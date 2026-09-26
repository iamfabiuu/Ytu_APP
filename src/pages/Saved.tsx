import { useState } from "react";
import { Link } from "react-router-dom";

type Kind = "Lugares" | "Rotas";

type Fav = {
  id: string;
  title: string;
  category: string;
  meta: string;
  img: string;
  kind: Kind;
};

const FAVS: Fav[] = [
  {
    id: "frevo",
    title: "Paço do Frevo",
    category: "Música e cultura",
    meta: "850 m • Grátis às terças",
    img: "/paco-do-frevo.jpg",
    kind: "Lugares",
  },
  {
    id: "sertao",
    title: "Cais do Sertão",
    category: "Museu interativo",
    meta: "1,2 km • a partir de R$ 10",
    img: "/cais-sertao.jpg",
    kind: "Lugares",
  },
  {
    id: "boavista",
    title: "Mercado da Boa Vista",
    category: "Gastronomia local",
    meta: "2,4 km • Opções econômicas",
    img: "/_mercado_da_boa_vista.jpg",
    kind: "Lugares",
  },
  {
    id: "rota-olinda",
    title: "Rota do Frevo",
    category: "4 paradas • 2h",
    meta: "Recife Antigo → Olinda",
    img: "/rota-frevo.jpg",
    kind: "Rotas",
  },
];

export function Saved() {
  const [kind, setKind] = useState<Kind>("Lugares");
  const [saved, setSaved] = useState<string[]>(FAVS.map((f) => f.id));

  const list = FAVS.filter((f) => f.kind === kind && saved.includes(f.id));
  const toggle = (id: string) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <section className="relative min-h-screen bg-[#FDF6EC] pb-28">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-64 h-[520px] opacity-[0.10]"
        style={{
          backgroundImage: "url('/img/pattern-gonzaga.svg')",
          backgroundSize: "contain",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      <header className="relative overflow-hidden rounded-b-[40px] bg-[#FBBF24] px-5 pb-16 pt-6">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-white/25"
          style={{
            maskImage: "url('/image 65.svg')",
            WebkitMaskImage: "url('/image 65.svg')",
            maskSize: "420px",
            WebkitMaskSize: "420px",
          }}
        />
        <img
          src="/logo.svg"
          alt="Vivo Recife"
          className="relative h-18 w-auto"
        />
        <h1 className="relative mt-6 text-center text-[30px] font-extrabold text-[#0B3A73]">
          Seus favoritos
        </h1>
        <p className="relative mt-1 text-center text-sm font-semibold text-[#0B3A73]">
          {saved.length} {saved.length === 1 ? "item salvo" : "itens salvos"}
        </p>
      </header>

      {/* TOGGLE com pílula deslizante */}
      <div className="relative -mt-9 px-4">
        <div
          role="tablist"
          aria-label="Tipo de favorito"
          className="relative flex rounded-2xl bg-white p-1.5 shadow-lg"
        >
          <span
            aria-hidden
            className="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-[#0B4FBF] shadow transition-transform duration-300 ease-out"
            style={{
              transform: kind === "Rotas" ? "translateX(100%)" : "none",
            }}
          />
          {(["Lugares", "Rotas"] as Kind[]).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={kind === k}
              onClick={() => setKind(k)}
              className={`relative flex-1 rounded-xl py-3 text-lg font-bold transition ${
                kind === k ? "text-white" : "text-[#E05A0C]"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState kind={kind} />
      ) : (
        <ul className="relative mt-5 grid grid-cols-2 items-stretch gap-4 px-4">
          {list.map((f) => (
            <FavCard key={f.id} fav={f} saved onToggle={() => toggle(f.id)} />
          ))}
        </ul>
      )}
    </section>
  );
}

function FavCard({
  fav,
  saved,
  onToggle,
}: {
  fav: Fav;
  saved: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="group flex flex-col overflow-hidden rounded-2xl bg-white p-2 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl">
      <Link
        to={`/${fav.kind === "Rotas" ? "rotas" : "lugares"}/${fav.id}`}
        className="block"
      >
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={fav.img}
            alt={fav.title}
            loading="lazy"
            className="h-32 w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/35 to-transparent" />
        </div>
        <p className="mt-2 line-clamp-1 text-[11px] font-bold uppercase tracking-wide text-[#F59300]">
          {fav.category}
        </p>
      </Link>

      <div className="mt-auto flex items-start justify-between gap-1 pt-0.5">
        <div className="min-w-0">
          <h2 className="line-clamp-2 text-[15px] font-extrabold leading-tight text-ink">
            {fav.title}
          </h2>
          <p className="mt-1 text-[11px] font-semibold text-[#0B4FBF]">
            {fav.meta}
          </p>
        </div>
        <button
          onClick={onToggle}
          aria-label={
            saved ? `Remover ${fav.title} dos favoritos` : `Salvar ${fav.title}`
          }
          className="-m-2 shrink-0 p-2 transition active:scale-75"
        >
          <StarIcon filled={saved} />
        </button>
      </div>
    </li>
  );
}

function EmptyState({ kind }: { kind: Kind }) {
  return (
    <div className="relative mx-6 mt-14 rounded-3xl border-2 border-dashed border-[#FBBF24]/60 bg-white/70 px-6 py-10 text-center">
      <StarIcon filled={false} className="mx-auto size-10 text-[#FBBF24]" />
      <p className="mt-3 text-base font-extrabold text-ink">
        Nenhuma {kind === "Rotas" ? "rota" : "parada"} salva ainda
      </p>
      <p className="mt-1 text-sm text-ink/60">
        Toque na estrelinha pra guardar seus queridinhos de Recife. ⭐
      </p>
      <Link
        to={kind === "Rotas" ? "/rotas" : "/explorar"}
        className="mt-5 inline-block rounded-full bg-[#0B4FBF] px-6 py-3 text-sm font-bold text-white shadow-md transition active:scale-95"
      >
        Explorar {kind.toLowerCase()}
      </Link>
    </div>
  );
}

const StarIcon = ({
  filled,
  className = "size-5 text-[#0B4FBF]",
}: {
  filled: boolean;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 3l2.8 5.9 6.2.8-4.6 4.3 1.2 6.2L12 17.8 6.4 20.2l1.2-6.2L3 9.7l6.2-.8z" />
  </svg>
);
