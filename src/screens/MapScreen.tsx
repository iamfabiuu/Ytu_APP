import { useCallback, useMemo, useRef, useState } from "react";
import {
  MapPin,
  Plus,
  Minus,
  Crosshair,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { RealMap, type MapHandle } from "../components/RealMap";
import { PLACES, type Place } from "../data/places";

const CATS = [
  "Tudo",
  "Cultura",
  "Praias",
  "Comida",
  "Patrimônio",
  "Eventos",
] as const;

export function MapScreen() {
  const [selected, setSelected] = useState<string | null>("frevo");
  const [cat, setCat] = useState<string>("Tudo");
  const mapRef = useRef<MapHandle>(null);

  const places = useMemo<Place[]>(
    () =>
      cat === "Tudo" ? PLACES : PLACES.filter((p: Place) => p.cat === cat),
    [cat],
  );

  const place = places.find((p: Place) => p.id === selected) ?? null;

  /* troca de categoria sem deixar seleção órfã */
  const selectCat = useCallback((c: string) => {
    setCat(c);
    const next =
      c === "Tudo" ? PLACES : PLACES.filter((p: Place) => p.cat === c);
    setSelected((s) => (s && next.some((p: Place) => p.id === s) ? s : null));
  }, []);

  const zoomIn = useCallback(() => mapRef.current?.zoomIn(), []);
  const zoomOut = useCallback(() => mapRef.current?.zoomOut(), []);
  const locate = useCallback(() => mapRef.current?.locate(), []);

  const controls = useMemo(
    () => [
      { Icon: Plus, label: "Aproximar", action: zoomIn },
      { Icon: Minus, label: "Afastar", action: zoomOut },
      { Icon: Crosshair, label: "Minha localização", action: locate },
    ],
    [locate, zoomIn, zoomOut],
  );

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-sand">
      <RealMap
        ref={mapRef}
        places={places}
        selected={selected}
        onSelect={setSelected}
      />

      {/* ---------- topo ---------- */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-[calc(env(safe-area-inset-top)+12px)]">
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex-1 rounded-2xl bg-white/95 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink/40">
              Sua localização
            </p>
            <p className="flex items-center gap-1.5 font-bold text-navy">
              <MapPin className="size-4" strokeWidth={2.5} aria-hidden />
              Recife, PE
            </p>
          </div>
          <button
            type="button"
            aria-label="Filtros"
            disabled
            className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition active:scale-90 disabled:opacity-60"
          >
            <SlidersHorizontal className="size-5" strokeWidth={2.5} />
          </button>
        </div>

        <ul className="pointer-events-auto -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATS.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => selectCat(c)}
                aria-pressed={cat === c}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold shadow-md shadow-black/5 transition active:scale-95 ${
                  cat === c
                    ? "bg-navy text-white"
                    : "bg-white/95 text-navy backdrop-blur"
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </header>

      {/* ---------- controles laterais ---------- */}
      <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2">
        {controls.map(({ Icon, label, action }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={action}
            className="grid size-11 place-items-center rounded-full bg-white/95 text-navy shadow-lg shadow-black/10 backdrop-blur transition active:scale-90"
          >
            <Icon className="size-5" strokeWidth={2.5} />
          </button>
        ))}
      </div>

      {/* ---------- estado vazio do filtro ---------- */}
      {places.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-10 text-center">
          <p className="rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-navy shadow-lg backdrop-blur">
            Nada em <span className="text-accent">{cat}</span> por aqui ainda 🌴
          </p>
        </div>
      )}

      {/* ---------- atribuição obrigatória ---------- */}
      <p
        className={`absolute left-4 z-20 text-[9px] font-medium text-ink/50 transition-all duration-300 ${
          place ? "bottom-[160px]" : "bottom-24"
        }`}
      >
        © MapTiler © OpenStreetMap
      </p>

      {/* ---------- card inferior ---------- */}
      {place && (
        <section className="absolute inset-x-0 bottom-0 z-20 animate-in slide-in-from-bottom rounded-t-3xl bg-white px-4 pb-32 pt-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
          <span className="mx-auto mb-4 block h-1.5 w-10 rounded-full bg-ink/10" />
          <div className="flex items-center gap-3 rounded-2xl bg-sand p-3">
            <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-navy/10">
              <img
                src={`/places/${place.id}.jpg`}
                alt=""
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                {place.dist} • {place.cat}
              </p>
              <h2 className="truncate text-lg font-bold text-ink">
                {place.label}
              </h2>
              <p className="text-xs font-semibold text-emerald-600">
                {place.hours}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
              className="grid size-8 place-items-center rounded-full text-ink/30 transition active:scale-90"
            >
              <X className="size-4" strokeWidth={2.5} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
