/**
 * Geometrias curadas dos trechos das rotas do YTU.
 *
 * Fonte única: src/data/segmentGeometries.json (GeoJSON FeatureCollection,
 * uma LineString por trecho). Cada Feature tem `properties.id` no formato
 * "idOrigem:idDestino", usando os ids de src/data/places.ts.
 *
 * Esse arquivo é gerado por scripts/generate-segments.ts e pode ser
 * ajustado à mão (por exemplo no geojson.io), desde que `properties.id`
 * seja mantido.
 */
import data from "../data/segmentGeometries.json";

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

const collection = data as unknown as SegmentCollection;

const BY_ID = new Map<string, LngLat[]>(
  collection.features.map((feature) => [
    feature.properties.id,
    feature.geometry.coordinates,
  ]),
);

/*
 * Utilitário para obter a geometria de um segmento de rota.
 *
 * Busca os trechos salvos no arquivo de geometrias e retorna
 * as coordenadas no sentido correto entre dois pontos.
 */
export function getSegmentGeometry(
  fromId: string,
  toId: string,
): LngLat[] | null {
  const forward = BY_ID.get(`${fromId}:${toId}`);

  if (forward && forward.length >= 2) {
    return forward;
  }

  const backward = BY_ID.get(`${toId}:${fromId}`);

  if (backward && backward.length >= 2) {
    return [...backward].reverse();
  }

  return null;
}