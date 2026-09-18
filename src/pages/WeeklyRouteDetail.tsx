import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronLeft, MapPin, Check, Play, Clock, Footprints,
    Navigation, Trophy, RotateCcw, Lock, Sparkles, Pause,
} from "lucide-react";
import { ROUTES } from "../data/routes";
import { PLACES, type Place } from "../data/places";
import { RealMap, type MapHandle } from "../components/RealMap";

type Status = "idle" | "active" | "done";

type Journey = {
    status: Status;
    checkpoint: number;
    startedAt: number | null;
    elapsed: number;
    paused: boolean;
};

const INITIAL: Journey = {
    status: "idle", checkpoint: -1, startedAt: null, elapsed: 0, paused: false,
};

const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (s: number) =>
    `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;

export function WeeklyRouteDetail() {
    const nav = useNavigate();
    const mapRef = useRef<MapHandle>(null);

    const route = useMemo(() => ROUTES.find((r) => r.featured) ?? ROUTES[0], []);
    const storageKey = `ytu:journey:${route?.id}`;

    const [journey, setJourney] = useState<Journey>(INITIAL);
    const [confirming, setConfirming] = useState<number | null>(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) setJourney((j) => ({ ...j, ...JSON.parse(raw) }));
        } catch { /* noop */ }
    }, [storageKey]);

    const stops = useMemo(
        () =>
            route
                ? route.stops
                    .map((sid) => PLACES.find((p) => p.id === sid))
                    .filter((p): p is Place => Boolean(p))
                : [],
        [route],
    );

    const total = stops.length;
    const doneCount = journey.checkpoint + 1;
    const progress = total ? Math.round((doneCount / total) * 100) : 0;
    const nextIndex = journey.checkpoint + 1;

    /* persistência */
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(journey));
    }, [journey, storageKey]);

    /* cronômetro */
    useEffect(() => {
        if (journey.status !== "active" || journey.paused) return;
        const t = setInterval(
            () => setJourney((j) => ({ ...j, elapsed: j.elapsed + 1 })),
            1000,
        );
        return () => clearInterval(t);
    }, [journey.status, journey.paused]);

    /* mapa */
    useEffect(() => {
        if (!route) return;
        mapRef.current?.showRoute(route.stops, Math.max(0, journey.checkpoint), route.segments);
        return () => mapRef.current?.clearRoute();
    }, [route, journey.checkpoint]);

    /* ações */
    const start = useCallback(() => {
        setJourney({ ...INITIAL, status: "active", startedAt: Date.now() });
        navigator.vibrate?.(20);
    }, []);

    const checkIn = useCallback((index: number) => {
        setConfirming(null);
        navigator.vibrate?.([10, 40, 10]);
        setJourney((j) => ({
            ...j,
            checkpoint: index,
            status: index >= total - 1 ? "done" : "active",
        }));
    }, [total]);

    const undo = useCallback(() => {
        setJourney((j) => ({ ...j, checkpoint: Math.max(-1, j.checkpoint - 1), status: "active" }));
    }, []);

    const reset = useCallback(() => setJourney(INITIAL), []);

    if (!route) {
        return (
            <section className="grid min-h-screen place-items-center bg-[#FDF7F2] px-5 text-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B1B3F]">Nenhuma rota da semana ainda</h1>
                    <p className="mt-2 text-sm text-black/50">Volte em breve — tem coisa boa vindo. ✨</p>
                    <button
                        onClick={() => nav("/")}
                        className="mt-5 rounded-2xl bg-[#1D3FA8] px-6 py-3 font-bold text-white active:scale-95"
                    >
                        Ir para o início
                    </button>
                </div>
            </section>
        );
    }

    const isIdle = journey.status === "idle";
    const isDone = journey.status === "done";

    const metrics = [
        { icon: MapPin, label: "paradas", value: total },
        { icon: Clock, label: "duração", value: route.duration ?? "~3h" },
        { icon: Footprints, label: "distância", value: route.distance ?? "2,4 km" },
    ];

    return (
        <section className="min-h-screen bg-[#FDF7F2] pb-44">
            {/* ---------- HEADER ---------- */}
            <header className="relative overflow-hidden bg-[#1D3FA8] px-5 pb-16 pt-5 text-white">
                <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-[#FFC300]/20 blur-2xl" />

                <div className="relative flex items-center justify-between">
                    <button
                        onClick={() => nav(-1)}
                        aria-label="Voltar"
                        className="grid size-10 place-items-center rounded-full bg-white/15 transition active:scale-90"
                    >
                        <ChevronLeft className="size-5" />
                    </button>

                    <span className="flex items-center gap-1.5 rounded-full bg-[#FFC300] px-3 py-1.5 text-[10px] font-extrabold tracking-[0.12em] text-[#0B1B3F]">
                        <Sparkles className="size-3.5" /> ROTA DA SEMANA
                    </span>
                </div>

                <h1 className="relative mt-5 text-[28px] font-extrabold leading-[1.1]">
                    {route.title}
                </h1>
                <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-white/75">
                    {route.description}
                </p>

                <dl className="relative mt-5 flex gap-2">
                    {metrics.map(({ icon: Icon, label, value }) => (
                        <div
                            key={label}
                            className="flex flex-1 items-center gap-2 rounded-2xl bg-white/10 px-3 py-2.5 backdrop-blur"
                        >
                            <Icon className="size-4 shrink-0 text-[#FFC300]" />
                            <div className="min-w-0">
                                <dd className="text-sm font-extrabold leading-none">{value}</dd>
                                <dt className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-white/50">
                                    {label}
                                </dt>
                            </div>
                        </div>
                    ))}
                </dl>
            </header>

            {/* ---------- PAINEL DE JORNADA ---------- */}
            {!isIdle && (
                <div className="relative z-10 mx-5 -mt-11 rounded-3xl bg-white p-4 shadow-xl shadow-[#1D3FA8]/15">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[10px] font-extrabold tracking-[0.12em] text-[#DC4A0C]">
                                {isDone ? "ROTA CONCLUÍDA" : journey.paused ? "PAUSADA" : "EM ANDAMENTO"}
                            </p>
                            <p className="mt-1 text-[26px] font-extrabold leading-none tabular-nums text-[#0B1B3F]">
                                {fmt(journey.elapsed)}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-[26px] font-extrabold leading-none text-[#1D3FA8]">{progress}%</p>
                            <p className="mt-1 text-[11px] font-bold text-black/40">
                                {doneCount} de {total}
                            </p>
                        </div>
                    </div>

                    <div
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#1D3FA8]/10"
                    >
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#1D3FA8] to-[#FFC300] transition-[width] duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {!isDone && (
                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => setJourney((j) => ({ ...j, paused: !j.paused }))}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F3F1EC] py-2.5 text-sm font-bold text-[#0B1B3F] active:scale-95"
                            >
                                {journey.paused ? <Play className="size-4" /> : <Pause className="size-4" />}
                                {journey.paused ? "Retomar" : "Pausar"}
                            </button>

                            {journey.checkpoint >= 0 && (
                                <button
                                    onClick={undo}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-[#F3F1EC] px-4 py-2.5 text-sm font-bold text-black/55 active:scale-95"
                                >
                                    <RotateCcw className="size-4" /> Desfazer
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ---------- MAPA ---------- */}
            <div className={`px-5 ${isIdle ? "-mt-11 relative z-10" : "pt-5"}`}>
                <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-[#1D3FA8]/10">
                    <div className="relative h-[240px] w-full">
                        <RealMap ref={mapRef} places={stops} selected={null} onSelect={() => { }} />
                    </div>
                    <p className="px-4 py-3 text-xs font-semibold text-black/45">
                        Mova o mapa e explore o caminho da rota.
                    </p>
                </div>
            </div>

            {/* ---------- PARADAS ---------- */}
            <div className="px-5 pt-7">
                <div className="flex items-end justify-between">
                    <h2 className="text-xl font-extrabold text-[#0B1B3F]">Sua rota</h2>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-black/35">
                        {total} paradas
                    </span>
                </div>
                <p className="mt-1 text-sm text-black/45">
                    {isIdle ? "Toque em iniciar para liberar os check-ins." : "Chegou? Faça o check-in da parada."}
                </p>

                <ol className="mt-5">
                    {stops.map((place, index) => {
                        const isLast = index === total - 1;
                        const completed = index <= journey.checkpoint;
                        const isNext = !isIdle && !isDone && index === nextIndex;
                        const locked = isIdle || (!completed && !isNext);

                        return (
                            <li key={place.id} className="relative flex gap-3.5">
                                {!isLast && (
                                    <span
                                        className={[
                                            "absolute left-[17px] top-9 h-[calc(100%-16px)] border-l-[3px]",
                                            index < journey.checkpoint
                                                ? "border-solid border-[#1D3FA8]"
                                                : "border-dashed border-[#1D3FA8]/25",
                                        ].join(" ")}
                                    />
                                )}

                                <div
                                    className={[
                                        "relative z-10 mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border-[3px] transition",
                                        completed
                                            ? "border-[#1D3FA8] bg-[#1D3FA8] text-white"
                                            : isNext
                                                ? "border-[#FFC300] bg-white text-[#0B1B3F] shadow-[0_0_0_4px_rgba(255,195,0,0.18)]"
                                                : "border-[#1D3FA8]/15 bg-white text-[#1D3FA8]/40",
                                    ].join(" ")}
                                >
                                    {completed
                                        ? <Check className="size-4" />
                                        : <span className="text-[13px] font-extrabold">{index + 1}</span>}
                                </div>

                                <div className="flex-1 pb-4">
                                    <div
                                        className={[
                                            "rounded-2xl transition",
                                            isNext ? "bg-white p-4 shadow-md ring-2 ring-[#FFC300]" : "p-3.5",
                                            completed ? "bg-[#1D3FA8] text-white shadow-sm" : "",
                                            locked && !completed ? "bg-white/55 opacity-70" : "",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className={[
                                                "text-[10px] font-extrabold tracking-[0.12em]",
                                                completed ? "text-white/70" : isNext ? "text-[#DC4A0C]" : "text-black/35",
                                            ].join(" ")}>
                                                {completed ? "CONCLUÍDA" : isNext ? "VOCÊ ESTÁ AQUI" : `PARADA ${index + 1}`}
                                            </p>

                                            {completed && (
                                                <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">
                                                    <Check className="size-3" /> OK
                                                </span>
                                            )}
                                            {locked && !completed && <Lock className="size-3.5 text-black/25" />}
                                        </div>

                                        <h3 className={[
                                            "mt-1 text-[17px] font-bold leading-snug",
                                            completed ? "text-white" : "text-[#0B1B3F]",
                                        ].join(" ")}>
                                            {place.label}
                                        </h3>

                                        <p className={[
                                            "mt-0.5 flex items-center gap-1.5 text-[13px]",
                                            completed ? "text-white/65" : "text-black/45",
                                        ].join(" ")}>
                                            <MapPin className="size-3.5" /> {place.cat}
                                        </p>

                                        {isNext && (
                                            <div className="mt-4 flex gap-2">
                                                {confirming === index ? (
                                                    <>
                                                        <button
                                                            onClick={() => checkIn(index)}
                                                            className="flex-1 rounded-xl bg-[#1D3FA8] py-3 text-sm font-bold text-white active:scale-95"
                                                        >
                                                            Confirmar chegada
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirming(null)}
                                                            className="rounded-xl bg-[#F3F1EC] px-4 py-3 text-sm font-bold text-black/50 active:scale-95"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => setConfirming(index)}
                                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FFC300] py-3 text-sm font-extrabold text-[#0B1B3F] active:scale-95"
                                                        >
                                                            <Check className="size-4" /> Cheguei
                                                        </button>
                                                        <button
                                                            onClick={() => nav(`/map?rota=${route.id}&parada=${place.id}`)}
                                                            aria-label="Como chegar"
                                                            className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#1D3FA8]/10 text-[#1D3FA8] active:scale-95"
                                                        >
                                                            <Navigation className="size-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>

            {/* ---------- CTA FIXO (acima da tab bar) ---------- */}
            <div className="fixed inset-x-0 bottom-[68px] z-20 border-t border-black/5 bg-white/95 px-5 py-3 backdrop-blur">
                {isIdle && (
                    <button
                        onClick={start}
                        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1D3FA8] text-[17px] font-bold text-white shadow-lg transition active:scale-[0.98]"
                    >
                        <Play className="size-5" /> Iniciar rota
                    </button>
                )}

                {journey.status === "active" && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => nav(`/map?rota=${route.id}`)}
                            aria-label="Ver no mapa"
                            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#1D3FA8]/10 text-[#1D3FA8] active:scale-95"
                        >
                            <MapPin className="size-5" />
                        </button>
                        <button
                            onClick={() => setConfirming(nextIndex)}
                            className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FFC300] px-4 text-[16px] font-extrabold text-[#0B1B3F] shadow-lg active:scale-[0.98]"
                        >
                            <Check className="size-5 shrink-0" />
                            <span className="truncate">Check-in: {stops[nextIndex]?.label}</span>
                        </button>
                    </div>
                )}

                {isDone && (
                    <div className="flex gap-3">
                        <button
                            onClick={reset}
                            aria-label="Refazer rota"
                            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#F3F1EC] text-black/50 active:scale-95"
                        >
                            <RotateCcw className="size-5" />
                        </button>
                        <button
                            onClick={() => nav(`/rotas/${route.id}/conquista`)}
                            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1D3FA8] text-[17px] font-bold text-white shadow-lg active:scale-[0.98]"
                        >
                            <Trophy className="size-5" /> Ver conquista
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
