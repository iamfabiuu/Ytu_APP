// src/pages/Personalizacao.tsx
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeAuth } from "../layouts/lib/fakeAuth";

/* ---------------- dados ---------------- */

type Option = {
  id: string;
  label: string;
  sub?: string;
  icon: React.ReactNode;
};

const I = (d: string, extra?: React.ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    className="h-7 w-7"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
    {extra}
  </svg>
);

const INTERESTS: Option[] = [
  {
    id: "gastronomia",
    label: "Gastronomia",
    sub: "Comida • Sabores • Restaurantes",
    icon: I("M4 14h16a8 8 0 0 0-16 0Zm-1 4h18"),
  },
  {
    id: "parques",
    label: "Parques",
    sub: "Natureza • Lazer • Ar livre",
    icon: I("M12 22v-6m0 0a5 5 0 1 0-3-9 4 4 0 1 0 3 9Z"),
  },
  {
    id: "musica",
    label: "Música",
    sub: "Shows • Artistas • Playlists",
    icon: I(
      "M9 18V6l10-2v12M9 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
    ),
  },
  {
    id: "historia",
    label: "História",
    sub: "Cultura • Museus • Patrimônio",
    icon: I(
      "M12 6.5S10 4 6 4v14c4 0 6 2 6 2s2-2 6-2V4c-4 0-6 2.5-6 2.5Zm0 0V20",
    ),
  },
  {
    id: "teatros",
    label: "Teatros",
    sub: "Emoção • Arte • Espetáculo",
    icon: I("M4 5h7v7a3.5 3.5 0 0 1-7 0V5Zm9 3h7v7a3.5 3.5 0 0 1-7 0V8Z"),
  },
  {
    id: "turismo",
    label: "Turismo",
    sub: "Viagens • Roteiros • Experiências",
    icon: I("M4 8h16v12H4V8Zm5 0V5h6v3M4 13h16"),
  },
];

const COMPANY: Option[] = [
  {
    id: "sozinho",
    label: "Sozinho",
    icon: I(
      "M13 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-2 4-3 5m3-5 3 4m-6 6 3-6m3 2 1 4M6 10l5-2 5 3",
    ),
  },
  {
    id: "casal",
    label: "Casal",
    icon: I(
      "M12 20s-6-3.5-6-8a3.2 3.2 0 0 1 6-1.4A3.2 3.2 0 0 1 18 12c0 4.5-6 8-6 8Z",
    ),
  },
  {
    id: "familia",
    label: "Família",
    icon: I(
      "M9 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3 20v-3a3 3 0 0 1 3-3h2m13 6v-3a3 3 0 0 0-3-3h-2m-4-1a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-4 8v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2",
    ),
  },
  {
    id: "amigos",
    label: "Amigos",
    icon: I(
      "M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m4-9h4m-2-2v4",
    ),
  },
];

const BUDGET: { id: string; tag: string; label: string; sub: string }[] = [
  {
    id: "economico",
    tag: "R$",
    label: "Econômico",
    sub: "Até R$ 40 por pessoa",
  },
  { id: "moderado", tag: "R$$", label: "Moderado", sub: "De R$ 40 a R$ 100" },
  {
    id: "premium",
    tag: "R$$$",
    label: "Quero investir",
    sub: "Acima de R$ 100",
  },
];

const STEPS = [
  {
    kicker: "PASSO 1 DE 3",
    title: ["O que faz seus olhos", "brilharem?"],
    hint: "ESCOLHA TUDO QUE COMBINA COM VOCÊ!",
  },
  {
    kicker: "PASSO 2 DE 3",
    title: ["Como você vai", "explorar?"],
    hint: "A COMPANHIA TAMBÉM MUDA O CAMINHO!",
  },
  {
    kicker: "PASSO 3 DE 3",
    title: ["Quanto quer", "investir hoje?"],
    hint: "SEM SURPRESAS NO MEIO DA ROTA.",
  },
];

const STORAGE_KEY = "ytu:preferences";
const YELLOW = "#F5C41F";
const BLUE = "#0B3EBE";
const CREAM = "#FDFBF4";

const CSS = `
@keyframes pzIn { from { opacity:0; transform: translate3d(var(--dx,20px),10px,0) } to { opacity:1; transform:none } }
.pz-in { opacity:0; animation: pzIn .5s cubic-bezier(.22,1,.36,1) forwards; animation-delay: var(--d,0ms) }
@media (prefers-reduced-motion: reduce){ .pz-in{ animation:none; opacity:1 } }
`;

/* ---------------- página ---------------- */

export default function Personalizacao() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [company, setCompany] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);

  const canNext = useMemo(
    () =>
      step === 0 ? interests.length > 0 : step === 1 ? !!company : !!budget,
    [step, interests, company, budget],
  );

  const go = (to: number, d: number) => {
    setDir(d);
    setStep(to);
  };

  const toggleInterest = (id: string) =>
    setInterests((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const finish = useCallback(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ interests, company, budget, at: Date.now() }),
      );
      localStorage.setItem("ytu:onboarded", "1");
    } catch {
      /* ignore */
    }
    fakeAuth.finishOnboarding();
    navigate("/", { replace: true });
  }, [interests, company, budget, navigate]);

  const next = () => (step === 2 ? finish() : go(step + 1, 1));
  const s = STEPS[step];

  return (
    <div
      className="flex h-dvh w-full flex-col overflow-hidden"
      style={{ background: YELLOW }}
    >
      <style>{CSS}</style>

      {/* topo */}
      <header className="shrink-0 px-6 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-5">
        <img src="/logo.svg" alt="YTU" className="h-18 w-auto" />
        <div className="mt-4 flex gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className="h-[3px] flex-1 rounded-full transition-all duration-500"
              style={{
                background: i <= step ? "#111827" : "rgba(255,255,255,.85)",
              }}
            />
          ))}
        </div>
      </header>

      {/* card */}
      <section
        className="flex min-h-0 flex-1 flex-col rounded-t-[28px] px-6 pt-7"
        style={{ background: CREAM }}
      >
        <div
          key={step}
          style={{ ["--dx" as string]: `${dir * 22}px` }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <p
            className="pz-in text-[11px] font-extrabold tracking-[0.14em]"
            style={{ color: "#C42A17", "--d": "0ms" } as React.CSSProperties}
          >
            {s.kicker}
          </p>
          <h1
            className="pz-in mt-2 text-[26px] font-extrabold leading-[1.22] text-[#111827]"
            style={{ "--d": "60ms" } as React.CSSProperties}
          >
            {s.title.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h1>
          <p
            className="pz-in mt-2.5 text-[11px] font-bold tracking-[0.08em] text-neutral-500"
            style={{ "--d": "110ms" } as React.CSSProperties}
          >
            {s.hint}
          </p>

          <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-4">
            {step === 0 && (
              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map((o, i) => (
                  <CardOption
                    key={o.id}
                    o={o}
                    active={interests.includes(o.id)}
                    delay={140 + i * 45}
                    onClick={() => toggleInterest(o.id)}
                  />
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {COMPANY.map((o, i) => (
                  <CardOption
                    key={o.id}
                    o={o}
                    big
                    active={company === o.id}
                    delay={140 + i * 55}
                    onClick={() => setCompany(o.id)}
                  />
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {BUDGET.map((b, i) => {
                  const active = budget === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBudget(b.id)}
                      className="pz-in flex w-full items-center gap-4 rounded-2xl border-2 p-3.5 text-left transition active:scale-[.98]"
                      style={
                        {
                          borderColor: active ? BLUE : "#E7E3D6",
                          background: active ? "#EAF0FF" : "#FFFFFF",
                          "--d": `${140 + i * 60}ms`,
                        } as React.CSSProperties
                      }
                    >
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-white"
                        style={{ background: BLUE }}
                      >
                        {b.tag}
                      </span>
                      <span>
                        <span className="block text-[17px] font-extrabold text-[#111827]">
                          {b.label}
                        </span>
                        <span className="block text-[13px] font-medium text-neutral-500">
                          {b.sub}
                        </span>
                      </span>
                    </button>
                  );
                })}

                <div
                  className="pz-in flex items-start gap-2 pt-1 text-[12px] font-medium leading-snug text-neutral-500"
                  style={{ "--d": "340ms" } as React.CSSProperties}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4 shrink-0"
                    fill="none"
                    stroke="#C42A17"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11v2h6v-2a6 6 0 0 0-3-11Z" />
                  </svg>
                  Você poderá mudar suas preferências a qualquer momento no
                  perfil.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* rodapé */}
        <footer className="flex shrink-0 items-center gap-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-1">
          {step > 0 && (
            <button
              type="button"
              onClick={() => go(step - 1, -1)}
              aria-label="Voltar"
              className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl transition active:scale-95"
              style={{ background: "#F2E7CE", color: BLUE }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={next}
            disabled={!canNext}
            className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl text-[17px] font-extrabold text-white shadow-lg transition active:scale-[.98] disabled:opacity-40 disabled:shadow-none"
            style={{ background: BLUE }}
          >
            {step === 2 ? "Explorar meu Recife" : "Continuar"}
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </footer>
      </section>
    </div>
  );
}

/* ---------------- card ---------------- */

function CardOption({
  o,
  active,
  delay,
  big,
  onClick,
}: {
  o: Option;
  active: boolean;
  delay: number;
  big?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`pz-in flex w-full flex-col justify-between rounded-2xl border-2 p-3.5 text-left transition active:scale-[.97] ${big ? "h-[104px]" : "h-[112px]"}`}
      style={
        {
          borderColor: active ? BLUE : "#E7E3D6",
          background: active ? "#EAF0FF" : "#FFFFFF",
          color: active ? BLUE : "#0B3EBE",
          "--d": `${delay}ms`,
        } as React.CSSProperties
      }
    >
      {o.icon}
      <span>
        <span className="block text-[15px] font-extrabold text-[#111827]">
          {o.label}
        </span>
        {o.sub && (
          <span className="block text-[9.5px] font-medium leading-tight text-neutral-500">
            {o.sub}
          </span>
        )}
      </span>
    </button>
  );
}
