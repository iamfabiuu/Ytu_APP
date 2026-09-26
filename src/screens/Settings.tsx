// src/screens/Settings.tsx
import { Link } from "react-router-dom";
import {
  Settings as SettingsIcon,
  ChevronRight,
  UserCircle2,
} from "lucide-react";

type Item = { label: string; to: string; indent?: string };

const ITEMS: Item[] = [
  {
    label: "Acessibilidade",
    to: "/configuracoes/acessibilidade",
    indent: "pl-6",
  },
  { label: "Central de ajuda", to: "/ajuda", indent: "pl-7" },
  { label: "Cupons", to: "/cupons", indent: "pl-8" },
  { label: "Notificações", to: "/configuracoes/notificacoes", indent: "pl-9" },
  { label: "Rotas", to: "/rotas", indent: "pl-10" },
  { label: "Termos de uso e dados", to: "/termos", indent: "pl-8" },
];

export default function Settings() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#F6F1EA] antialiased">
      {/* textura / blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -right-8 h-80 w-80 rounded-full bg-rose-300/25 blur-[90px]" />
        <div className="absolute -left-20 bottom-24 h-80 w-80 rounded-full bg-amber-300/35 blur-[90px]" />
        <div className="absolute -right-12 bottom-0 h-72 w-72 rounded-full bg-orange-300/30 blur-[80px]" />
        <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-indigo-300/20 blur-[90px]" />
      </div>

      <section className="relative flex min-h-dvh flex-col overflow-hidden rounded-r-[32px] bg-gradient-to-b from-white/95 via-white/88 to-white/80 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] backdrop-blur-md">
        {/* trilho azul */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[7px] bg-gradient-to-b from-blue-700 via-sky-400 to-blue-700"
        />
        <span
          aria-hidden
          className="absolute inset-y-0 left-[7px] w-8 bg-gradient-to-r from-sky-500/10 to-transparent"
        />

        {/* header */}
        <header className="flex items-start justify-between gap-4 pl-6 pr-5 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
          <div className="flex items-center gap-2.5 pt-2">
            <SettingsIcon
              aria-hidden
              className="h-[26px] w-[26px] text-slate-900"
              strokeWidth={2.1}
            />
            <h1 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-700">
              Configurações
            </h1>
          </div>

          <Link
            to="/perfil"
            className="group flex flex-col items-center gap-1.5 rounded-2xl p-1 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <span className="grid h-[58px] w-[58px] place-items-center rounded-full bg-white ring-1 ring-slate-900/85 shadow-sm transition-all duration-300 group-hover:ring-2 group-hover:ring-blue-600 group-hover:shadow-md motion-safe:group-active:scale-95">
              <UserCircle2
                aria-hidden
                className="h-10 w-10 text-slate-700 transition-colors group-hover:text-blue-700"
                strokeWidth={1.4}
              />
            </span>
            <span className="text-[11px] font-bold tracking-tight text-slate-900">
              Editar Perfil
            </span>
          </Link>
        </header>

        {/* separador com fade */}
        <div
          aria-hidden
          className="mt-5 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent"
        />

        {/* lista */}
        <nav aria-label="Opções de configuração" className="flex-1 py-4">
          <ul className="space-y-0.5">
            {ITEMS.map(({ label, to, indent = "pl-6" }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`group relative flex items-center gap-4 py-4 pr-4 outline-none transition-colors duration-200 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-transparent focus-visible:bg-blue-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-safe:active:scale-[0.995] ${indent}`}
                >
                  {/* marcador lateral no hover */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-r bg-blue-600 transition-all duration-300 group-hover:h-[60%]"
                  />
                  <span className="flex-1 text-[21px] font-extrabold leading-[1.2] tracking-[-0.01em] text-slate-900 transition-colors group-hover:text-blue-900">
                    {label}
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 group-hover:bg-blue-600/10">
                    <ChevronRight
                      aria-hidden
                      className="h-[22px] w-[22px] text-slate-900 transition-transform duration-300 group-hover:text-blue-700 motion-safe:group-hover:translate-x-0.5"
                      strokeWidth={3}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pl-6 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
          Recife Guia · v1.0.0
        </p>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[5px] bg-gradient-to-r from-blue-700 via-sky-500 to-blue-600"
        />
      </section>
    </main>
  );
}
