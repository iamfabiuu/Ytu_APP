import { Link, useNavigate } from "react-router-dom";

const STATS = [
  { value: 24, label: "Trilhas\nfeitas" },
  { value: 37, label: "Lugares\nvisitados" },
  { value: 12, label: "Posts\ncompartilhados" },
];

const ACH_SUMMARY = {
  level: 3,
  title: "Explorador do Recife",
  xp: 420,
  nextXp: 600,
  locked: 4,
  badges: [
    { icon: "👣", name: "Primeiro Passo" },
    { icon: "🎭", name: "Passista" },
    { icon: "🍲", name: "Caldinho Lover" },
    { icon: "🗺️", name: "Explorador" },
  ],
};

const ACTIVITY = [
  {
    id: "1",
    title: "Você visitou Caixa Cultural Recife",
    when: "Ontem",
    pts: 20,
    img: "/foto_carrasco.jpeg",
  },
];

export function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-white pb-28">
      {/* blobs decorativos */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-16 top-[360px] h-72 w-[130%] rounded-[50%] bg-[#B9C0E0]/60 blur-[2px]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-24 h-64 w-80 rounded-[50%] bg-[#F7EBB4]/80"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-6 h-56 w-72 rounded-[50%] bg-[#F3C3B4]/70"
      />

      {/* HEADER */}
      <header className="relative h-40 rounded-b-[48px] bg-[#1D4ED8]">
        <span
          aria-hidden
          className="absolute inset-0 overflow-hidden rounded-b-[48px] opacity-20"
          style={{
            backgroundImage: "url('/img/pattern-recife.svg')",
            backgroundSize: "300px",
          }}
        />

        <div className="absolute right-5 top-5 z-30 flex items-center gap-2 text-white">
          <Link
            to="/ajustes"
            aria-label="Configurações"
            className="rounded-full bg-white/15 p-2 backdrop-blur transition active:scale-90 hover:bg-white/25"
          >
            <GearIcon />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sair da conta"
            title="Sair"
            className="rounded-full bg-white/15 p-2 backdrop-blur transition active:scale-90 hover:bg-white/25"
          >
            <LogoutIcon className="size-5" />
          </button>
        </div>
      </header>

      {/* CARD DE PERFIL */}
      <div className="relative z-10 -mt-14 px-4">
        <div className="rounded-3xl bg-white px-4 pb-4 pt-20 shadow-[0_8px_30px_rgba(29,78,216,0.10)] ring-1 ring-[#1D4ED8]/10">
          {/* avatar */}
          <img
            src="/foto_carrasco.jpeg"
            alt="Carrasco"
            className="absolute left-1/2 top-0 z-20 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-white object-cover shadow-lg"
          />

          <div className="text-center">
            <h1 className="text-xl font-extrabold text-ink">Carrasco</h1>
            <p className="text-sm text-ink/50">@carrasco.cultura</p>

            <Link
              to="/cupons"
              className="mt-4 inline-flex rounded-full bg-[#F59E0B] px-6 py-2.5 text-sm font-bold text-white shadow transition active:scale-95 hover:bg-[#E08A08]"
            >
              Ver cupons
            </Link>
          </div>

          <ul className="mt-5 grid grid-cols-3 border-t border-ink/10 pt-4">
            {STATS.map((s) => (
              <li key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-[#DC4A0C]">
                  {s.value}
                </p>
                <p className="mt-0.5 whitespace-pre-line text-[11px] font-semibold leading-tight text-ink/50">
                  {s.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ATIVIDADE */}
      <div className="relative z-10 mt-8 px-4">
        <h2 className="text-[15px] font-extrabold text-ink">
          Atividade Recente
        </h2>

        <ul className="mt-3 space-y-3">
          {ACTIVITY.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-md ring-1 ring-[#1D4ED8]/10"
            >
              <img
                src={a.img}
                alt=""
                className="size-11 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-[#1D4ED8]">
                  {a.title}
                </p>
                <p className="text-[11px] text-ink/45">{a.when}</p>
              </div>
              <span className="shrink-0 text-xs font-bold text-[#1D4ED8]">
                +{a.pts} pts
              </span>
            </li>
          ))}
        </ul>
      </div>

            {/* RESUMO DE CONQUISTAS */}
      <div className="relative z-10 mt-8 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold text-ink">Conquistas</h2>
          <Link
            to="/conquistas"
            className="text-[12px] font-bold text-[#1D4ED8] active:scale-95"
          >
            Ver todas →
          </Link>
        </div>

        <Link
          to="/conquistas"
          className="block rounded-3xl bg-white p-4 shadow-md ring-1 ring-[#1D4ED8]/10 transition active:scale-[0.98] hover:ring-[#1D4ED8]/30"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-widest text-[#F59E0B]">
                NÍVEL {ACH_SUMMARY.level}
              </p>
              <p className="text-[15px] font-extrabold text-ink">
                {ACH_SUMMARY.title}
              </p>
            </div>
            <p className="text-[11px] font-semibold text-ink/50">
              {ACH_SUMMARY.xp}/{ACH_SUMMARY.nextXp} XP
            </p>
          </div>

          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-[#1D4ED8] transition-all"
              style={{
                width: `${Math.min(100, (ACH_SUMMARY.xp / ACH_SUMMARY.nextXp) * 100)}%`,
              }}
            />
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-ink/10 pt-4">
            {ACH_SUMMARY.badges.map((b, i) => (
              <span
                key={i}
                className="flex size-11 items-center justify-center rounded-xl bg-[#FFF3D1] text-xl"
                title={b.name}
              >
                {b.icon}
              </span>
            ))}
            <span className="flex size-11 items-center justify-center rounded-xl bg-ink/5 text-xs font-extrabold text-ink/40">
              +{ACH_SUMMARY.locked}
            </span>
            <p className="ml-auto text-right text-[11px] font-semibold leading-tight text-ink/50">
              {ACH_SUMMARY.badges.length} de{" "}
              {ACH_SUMMARY.badges.length + ACH_SUMMARY.locked}
              <br />
              desbloqueadas
            </p>
          </div>
        </Link>
      </div>

      {/* SAIR */}
      <div className="relative z-10 mt-6 px-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-extrabold text-[#DC4A0C] shadow-md ring-1 ring-[#DC4A0C]/20 transition active:scale-[0.98] hover:bg-[#DC4A0C]/5"
        >
          <LogoutIcon className="size-5" />
          Sair da conta
        </button>
      </div>
    </section>
  );
}

const GearIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
  </svg>
);

const LogoutIcon = ({ className = "size-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);
