import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Map as MTMap, Marker, config } from "@maptiler/sdk";
import { LngLatBounds } from "maplibre-gl";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { PLACES, type Place } from "../data/places";

/* ── config ─────────────────────────────────────────────── */

const KEY = import.meta.env.VITE_MAPTILER_KEY as string;
config.apiKey = KEY;

const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${KEY}`;
const RECIFE: [number, number] = [-34.8811, -8.0631];

const ROUTE_SRC = "ytu-route";
const ROUTE_LINE = "ytu-route-line";
const ROUTE_CASING = "ytu-route-casing";

const GEO_OPTS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 30_000,
};

const FIT_PADDING = { top: 130, bottom: 220, left: 40, right: 40 };

/* ── theming dos pins ───────────────────────────────────── */

const ICONS: Record<string, string> = {
  Cultura: `<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/>`,
  Praias: `<path d="M2 20h20M6 20c0-6 3-10 6-10s6 4 6 10"/><circle cx="18" cy="6" r="3"/>`,
  Comida: `<path d="M4 3v7a3 3 0 006 0V3M7 10v11M17 3c-2 2-2 5 0 7v11"/>`,
  Patrimônio: `<path d="M3 10h18L12 3 3 10zM5 10v9M19 10v9M3 19h18"/>`,
  default: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/>`,
};

const CAT_COLOR: Record<string, [string, string]> = {
  Cultura: ["#A855F7", "#7C3AED"],
  Praias: ["#22D3EE", "#0891B2"],
  Comida: ["#FB923C", "#EA580C"],
  Patrimônio: ["#FBBF24", "#D97706"],
  default: ["#FF6B6B", "#E63946"],
};

const pinSvg = (cat: string) =>
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICONS[cat] ?? ICONS.default}</svg>`;

function buildPin(place: Place, onClick: () => void): HTMLButtonElement {
  const [c1, c2] = CAT_COLOR[place.cat] ?? CAT_COLOR.default;
  const el = document.createElement("button");

  el.type = "button";
  el.setAttribute("aria-label", place.label);
  el.dataset.cat = place.cat;
  el.className =
    "relative grid h-11 w-9 origin-bottom cursor-pointer place-items-start " +
    "justify-center transition-[transform,scale,filter] duration-300 ease-out " +
    "will-change-transform hover:-translate-y-1 focus-visible:outline-none";

  el.innerHTML =
    `<span class="absolute bottom-0 left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-full bg-black/25 blur-[2px]"></span>` +
    `<span class="grid size-9 rotate-45 place-items-center rounded-full rounded-br-sm border-[2.5px] border-white text-white" ` +
    `style="background:linear-gradient(135deg,${c1},${c2});box-shadow:0 6px 14px -2px ${c2}99">` +
    `<span class="-rotate-45">${pinSvg(place.cat)}</span></span>`;

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick();
  });

  return el;
}

function buildUserDot(): HTMLDivElement {
  const dot = document.createElement("div");
  dot.className =
    "size-4 rounded-full border-2 border-white bg-blue-500 " +
    "shadow-[0_0_0_8px_rgba(59,130,246,.25)]";
  return dot;
}

/* ── tipos públicos ─────────────────────────────────────── */

export type RouteResult = {
  distance: number;
  duration: number;
  stops: string[];
};

export type MapHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  locate: () => Promise<[number, number] | null>;
  flyTo: (id: string) => void;
  routeTo: (ids: string[]) => Promise<RouteResult | null>;
  clearRoute: () => void;
};

type Props = {
  selected: string | null;
  onSelect: (id: string | null) => void;
  places?: Place[];
  onRoute?: (result: RouteResult | null) => void;
};

/* ── helpers ────────────────────────────────────────────── */

const getPosition = () =>
  new Promise<[number, number]>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização não suportada neste dispositivo."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve([coords.longitude, coords.latitude]),
      (err) => reject(new Error(err.message)),
      GEO_OPTS,
    );
  });

/* ── componente ─────────────────────────────────────────── */

export const RealMap = forwardRef<MapHandle, Props>(function RealMap(
  { selected, onSelect, places = PLACES, onRoute },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MTMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const meRef = useRef<Marker | null>(null);
  const userPosRef = useRef<[number, number] | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // refs de callbacks → evitam closures velhas
  const onSelectRef = useRef(onSelect);
  const onRouteRef = useRef(onRoute);
  const placesRef = useRef(places);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
    onRouteRef.current = onRoute;
    placesRef.current = places;
  });

  /* init */
  useEffect(() => {
    const node = containerRef.current;
    if (!node || mapRef.current) return;

    if (!KEY) {
      console.error("❌ VITE_MAPTILER_KEY ausente no .env");
      return;
    }

    const map = new MTMap({
      container: node,
      style: STYLE_URL,
      center: RECIFE,
      zoom: 14,
      terrain: false,
      attributionControl: {},
      navigationControl: false,
      geolocateControl: false,
    });

    mapRef.current = map;

    map.on("styleimagemissing", (e) => {
      if (!map.hasImage(e.id)) {
        map.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) });
      }
    });

    map.on("load", () => {
      map.resize();
      setReady(true);
    });

    map.on("error", (e) =>
      console.error("❌ maptiler:", e.error?.message ?? e),
    );

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(node);

    return () => {
      ro.disconnect();
      abortRef.current?.abort();

      mapRef.current = null;
      markersRef.current = {};
      meRef.current = null;
      userPosRef.current = null;
      setReady(false);

      requestAnimationFrame(() => {
        try {
          map.remove();
        } catch {
          /* noop */
        }
      });
    };
  }, []);

  /* marcadores */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    places.forEach((p) => {
      const el = buildPin(p, () => onSelectRef.current(p.id));
      markersRef.current[p.id] = new Marker({ element: el, anchor: "bottom" })
        .setLngLat([p.lng, p.lat])
        .addTo(map);
    });

    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};
    };
  }, [places, ready]);

  /* destaque + voo */
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const node = marker.getElement();
      const active = id === selected;

      node.style.zIndex = active ? "10" : "1";
      node.style.scale = active ? "1.25" : "1";
      node.style.filter = active
        ? "drop-shadow(0 0 8px rgba(230,57,70,.7))"
        : "none";
    });

    const map = mapRef.current;
    const place = places.find((p) => p.id === selected);
    if (!map || !ready || !place) return;

    map.flyTo({
      center: [place.lng, place.lat],
      zoom: Math.max(map.getZoom(), 15),
      offset: [0, -90],
      duration: 700,
    });
  }, [selected, places, ready]);

  /* ── rota ─────────────────────────────────────────────── */

  const clearRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      [ROUTE_LINE, ROUTE_CASING].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
      if (map.getSource(ROUTE_SRC)) map.removeSource(ROUTE_SRC);
    } catch (error) {
      console.warn("⚠️ Falha ao limpar a rota:", error);
    }
  }, []);

  const syncUserMarker = useCallback((pos: [number, number]) => {
    const map = mapRef.current;
    if (!map) return;

    userPosRef.current = pos;

    if (meRef.current) meRef.current.setLngLat(pos);
    else
      meRef.current = new Marker({ element: buildUserDot() })
        .setLngLat(pos)
        .addTo(map);
  }, []);

  const drawRoute = useCallback(
    (geometry: GeoJSON.Geometry) => {
      const map = mapRef.current;
      if (!map) return;

      clearRoute();

      map.addSource(ROUTE_SRC, {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry },
      });

      const layout = { "line-cap": "round", "line-join": "round" } as const;

      map.addLayer({
        id: ROUTE_CASING,
        type: "line",
        source: ROUTE_SRC,
        layout,
        paint: {
          "line-color": "#FFFFFF",
          "line-width": 9,
          "line-opacity": 0.95,
        },
      });

      map.addLayer({
        id: ROUTE_LINE,
        type: "line",
        source: ROUTE_SRC,
        layout,
        paint: { "line-color": "#E63946", "line-width": 5 },
      });
    },
    [clearRoute],
  );

  const routeTo = useCallback(
    async (ids: string[]): Promise<RouteResult | null> => {
      const map = mapRef.current;
      if (!map || !ready) return null;

      const destinations = ids
        .map((id) => placesRef.current.find((p) => p.id === id))
        .filter((p): p is Place => Boolean(p));

      if (!destinations.length) {
        console.warn("⚠️ Nenhum destino válido para a rota.");
        return null;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const origin = await getPosition();
        syncUserMarker(origin);

        const coords: [number, number][] = [
          origin,
          ...destinations.map((p) => [p.lng, p.lat] as [number, number]),
        ];

        const path = coords.map(([lng, lat]) => `${lng},${lat}`).join(";");
        const url =
          `https://api.maptiler.com/routing/v1/walking/${path}.json` +
          `?key=${KEY}&overview=full&geometries=geojson`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Routing API → HTTP ${res.status}`);

        const route = (await res.json()).routes?.[0];
        if (!route?.geometry) throw new Error("Geometria da rota ausente.");
        if (!mapRef.current) return null;

        drawRoute(route.geometry);

        const bounds = coords.reduce(
          (acc, c) => acc.extend(c),
          new LngLatBounds(),
        );

        map.fitBounds(bounds, {
          padding: FIT_PADDING,
          duration: 1000,
          maxZoom: 16,
        });

        const result: RouteResult = {
          distance: route.distance,
          duration: route.duration,
          stops: destinations.map((d) => d.label),
        };

        onRouteRef.current?.(result);
        return result;
      } catch (error) {
        if ((error as Error).name === "AbortError") return null;
        console.error("❌ Erro ao calcular rota:", error);
        onRouteRef.current?.(null);
        return null;
      }
    },
    [ready, drawRoute, syncUserMarker],
  );

  /* ── api imperativa ───────────────────────────────────── */

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => mapRef.current?.zoomIn(),
      zoomOut: () => mapRef.current?.zoomOut(),

      locate: async () => {
        try {
          const pos = await getPosition();
          syncUserMarker(pos);
          mapRef.current?.flyTo({ center: pos, zoom: 15, duration: 800 });
          return pos;
        } catch (error) {
          console.warn("📍", (error as Error).message);
          return null;
        }
      },

      flyTo: (id) => {
        const place = placesRef.current.find((p) => p.id === id);
        if (place)
          mapRef.current?.flyTo({ center: [place.lng, place.lat], zoom: 16 });
      },

      routeTo,
      clearRoute,
    }),
    [routeTo, clearRoute, syncUserMarker],
  );

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
});
