import { useEffect, useMemo, type ComponentType } from "react";
import { getRouteStats, type RouteStats } from "../lib/segmentGeometry";
import { BikeIcon, WalkIcon } from "./travelModeIcons";
import {
  DEFAULT_MODE,
  MODE_LABELS,
  TRAVEL_MODES,
  type TravelMode,
} from "../lib/travelMode";

type Props = {
  /* modo escolhido no momento */
  value: TravelMode;
  onChange: (mode: TravelMode) => void;
  /* ids das paradas da rota, na ordem (ex.: route.stops) */
  stopIds: string[];
  className?: string;
};

const ICONS: Record<TravelMode, ComponentType<{ className?: string }>> = {
  foot: WalkIcon,
  bike: BikeIcon,
};

const formatKm = (meters: number) =>
  `${(meters / 1000).toFixed(1).replace(".", ",")} km`;

const formatMinutes = (minutes: number) =>
  minutes < 60
    ? `${minutes} min`
    : `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, "0")}`;

type Option = {
  mode: TravelMode;
  available: boolean;
  stats: RouteStats | null;
};

/*
 * Seletor "A pé / Bicicleta".
 *
 * - A pé está sempre disponível.
 * - Os outros modos só ficam ativos se TODOS os trechos da rota tiverem
 *   geometria salva (ver scripts/generate-segments.ts). Senão aparecem
 *   desativados, com "em breve".
 * - Se o modo escolhido deixar de estar disponível (ex.: o usuário trocou
 *   de rota), volta sozinho para "A pé".
 */
export function TravelModeToggle({
  value,
  onChange,
  stopIds,
  className = "",
}: Props) {
  const options = useMemo<Option[]>(
    () =>
      TRAVEL_MODES.map((mode) => {
        const stats = getRouteStats(stopIds, mode);

        return {
          mode,
          stats,
          available: mode === DEFAULT_MODE || stats !== null,
        };
      }),
    [stopIds],
  );

  const currentIsAvailable =
    options.find((option) => option.mode === value)?.available ?? false;

  useEffect(() => {
    if (!currentIsAvailable) {
      onChange(DEFAULT_MODE);
    }
  }, [currentIsAvailable, onChange]);

  return (
    <div
      role="radiogroup"
      aria-label="Como você vai?"
      className={`flex gap-2 ${className}`}
    >
      {options.map(({ mode, available, stats }) => {
        const Icon = ICONS[mode];
        const active = value === mode;

        const detail = !available
          ? "em breve"
          : stats
            ? `${formatKm(stats.distanceMeters)} · ~${formatMinutes(stats.durationMinutes)}`
            : "";

        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={!available}
            onClick={() => onChange(mode)}
            className={[
              "flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl px-3.5 py-3 text-left transition active:scale-95",
              active
                ? "bg-[#1D3FA8] text-white shadow-md"
                : "bg-white text-[#0B1B3F] shadow-sm",
              available ? "" : "opacity-50",
            ].join(" ")}
          >
            <Icon className="size-5 shrink-0" />

            <span className="min-w-0">
              <span className="block text-sm font-extrabold leading-none">
                {MODE_LABELS[mode]}
              </span>

              {detail && (
                <span
                  className={[
                    "mt-1 block truncate text-[11px] font-semibold",
                    active ? "text-white/70" : "text-black/45",
                  ].join(" ")}
                >
                  {detail}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}