/*
 * Barcos e navios decorativos do mapa.
 *
 *  - NAVIOS: formas desenhadas em escala real, como o Marco Zero (ver
 *    landmarks.ts). São geometria do mapa, não HTML flutuante.
 *  - VELEIROS: ilustração em imagem (ver boatIcons.ts).
 *
 * As posições e os tamanhos ficam em src/data/boats.ts.
 */
import type { Map as MTMap } from "@maptiler/sdk";
import { BOATS, type Boat } from "../data/boats";
import type { LngLat } from "../lib/segmentGeometry";
import {
  addBoatIcons,
  removeBoatIcons,
  type IconLoader,
} from "./boatIcons";

type PartId = "wake" | "hull" | "cabin" | "funnel";

/*
 * Forma do navio em coordenadas "unitárias": o navio tem comprimento 1,
 * a proa aponta para +y e o lado direito (boreste) é +x. O ponto (0, 0)
 * é o centro. Depois a forma é ampliada (comprimento em metros) e
 * girada (heading).
 */
const SHIP_SHAPE: { id: PartId; points: LngLat[] }[] = [
  /* esteira branca atrás do navio */
  {
    id: "wake",
    points: [
      [-0.09, -0.5],
      [0.09, -0.5],
      [0.025, -1.3],
      [-0.025, -1.3],
    ],
  },
  /* casco, com proa em ponta */
  {
    id: "hull",
    points: [
      [-0.095, -0.5],
      [0.095, -0.5],
      [0.11, -0.2],
      [0.105, 0.15],
      [0.065, 0.36],
      [0, 0.5],
      [-0.065, 0.36],
      [-0.105, 0.15],
      [-0.11, -0.2],
    ],
  },
  /* superestrutura na popa */
  {
    id: "cabin",
    points: [
      [-0.065, -0.4],
      [0.065, -0.4],
      [0.065, -0.12],
      [-0.065, -0.12],
    ],
  },
  /* chaminé */
  {
    id: "funnel",
    points: [
      [-0.035, -0.34],
      [0.035, -0.34],
      [0.035, -0.2],
      [-0.035, -0.2],
    ],
  },
];

/* Ordem de desenho: a primeira fica por baixo. */
const PART_ORDER: PartId[] = ["wake", "hull", "cabin", "funnel"];

/* Cores da identidade do YTU (as mesmas do Marco Zero). */
const PART_STYLE: Record<
  PartId,
  { color: string; opacity: number; outline?: string }
> = {
  wake: { color: "#FFFFFF", opacity: 0.35 },
  hull: { color: "#FFF4DF", opacity: 1, outline: "#C85A3D" },
  cabin: { color: "#C85A3D", opacity: 1 },
  funnel: { color: "#F2BD45", opacity: 1 },
};

const DEFAULT_SHIP_LENGTH_METERS = 200;

/*
 * Todos os ids daqui começam com "ytu-boat-". O módulo de rotas apaga
 * TUDO que começa com "ytu-route", então nunca use esse prefixo aqui.
 */
const ID_PREFIX = "ytu-boat-";

/* Abaixo deste zoom os navios somem (viram pontinhos sem sentido). */
const MIN_ZOOM = 12;

const EARTH_RADIUS = 6378137;

/*
 * "Geração" de cada mapa: cada addBoats/removeBoats avança o número. Um
 * carregamento de imagem que termine depois disso é descartado.
 */
const generation = new WeakMap<MTMap, number>();

/*
 * Converte um NAVIO em polígonos (um por parte), já em longitude/latitude.
 * Para outros tipos de barco devolve lista vazia. Exportada para testes.
 */
export function buildBoatParts(boat: Boat) {
  if (boat.kind !== "ship") {
    return [];
  }

  const length = boat.lengthMeters ?? DEFAULT_SHIP_LENGTH_METERS;
  const heading = ((boat.heading ?? 0) * Math.PI) / 180;

  const [lng, lat] = boat.position;

  /* graus por metro (mesma conta do círculo do Marco Zero) */
  const degreesPerMeterLat = (1 / EARTH_RADIUS) * (180 / Math.PI);
  const degreesPerMeterLng =
    degreesPerMeterLat / Math.cos((lat * Math.PI) / 180);

  const sin = Math.sin(heading);
  const cos = Math.cos(heading);

  return SHIP_SHAPE.map((part) => {
    const ring = part.points.map(([x, y]) => {
      /* gira: heading 0 = proa ao norte, 90 = proa ao leste */
      const east = length * (x * cos + y * sin);
      const north = length * (-x * sin + y * cos);

      return [
        lng + east * degreesPerMeterLng,
        lat + north * degreesPerMeterLat,
      ] as LngLat;
    });

    /* polígono fechado */
    ring.push(ring[0]);

    return {
      id: part.id,
      feature: {
        type: "Feature" as const,
        properties: {},
        geometry: {
          type: "Polygon" as const,
          coordinates: [ring],
        },
      },
    };
  });
}

type BoatFeature = ReturnType<typeof buildBoatParts>[number]["feature"];

/*
 * Adiciona os barcos ao mapa. Deve ser chamado depois que o estilo
 * carregou. Pode ser chamado mais de uma vez (refaz do zero).
 *
 * Os navios ficam ABAIXO dos textos do mapa (nomes de lugares), para não
 * cobrir os rótulos, e abaixo da rota e dos pinos, que são adicionados
 * depois. Os veleiros entram um instante depois, quando a imagem carrega.
 *
 * `loadIcon` existe só para testes.
 */
export function addBoats(
  map: MTMap,
  boats: Boat[] = BOATS,
  loadIcon?: IconLoader,
) {
  removeBoats(map);

  const mine = generation.get(map);
  const isCurrent = () => generation.get(map) === mine;

  const featuresByPart = new Map<PartId, BoatFeature[]>();

  boats.forEach((boat) => {
    buildBoatParts(boat).forEach(({ id, feature }) => {
      const list = featuresByPart.get(id) ?? [];
      list.push(feature);
      featuresByPart.set(id, list);
    });
  });

  const beforeId = map
    .getStyle()
    ?.layers?.find((layer) => layer.type === "symbol")?.id;

  PART_ORDER.forEach((partId) => {
    const features = featuresByPart.get(partId);

    if (!features || features.length === 0) {
      return;
    }

    const id = ID_PREFIX + partId;
    const style = PART_STYLE[partId];

    map.addSource(id, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features,
      },
    });

    map.addLayer(
      {
        id,
        type: "fill",
        source: id,
        minzoom: MIN_ZOOM,
        paint: {
          "fill-color": style.color,
          "fill-opacity": style.opacity,
          ...(style.outline ? { "fill-outline-color": style.outline } : {}),
        },
      },
      beforeId,
    );
  });

  void addBoatIcons(map, boats, isCurrent, loadIcon);
}

/*
 * Remove os barcos e cancela qualquer carregamento de imagem em andamento.
 * Seguro de chamar mesmo que já tenham sido removidos.
 */
export function removeBoats(map: MTMap) {
  generation.set(map, (generation.get(map) ?? 0) + 1);

  removeBoatIcons(map);

  [...PART_ORDER].reverse().forEach((partId) => {
    const id = ID_PREFIX + partId;

    if (map.getLayer(id)) {
      try {
        map.removeLayer(id);
      } catch {
        /* noop */
      }
    }

    if (map.getSource(id)) {
      try {
        map.removeSource(id);
      } catch {
        /* noop */
      }
    }
  });
}