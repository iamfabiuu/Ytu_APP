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
  setMarkerLabels,
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

/*
 * A partir deste zoom, os nomes dos lugares ficam visíveis.
 *
 * Abaixo de 14:
 *   somente os pins.
 *
 * A partir de 14:
 *   pins + nomes.
 */
const LABEL_ZOOM = 14;

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
 *
 * Regra das rotas:
 *
 * - Quando o usuário inicia uma rota, ela fica registrada em
 *   activeRouteRef.
 * - Selecionar uma parada da rota NÃO encerra essa rota.
 * - O mapa pode voar até a parada normalmente.
 * - Depois que a seleção muda, a rota ativa é redesenhada sem
 *   reenquadrar a câmera.
 * - Só clearRoute() realmente encerra a rota.
 *
 * Pinos:
 * - sem rota: todos os lugares recebidos ganham pino;
 * - com rota: somente as paradas da rota ganham pino.
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

  /*
   * Guarda a rota atualmente ativa.
   *
   * Isso é diferente de routeKey:
   * routeKey controla quais pinos aparecem;
   * activeRouteRef garante que a rota continue desenhada
   * mesmo quando selected muda.
   */
  const activeRouteRef = useRef<PendingRoute | null>(null);

  const routeInitializedRef = useRef(false);

  /* último modo desenhado */
  const lastModeRef = useRef<TravelMode | null>(null);

  /* um controlador de rota por mapa */
  const [routes] = useState(createRouteController);

  const [ready, setReady] = useState(false);

  /*
   * IDs das paradas da rota em exibição.
   * null = nenhuma rota escolhida.
   */
  const [routeKey, setRouteKey] = useState<string | null>(null);

  /*
   * Lugares que devem ter pino agora.
   */
  const visiblePlaces = useMemo(
    () =>
      placesOnRoute(
        places,
        routeKey === null ? null : routeKey.split(","),
      ),
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

  /*
   * Limpa completamente a rota atual.
   *
   * Esta é a única operação que deve realmente fazer
   * o usuário sair da rota.
   */
  const clearRoute = () => {
    pendingRouteRef.current = null;
    activeRouteRef.current = null;

    setRouteKey(null);

    routeInitializedRef.current = false;
    lastModeRef.current = null;

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
        const layers = map
          .queryRenderedFeatures(e.point)
          .map((f) => f.layer.id);

        const naAgua = layers.includes("Water");

        console.log(
          `📍 [${e.lngLat.lng.toFixed(6)}, ${e.lngLat.lat.toFixed(6)}] ${
            naAgua ? "🌊 água" : "⚠️ não é água"
          }`,
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

      /* Marco Zero como geometria real do mapa */
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
      activeRouteRef.current = null;

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

    markersRef.current = renderPlaceMarkers(
      map,
      visiblePlaces,
      (id) => onSelectRef.current(id),
    );

    /*
     * Define imediatamente a visibilidade dos nomes.
     */
    setMarkerLabels(
      markersRef.current,
      map.getZoom() >= LABEL_ZOOM,
    );

    return () => {
      removeMarkers(markersRef.current);

      markersRef.current = {};
    };
  }, [visiblePlaces, ready]);

  /* ---------- nomes dos locais conforme o zoom ---------- */

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !ready) return;

    const updateLabels = () => {
      const visible = map.getZoom() >= LABEL_ZOOM;

      setMarkerLabels(markersRef.current, visible);
    };

    map.on("zoom", updateLabels);

    updateLabels();

    return () => {
      map.off("zoom", updateLabels);
    };
  }, [ready, visiblePlaces]);

  /* ---------- destaque ---------- */

  useEffect(() => {
    highlightMarker(markersRef.current, selected);
  }, [selected, visiblePlaces, ready]);

  /* ---------- voo + preservação da rota ---------- */

  useEffect(() => {
    const p = places.find((x) => x.id === selected);

    const map = mapRef.current;

    if (!p || !map || !ready) return;

    /*
     * Primeiro leva a câmera até o local selecionado.
     */
    map.flyTo({
      center: [p.lng, p.lat],
      zoom: Math.max(map.getZoom(), 15),
      offset: [0, -90],
      duration: 700,
    });

    /*
     * Se existe uma rota ativa, ela NÃO deve desaparecer
     * quando selected muda.
     *
     * Redesenhamos a mesma rota sem fitRoute.
     *
     * Isso mantém:
     *
     * rota completa
     *      +
     * parada selecionada
     *      +
     * câmera focada na parada
     */
    const activeRoute = activeRouteRef.current;

    if (activeRoute) {
      /*
       * Pequeno atraso para deixar o flyTo iniciar antes
       * de garantir novamente as camadas da rota.
       *
       * Não usamos fitRoute aqui, portanto a câmera não
       * volta para enquadrar a rota inteira.
       */
      const timer = window.setTimeout(() => {
        const currentRoute = activeRouteRef.current;

        if (!currentRoute || !mapRef.current) return;

        void drawRoute(
          currentRoute.ids,
          currentRoute.currentCheckpoint,
          false,
          currentRoute.mode,
        );
      }, 40);

      return () => {
        window.clearTimeout(timer);
      };
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

            meRef.current = showUserLocation(
              map,
              meRef.current,
              pos,
            );

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

      showRoute: (
        ids,
        currentCheckpoint = 0,
        mode = DEFAULT_MODE,
      ) => {
        /*
         * Guarda a rota como a rota atualmente ativa.
         *
         * A partir daqui, mudar selected não significa
         * sair da rota.
         */
        const route: PendingRoute = {
          ids,
          currentCheckpoint,
          fitRoute: false,
          mode,
        };

        activeRouteRef.current = route;

        setRouteKey(ids.join(","));

        const isNewRoute = !routeInitializedRef.current;

        /*
         * Rota nova OU troca de modo:
         * reenquadra a câmera.
         */
        const fitRoute =
          isNewRoute || lastModeRef.current !== mode;

        lastModeRef.current = mode;

        const pending: PendingRoute = {
          ids,
          currentCheckpoint,
          fitRoute,
          mode,
        };

        activeRouteRef.current = pending;
        pendingRouteRef.current = pending;

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
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}
    />
  );
});