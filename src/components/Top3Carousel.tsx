// src/components/Top3Carousel.tsx
import { useEffect, useRef, useState } from "react";

type Card = {
  rank: number;
  title: string;
  meta: string;
  bg: string;
};

interface Top3CarouselProps {
  items: Card[];
  /** Tempo de autoplay em ms. Passe 0 para desativar. */
  autoPlayMs?: number;
}

/**
 * Carrossel "coverflow": o card ativo fica centralizado e maior,
 * os vizinhos aparecem parcialmente nas laterais, como na Top3 do print.
 */
export function Top3Carousel({ items, autoPlayMs = 3500 }: Top3CarouselProps) {
  const count = items.length;
  const centerIndexInitial = Math.max(
    0,
    items.findIndex((i) => i.rank === 1)
  );
  const [active, setActive] = useState(centerIndexInitial);
  const timerRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  function next() {
    setActive((a) => (a + 1) % count);
  }
  function prev() {
    setActive((a) => (a - 1 + count) % count);
  }

  function startAutoplay() {
    if (autoPlayMs <= 0) return;
    stopAutoplay();
    timerRef.current = window.setInterval(next, autoPlayMs);
  }
  function stopAutoplay() {
    if (timerRef.current) window.clearInterval(timerRef.current);
  }

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlayMs, count]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    stopAutoplay();
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) prev();
    else if (delta < -40) next();
    touchStartX.current = null;
    startAutoplay();
  }

  // distância do card em relação ao ativo, já "enrolando" (-1, 0, 1...)
  function offsetOf(index: number) {
    let diff = index - active;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  }

  return (
    <div
      className="relative mx-auto h-64 max-w-md select-none overflow-hidden [perspective:1200px]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {items.map((r, i) => {
        const offset = offsetOf(i);
        const isCenter = offset === 0;
        const translate = offset * 128; // espaçamento horizontal entre cards
        const rotate = offset * -8; // leve giro 3D, tipo carrossel
        const scale = isCenter ? 1 : 0.85;
        const opacity = Math.abs(offset) > 1 ? 0 : isCenter ? 1 : 0.9;
        const z = isCenter ? 20 : 10 - Math.abs(offset);

        return (
          <button
            key={r.rank}
            type="button"
            aria-label={`${r.title}, ${r.meta}`}
            aria-current={isCenter}
            onClick={() => {
              setActive(i);
              startAutoplay();
            }}
            style={{
              transform: `translate(-50%, -50%) translateX(${translate}px) rotateY(${rotate}deg) scale(${scale})`,
              opacity,
              zIndex: z,
            }}
            className={`absolute left-1/2 top-1/2 w-40 shrink-0 rounded-2xl p-4 text-center text-white shadow-xl transition-all duration-500 ease-out ${r.bg}`}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-2xl font-extrabold text-brand-blue">
              {r.rank}
            </div>
            <h3 className="mt-3 text-lg font-extrabold leading-tight">
              {r.title}
            </h3>
            <p className="mt-1 text-[11px] font-semibold opacity-90">
              {r.meta}
            </p>
            <p aria-hidden className="mt-4 text-4xl">
              🌀
            </p>
          </button>
        );
      })}

      {/* indicadores */}
      <div className="absolute bottom-1 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
        {items.map((r, i) => (
          <button
            key={r.rank}
            type="button"
            aria-label={`Ir para ${r.title}`}
            onClick={() => {
              setActive(i);
              startAutoplay();
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-4 bg-brand-blue" : "w-1.5 bg-ink/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
