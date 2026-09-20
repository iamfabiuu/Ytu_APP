/*
 * Modos de deslocamento do YTU.
 *
 * Para acrescentar um modo novo (ex.: carro) é preciso:
 *  1. incluir o nome aqui em TravelMode / TRAVEL_MODES / MODE_LABELS / SPEED_KMH;
 *  2. incluir o modo em MODE_CONFIG no scripts/generate-segments.ts;
 *  3. criar o arquivo de geometrias do modo em src/data/;
 *  4. registrar esse arquivo em src/lib/segmentGeometry.ts.
 */

export type TravelMode = "foot" | "bike";

export const TRAVEL_MODES: TravelMode[] = ["foot", "bike"];

/* Modo usado quando nada foi escolhido. */
export const DEFAULT_MODE: TravelMode = "foot";

export const MODE_LABELS: Record<TravelMode, string> = {
  foot: "A pé",
  bike: "Bicicleta",
};

/*
 * Velocidade média usada só para ESTIMAR o tempo de deslocamento
 * (km/h). Não considera paradas, semáforos nem visitas aos lugares.
 */
export const SPEED_KMH: Record<TravelMode, number> = {
  foot: 5,
  bike: 15,
};