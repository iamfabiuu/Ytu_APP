import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Map as MTMap, Marker, config } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { PLACES, type Place } from "../data/places";
import { applyYtuMapTheme } from "../lib/ytuMapTheme";
import { addLandmarks, removeLandmarks } from "../map/landmarks";
import {
  highlightMarker,
  placesOnRoute,
  removeMarkers,
  renderPlaceMarkers,
  showUserLocation,
  type MarkerMap,
} from "../map/markers";
import { createRouteController } from "../map/route";
import { DEFAULT_MODE, type TravelMode } from "../lib/travelMode";
import { addBoats, removeBoats } from "../map/boatLayers";

const RECIFE: [number, number] = [-34.8811, -8.0631];

const KEY = import.meta.env.VITE_MAPTILER_KEY as string;
config.apiKey = KEY;

const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${KEY}`;

export type MapHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  locate: () => void;
  flyTo: (id: string) => void;

  showRoute: (
    ids: string[],
    currentCheckpoint?: number,
    mode?: TravelMode,
  ) => void;

  clearRoute: () => void;
};

type Props = {
  selected: string | null;
  onSelect: (id: string | null) => void;
  places?: Place[];
};

type PendingRoute = {
  ids: string[];
  currentCheckpoint: number;
  fitRoute: boolean;
  mode: TravelMode;
};

/*
 * RealMap é o orquestrador: cria o mapa, guarda o estado do React e
 * chama os módulos de src/map/ (landmarks, markers, route).
 * Regra: o que precisa de hook fica aqui; o que só precisa da
 * instância do mapa mora em src/map/.
 *
 * Pinos: com uma rota em exibição (showRoute), só as paradas dela
 * ganham pino. Sem rota, todos os `places` recebidos ganham pino.
 */
export const RealMap = forwardRef<MapHandle, Props>(function RealMap(
  { selected, onSelect, places = PLACES },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MTMap | null>(null);

  const markersRef = useRef<MarkerMap>({});
  const meRef = useRef<Marker | null>(null);

  const onSelectRef = useRef(onSelect);

  const pendingRouteRef = useRef<PendingRoute | null>(null);

  const routeInitializedRef = useRef(false);

  /* último modo desenhado: se mudar, a câmera reenquadra a rota nova */
  const lastModeRef = useRef<TravelMode | null>(null);

  /* um controlador de rota por mapa (guarda a versão anti-corrida) */
  const [routes] = useState(createRouteController);

  const [ready, setReady] = useState(false);

  /*
   * Ids das paradas da rota em exibição, juntos numa string
   * (null = nenhuma rota escolhida). Como é uma string, mostrar a
   * mesma rota de novo (ex.: a cada checkpoint) não refaz os pinos.
   */
  const [routeKey, setRouteKey] = useState<string | null>(null);

  /* lugares que devem ter pino agora */
  const visiblePlaces = useMemo(
    () =>
      placesOnRoute(places, routeKey === null ? null : routeKey.split(",")),
    [places, routeKey],
  );

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  /* ---------- rota ---------- */

  const drawRoute = (
    ids: string[],
    currentCheckpoint = 0,
    fitRoute = false,
    mode: TravelMode = DEFAULT_MODE,
  ) => {
    const map = mapRef.current;

    if (!map || !ready) {
      return Promise.resolve();
    }

    return routes.draw({
      map,
      places,
      ids,
      currentCheckpoint,
      fitRoute,
      mode,
    });
  };

  const clearRoute = () => {
    pendingRouteRef.current = null;

    setRouteKey(null);

    routes.clear(mapRef.current);
  };

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

    if (import.meta.env.DEV) {
      map.on("click", (e) => {
        const layers = map.queryRenderedFeatures(e.point).map((f) => f.layer.id);
        const naAgua = layers.includes("Water");
        console.log(
          `📍 [${e.lngLat.lng.toFixed(6)}, ${e.lngLat.lat.toFixed(6)}] ${naAgua ? "🌊 água" : "⚠️ não é água"}`,
        );
      });
    }


    map.on("styleimagemissing", (e) => {
      if (!map.hasImage(e.id)) {
        map.addImage(e.id, {
          width: 1,
          height: 1,
          data: new Uint8Array(4),
        });
      }
    });

    map.on("load", () => {
      /* tema visual do YTU */
      applyYtuMapTheme(map);

      /* Marco Zero como geometria real do mapa (não é Marker HTML) */
      addLandmarks(map);

      addBoats(map);

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

      /* invalida rotas em andamento e apaga o que foi desenhado */
      pendingRouteRef.current = null;
      routes.clear(map);

      removeLandmarks(map);
      removeBoats(map);

      mapRef.current = null;
      markersRef.current = {};
      meRef.current = null;

      routeInitializedRef.current = false;
      lastModeRef.current = null;

      setReady(false);

      requestAnimationFrame(() => {
        try {
          map.remove();
        } catch {
          /* noop */
        }
      });
    };
  }, [routes]);

  /* ---------- desenha rota pendente ---------- */

  useEffect(() => {
    if (!ready) return;

    const pending = pendingRouteRef.current;

    if (!pending) return;

    pendingRouteRef.current = null;

    void drawRoute(
      pending.ids,
      pending.currentCheckpoint,
      pending.fitRoute,
      pending.mode,
    );
  }, [ready]);

  /* ---------- marcadores ---------- */

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !ready) return;

    removeMarkers(markersRef.current);

    markersRef.current = renderPlaceMarkers(map, visiblePlaces, (id) =>
      onSelectRef.current(id),
    );

    return () => {
      removeMarkers(markersRef.current);

      markersRef.current = {};
    };
  }, [visiblePlaces, ready]);

  /* ---------- destaque ---------- */

  useEffect(() => {
    highlightMarker(markersRef.current, selected);
  }, [selected, visiblePlaces, ready]);

  /* ---------- voo ---------- */

  useEffect(() => {
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
        if (!navigator.geolocation) {
          return;
        }

        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const map = mapRef.current;

            if (!map) return;

            const pos: [number, number] = [
              coords.longitude,
              coords.latitude,
            ];

            meRef.current = showUserLocation(map, meRef.current, pos);

            map.flyTo({
              center: pos,
              zoom: 15,
              duration: 800,
            });
          },
          (err) =>
            console.warn("Geolocation:", err.message),
          {
            enableHighAccuracy: true,
            timeout: 8000,
          },
        );
      },

      flyTo: (id) => {
        const p = places.find((x) => x.id === id);

        if (p) {
          mapRef.current?.flyTo({
            center: [p.lng, p.lat],
            zoom: 16,
          });
        }
      },

      showRoute: (ids, currentCheckpoint = 0, mode = DEFAULT_MODE) => {
        setRouteKey(ids.join(","));

        const isNewRoute = !routeInitializedRef.current;

        /* rota nova OU troca de modo (a pé ↔ bike): enquadra a câmera */
        const fitRoute = isNewRoute || lastModeRef.current !== mode;

        lastModeRef.current = mode;

        pendingRouteRef.current = {
          ids,
          currentCheckpoint,
          fitRoute,
          mode,
        };

        routeInitializedRef.current = true;

        if (mapRef.current && ready) {
          pendingRouteRef.current = null;

          void drawRoute(
            ids,
            currentCheckpoint,
            fitRoute,
            mode,
          );
        }
      },

      clearRoute: () => {
        clearRoute();
      },
    }),
    [places, ready],
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
    />
  );
});