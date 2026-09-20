/**
 * Geometrias curadas dos trechos das rotas do YTU, por modo de deslocamento.
 *
 * Um arquivo GeoJSON (FeatureCollection) por modo:
 *   - foot → src/data/segmentGeometries.json        (a pé)
 *   - bike → src/data/segmentGeometries.bike.json   (bicicleta)
 *
 * Em cada arquivo, cada Feature é uma LineString com `properties.id` no
 * formato "idOrigem:idDestino", usando os ids de src/data/places.ts.
 *
 * Os arquivos são gerados por scripts/generate-segments.ts e podem ser
 * ajustados à mão (por exemplo no geojson.io), desde que `properties.id`
 * seja mantido.
 */
import footData from "../data/segmentGeometries.json";
import bikeData from "../data/segmentGeometries.bike.json";
import { DEFAULT_MODE, SPEED_KMH, type TravelMode } from "./travelMode";

export type LngLat = [number, number];

type SegmentFeature = {
  type: "Feature";
  properties: { id: string };
  geometry: { type: "LineString"; coordinates: LngLat[] };
};

type SegmentCollection = {
  type: "FeatureCollection";
  features: SegmentFeature[];
};

function buildIndex(data: unknown): Map<string, LngLat[]> {
  const collection = data as SegmentCollection;

  return new Map(
    collection.features.map((feature) => [
      feature.properties.id,
      feature.geometry.coordinates,
    ]),
  );
}

const INDEX: Record<TravelMode, Map<string, LngLat[]>> = {
  foot: buildIndex(footData),
  bike: buildIndex(bikeData),
};

/**
 * Devolve a polilinha curada do trecho `fromId → toId` no modo pedido, ou
 * `null` se não existir (nesse caso quem chamou decide o que fazer).
 *
 * Só a pé, se existir apenas o trecho no sentido contrário, ele é devolvido
 * invertido. Para bicicleta isso NÃO é feito: o sentido contrário pode
 * ser mão única.
 */
export function getSegmentGeometry(
  fromId: string,
  toId: string,
  mode: TravelMode = DEFAULT_MODE,
): LngLat[] | null {
  const index = INDEX[mode];

  const forward = index.get(`${fromId}:${toId}`);

  if (forward && forward.length >= 2) {
    return forward;
  }

  if (mode === "foot") {
    const backward = index.get(`${toId}:${fromId}`);

    if (backward && backward.length >= 2) {
      return [...backward].reverse();
    }
  }

  return null;
}

/* Comprimento de uma polilinha, em metros. */
function pathLength(coordinates: LngLat[]): number {
  const R = 6371000;
  const rad = Math.PI / 180;

  let total = 0;

  for (let i = 1; i < coordinates.length; i++) {
    const [lng1, lat1] = coordinates[i - 1];
    const [lng2, lat2] = coordinates[i];

    const dLat = (lat2 - lat1) * rad;
    const dLng = (lng2 - lng1) * rad;

    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;

    total += 2 * R * Math.asin(Math.sqrt(h));
  }

  return total;
}

export type RouteStats = {
  distanceMeters: number;
  /* estimativa só do deslocamento (ver SPEED_KMH em travelMode.ts) */
  durationMinutes: number;
};

/*
 * Distância e tempo estimado de uma rota no modo pedido.
 * Devolve `null` se algum trecho não tiver geometria salva nesse modo.
 */
export function getRouteStats(
  stopIds: string[],
  mode: TravelMode = DEFAULT_MODE,
): RouteStats | null {
  if (stopIds.length < 2) {
    return null;
  }

  let distanceMeters = 0;

  for (let i = 0; i < stopIds.length - 1; i++) {
    const segment = getSegmentGeometry(stopIds[i], stopIds[i + 1], mode);

    if (!segment) {
      return null;
    }

    distanceMeters += pathLength(segment);
  }

  const hours = distanceMeters / 1000 / SPEED_KMH[mode];

  return {
    distanceMeters,
    durationMinutes: Math.max(1, Math.round(hours * 60)),
  };
}

/* A rota inteira tem geometria salva neste modo? */
export function hasModeGeometry(stopIds: string[], mode: TravelMode): boolean {
  return getRouteStats(stopIds, mode) !== null;
}