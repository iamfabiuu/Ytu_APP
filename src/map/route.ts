/*
 * Lógica das rotas do mapa.
 *
 * Responsável por calcular, montar, exibir e remover as
 * linhas das rotas, utilizando as geometrias salvas e,
 * quando necessário, o serviço de roteamento.
 */

/*
 * Lógica das rotas do mapa.
 *
 * Responsável por calcular, montar, exibir e remover as
 * linhas das rotas, utilizando as geometrias salvas e,
 * quando necessário, o serviço de roteamento.
 */
import type { Map as MTMap } from "@maptiler/sdk";
import type { Place } from "../data/places";
import { getSegmentGeometry, type LngLat } from "../lib/segmentGeometry";

/* ---------- constantes ---------- */

/*
 * Reserva para trechos SEM geometria salva.
 * Atenção: o servidor público ignora o perfil "foot" e responde como
 * carro. Por isso o ideal é ter geometria salva para todos os trechos
 * (ver scripts/generate-segments.ts).
 */
const OSRM_URL = "https://router.project-osrm.org/route/v1/foot";

/*
 * Todo id de camada/fonte de rota começa com este prefixo, e a limpeza
 * apaga TUDO que começa com ele. Nenhum outro módulo do mapa (landmarks,
 * marcadores...) deve usar ids com "ytu-route".
 */
const ROUTE_PREFIX = "ytu-route";

const ROUTE_SOURCE_ID = "ytu-route";
const ROUTE_OUTLINE_ID = "ytu-route-outline";
const ROUTE_LAYER_ID = "ytu-route-line";

const ROUTE_PROGRESS_SOURCE_ID = "ytu-route-progress";
const ROUTE_PROGRESS_OUTLINE_ID = "ytu-route-progress-outline";
const ROUTE_PROGRESS_LAYER_ID = "ytu-route-progress-line";

/* ---------- tipos ---------- */

type OsrmStep = {
  name?: string;
  distance?: number;
  maneuver?: { type?: string; modifier?: string; location?: LngLat };
};

type OsrmResponse = {
  code?: string;
  routes?: {
    geometry?: { coordinates?: LngLat[] };
    legs?: { steps?: OsrmStep[] }[];
  }[];
};

export type DrawRouteOptions = {
  map: MTMap;
  /* lugares disponíveis para procurar as paradas pelo id */
  places: Place[];
  /* ids das paradas, na ordem da rota */
  ids: string[];
  /* quantos trechos já foram concluídos (pintados como progresso) */
  currentCheckpoint: number;
  /* se deve enquadrar a câmera na rota inteira */
  fitRoute: boolean;
};

export type RouteController = {
  draw: (options: DrawRouteOptions) => Promise<void>;
  clear: (map: MTMap | null) => void;
};

/* ---------- remoção visual ---------- */

/* Remove do mapa TODAS as camadas e fontes de rota do YTU. */
export function removeRouteVisuals(map: MTMap) {
  const style = map.getStyle();

  if (style?.layers) {
    const routeLayers = style.layers
      .filter((layer) => layer.id.startsWith(ROUTE_PREFIX))
      .map((layer) => layer.id)
      .reverse();

    routeLayers.forEach((layerId) => {
      if (map.getLayer(layerId)) {
        try {
          map.removeLayer(layerId);
        } catch {
          /* noop */
        }
      }
    });
  }

  const sourceIds = Object.keys(style?.sources ?? {}).filter((sourceId) =>
    sourceId.startsWith(ROUTE_PREFIX),
  );

  sourceIds.forEach((sourceId) => {
    if (map.getSource(sourceId)) {
      try {
        map.removeSource(sourceId);
      } catch {
        /* noop */
      }
    }
  });
}

/* ---------- helpers ---------- */

/*
 * Reserva: pede o trecho ao OSRM. Lança erro se a resposta não servir.
 * `segmentNumber` (1, 2, 3...) só aparece nas mensagens de erro.
 */
async function fetchOsrmSegment(
  from: Place,
  to: Place,
  segmentNumber: number,
): Promise<LngLat[]> {
  const path = [`${from.lng},${from.lat}`, `${to.lng},${to.lat}`].join(";");

  const url = `${OSRM_URL}/${path}?overview=full&geometries=geojson&steps=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  const data = (await response.json()) as OsrmResponse;

  console.log(
    "🛣️ OSRM DETALHADO",
    data.routes?.[0]?.legs?.[0]?.steps?.map((step) => ({
      rua: step.name,
      distancia: step.distance,
      tipo: step.maneuver?.type,
      direcao: step.maneuver?.modifier,
      local: step.maneuver?.location,
    })),
  );

  if (data.code !== "Ok") {
    throw new Error(`OSRM retornou: ${data.code ?? "erro desconhecido"}`);
  }

  const coordinates = data.routes?.[0]?.geometry?.coordinates;

  if (!coordinates?.length) {
    throw new Error(`Geometria não encontrada para o trecho ${segmentNumber}.`);
  }

  return coordinates;
}

/*
 * Junta trechos numa linha só, sem duplicar o ponto de encontro
 * (o último ponto de um trecho é o primeiro do seguinte).
 */
function joinSegments(segments: LngLat[][]): LngLat[] {
  const joined: LngLat[] = [];

  segments.forEach((coordinates, index) => {
    joined.push(...(index === 0 ? coordinates : coordinates.slice(1)));
  });

  return joined;
}

function getBounds(coordinates: LngLat[]): [LngLat, LngLat] {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  coordinates.forEach(([lng, lat]) => {
    minLng = Math.min(minLng, lng);
    minLat = Math.min(minLat, lat);
    maxLng = Math.max(maxLng, lng);
    maxLat = Math.max(maxLat, lat);
  });

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

type LineOptions = {
  sourceId: string;
  outlineId: string;
  lineId: string;
  coordinates: LngLat[];
  color: string;
  dashed: boolean;
};

/* Adiciona uma linha com contorno branco (fonte + 2 camadas). */
function addLine(map: MTMap, options: LineOptions) {
  const { sourceId, outlineId, lineId, coordinates, color, dashed } = options;

  const layout = {
    "line-join": "round",
    "line-cap": "round",
  } as const;

  const dash = dashed ? { "line-dasharray": [2, 2] } : {};

  map.addSource(sourceId, {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates,
      },
    },
  });

  map.addLayer({
    id: outlineId,
    type: "line",
    source: sourceId,
    layout,
    paint: {
      "line-color": "#FFFFFF",
      "line-width": 8,
      "line-opacity": 0.95,
      ...dash,
    },
  });

  map.addLayer({
    id: lineId,
    type: "line",
    source: sourceId,
    layout,
    paint: {
      "line-color": color,
      "line-width": 5,
      "line-opacity": 1,
      ...dash,
    },
  });
}

/* ---------- controlador ---------- */

/*
 * Cria um controlador de rota. Use UM por mapa.
 *
 * Cada `draw` recebe uma versão. Se uma resposta antiga do OSRM chegar
 * depois de uma rota mais nova (ou depois de um `clear`), ela é
 * descartada. Como a versão fica dentro deste controlador, dois mapas
 * na tela não interferem um no outro.
 */
export function createRouteController(): RouteController {
  let version = 0;

  const clear = (map: MTMap | null) => {
    /* invalida qualquer draw() que ainda esteja esperando resposta */
    version += 1;

    if (map) {
      removeRouteVisuals(map);
    }
  };

  const draw = async ({
    map,
    places,
    ids,
    currentCheckpoint,
    fitRoute,
  }: DrawRouteOptions) => {
    if (ids.length < 2) {
      return;
    }

    const drawVersion = ++version;
    const isCurrent = () => drawVersion === version;

    const points = ids
      .map((id) => places.find((place) => place.id === id))
      .filter((place): place is Place => Boolean(place));

    if (points.length < 2) {
      console.warn("⚠️ Não foi possível encontrar todas as paradas da rota.");
      return;
    }

    try {
      /* um trecho por par de paradas: geometria salva ou OSRM */
      const segments: LngLat[][] = [];

      for (let i = 0; i < points.length - 1; i++) {
        if (!isCurrent()) {
          return;
        }

        const from = points[i];
        const to = points[i + 1];

        const stored = getSegmentGeometry(from.id, to.id);

        if (stored) {
          segments.push(stored);
          continue;
        }

        let coordinates: LngLat[];

        try {
          coordinates = await fetchOsrmSegment(from, to, i + 1);
        } catch (error) {
          /* erro de uma rota que já foi substituída não interessa */
          if (!isCurrent()) {
            return;
          }
          throw error;
        }

        if (!isCurrent()) {
          return;
        }

        segments.push(coordinates);
      }

      if (!isCurrent()) {
        return;
      }

      /* rota completa e trechos já concluídos */
      const fullCoordinates = joinSegments(segments);

      const completedSegments = Math.max(
        0,
        Math.min(currentCheckpoint, segments.length),
      );

      const progressCoordinates = joinSegments(
        segments.slice(0, completedSegments),
      );

      removeRouteVisuals(map);

      addLine(map, {
        sourceId: ROUTE_SOURCE_ID,
        outlineId: ROUTE_OUTLINE_ID,
        lineId: ROUTE_LAYER_ID,
        coordinates: fullCoordinates,
        color: "#E87532",
        dashed: true,
      });

      if (progressCoordinates.length >= 2) {
        addLine(map, {
          sourceId: ROUTE_PROGRESS_SOURCE_ID,
          outlineId: ROUTE_PROGRESS_OUTLINE_ID,
          lineId: ROUTE_PROGRESS_LAYER_ID,
          coordinates: progressCoordinates,
          color: "#C85A3D",
          dashed: false,
        });
      }

      if (fullCoordinates.length === 0 || !fitRoute) {
        return;
      }

      map.fitBounds(getBounds(fullCoordinates), {
        padding: {
          top: 180,
          bottom: 180,
          left: 60,
          right: 60,
        },
        duration: 800,
      });
    } catch (error) {
      console.error("❌ Erro ao calcular rota:", error);
    }
  };

  return { draw, clear };
}