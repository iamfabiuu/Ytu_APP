import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Check } from "lucide-react";
import { ROUTES } from "../data/routes";
import { PLACES, type Place } from "../data/places";
import { RealMap, type MapHandle } from "../components/RealMap";

export function RouteDetail() {
    const { id } = useParams();
    const nav = useNavigate();
    const mapRef = useRef<MapHandle>(null);

    const [currentCheckpoint, setCurrentCheckpoint] = useState(1);

    const route = ROUTES.find((r) => r.id === id);

    const stops = useMemo(
        () =>
            route
                ? route.stops
                    .map((stopId) =>
                        PLACES.find((place) => place.id === stopId),
                    )
                    .filter((place): place is Place => Boolean(place))
                : [],
        [route],
    );

    useEffect(() => {
        if (!route) return;

        mapRef.current?.showRoute(
            route.stops,
            currentCheckpoint,
        );

        return () => {
            mapRef.current?.clearRoute();
        };
    }, [route, currentCheckpoint]);

    if (!route) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-[#FDF7F2] px-5">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#0B1B3F]">
                        Rota não encontrada
                    </h1>

                    <button
                        onClick={() => nav("/nearby")}
                        className="mt-4 rounded-2xl bg-[#1D3FA8] px-5 py-3 font-bold text-white"
                    >
                        Voltar
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#FDF7F2] pb-32">
            {/* HEADER */}
            <div className="relative bg-[#1D3FA8] px-5 pb-8 pt-6 text-white">
                <button
                    onClick={() => nav(-1)}
                    aria-label="Voltar"
                    className="mb-6 grid size-11 place-items-center rounded-full bg-white/15 transition active:scale-90"
                >
                    <ChevronLeft className="size-6" />
                </button>

                <p className="text-[11px] font-extrabold tracking-[0.15em] text-white/70">
                    ROTA CULTURAL
                </p>

                <h1 className="mt-2 text-[34px] font-extrabold leading-tight">
                    {route.title}
                </h1>

                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/80">
                    {route.description}
                </p>
            </div>

            {/* PARADAS */}
            <div className="px-5 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#0B1B3F]">
                        Sua rota
                    </h2>

                    <span className="text-sm font-semibold text-black/45">
                        {stops.length} paradas
                    </span>
                </div>

                <div className="mt-6">
                    {stops.map((place, index) => {
                        const isFirst = index === 0;
                        const isLast = index === stops.length - 1;

                        // O checkpoint representa a parada que já foi alcançada.
                        const isCompleted = index <= currentCheckpoint;

                        return (
                            <div
                                key={place.id}
                                className="relative flex gap-4"
                            >
                                {/* LINHA DO CHECKPOINT */}
                                {!isLast && (
                                    <div
                                        className={[
                                            "absolute left-[19px] top-10 h-[calc(100%-18px)] w-[3px] border-l-[3px]",
                                            index < currentCheckpoint
                                                ? "border-solid border-[#1D3FA8]"
                                                : "border-dashed border-[#1D3FA8]/25",
                                        ].join(" ")}
                                    />
                                )}

                                {/* CHECKPOINT */}
                                <div
                                    className={[
                                        "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-4",
                                        isCompleted
                                            ? "border-[#1D3FA8] bg-[#1D3FA8] text-white"
                                            : "border-[#1D3FA8]/15 bg-white text-[#1D3FA8]",
                                    ].join(" ")}
                                >
                                    {isCompleted ? (
                                        <Check className="size-5" />
                                    ) : (
                                        <span className="text-sm font-extrabold">
                                            {index + 1}
                                        </span>
                                    )}
                                </div>

                                {/* CARD */}
                                <div className="mb-5 flex-1">
                                    <div
                                        className={[
                                            "rounded-3xl p-4 shadow-sm",
                                            isCompleted
                                                ? "bg-[#1D3FA8] text-white"
                                                : "bg-white text-[#0B1B3F]",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p
                                                className={[
                                                    "text-[10px] font-extrabold tracking-[0.12em]",
                                                    isCompleted
                                                        ? "text-white/70"
                                                        : "text-[#DC4A0C]",
                                                ].join(" ")}
                                            >
                                                {isFirst
                                                    ? "PRIMEIRA PARADA"
                                                    : isCompleted
                                                        ? "PARADA CONCLUÍDA"
                                                        : `PARADA ${index + 1}`}
                                            </p>

                                            {isCompleted && (
                                                <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold">
                                                    <Check className="size-3" />
                                                    {isFirst
                                                        ? "INÍCIO"
                                                        : "CONCLUÍDA"}
                                                </span>
                                            )}
                                        </div>

                                        <h3
                                            className={[
                                                "mt-1 text-lg font-bold",
                                                isCompleted
                                                    ? "text-white"
                                                    : "text-[#0B1B3F]",
                                            ].join(" ")}
                                        >
                                            {place.label}
                                        </h3>

                                        <p
                                            className={[
                                                "mt-1 flex items-center gap-1.5 text-sm",
                                                isCompleted
                                                    ? "text-white/65"
                                                    : "text-black/45",
                                            ].join(" ")}
                                        >
                                            <MapPin className="size-4" />
                                            {place.cat}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CONTROLE TEMPORÁRIO DE CHECKPOINT */}
            <div className="mx-5 mb-4 rounded-2xl bg-white p-4 shadow-sm">
                <p className="mb-3 text-sm font-bold text-[#0B1B3F]">
                    Teste de checkpoint: {currentCheckpoint}
                </p>

                <div className="flex gap-2">
                    <button
                        onClick={() =>
                            setCurrentCheckpoint((value) =>
                                Math.max(0, value - 1),
                            )
                        }
                        className="flex-1 rounded-xl bg-[#F1F1F1] px-4 py-3 font-bold text-[#0B1B3F]"
                    >
                        ← Voltar
                    </button>

                    <button
                        onClick={() =>
                            setCurrentCheckpoint((value) =>
                                Math.min(stops.length - 1, value + 1),
                            )
                        }
                        className="flex-1 rounded-xl bg-[#1D3FA8] px-4 py-3 font-bold text-white"
                    >
                        Avançar →
                    </button>
                </div>
            </div>

            {/* MAPA DA ROTA */}
            <div className="px-5 pt-2">
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                    <div className="relative h-[420px] w-full">
                        <RealMap
                            ref={mapRef}
                            places={stops}
                            selected={null}
                            onSelect={() => { }}
                        />
                    </div>

                    <div className="px-4 py-3">
                        <p className="text-xs font-semibold text-black/45">
                            Mova o mapa e explore o caminho da rota.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="fixed inset-x-0 bottom-0 z-20 bg-white/95 px-5 py-4 backdrop-blur">
                <button
                    onClick={() => nav(`/map?rota=${route.id}`)}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1D3FA8] text-[17px] font-bold text-white shadow-lg transition active:scale-[0.98]"
                >
                    <MapPin className="size-5" />
                    Ver rota no mapa
                </button>
            </div>
        </section>
    );
}

