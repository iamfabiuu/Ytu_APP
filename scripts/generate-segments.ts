/**
 * YTU — gerador de geometrias dos trechos das rotas culturais.
 *
 * O que faz:
 *   Para cada par de paradas consecutivas em src/data/routes.ts, pede a um
 *   roteador de PEDESTRES (OSRM do FOSSGIS, perfil "foot") o caminho pelas
 *   ruas e grava a polilinha em src/data/segmentGeometries.json.
 *
 *   O app NÃO chama roteador em tempo de execução para esses trechos: ele
 *   lê o JSON. O roteador aqui é só uma ferramenta de autoria.
 *
 * Uso (rode na RAIZ do projeto):
 *   npx tsx scripts/generate-segments.ts
 *       gera só os trechos que ainda não existem no JSON
 *
 *   npx tsx scripts/generate-segments.ts --only=marcozero:frevo --force
 *       regera um trecho específico (sobrescreve o que estiver no JSON)
 *
 *   npx tsx scripts/generate-segments.ts --force
 *       regera TUDO (apaga ajustes manuais!)
 *
 * Trechos que já existem no JSON nunca são sobrescritos sem --force.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROUTES } from "../src/data/routes";
import { PLACES, type Place } from "../src/data/places";

type LngLat = [number, number];

type SegmentFeature = {
  type: "Feature";
  properties: { id: string; [key: string]: unknown };
  geometry: { type: "LineString"; coordinates: LngLat[] };
};

type SegmentCollection = {
  type: "FeatureCollection";
  features: SegmentFeature[];
};

/* ---------- configuração ---------- */

const OUTPUT = resolve(process.cwd(), "src/data/segmentGeometries.json");

/*
 * Servidor público OSRM do FOSSGIS com perfil de pedestre.
 * Uso razoável e não comercial, no máximo 1 requisição por segundo,
 * sem garantia de disponibilidade. Serve para AUTORIA, não para produção.
 */
const ROUTER = "https://routing.openstreetmap.de/routed-foot/route/v1/foot";
const DELAY_MS = 1200;

/* Avisa se o início/fim da linha ficar longe da parada (em metros). */
const MAX_GAP_METERS = 5;

/*
 * Pontos-guia opcionais por trecho, no formato [lng, lat].
 * Servem para empurrar o roteador para as ruas desejadas. Coloque cada
 * ponto EM CIMA da rua que a equipe quer, na ordem do percurso.
 *
 * Exemplo:
 *   "marcozero:frevo": [[-34.8722273, -8.062246]],
 */
const GUIDES: Record<string, LngLat[]> = {};

/* ---------- utilitários ---------- */

const sleep = (ms: number) =>
  new Promise<void>((done) => setTimeout(done, ms));

function meters(a: LngLat, b: LngLat): number {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad;
  const dLng = (b[0] - a[0]) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function load(): SegmentCollection {
  if (!existsSync(OUTPUT)) {
    return { type: "FeatureCollection", features: [] };
  }
  return JSON.parse(readFileSync(OUTPUT, "utf8")) as SegmentCollection;
}

/* Uma Feature por linha: diffs do git ficam legíveis. */
function save(collection: SegmentCollection) {
  const lines = collection.features.map(
    (feature) =>
      `    {"type":"Feature","properties":${JSON.stringify(feature.properties)},` +
      `"geometry":{"type":"LineString","coordinates":${JSON.stringify(feature.geometry.coordinates)}}}`,
  );

  const body =
    lines.length > 0
      ? `[\n${lines.join(",\n")}\n  ]`
      : "[]";

  writeFileSync(
    OUTPUT,
    `{\n  "type": "FeatureCollection",\n  "features": ${body}\n}\n`,
  );
}

function has(collection: SegmentCollection, id: string) {
  return collection.features.some((f) => f.properties.id === id);
}

function upsert(collection: SegmentCollection, feature: SegmentFeature) {
  const index = collection.features.findIndex(
    (f) => f.properties.id === feature.properties.id,
  );

  if (index >= 0) {
    collection.features[index] = feature;
  } else {
    collection.features.push(feature);
  }
}

/* ---------- roteamento ---------- */

async function fetchSegment(from: Place, to: Place, guides: LngLat[]) {
  const points: LngLat[] = [
    [from.lng, from.lat],
    ...guides,
    [to.lng, to.lat],
  ];

  const path = points.map(([lng, lat]) => `${lng},${lat}`).join(";");
  const url = `${ROUTER}/${path}?overview=full&geometries=geojson`;

  const response = await fetch(url, {
    headers: { "User-Agent": "YTU-route-authoring/1.0" },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = (await response.json()) as {
    code: string;
    routes?: { distance: number; geometry: { coordinates: LngLat[] } }[];
  };

  const route = data.routes?.[0];

  if (data.code !== "Ok" || !route?.geometry?.coordinates?.length) {
    throw new Error(`Resposta do roteador: ${data.code}`);
  }

  return {
    coordinates: route.geometry.coordinates,
    distance: route.distance,
  };
}

function report(
  id: string,
  from: Place,
  to: Place,
  coordinates: LngLat[],
  distance: number,
) {
  const start: LngLat = [from.lng, from.lat];
  const end: LngLat = [to.lng, to.lat];

  const straight = meters(start, end);
  const ratio = distance / Math.max(straight, 1);

  console.log(
    `✅ ${id}: ${Math.round(distance)} m ` +
      `(linha reta ${Math.round(straight)} m, ${ratio.toFixed(1)}x), ` +
      `${coordinates.length} pontos`,
  );

  if (ratio > 2.5) {
    console.warn(
      `   ⚠️  ${ratio.toFixed(1)}x maior que a linha reta. Confira no mapa ` +
        `(pode ser um desvio real, como uma ponte).`,
    );
  }

  const startGap = meters(coordinates[0], start);
  const endGap = meters(coordinates[coordinates.length - 1], end);

  if (startGap > MAX_GAP_METERS) {
    console.warn(
      `   ⚠️  a linha começa a ${Math.round(startGap)} m de "${from.label}".`,
    );
  }

  if (endGap > MAX_GAP_METERS) {
    console.warn(
      `   ⚠️  a linha termina a ${Math.round(endGap)} m de "${to.label}".`,
    );
  }
}

/* ---------- principal ---------- */

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const only = args.find((a) => a.startsWith("--only="))?.slice("--only=".length);

  const placeById = new Map(PLACES.map((place) => [place.id, place]));

  /* pares consecutivos de todas as rotas, sem repetição */
  const pairs = new Map<string, { from: string; to: string }>();

  for (const route of ROUTES) {
    for (let i = 0; i < route.stops.length - 1; i++) {
      const from = route.stops[i];
      const to = route.stops[i + 1];
      pairs.set(`${from}:${to}`, { from, to });
    }
  }

  if (only && !pairs.has(only)) {
    console.error(`❌ Trecho "${only}" não existe em routes.ts.`);
    console.error(`   Trechos válidos: ${[...pairs.keys()].join(", ")}`);
    process.exitCode = 1;
    return;
  }

  const collection = load();
  let requests = 0;
  let failures = 0;

  for (const [id, { from, to }] of pairs) {
    if (only && id !== only) continue;

    const exists = has(collection, id) || has(collection, `${to}:${from}`);

    if (exists && !force) {
      console.log(`⏭️  ${id}: já existe (use --force para regerar)`);
      continue;
    }

    const a = placeById.get(from);
    const b = placeById.get(to);

    if (!a || !b) {
      console.error(`❌ ${id}: parada não encontrada em places.ts`);
      failures++;
      continue;
    }

    if (requests > 0) await sleep(DELAY_MS);
    requests++;

    try {
      const { coordinates, distance } = await fetchSegment(
        a,
        b,
        GUIDES[id] ?? [],
      );

      report(id, a, b, coordinates, distance);

      upsert(collection, {
        type: "Feature",
        properties: {
          id,
          from,
          to,
          distance: Math.round(distance),
          source: "osm-foot",
        },
        geometry: { type: "LineString", coordinates },
      });

      /* salva a cada trecho: se algo falhar, o progresso não se perde */
      save(collection);
    } catch (error) {
      console.error(`❌ ${id}:`, error instanceof Error ? error.message : error);
      failures++;
    }
  }

  console.log(
    failures === 0
      ? `\nPronto. Arquivo: ${OUTPUT}`
      : `\nTerminou com ${failures} falha(s).`,
  );

  if (failures > 0) process.exitCode = 1;
}

void main();