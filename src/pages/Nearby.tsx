import { useState } from "react";
import { Link } from "react-router-dom";

const TABS = [
  "Recomendados",
  "Econômicas",
  "Perfomáticas",
  "Em grupo",
] as const;
type Tab = (typeof TABS)[number];

const TAG_STYLE: Record<Tab, { bg: string; chip: string; text: string }> = {
  Recomendados: { bg: "#0B4FBF", chip: "#FBBF24", text: "#3B2A00" },
  Econômicas: { bg: "#0B4FBF", chip: "#FBBF24", text: "#3B2A00" },
  Perfomáticas: { bg: "#C81E12", chip: "#0B4FBF", text: "#FFFFFF" },
  "Em grupo": { bg: "#F59300", chip: "#0B4FBF", text: "#FFFFFF" },
};

type Route = {
  id: string;
  title: string;
  tag: Tab;
  duration: string;
  stops: number;
  price: string;
  img: string;
};

const ROUTES: Route[] = [
  {
    id: "frevo",
    title: "Paço do Frevo",
    tag: "Econômicas",
    duration: "3h",
    stops: 4,
    price: "Até R$15,00",
    img: "/paco-do-frevo.jpg",
  },
  {
    id: "sertao",
    title: "Cais do Sertão",
    tag: "Perfomáticas",
    duration: "3h30",
    stops: 6,
    price: "Até R$80,00",
    img: "/cais-sertao.jpg",
  },
  {
    id: "boavista",
    title: "Mercado da Boa Vista",
    tag: "Em grupo",
    duration: "2h",
    stops: 3,
    price: "Até R$50,00",
    img: "/_mercado_da_boa_vista.jpg",
  },
];

export function Nearby() {
  const [tab, setTab] = useState<Tab>("Recomendados");

  const list =
    tab === "Recomendados" ? ROUTES : ROUTES.filter((r) => r.tag === tab);

  return (
    <section className="min-h-screen bg-[#F7F7F8] pb-28">
      {/* HEADER */}
      <header className="relative overflow-hidden rounded-b-[36px] bg-[#F59300] px-5 pb-6 pt-6">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "url('/img/pattern-frevo.svg')",
            backgroundSize: "420px",
          }}
        />
        <img
          src="/logo.svg"
          alt="Vivo Recife"
          className="relative h-12 w-auto"
        />

        <h1 className="relative mt-8 text-[26px] font-extrabold leading-tight text-white">
          Rotas para viver o Recife
        </h1>

        <div className="relative -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 ${
                tab === t
                  ? "bg-[#0B4FBF] text-white shadow-md"
                  : "bg-white text-[#1F2937] shadow-sm"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* CARDS */}
      <ul className="space-y-4 px-4 pt-5">
        {list.map((r) => (
          <RouteCard key={r.id} route={r} />
        ))}

        <li>
          <Link
            to="/rotas/nova"
            className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-ink/20 bg-white/60 p-4 transition hover:border-[#F59300] hover:bg-white"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[#FCE3B4] text-xl font-bold text-[#E63946]">
              +
            </span>
            <span className="flex-1 font-bold text-ink">
              Monte sua própria rota
            </span>
            <span className="text-ink/40">›</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

function RouteCard({ route }: { route: Route }) {
  const s = TAG_STYLE[route.tag];

  return (
    <Link
      to={`/rotas/${route.id}`}
      className="flex h-40 overflow-hidden rounded-2xl shadow-md transition active:scale-[0.98]"
      style={{ background: s.bg }}
    >
      <img
        src={route.img}
        alt={route.title}
        loading="lazy"
        className="h-full w-[38%] shrink-0 object-cover"
      />

      <div className="relative flex-1 overflow-hidden p-3.5">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-2 h-full w-40 opacity-20"
          style={{
            backgroundImage: "url('/img/pattern-card.svg')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        <span
          className="relative inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold"
          style={{ background: s.chip, color: s.text }}
        >
          {route.tag}
        </span>

        <h2 className="relative mt-1.5 text-xl font-extrabold leading-tight text-white">
          {route.title}
        </h2>

        <div className="relative mt-2.5 space-y-1.5 text-[13px] font-medium text-white/95">
          <p className="flex items-center gap-1.5">
            <ClockIcon /> {route.duration} • {route.stops} Paradas
          </p>
          <p className="flex items-center gap-1.5">
            <TicketIcon /> {route.price}
          </p>
        </div>
      </div>
    </Link>
  );
}

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="size-4"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" strokeLinecap="round" />
  </svg>
);

const TicketIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="size-4"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18" strokeLinecap="round" />
  </svg>
);
