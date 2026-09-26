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
    <section className="relative min-h-dvh overflow-hidden bg-[#FDF8F1] pb-28">
      {/* blobs decorativos */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-28 top-[400px] h-[300px] w-[340px] rotate-[-18deg] rounded-[50%] bg-[#F3C9B4]/50"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-8 h-[260px] w-[300px] rotate-[12deg] rounded-[50%] bg-[#F3C9B4]/60"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-10 bottom-40 h-[180px] w-[200px] rounded-[50%] bg-[#F3C9B4]/40"
      />

      {/* HEADER LARANJA */}
      <header className="relative h-[190px] overflow-hidden bg-[#EF4E15]">
        <span
          aria-hidden
          className="absolute inset-0 bg-white/20"
          style={{
            maskImage: "url('/image 65.svg')",
            WebkitMaskImage: "url('/image 65.svg')",
            maskSize: "380px",
            WebkitMaskSize: "380px",
            maskPosition: "center top",
            WebkitMaskPosition: "center top",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
        <img
          src="/logo.svg"
          alt="Logo"
          className="absolute left-5 top-4 h-11 w-auto"
        />
        <h1 className="absolute inset-x-0 top-[74px] text-center text-[32px] font-extrabold tracking-tight text-white">
          Cupons
        </h1>
      </header>

      {/* BANNER AZUL (sobrepõe o header) */}
      <div className="relative z-10 -mt-[62px] px-4">
        <div className="rounded-[20px] bg-[#1443C3] px-5 py-5 text-white shadow-[0_10px_24px_rgba(20,67,195,0.25)]">
          <div className="flex items-center gap-4">
            <BadgeIcon />
            <h2 className="text-[22px] font-extrabold leading-[1.15]">
              Ative cupons e<br />
              economize mais!
            </h2>
          </div>
          <p className="mt-4 text-center text-[13px] font-semibold text-white/95">
            Ative seus cupons e use na hora de pagar.
          </p>
        </div>
      </div>

      {/* FILTRO */}
      <div className="relative z-10 mt-5 px-5">
        <button
          onClick={() => setFilter("todos")}
          className={`rounded-full border px-5 py-2 text-[13px] font-extrabold transition active:scale-95 ${
            filter === "todos"
              ? "border-[#EF4E15] bg-white text-[#EF4E15]"
              : "border-black/10 bg-white text-black/35"
          }`}
        >
          Todos os cupons
        </button>
      </div>

      {/* LISTA */}
      <ul className="relative z-10 mt-4 space-y-3 px-5">
        {COUPONS.map((c) => (
          <li
            key={c.id}
            className="flex items-center gap-3 rounded-[16px] border border-black/[0.07] bg-white p-3.5"
          >
            <span className="grid size-[46px] shrink-0 place-items-center rounded-[12px] bg-[#1443C3] text-white">
              <CouponIcon name={c.icon} />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[19px] font-extrabold leading-none text-[#1443C3]">
                  {c.off}
                </p>
                <p className="shrink-0 text-[10px] font-semibold text-black/45">
                  Válido até {c.until}
                </p>
              </div>
              <p className="mt-1.5 text-[13px] font-bold text-[#1A1A1A]">
                {c.rule}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- ícones ---------- */

const BadgeIcon = () => (
  <img
    src="/Simbolo.svg"
    alt=""
    aria-hidden
    className="size-[62px] shrink-0 select-none object-contain"
  />
);

const CouponIcon = ({ name }: { name: "camera" | "bottle" | "bag" }) => {
  const base = "size-[26px]";
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
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
