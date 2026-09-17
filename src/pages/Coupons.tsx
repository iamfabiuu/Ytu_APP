import { useState } from "react";

const COUPONS = [
  {
    id: "1",
    off: "10% OFF",
    rule: "Em compras acima de R$100",
    until: "25/12/2026",
    icon: "camera",
  },
  {
    id: "2",
    off: "15% OFF",
    rule: "Em compras acima de R$130",
    until: "25/12/2026",
    icon: "bottle",
  },
  {
    id: "3",
    off: "25% OFF",
    rule: "Em compras acima de R$400",
    until: "25/12/2026",
    icon: "bag",
  },
] as const;

export function Coupons() {
  const [filter, setFilter] = useState("todos");

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FDF8F1] pb-28">
      {/* blobs decorativos de fundo */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 top-[520px] h-72 w-[420px] rounded-[50%] bg-[#F8D9CB]/60"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-24 h-64 w-80 rounded-[50%] bg-[#F8D9CB]/70"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-6 top-[640px] h-40 w-40 rounded-[50%] bg-[#F8D9CB]/40"
      />

      {/* HEADER */}
      <header className="relative h-[140px] bg-[#F04A16]">
        <span
          aria-hidden
          className="absolute inset-0 opacity-[0.18] mix-blend-multiply"
          style={{
            backgroundImage: "url('/img/pattern-cordel.svg')",
            backgroundSize: "420px",
          }}
        />
        <img
          src="/logo.svg"
          alt="Logo"
          className="absolute left-6 top-5 h-12 w-auto"
        />
        <h1 className="absolute inset-x-0 bottom-5 text-center text-[34px] font-extrabold tracking-tight text-white">
          Cupons
        </h1>
      </header>

      {/* BANNER AZUL */}
      <div className="relative z-10 -mt-1 px-4">
        <div className="rounded-2xl bg-[#1443C3] px-5 py-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <span className="grid size-[74px] shrink-0 place-items-center text-[#F04A16]">
              <BadgeIcon />
            </span>
            <h2 className="text-2xl font-extrabold leading-tight">
              Ative cupons e economize mais!
            </h2>
          </div>
          <p className="mt-4 text-center text-[13px] font-medium text-white/90">
            Ative seus cupons e use na hora de pagar.
          </p>
        </div>
      </div>

      {/* FILTRO */}
      <div className="relative z-10 mt-6 px-6">
        <button
          onClick={() => setFilter("todos")}
          className={`rounded-full border-2 px-6 py-2.5 text-sm font-extrabold transition active:scale-95 ${
            filter === "todos"
              ? "border-[#F04A16] bg-white text-[#F04A16]"
              : "border-ink/10 bg-white text-ink/40"
          }`}
        >
          Todos os cupons
        </button>
      </div>

      {/* LISTA */}
      <ul className="relative z-10 mt-4 space-y-4 px-6">
        {COUPONS.map((c) => (
          <li
            key={c.id}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(20,67,195,0.08)] ring-1 ring-ink/5"
          >
            <span className="grid size-[52px] shrink-0 place-items-center rounded-xl bg-[#1443C3] text-white">
              <CouponIcon name={c.icon} />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xl font-extrabold text-[#1443C3]">{c.off}</p>
                <p className="mt-1 shrink-0 text-[11px] font-medium text-ink/45">
                  Válido até {c.until}
                </p>
              </div>
              <p className="mt-1 text-[14px] font-bold text-ink">{c.rule}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- ícones ---------- */

const BadgeIcon = () => (
  <svg viewBox="0 0 100 100" className="size-[74px]">
    <path
      fill="currentColor"
      d="M50 2l8.7 7.6 11.4-2.4 5 10.6 11 4.2-1 11.6 8 8.4-5.8 10.1 3.4 11.2-10.5 5-4.4 10.8-11.5-1.3-9.3 7-9.3-7-11.5 1.3-4.4-10.8-10.5-5L21.7 54 15.9 44l8-8.4-1-11.6 11-4.2 5-10.6L50.3 11z"
    />
    <text
      x="50"
      y="50"
      textAnchor="middle"
      dominantBaseline="central"
      fill="#fff"
      fontSize="38"
      fontWeight="800"
      fontFamily="inherit"
    >
      %
    </text>
  </svg>
);

const CouponIcon = ({ name }: { name: "camera" | "bottle" | "bag" }) => {
  const base = "size-7";
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  if (name === "camera")
    return (
      <svg viewBox="0 0 24 24" className={base} {...p}>
        <path d="M3 8.5A2.5 2.5 0 015.5 6h1.7l1.1-1.8h5.4L14.8 6h3.7A2.5 2.5 0 0121 8.5v8A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5z" />
        <circle cx="12" cy="12.5" r="3.2" />
      </svg>
    );

  if (name === "bottle")
    return (
      <svg viewBox="0 0 24 24" className={base} {...p}>
        <path d="M10.5 2h3v3.2c0 .9.3 1.7.9 2.4l.9 1.1c.5.6.7 1.3.7 2V20a2 2 0 01-2 2h-5a2 2 0 01-2-2V10.7c0-.7.2-1.4.7-2l.9-1.1c.6-.7.9-1.5.9-2.4z" />
        <path d="M8 13h8" />
      </svg>
    );

  return (
    <svg viewBox="0 0 24 24" className={base} {...p}>
      <path d="M5 8h14l-1.2 12.2A2 2 0 0115.8 22H8.2a2 2 0 01-2-1.8z" />
      <path d="M9 8V6.5a3 3 0 016 0V8" />
    </svg>
  );
};
