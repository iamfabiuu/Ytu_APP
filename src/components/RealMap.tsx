import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Map as MTMap, Marker, config } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { PLACES, type Place } from "../data/places";

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
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" ` +
  `stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">` +
  `${ICONS[cat] ?? ICONS.default}</svg>`;

const RECIFE: [number, number] = [-34.8811, -8.0631];

const KEY = import.meta.env.VITE_MAPTILER_KEY as string;
config.apiKey = KEY;

const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${KEY}`;

export type MapHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  locate: () => void;
  flyTo: (id: string) => void;
};

type Props = {
  selected: string | null;
  onSelect: (id: string | null) => void;
  places?: Place[];
};

export const RealMap = forwardRef<MapHandle, Props>(function RealMap(
  { selected, onSelect, places = PLACES },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MTMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const meRef = useRef<Marker | null>(null);
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  /* ---------- init ---------- */
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
      mapRef.current = null;
      markersRef.current = {};
      meRef.current = null;
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

  /* ---------- marcadores ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    places.forEach((p) => {
      const [c1, c2] = CAT_COLOR[p.cat] ?? CAT_COLOR.default;

      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", p.label);
      el.dataset.cat = p.cat;
      el.style.setProperty("--pin", c2);
      el.className =
        "relative grid h-11 w-9 cursor-pointer place-items-start justify-center " +
        "transition-transform duration-300 ease-out will-change-transform " +
        "hover:-translate-y-1 focus-visible:outline-none";
      el.innerHTML =
        `<span class="absolute bottom-0 left-1/2 h-1.5 w-4 -translate-x-1/2 ` +
        `rounded-full bg-black/25 blur-[2px]"></span>` +
        `<span class="pin-head grid size-9 rotate-45 place-items-center rounded-full ` +
        `rounded-br-sm border-[2.5px] border-white text-white" ` +
        `style="background:linear-gradient(135deg,${c1},${c2});` +
        `box-shadow:0 6px 14px -2px ${c2}99">` +
        `<span class="-rotate-45">${pinSvg(p.cat)}</span></span>`;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current(p.id);
      });

      markersRef.current[p.id] = new Marker({ element: el, anchor: "bottom" })
        .setLngLat([p.lng, p.lat])
        .addTo(map);
    });

    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};
    };
  }, [places, ready]);

  /* ---------- destaque + voo ---------- */
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, m]) => {
      const node = m.getElement();
      const active = id === selected;
      node.style.zIndex = active ? "10" : "1";
      node.style.filter = active
        ? "drop-shadow(0 0 8px rgba(230,57,70,.7))"
        : "none";
      node.style.scale = active ? "1.25" : "1";
    });

    const p = places.find((x) => x.id === selected);
    const map = mapRef.current;
    if (p && map && ready) {
      map.flyTo({
        center: [p.lng, p.lat],
        zoom: Math.max(map.getZoom(), 15),
        offset: [0, -90],
        duration: 700,
      });
    }
  }, [selected, places, ready]);

  /* ---------- API imperativa ---------- */
  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => mapRef.current?.zoomIn(),
      zoomOut: () => mapRef.current?.zoomOut(),
      locate: () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const map = mapRef.current;
            if (!map) return;
            const pos: [number, number] = [coords.longitude, coords.latitude];

            if (!meRef.current) {
              const dot = document.createElement("div");
              dot.className =
                "size-4 rounded-full border-2 border-white bg-blue-500 " +
                "shadow-[0_0_0_8px_rgba(59,130,246,.25)]";
              meRef.current = new Marker({ element: dot })
                .setLngLat(pos)
                .addTo(map);
            } else {
              meRef.current.setLngLat(pos);
            }
            map.flyTo({ center: pos, zoom: 15, duration: 800 });
          },
          (err) => console.warn("Geolocation:", err.message),
          { enableHighAccuracy: true, timeout: 8000 },
        );
      },
      flyTo: (id) => {
        const p = places.find((x) => x.id === id);
        if (p) mapRef.current?.flyTo({ center: [p.lng, p.lat], zoom: 16 });
      },
    }),
    [places],
  );

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
});
