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
    meta: "850 m • Grátis as terças",
    img: "/paco-do-frevo.jpg",
    kind: "Lugares",
  },
  {
    id: "sertao",
    title: "Cais do Sertão",
    category: "Museu interasitivo",
    meta: "1,2 km • a partir de 10 R$",
    img: "/cais-sertao.jpg",
    kind: "Lugares",
  },
  {
    id: "boavista",
    title: "Mercado da Boa Vista",
    category: "Gastronomia Local",
    meta: "2,4 km • Opções econômicas",
    img: "/_mercado_da_boa_vista.jpg",
    kind: "Lugares",
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
      {/* textura de fundo (Gonzagão) */}
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

      {/* HEADER */}
      <header className="relative overflow-hidden rounded-b-[40px] bg-[#FBBF24] px-5 pb-16 pt-6">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
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
        <h1 className="relative mt-6 text-center text-[30px] font-extrabold text-white drop-shadow-sm">
          Seus favoritos
        </h1>
      </header>

      {/* TOGGLE */}
      <div className="relative -mt-9 px-4">
        <div className="flex rounded-2xl bg-white p-1.5 shadow-lg">
          {(["Lugares", "Rotas"] as Kind[]).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={`flex-1 rounded-xl py-3 text-lg font-bold transition active:scale-95 ${
                kind === k ? "bg-[#0B4FBF] text-white shadow" : "text-[#E05A0C]"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      {list.length === 0 ? (
        <p className="relative mt-16 px-8 text-center text-ink/50">
          Nada salvo em <b>{kind}</b> ainda. Toque na ⭐ pra guardar seus
          queridinhos!
        </p>
      ) : (
        <ul className="relative mt-5 grid grid-cols-2 gap-4 px-4">
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
    <li className="overflow-hidden rounded-2xl bg-white p-2 shadow-md transition hover:shadow-lg">
      <Link to={`/lugares/${fav.id}`} className="block">
        <img
          src={fav.img}
          alt={fav.title}
          loading="lazy"
          className="h-32 w-full rounded-xl object-cover"
        />
        <p className="mt-2 text-[11px] font-bold text-[#F59300]">
          {fav.category}
        </p>
      </Link>

      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-extrabold text-ink">
            {fav.title}
          </h2>
          <p className="mt-0.5 text-[11px] font-semibold text-[#0B4FBF]">
            {fav.meta}
          </p>
        </div>
        <button
          onClick={onToggle}
          aria-label={saved ? "Remover dos favoritos" : "Salvar"}
          className="mt-0.5 shrink-0 p-0.5 transition active:scale-90"
        >
          <StarIcon filled={saved} />
        </button>
      </div>
    </li>
  );
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="size-5 text-[#0B4FBF]"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
  >
    <path d="M12 3l2.8 5.9 6.2.8-4.6 4.3 1.2 6.2L12 17.8 6.4 20.2l1.2-6.2L3 9.7l6.2-.8z" />
  </svg>
);
