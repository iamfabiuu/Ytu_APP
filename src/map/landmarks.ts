/*
 * Elementos geográficos personalizados do mapa.
 *
 * Responsável por criar e remover elementos especiais que
 * ficam diretamente sobre o mapa, como o Marco Zero.
 */

/*
 * Elementos geográficos personalizados do mapa.
 *
 * Responsável por criar e remover elementos especiais que
 * ficam diretamente sobre o mapa, como o Marco Zero.
 */
import type { Map as MTMap } from "@maptiler/sdk";
import type { LngLat } from "../lib/segmentGeometry";

export const MARCO_ZERO: LngLat = [-34.871204253745965, -8.063084808406737];

/*
 * ATENÇÃO: os ids abaixo começam com "ytu-marco-zero-".
 *
 * O módulo de rotas (route.ts) apaga TUDO que começa com "ytu-route".
 * Por isso, nenhum elemento daqui pode usar esse prefixo, senão limpar
 * a rota apagaria o landmark junto.
 */
type Ring = {
  id: string;
  radiusMeters: number;
  color: string;
  opacity: number;
  outlineColor?: string;
};

/* Do maior para o menor: o anel externo fica por baixo. */
const MARCO_ZERO_RINGS: Ring[] = [
  /* Anel externo YTU. */
  {
    id: "ytu-marco-zero-outer",
    radiusMeters: 20,
    color: "#E87532",
    opacity: 0.28,
  },
  /* Área principal terracota. */
  {
    id: "ytu-marco-zero-middle",
    radiusMeters: 15,
    color: "#C85A3D",
    opacity: 0.95,
    outlineColor: "#FFF4DF",
  },
  /* Centro amarelo: referência visual à identidade do YTU. */
  {
    id: "ytu-marco-zero-inner",
    radiusMeters: 10,
    color: "#F2BD45",
    opacity: 1,
  },
];

/*
 * Cria um pequeno círculo geográfico ao redor de uma coordenada.
 *
 * Diferente de um Marker HTML, isso vira geometria real do mapa:
 * acompanha zoom, pitch e rotação e fica preso à posição geográfica.
 */
function createGroundCircle(
  center: LngLat,
  radiusMeters: number,
  steps = 64,
) {
  const [lng, lat] = center;

  const coordinates: LngLat[] = [];

  const earthRadius = 6378137;
  const latitudeRadians = (lat * Math.PI) / 180;
  const angularDistance = radiusMeters / earthRadius;

  const deltaLat = angularDistance * (180 / Math.PI);
  const deltaLng =
    (angularDistance * (180 / Math.PI)) / Math.cos(latitudeRadians);

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;

    coordinates.push([
      lng + Math.cos(angle) * deltaLng,
      lat + Math.sin(angle) * deltaLat,
    ]);
  }

  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "Polygon" as const,
      coordinates: [coordinates],
    },
  };
}

/*
 * Adiciona os landmarks ao mapa (hoje, só o Marco Zero).
 * Deve ser chamado depois que o estilo do mapa carregou.
 */
export function addLandmarks(map: MTMap) {
  MARCO_ZERO_RINGS.forEach((ring) => {
    map.addSource(ring.id, {
      type: "geojson",
      data: createGroundCircle(MARCO_ZERO, ring.radiusMeters),
    });
  });

  MARCO_ZERO_RINGS.forEach((ring) => {
    map.addLayer({
      id: ring.id,
      type: "fill",
      source: ring.id,
      paint: {
        "fill-color": ring.color,
        "fill-opacity": ring.opacity,
        ...(ring.outlineColor
          ? { "fill-outline-color": ring.outlineColor }
          : {}),
      },
    });
  });
}

/*
 * Remove os landmarks. Seguro de chamar mesmo que já tenham sido
 * removidos.
 */
export function removeLandmarks(map: MTMap) {
  [...MARCO_ZERO_RINGS].reverse().forEach((ring) => {
    if (map.getLayer(ring.id)) {
      try {
        map.removeLayer(ring.id);
      } catch {
        /* noop */
      }
    }
  });

  [...MARCO_ZERO_RINGS].reverse().forEach((ring) => {
    if (map.getSource(ring.id)) {
      try {
        map.removeSource(ring.id);
      } catch {
        /* noop */
      }
    }
  });
}