/*
 * Marcadores dos pontos do mapa.
 *
 * Responsável pela criação, atualização e remoção dos
 * marcadores dos locais culturais exibidos no mapa.
 */
import { Marker, type Map as MTMap } from "@maptiler/sdk";
import type { Place } from "../data/places";
import type { LngLat } from "../lib/segmentGeometry";

export type MarkerMap = Record<string, Marker>;

const ICONS: Record<string, string> = {
  Cultura: `<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/>`,

  Praias: `<path d="M2 20h20M6 20c0-6 3-10 6-10s6 4 6 10"/><circle cx="18" cy="6" r="3"/>`,

  Comida: `<path d="M4 3v7a3 3 0 006 0V3M7 10v11M17 3c-2 2-2 5 0 7v11"/>`,

  Culinária: `<path d="M6 3v7a3 3 0 006 0V3M9 10v11M18 3v18M15 3v7h6"/>`,

  Patrimônio: `<path d="M3 10h18L12 3 3 10zM5 10v9M19 10v9M3 19h18"/>`,

  default: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/>`,
};

const CAT_COLOR: Record<string, [string, string]> = {
  Cultura: ["#A855F7", "#7C3AED"],

  Praias: ["#22D3EE", "#0891B2"],

  Comida: ["#FB923C", "#EA580C"],

  Culinária: ["#F97316", "#C2410C"],

  Patrimônio: ["#FBBF24", "#D97706"],

  default: ["#FF6B6B", "#E63946"],
};

const pinSvg = (cat: string) =>
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" ` +
  `stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">` +
  `${ICONS[cat] ?? ICONS.default}</svg>`;

/*
 * Quais lugares devem ter pino.
 *
 * - `routeIds === null`: nenhuma rota em exibição → todos os lugares.
 * - `routeIds` com ids: só os lugares que estão na rota.
 *
 * Mantém a ordem original de `places` (não a ordem da rota).
 */
export function placesOnRoute(
  places: Place[],
  routeIds: string[] | null,
): Place[] {
  if (routeIds === null) {
    return places;
  }

  const onRoute = new Set(routeIds);

  return places.filter((place) => onRoute.has(place.id));
}

/*
 * Mostra ou esconde os nomes dos lugares.
 *
 * Os nomes são criados dentro de cada marcador e recebem
 * a classe `place-label`.
 */
export function setMarkerLabels(
  markers: MarkerMap,
  visible: boolean,
) {
  Object.values(markers).forEach((marker) => {
    const node = marker.getElement();
    const label = node.querySelector<HTMLElement>(".place-label");

    if (!label) return;

    label.style.opacity = visible ? "1" : "0";
    label.style.pointerEvents = visible ? "auto" : "none";
  });
}

/*
 * Cria um marcador para cada lugar e devolve o mapa id -> Marker.
 * `onSelect` é chamado com o id do lugar quando o marcador é clicado.
 */
export function renderPlaceMarkers(
  map: MTMap,
  places: Place[],
  onSelect: (id: string) => void,
): MarkerMap {
  const markers: MarkerMap = {};

  places.forEach((p) => {
    const [c1, c2] = CAT_COLOR[p.cat] ?? CAT_COLOR.default;

    const el = document.createElement("button");

    el.type = "button";
    el.setAttribute("aria-label", p.label);
    el.dataset.cat = p.cat;

    el.style.setProperty("--pin", c2);

    el.className =
      "relative grid h-11 w-auto min-w-9 cursor-pointer " +
      "place-items-start justify-center " +
      "transition-transform duration-300 ease-out " +
      "will-change-transform hover:-translate-y-1 " +
      "focus-visible:outline-none";

    el.innerHTML =
      `<span class="absolute bottom-0 left-1/2 h-1.5 w-4 -translate-x-1/2 ` +
      `rounded-full bg-black/25 blur-[2px]"></span>` +

      `<span class="place-label absolute bottom-10 left-1/2 ` +
      `-translate-x-1/2 whitespace-nowrap rounded-md ` +
      `bg-white/95 px-2 py-1 text-xs font-semibold text-slate-800 ` +
      `shadow-md ring-1 ring-black/5 transition-opacity duration-200 ` +
      `opacity-0 pointer-events-none">` +
      `${p.label}` +
      `</span>` +

      `<span class="pin-head grid size-9 rotate-45 place-items-center ` +
      `rounded-full rounded-br-sm border-[2.5px] border-white text-white" ` +
      `style="background:linear-gradient(135deg,${c1},${c2});` +
      `box-shadow:0 6px 14px -2px ${c2}99">` +
      `<span class="-rotate-45">${pinSvg(p.cat)}</span>` +
      `</span>`;

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      onSelect(p.id);
    });

    markers[p.id] = new Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat([p.lng, p.lat])
      .addTo(map);
  });

  return markers;
}

/* Remove todos os marcadores do mapa. */
export function removeMarkers(markers: MarkerMap) {
  Object.values(markers).forEach((marker) => marker.remove());
}

/* Destaca o marcador do lugar selecionado (ou nenhum, se for null). */
export function highlightMarker(
  markers: MarkerMap,
  selectedId: string | null,
) {
  Object.entries(markers).forEach(([id, marker]) => {
    const node = marker.getElement();
    const active = id === selectedId;

    node.style.zIndex = active ? "10" : "1";

    const pin = node.querySelector<HTMLElement>(".pin-head");

    if (!pin) return;

    pin.style.scale = active ? "1.25" : "1";

    pin.style.filter = active
      ? "drop-shadow(0 0 8px rgba(230,57,70,.7))"
      : "none";
  });

  Object.entries(markers).forEach(([id, marker]) => {
    const node = marker.getElement();

    const active = id === selectedId;

    // O elemento raiz NÃO deve ser escalado,
    // pois é ele que o MapTiler usa para posicionar o Marker.
    node.style.zIndex = active ? "10" : "1";

    const pin = node.querySelector<HTMLElement>(".pin-head");

    if (!pin) return;

    // Escala somente o visual do pin.
    pin.style.scale = active ? "1.25" : "1";

    // O brilho também fica somente no pin.
    pin.style.filter = active
      ? "drop-shadow(0 0 8px rgba(230,57,70,.7))"
      : "none";
  });
}

/*
 * Mostra (ou move) o ponto azul da localização do usuário.
 * Recebe o marcador atual (ou null) e devolve o marcador em uso.
 */
export function showUserLocation(
  map: MTMap,
  current: Marker | null,
  position: LngLat,
): Marker {
  if (current) {
    return current.setLngLat(position);
  }

  const dot = document.createElement("div");

  dot.className =
    "size-4 rounded-full border-2 border-white bg-blue-500 " +
    "shadow-[0_0_0_8px_rgba(59,130,246,.25)]";

  return new Marker({ element: dot }).setLngLat(position).addTo(map);
}
