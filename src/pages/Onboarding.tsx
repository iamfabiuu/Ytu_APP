import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Slide = {
  bg: string;
  pattern: string;
  kicker: string;
  title: string[];
  highlight: number;
  kickerColor: string;
  titleColor: string;
  textColor: string;
  text: string;
};

const SLIDES: Slide[] = [
  {
    bg: "#1339B5",
    pattern: "/image 46.svg",
    kicker: "RECIFE PARA VIVER",
    title: ["A cultura", "começa onde", "você está."],
    highlight: 2,
    kickerColor: "#F5C823",
    titleColor: "#FFFFFF",
    textColor: "#F5C823",
    text: "Descubra lugares, histórias e sabores que fazem o Recife pulsar.",
  },
  {
    bg: "#C42A17",
    pattern: "/image 46 (1).svg",
    kicker: "ROTAS DO SEU JEITO",
    title: ["Seu tempo, sua", "companhia,", "seu bolso."],
    highlight: 2,
    kickerColor: "#F5C823",
    titleColor: "#FFFFFF",
    textColor: "#F5C823",
    text: "O YTU combina suas preferências e monta experiências possíveis de verdade.",
  },
  {
    bg: "#E9A93A",
    pattern: "/image 46 (2).svg",
    kicker: "DAQUI PRA ONDE?",
    title: ["Descubra,", "caminhe e viva", "a cidade"],
    highlight: 2,
    kickerColor: "#1339B5",
    titleColor: "#FFFFFF",
    textColor: "#1339B5",
    text: "Do frevo à gastronomia: você escolhe o ritmo e a gente mostra o caminho.",
  },
];

const STORAGE_KEY = "ytu:onboarding-done";
const NEXT_ROUTE = "/personalizacao";

const CSS = `
@keyframes ytuIn {
  from { opacity: 0; transform: translate3d(var(--dx), 14px, 0); }
  to   { opacity: 1; transform: none; }
}
@keyframes ytuFade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ytuDraw { from { stroke-dashoffset: 760 } to { stroke-dashoffset: 0 } }
@keyframes ytuPop {
  0% { transform: scale(.6); opacity: 0 }
  60% { transform: scale(1.12) }
  100% { transform: scale(1); opacity: 1 }
}
.ytu-in {
  opacity: 0;
  animation: ytuIn .62s cubic-bezier(.22,1,.36,1) forwards;
  animation-delay: var(--d, 0ms);
}
.ytu-pattern { animation: ytuFade .7s ease forwards; }
.ytu-draw {
  stroke-dasharray: 760;
  stroke-dashoffset: 760;
  animation: ytuDraw .85s cubic-bezier(.65,0,.35,1) forwards;
  animation-delay: var(--d, 0ms);
}
.ytu-pop { animation: ytuPop .45s cubic-bezier(.34,1.56,.64,1) forwards; }
@media (prefers-reduced-motion: reduce) {
  .ytu-in, .ytu-pattern, .ytu-draw, .ytu-pop {
    animation: none !important;
    opacity: 1 !important;
    stroke-dashoffset: 0 !important;
    transform: none !important;
  }
}
`;

function Ellipse({ color, delay }: { color: string; delay: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 90"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -inset-x-4 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+2rem)]"
    >
      <ellipse
        className="ytu-draw"
        style={{ "--d": `${delay}ms` } as React.CSSProperties}
        cx="150"
        cy="45"
        rx="145"
        ry="38"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        transform="rotate(-1.4 150 45)"
      />
    </svg>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const startX = useRef<number | null>(null);

  const s = SLIDES[index];
  const isLast = index === SLIDES.length - 1;
  const dx = `${dir * 28}px`;

  const go = useCallback((to: number, d: number) => {
    setDir(d);
    setIndex(to);
  }, []);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    navigate(NEXT_ROUTE, { replace: true });
  }, [navigate]);

  const next = useCallback(() => {
    if (isLast) finish();
    else go(index + 1, 1);
  }, [isLast, finish, go, index]);

  const prev = useCallback(() => {
    if (index > 0) go(index - 1, -1);
  }, [go, index]);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(delta) < 48) return;
    if (delta < 0) next();
    else prev();
  };

  return (
    <div
      tabIndex={0}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
      className="relative isolate flex h-dvh w-full flex-col overflow-hidden outline-none transition-colors duration-700 ease-out"
      style={{ background: s.bg, ["--dx" as string]: dx }}
    >
      <style>{CSS}</style>

      {/* Pattern com crossfade a cada slide */}
      <img
        key={s.pattern}
        src={s.pattern}
        alt=""
        aria-hidden
        className="ytu-pattern pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-0"
      />

      <header className="relative z-10 flex items-start justify-between px-6 pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <img
          src="/logo.svg"
          alt="YTU"
          className="ytu-in h-18 w-auto"
          style={{ "--d": "80ms", "--dx": "0px" } as React.CSSProperties}
        />
        <button
          type="button"
          onClick={finish}
          className="ytu-in rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#1339B5] shadow-sm transition hover:shadow-md active:scale-95"
          style={{ "--d": "160ms", "--dx": "0px" } as React.CSSProperties}
        >
          Pular
        </button>
      </header>

      {/* key no index => remonta e reanima o bloco todo */}
      <main
        key={index}
        className="relative z-10 flex w-full max-w-md flex-1 flex-col justify-center px-6"
      >
        <p
          className="ytu-in mb-4 text-sm font-bold uppercase tracking-[0.2em]"
          style={{ color: s.kickerColor, "--d": "60ms" } as React.CSSProperties}
        >
          {s.kicker}
        </p>

        <h1 className="text-[2rem] font-extrabold leading-[1.25] tracking-tight">
          {s.title.map((line, i) =>
            i === s.highlight ? (
              <span
                key={line}
                className="ytu-in relative inline-block italic"
                style={{ "--d": `${160 + i * 90}ms` } as React.CSSProperties}
              >
                <Ellipse color={s.textColor} delay={420 + i * 90} />
                <span className="relative" style={{ color: s.titleColor }}>
                  {line}
                </span>
              </span>
            ) : (
              <span
                key={line}
                className="ytu-in block"
                style={
                  {
                    color: s.titleColor,
                    "--d": `${160 + i * 90}ms`,
                  } as React.CSSProperties
                }
              >
                {line}
              </span>
            ),
          )}
        </h1>

        <p
          className="ytu-in mt-6 max-w-[24ch] text-base font-bold leading-snug"
          style={{ color: s.textColor, "--d": "480ms" } as React.CSSProperties}
        >
          {s.text}
        </p>
      </main>

      <footer className="relative z-10 flex items-center justify-between px-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para o slide ${i + 1}`}
              onClick={() => go(i, i > index ? 1 : -1)}
              className="h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
              style={{
                width: i === index ? 34 : 8,
                background: i === index ? "#F5C823" : "rgba(255,255,255,.6)",
              }}
            />
          ))}
        </div>

        <button
          key={isLast ? "check" : "arrow"}
          type="button"
          onClick={next}
          aria-label={isLast ? "Começar" : "Próximo"}
          className={`ytu-pop group flex items-center justify-center bg-white text-[#1339B5] shadow-lg transition-transform duration-300 active:scale-90 ${
            isLast ? "h-12 w-12 rounded-full" : "h-11 w-20 rounded-full"
          }`}
        >
          {isLast ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
              <path
                className="ytu-draw"
                style={
                  { "--d": "120ms", strokeDasharray: 30 } as React.CSSProperties
                }
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-8" fill="none">
              <path
                d="M4 12h16m0 0l-5-5m5 5l-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </svg>
          )}
        </button>
      </footer>
    </div>
  );
}
