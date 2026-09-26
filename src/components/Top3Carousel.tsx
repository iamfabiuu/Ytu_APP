import { useEffect, useRef, useState } from "react";

type Card = {
  rank: number;
  title: string;
  meta: string;
  bg: string;
};

/*
 * Coloque aqui o caminho das imagens de fundo (decoração)
 * exportadas do Figma para cada card, ex: "/images/top3/decoracao-1.png"
 */
const DECORATION_IMAGE_SRC: Record<number, string> = {
  1: "/top3/dec1.svg",
  2: "/top3/dec2.svg",
  3: "/top3/dec3.svg",
};

/*
 * Coloque aqui o caminho dos ícones exportados do Figma
 * para cada card, ex: "/images/top3/icone-1.png"
 */
const ICON_IMAGE_SRC: Record<number, string> = {
  1: "/top3/icon1.svg",
  2: "/top3/icon2.svg",
  3: "/top3/icon3.svg",
};

interface Top3CarouselProps {
  items: Card[];
  autoPlayMs?: number;
}

export function Top3Carousel({
  items,
  autoPlayMs = 3500,
}: Top3CarouselProps) {
  const count = items.length;

  const centerIndexInitial = Math.max(
    0,
    items.findIndex((item) => item.rank === 1)
  );

  const [active, setActive] = useState(centerIndexInitial);

  const timerRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  function next() {
    setActive((current) => (current + 1) % count);
  }

  function prev() {
    setActive((current) => (current - 1 + count) % count);
  }

  function stopAutoplay() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startAutoplay() {
    if (autoPlayMs <= 0) return;

    stopAutoplay();

    timerRef.current = window.setInterval(next, autoPlayMs);
  }

  useEffect(() => {
    startAutoplay();

    return stopAutoplay;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlayMs, count]);

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
    stopAutoplay();
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;

    const delta =
      event.changedTouches[0].clientX - touchStartX.current;

    if (delta > 40) {
      prev();
    } else if (delta < -40) {
      next();
    }

    touchStartX.current = null;
    startAutoplay();
  }

  function offsetOf(index: number) {
    let diff = index - active;

    if (diff > count / 2) {
      diff -= count;
    }

    if (diff < -count / 2) {
      diff += count;
    }

    return diff;
  }

  return (
    <div
      className="
        relative
        mx-auto
        h-[320px]
        w-full
        overflow-visible
        select-none
        [perspective:1000px]
      "
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {items.map((item, index) => {
        const offset = offsetOf(index);

        const isCenter = offset === 0;
        const isLeft = offset === -1;
        const isRight = offset === 1;

        /*
         * Espaçamento horizontal.
         *
         * O centro permanece sobreposto aos laterais,
         * mas deixa a área externa dos cards laterais visível.
         */
        const translateX = offset * 125;

        /*
         * O card central é maior.
         * Os laterais ficam menores.
         */
        const scale = isCenter ? 1 : 0.85;

        /*
         * Efeito "porta meio aberta".
         *
         * O card esquerdo gira levemente para dentro.
         * O card direito gira levemente para dentro.
         *
         * Não usei rotate() para não tombar os cards.
         */
        const rotateY = isLeft
          ? 30
          : isRight
            ? -30
            : 0;

        const opacity =
          Math.abs(offset) > 1 ? 0 : 1;

        const zIndex = isCenter ? 30 : 10;

        return (
          <button
            key={item.rank}
            type="button"
            aria-label={`${item.title}, ${item.meta}`}
            aria-current={isCenter}
            onClick={() => {
              setActive(index);
              startAutoplay();
            }}
            style={{
              transform: `
                translate(-50%, -50%)
                translateX(${translateX}px)
                rotateY(${rotateY}deg)
                scale(${scale})
              `,
              opacity,
              zIndex,
              transformOrigin: isLeft
                ? "right center"
                : isRight
                  ? "left center"
                  : "center center",
            }}
            className={`
              absolute
              left-1/2
              top-[47.5%]

              h-[281px]
              w-[181px]

              overflow-hidden
              rounded-[25px]

              p-0

              text-center
              text-white

              shadow-[0_7px_18px_rgba(0,0,0,0.10)]

              transition-all
              duration-500
              ease-out

              ${item.bg}
            `}
          >
            {/* =====================================================
                DECORAÇÃO AZUL
                ===================================================== */}

            {item.rank === 1 && (
              <img
                src={DECORATION_IMAGE_SRC[1]}
                alt=""
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  opacity-20
                "
              />
            )}

            {/* =====================================================
                DECORAÇÃO LARANJA
                ===================================================== */}

            {item.rank === 2 && (
              <img
                src={DECORATION_IMAGE_SRC[2]}
                alt=""
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    -left-3
                    h-[calc(80%+80px)]
                    object-cover
                    opacity-20
                "
              />
            )}

            {/* =====================================================
                DECORAÇÃO VERMELHA
                ===================================================== */}

            {item.rank === 3 && (
              <img
                src={DECORATION_IMAGE_SRC[3]}
                alt=""
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  opacity-20
                "
              />
            )}

            {/* =====================================================
                RANK 1
                CÍRCULO DOURADO PREENCHIDO
                ===================================================== */}

            {item.rank === 1 && (
              <div
                className="
                  absolute
                  left-1/2
                  top-[29px]
                  z-30
                  flex
                  h-[60px]
                  w-[60px]
                  -translate-x-1/2
                  items-center
                  justify-center
                  rounded-full
                  shadow-[0_3px_7px_rgba(0,0,0,0.14)]
                "
                style={{
                  background:
                    "linear-gradient(180deg, #FCD348 0%, #FEC51C 100%)",
                }}
              >
                <span
                  className="
                    text-[30px]
                    font-extrabold
                    leading-none
                    text-[#0C3C96]
                  "
                >
                  1
                </span>
              </div>
            )}

            {/* =====================================================
                RANK 2
                CÍRCULO BRANCO PREENCHIDO
                ===================================================== */}

            {item.rank === 2 && (
              <div
                className="
                  absolute
                  left-1/2
                  top-[29px]
                  z-30
                  flex
                  h-[60px]
                  w-[60px]
                  -translate-x-1/2
                  items-center
                  justify-center
                  rounded-full
                  shadow-[0_4px_8px_rgba(0,0,0,0.20)]
                "
                style={{
                  background:
                    "linear-gradient(180deg, #FFFFFF 0%, #DDDCDB 100%)",
                }}
              >
                <span
                  className="
                    text-[30px]
                    font-extrabold
                    leading-none
                    text-[#EA7E00]
                    drop-shadow-[0_1px_1px_rgba(0,0,0,0.10)]
                  "
                >
                  2
                </span>
              </div>
            )}

            {/* =====================================================
                RANK 3
                OVAL DOURADO PREENCHIDO
                ===================================================== */}

            {item.rank === 3 && (
              <div
                className="
                  absolute
                  left-1/2
                  top-[29px]
                  z-30
                  flex
                  h-[60px]
                  w-[60px]
                  -translate-x-1/2
                  items-center
                  justify-center
                  rounded-full
                  shadow-[0_3px_7px_rgba(0,0,0,0.15)]
                "
                style={{
                  background:
                    "linear-gradient(180deg, #F6A428 0%, #FDCE86 100%)",
                }}
              >
                <span
                  className="
                    text-[30px]
                    font-extrabold
                    leading-none
                    text-[#D12D21]
                  "
                >
                  3
                </span>
              </div>
            )}

            {/* =====================================================
                TÍTULO
                ===================================================== */}

            <h3
              className="
                absolute
                left-[15px]
                right-[15px]
                top-[101px]
                z-20
                text-center
                text-[17px]
                font-extrabold
                leading-[1.18]
                text-white
              "
            >
              {item.title}
            </h3>

            {/* =====================================================
                META
                ===================================================== */}

            <p
              className="
                absolute
                left-[10px]
                right-[10px]
                top-[160px]
                z-20
                text-center
                text-[10px]
                font-medium
                leading-tight
                text-white
              "
            >
              {item.meta}
            </p>

            {/* =====================================================
                ÍCONE RANK 1
                ===================================================== */}

            {item.rank === 1 && (
              <div
                aria-hidden="true"
                className="
                  absolute
                  bottom-[21px]
                  left-1/2
                  z-20
                  h-[70px]
                  w-[70px]
                  -translate-x-1/2
                "
              >
                <img
                  src={ICON_IMAGE_SRC[1]}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            {/* =====================================================
                ÍCONE RANK 2
                ===================================================== */}

            {item.rank === 2 && (
              <div
                aria-hidden="true"
                className="
                  absolute
                  bottom-[20px]
                  left-1/2
                  z-20
                  h-[70px]
                  w-[70px]
                  -translate-x-1/2
                "
              >
                <img
                  src={ICON_IMAGE_SRC[2]}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            {/* =====================================================
                ÍCONE RANK 3
                ===================================================== */}

            {item.rank === 3 && (
              <div
                aria-hidden="true"
                className="
                  absolute
                  bottom-[20px]
                  left-1/2
                  z-20
                  h-[70px]
                  w-[70px]
                  -translate-x-1/2
                "
              >
                <img
                  src={ICON_IMAGE_SRC[3]}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </button>
        );
      })}

      {/* =========================================================
          INDICADORES
          ========================================================= */}

      <div
        className="
          absolute
          bottom-0
          left-1/2
          z-50
          flex
          -translate-x-1/2
          items-center
          gap-[5px]
        "
      >
        {items.map((item, index) => (
          <button
            key={item.rank}
            type="button"
            aria-label={`Ir para ${item.title}`}
            onClick={() => {
              setActive(index);
              startAutoplay();
            }}
            className={`
              h-[6px]
              rounded-full
              transition-all
              duration-300
              ${
                index === active
                  ? "w-[22px] bg-[#1B4AA6]"
                  : "w-[6px] bg-black/15"
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}
