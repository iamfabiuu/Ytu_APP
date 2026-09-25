import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  Accessibility,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Clock3,
  MapPin,
  Navigation,
  Route as RouteIcon,
  Star,
  Ticket,
  X,
} from "lucide-react";

import { RealMap, type MapHandle } from "../components/RealMap";
import { PLACES } from "../data/places";
import { PLACE_DETAILS } from "../data/placeDetails";
import { ROUTES } from "../data/routes";

const CATS = [
  "Tudo",
  "Cultura",
  "Praias",
  "Comida",
  "Culinária",
  "Patrimônio",
  "Eventos",
];

export function MapScreen() {
  const mapRef = useRef<MapHandle>(null);

  const sheetStartY = useRef<number | null>(null);
  const sheetDidDrag = useRef(false);

  const [selected, setSelected] = useState<string | null>(null);
  const [cat, setCat] = useState("Tudo");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const visiblePlaces = useMemo(() => {
    if (cat === "Tudo") return PLACES;

    return PLACES.filter((place) => place.cat === cat);
  }, [cat]);

  const place = useMemo(() => {
    return PLACES.find((item) => item.id === selected) ?? null;
  }, [selected]);

  const details = useMemo(() => {
    if (!selected) return null;

    return PLACE_DETAILS[selected] ?? null;
  }, [selected]);

  const recommendedRoutes = useMemo(() => {
    if (!place) return [];

    return ROUTES.filter((route) =>
      route.stops.includes(place.id),
    );
  }, [place]);

  /*
   * Selecionar outro local encerra a rota atual.
   * A rota só volta quando o usuário escolher uma rota novamente.
   */
 const selectPlace = useCallback((id: string | null) => {
  mapRef.current?.clearRoute();

  setSelected(id);
  setShowRecommendations(false);
  setSheetExpanded(false);
}, []);

const selectRouteStop = useCallback((id: string) => {
  // Mantém a rota ativa no mapa.
  setSelected(id);
  setShowRecommendations(false);
  setSheetExpanded(false);

  // Apenas centraliza o mapa na parada escolhida.
  mapRef.current?.flyTo(id);
}, []);

  /*
   * Trocar de categoria também encerra qualquer rota ativa.
   */
  const handleCategoryChange = useCallback(
    (category: string) => {
      mapRef.current?.clearRoute();

      setCat(category);

      setSelected((current) => {
        if (!current) return null;

        const nextPlaces =
          category === "Tudo"
            ? PLACES
            : PLACES.filter(
                (item) => item.cat === category,
              );

        return nextPlaces.some(
          (item) => item.id === current,
        )
          ? current
          : null;
      });

      setShowRecommendations(false);
      setSheetExpanded(false);
    },
    [],
  );

  /*
   * Ativa uma rota e imediatamente recolhe o painel.
   * Assim a rota fica visível no mapa sem o painel cobrindo a tela.
   */
  const startRoute = useCallback((routeStops: string[]) => {
    mapRef.current?.showRoute(routeStops);

    setShowRecommendations(false);
    setSheetExpanded(false);
  }, []);

  const flyToPlace = useCallback(() => {
    if (!place) return;

    mapRef.current?.flyTo(place.id);
  }, [place]);

  /*
   * Fechar o local também encerra a rota.
   */
  const closePlace = useCallback(() => {
    mapRef.current?.clearRoute();

    setSelected(null);
    setShowRecommendations(false);
    setSheetExpanded(false);
  }, []);

  /*
   * Clique simples no puxador.
   */
  const toggleSheet = useCallback(() => {
    if (sheetDidDrag.current) {
      sheetDidDrag.current = false;
      return;
    }

    setSheetExpanded((current) => !current);
    setShowRecommendations(false);
  }, []);

  /*
   * Começa a acompanhar o movimento do dedo/mouse.
   */
  const handleSheetPointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      sheetStartY.current = event.clientY;
      sheetDidDrag.current = false;
    },
    [],
  );

  /*
   * Se realmente arrastou para cima/baixo, altera o painel.
   */
  const handleSheetPointerUp = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const startY = sheetStartY.current;

      if (startY === null) return;

      const deltaY = event.clientY - startY;

      if (Math.abs(deltaY) > 35) {
        sheetDidDrag.current = true;

        if (deltaY < -35) {
          setSheetExpanded(true);
          setShowRecommendations(false);
        } else {
          setSheetExpanded(false);
          setShowRecommendations(false);
        }
      }

      sheetStartY.current = null;
    },
    [],
  );

  const getTagClass = (tag: string) => {
    const normalized = tag.toUpperCase();

    if (
      normalized.includes("CULTURA") ||
      normalized.includes("MUSEU")
    ) {
      return "border-red-100 bg-red-50 text-red-600";
    }

    if (
      normalized.includes("MÚSICA") ||
      normalized.includes("DANÇA")
    ) {
      return "border-orange-100 bg-orange-50 text-orange-600";
    }

    if (
      normalized.includes("GASTRONOMIA") ||
      normalized.includes("FEIRA")
    ) {
      return "border-yellow-100 bg-yellow-50 text-yellow-700";
    }

    if (
      normalized.includes("INTERATIVO") ||
      normalized.includes("VIDA LOCAL")
    ) {
      return "border-sky-100 bg-sky-50 text-sky-600";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100">
      {/* MAPA */}
      <div className="absolute inset-0">
        <RealMap
          ref={mapRef}
          places={visiblePlaces}
          selected={selected}
          onSelect={selectPlace}
        />
      </div>

      {/* FILTROS */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20">
        <div className="pointer-events-auto flex gap-2 overflow-x-auto px-4 py-4 scrollbar-none">
          {CATS.map((item) => {
            const active = cat === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => handleCategoryChange(item)}
                className={[
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium",
                  "shadow-sm backdrop-blur-md transition",
                  active
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-white/70 bg-white/90 text-slate-700 hover:bg-white",
                ].join(" ")}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* PAINEL DO LOCAL */}
      {place && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
          <div className="pointer-events-auto mx-auto w-full max-w-2xl px-3 pb-3 sm:px-5 sm:pb-5">
            <div
              className={[
                "rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5",
                "transition-all duration-300",
                sheetExpanded
                  ? "max-h-[calc(100dvh-88px)] overflow-x-hidden overflow-y-auto overscroll-contain"
                  : "max-h-[260px] overflow-hidden",
              ].join(" ")}
            >
              {/* PUXADOR */}
              <div className="sticky top-0 z-20 flex justify-center bg-white/95 px-4 pb-2 pt-3 backdrop-blur-md">
                <button
                  type="button"
                  onClick={toggleSheet}
                  onPointerDown={handleSheetPointerDown}
                  onPointerUp={handleSheetPointerUp}
                  aria-label={
                    sheetExpanded
                      ? "Recolher informações"
                      : "Expandir informações"
                  }
                  aria-expanded={sheetExpanded}
                  className="flex w-full cursor-grab touch-none flex-col items-center gap-1 active:cursor-grabbing"
                >
                  <span className="h-1.5 w-12 rounded-full bg-slate-300 transition-colors hover:bg-slate-400" />

                  {sheetExpanded ? (
                    <ArrowDown
                      size={14}
                      className="text-slate-400"
                    />
                  ) : (
                    <ArrowUp
                      size={14}
                      className="text-slate-400"
                    />
                  )}
                </button>
              </div>

              {/* RESUMO */}
              <div className="px-4 pb-4 sm:px-5">
                <div className="flex gap-3">
                  {/* IMAGEM */}
                  <div
                    className={[
                      "shrink-0 overflow-hidden rounded-2xl bg-slate-100",
                      sheetExpanded
                        ? "h-24 w-24"
                        : "h-20 w-20",
                    ].join(" ")}
                  >
                    {details?.cover ? (
                      <img
                        src={details.cover}
                        alt={details.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <MapPin
                          size={24}
                          className="text-slate-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* INFORMAÇÕES PRINCIPAIS */}
                  <div className="min-w-0 flex-1">
                    {details?.tags?.length ? (
                      <div className="mb-1.5 flex flex-wrap gap-1.5">
                        {details.tags.map((tag) => (
                          <span
                            key={tag}
                            className={[
                              "rounded-full border px-2 py-1",
                              "text-[9px] font-bold uppercase tracking-wide",
                              getTagClass(tag),
                            ].join(" ")}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-red-500">
                        {place.cat}
                      </p>
                    )}

                    <h2 className="truncate text-lg font-bold leading-tight text-slate-950">
                      {details?.name ?? place.label}
                    </h2>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
                      {details?.rating !== undefined && (
                        <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                          <Star
                            size={14}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          {details.rating.toFixed(1)}
                        </span>
                      )}

                      {details?.reviews !== undefined && (
                        <span>
                          {details.reviews.toLocaleString(
                            "pt-BR",
                          )}{" "}
                          avaliações
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} />
                        {details?.distance ?? place.dist}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs font-semibold text-emerald-600">
                      {details?.hours.value ?? place.hours}
                    </p>
                  </div>

                  {/* FECHAR */}
                  <button
                    type="button"
                    onClick={closePlace}
                    aria-label="Fechar informações"
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* BOTÃO DE RECOMENDAÇÕES NO MODO COMPACTO */}
                {!sheetExpanded && (
                  <button
                    type="button"
                    onClick={() => {
                      setSheetExpanded(true);
                      setShowRecommendations(true);
                    }}
                    className="mt-3 flex w-full items-center justify-between rounded-2xl bg-red-50 px-4 py-3.5 text-left transition hover:bg-red-100"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-red-600">
                        Ver recomendações
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {recommendedRoutes.length === 0
                          ? "Confira os detalhes deste local"
                          : recommendedRoutes.length === 1
                            ? "1 rota passa por este local"
                            : `${recommendedRoutes.length} rotas passam por este local`}
                      </p>
                    </div>

                    <ArrowRight
                      size={19}
                      className="shrink-0 text-red-500"
                    />
                  </button>
                )}
              </div>

              {/* CONTEÚDO EXPANDIDO */}
              {sheetExpanded && (
                <div className="border-t border-slate-100 px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4 sm:px-5">
                  {/* BADGE */}
                  {details?.badge && (
                    <div className="mb-3 inline-flex rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700">
                      {details.badge}
                    </div>
                  )}

                  {/* DESCRIÇÃO */}
                  {details?.description && (
                    <p className="text-sm leading-6 text-slate-600">
                      {details.description}
                    </p>
                  )}

                  {/* INFORMAÇÕES RÁPIDAS */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3">
                      <div className="flex items-center gap-2 text-orange-600">
                        <Clock3 size={16} />
                        <span className="text-xs font-bold">
                          Horário
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {details?.hours.value ?? place.hours}
                      </p>

                      {details?.hours.note && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {details.hours.note}
                        </p>
                      )}
                    </div>

                    {details?.ticket ? (
                      <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-3">
                        <div className="flex items-center gap-2 text-yellow-700">
                          <Ticket size={16} />
                          <span className="text-xs font-bold">
                            Ingresso
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {details.ticket.value}
                        </p>

                        {details.ticket.note && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {details.ticket.note}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-sky-100 bg-sky-50 p-3">
                        <div className="flex items-center gap-2 text-sky-600">
                          <MapPin size={16} />
                          <span className="text-xs font-bold">
                            Distância
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {details?.distance ?? place.dist}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ACESSIBILIDADE */}
                  {details?.accessibility && (
                    <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50 p-3">
                      <div className="flex items-center gap-2">
                        <Accessibility
                          size={17}
                          className="text-sky-600"
                        />

                        <span className="text-sm font-bold text-slate-900">
                          {details.accessibility.title}
                        </span>
                      </div>

                      {details.accessibility.features.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {details.accessibility.features.map(
                            (feature) => (
                              <span
                                key={feature}
                                className="rounded-full border border-sky-100 bg-white px-2.5 py-1 text-xs font-medium text-sky-700"
                              >
                                {feature}
                              </span>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ENDEREÇO */}
                  {details?.address && (
                    <div className="mt-3 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-red-500"
                      />

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {details.address.line1}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {details.address.line2}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* VER NO MAPA */}
                  <button
                    type="button"
                    onClick={flyToPlace}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-700 transition hover:bg-sky-100"
                  >
                    <Navigation size={17} />
                    Ver no mapa
                  </button>

                  {/* RECOMENDAÇÕES */}
                  <div className="mt-5">
                    {!showRecommendations ? (
                      <button
                        type="button"
                        onClick={() =>
                          setShowRecommendations(true)
                        }
                        className="flex w-full items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-left transition hover:bg-red-100"
                      >
                        <div>
                          <p className="text-sm font-bold text-red-600">
                            Ver recomendações
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {recommendedRoutes.length === 0
                              ? "Nenhuma rota cadastrada para este local"
                              : recommendedRoutes.length === 1
                                ? "1 rota passa por este local"
                                : `${recommendedRoutes.length} rotas passam por este local`}
                          </p>
                        </div>

                        <ArrowRight
                          size={18}
                          className="text-red-500"
                        />
                      </button>
                    ) : (
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <p className="text-base font-bold text-slate-900">
                              Rotas recomendadas
                            </p>

                            <p className="text-xs text-slate-500">
                              Escolha uma rota para ver no mapa
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setShowRecommendations(false)
                            }
                            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Ocultar recomendações"
                          >
                            <X size={17} />
                          </button>
                        </div>

                        {recommendedRoutes.length > 0 ? (
                          <div className="space-y-3">
                            {recommendedRoutes.map((route) => {
                              const routePlaces = route.stops
                                .map((id) =>
                                  PLACES.find(
                                    (item) => item.id === id,
                                  ),
                                )
                                .filter(
                                  (
                                    item,
                                  ): item is (typeof PLACES)[number] =>
                                    Boolean(item),
                                );

                              return (
                                <div
                                  key={route.id}
                                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                                >
                                  {/* CARD DA ROTA */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      startRoute(route.stops)
                                    }
                                    className="group w-full text-left transition hover:bg-red-50"
                                  >
                                    <div className="flex gap-3 p-3">
                                      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                                        {route.img ? (
                                          <img
                                            src={route.img}
                                            alt=""
                                            className="h-full w-full object-cover"
                                          />
                                        ) : null}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                          <p className="text-sm font-bold text-slate-900">
                                            {route.title}
                                          </p>

                                          <ArrowRight
                                            size={16}
                                            className="mt-0.5 shrink-0 text-red-400 transition group-hover:translate-x-0.5"
                                          />
                                        </div>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                          {route.description}
                                        </p>

                                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500">
                                          <span>
                                            {route.duration}
                                          </span>

                                          <span>
                                            {route.price}
                                          </span>

                                          <span>
                                            {route.stops.length}{" "}
                                            paradas
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </button>

                                  {/* PARADAS */}
                                  {routePlaces.length > 0 && (
                                    <div className="border-t border-slate-100 px-3 pb-3 pt-2.5">
                                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Paradas
                                      </p>

                                      <div className="flex flex-wrap items-center gap-1.5">
                                        {routePlaces.map(
                                          (stop, index) => (
                                            <div
                                              key={stop.id}
                                              className="flex items-center gap-1.5"
                                            >
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  selectRouteStop(
                                                    stop.id,
                                                  )
                                                }
                                                className={[
                                                  "rounded-full border px-2.5 py-1",
                                                  "text-[10px] font-bold transition-colors",
                                                  stop.id ===
                                                  place.id
                                                    ? "border-red-200 bg-red-50 text-red-600"
                                                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
                                                ].join(" ")}
                                              >
                                                {index + 1}.{" "}
                                                {stop.label}
                                              </button>

                                              {index <
                                                routePlaces.length -
                                                  1 && (
                                                <span className="text-slate-300">
                                                  →
                                                </span>
                                              )}
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center">
                            <RouteIcon
                              size={25}
                              className="mx-auto text-slate-300"
                            />

                            <p className="mt-2 text-sm font-bold text-slate-600">
                              Nenhuma rota cadastrada
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-400">
                              Esse local ainda não faz parte de uma
                              rota recomendada.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}