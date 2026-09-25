// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Top3Carousel } from "../components/Top3Carousel";


const CHIPS = ["Cultura", "Música", "História", "Culinária"];

const PLACES = [
  {
    id: "passo-do-frevo",
    name: "Paço do Frevo",
    info: "850 M • Grátis às terças",
    img: "/paco-do-frevo.jpg",
  },
  {
    id: "cais-do-sertao",
    name: "Cais do Sertão",
    info: "850 M • Grátis às terças",
    img: "/cais-sertao.jpg",
  },
  {
    id: "mercado-boa-vista",
    name: "Mercado da Boa Vista",
    info: "1,8 KM • Comércio Popular e Público",
    img: "/_mercado_da_boa_vista.jpg",
  },
];

const CATEGORIES = [
  { label: "Econômica", bg: "bg-brand-blue", icon: "/Economic.svg" },
  { label: "Performática", bg: "bg-brand-yellow", icon: "/perform.svg" },
  { label: "De casal", bg: "bg-brand-red", icon: "/casal.svg" },
  { label: "Sozinho", bg: "bg-brand-orange", icon: "/sozinho.svg" },
  { label: "Em Família", bg: "bg-brand-blue", icon: "/familia.svg" },
  { label: "Com amigos", bg: "bg-brand-orange", icon: "/amigos.svg" },
];

const TOP3 = [
    {
    rank: 1,
    title: "Recife a pé e sem pressa",
    meta: "4 paradas • 3h • Grátis",
    bg: "bg-brand-blue",
  },

  {
    rank: 2,
    title: "Sabores do mercado",
    meta: "3 paradas • 2h • Grátis",
    bg: "bg-brand-yellow",
  },

  {
    rank: 3,
    title: "Recife Antigo ao pôr do sol",
    meta: "5 paradas • 3h • R$30,00",
    bg: "bg-brand-red",
  },
];

function SectionHead({ title, to }: { title: string; to?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-2">
      <h2 className="text-base font-extrabold text-ink">{title}</h2>
      {to && (
        <Link
          to={to}
          className="text-xs font-semibold text-brand-blue hover:underline"
        >
          Ver todos →
        </Link>
      )}
    </div>
  );
}


const BG_IMAGE = "/fundoHome.svg";
const BG_OPACITY = 0.9;

export function Home() {
  const [active, setActive] = [CHIPS[0], (_: string) => {}]; // troque por useState se quiser interativo

  return (
    <div className="relative isolate min-h-full bg-sand">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 select-none"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "800px 1400px",
          opacity: BG_OPACITY,
        }}
      />

      {/* Header */}
      <header className="rounded-b-3xl bg-brand-yellow px-4 pb-5 pt-4">
        <img src="/logo.svg" alt="Ytu" className="h-18 w-18" />

        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm"
        >
          <span aria-hidden className="text-ink/50">
            🔍
          </span>
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
            placeholder="Buscar por rotas, eventos, restaurantes, etc..."
            aria-label="Buscar"
          />
        </form>

        <p className="mt-4 text-sm font-extrabold text-ink">Daqui para onde?</p>
        <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                active === c ? "bg-brand-blue text-white" : "bg-white text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <main className="relative mx-auto max-w-md space-y-8 px-4 pb-32 pt-5">
        {/* Rota da semana */}
        <Link
          to="/rotas/destaque"
          aria-label="Rota da semana: Recife a pé e sem pressa — 4 paradas, 3h, grátis"
          className="group relative isolate flex min-h-[210px] flex-col justify-center overflow-hidden rounded-2xl bg-brand-blue p-5 text-white shadow-lg shadow-brand-blue/20 transition active:scale-[0.98]"
        >
          {/* pattern de fundo */}
          <img
            src="/image 59.svg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 size-full select-none object-cover opacity-[0.18]"
          />

          {/* fade pra legibilidade */}
          <span
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-blue via-brand-blue/80 to-transparent"
          />

          <span className="relative text-xs font-bold tracking-[0.2em] text-brand-yellow">
            ROTA DA SEMANA
          </span>

          <h3 className="relative mt-2 max-w-[60%] text-3xl font-extrabold leading-tight">
            Recife a pé e sem pressa
          </h3>

          <p className="relative mt-3 flex items-center gap-2 text-sm font-semibold text-white/85">
            4 paradas <span className="text-white/35">•</span> 3h
            <span className="text-white/35">•</span>
            <span className="text-brand-yellow">Grátis</span>
          </p>

          <span className="relative mt-4 flex w-fit items-center gap-1.5 rounded-full bg-brand-yellow px-4 py-2 text-xs font-extrabold text-brand-blue">
            Iniciar rota
            <ChevronRight className="size-3.5 transition group-active:translate-x-0.5" />
          </span>

          <img
            src="/Group 15.svg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-5 top-1/2 size-20 -translate-y-1/2 select-none object-contain drop-shadow"
          />
        </Link>

        {/* Lugares */}
        <section>
          <SectionHead title="Lugares que combinam com você" to="/nearby" />
          <ul className="space-y-3">
            {PLACES.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/lugar/${p.id}`}
                  className="flex items-center gap-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
                >
                  <img
                    src={p.img}
                    alt=""
                    className="h-20 w-24 shrink-0 object-cover"
                  />
                  <div className="min-w-0 flex-1 py-3">
                    <p className="truncate font-extrabold text-ink">{p.name}</p>
                    <p className="mt-1 truncate text-xs text-ink/60">
                      📍 {p.info}
                    </p>
                  </div>
                  <span aria-hidden className="pr-4 text-xl text-ink/40">
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Categorias */}
        <section>
          <SectionHead title="Explorar por categorias de Rotas" to="/nearby" />
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => (
              <button
                key={c.label}
                aria-label={`Categoria ${c.label}`}
                className={`group relative isolate h-24 w-40 shrink-0 overflow-hidden rounded-2xl px-4 text-left text-lg font-extrabold text-white shadow-sm transition active:scale-[0.97] ${c.bg}`}
              >
                {/* ícone de fundo */}
                <img
                  src={c.icon}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute -bottom-2 -right-2 -z-10 size-24 select-none object-contain opacity-25 transition group-active:scale-110"
                />
                {/* fade pra legibilidade do texto */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-gradient-to-r from-black/15 to-transparent"
                />
                <span className="relative drop-shadow-sm">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Top 3 — carrossel giratório */}
        <section>
          <SectionHead title="Top 3 Roteiros Arretados!" />
          <Top3Carousel items={TOP3} />
        </section>
      </main>
    </div>
  );
}
