// src/components/PlaceDetailView.tsx
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Star, Clock, Wallet, Accessibility, MapPin } from "lucide-react";
import type { PlaceDetail } from "../data/placeDetails";

export function PlaceDetailView({ place }: { place: PlaceDetail }) {
  const nav = useNavigate();

  return (
    <section className="relative min-h-screen bg-[#FDF7F2] pb-32">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={place.cover} alt={place.name} className="size-full object-cover" />
        <button
          onClick={() => nav(-1)}
          aria-label="Voltar"
          className="absolute left-4 top-4 z-20 grid size-11 place-items-center rounded-full bg-white/95 text-[#1D4ED8] shadow-lg backdrop-blur transition active:scale-90"
        >
          <ChevronLeft className="size-6" />
        </button>
      </div>

      <div className="relative z-10 -mt-8 rounded-t-[32px] bg-white px-5 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          {place.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-[#FDE8E4] px-3 py-1 text-[10px] font-extrabold tracking-wide text-[#DC4A0C]"
            >
              {t}
            </span>
          ))}
          <span className="rounded-full bg-[#F5B921] px-3 py-1 text-[11px] font-extrabold text-[#1F2937]">
            {place.badge}
          </span>
        </div>

        <h1 className="mt-3 text-[34px] font-extrabold leading-tight text-[#0B1B3F]">
          {place.name}
        </h1>

        <div className="mt-1 flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 font-bold text-[#F5B921]">
            <Star className="size-4 fill-current" />
            {place.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
          </span>
          <span className="text-ink/50">({place.reviews} avaliações)</span>
          <span className="text-ink/50">{place.distance}</span>
        </div>

        <p className="mt-4 text-[15px] leading-relaxed text-ink/70">{place.description}</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <InfoCard icon={<Clock className="size-6" />} label="HORÁRIO" {...place.hours} />
          <InfoCard icon={<Wallet className="size-6" />} label="ENTRADA" {...place.ticket} />
        </div>

        <div className="mt-4 rounded-3xl bg-[#E8EEFF] p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#1D3FA8] text-white">
              <Accessibility className="size-6" />
            </span>
            <div>
              <p className="text-[11px] font-extrabold tracking-wide text-[#1D4ED8]">
                ACESSIBILIDADE
              </p>
              <p className="text-lg font-bold text-[#0B1B3F]">{place.accessibility.title}</p>
            </div>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {place.accessibility.features.map((f) => (
              <li key={f} className="rounded-full bg-[#1D3FA8] px-4 py-2 text-xs font-bold text-white">
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <p className="text-[11px] font-extrabold tracking-wide text-[#DC4A0C]">COMO CHEGAR</p>
          <h2 className="mt-1 text-2xl font-bold text-[#0B1B3F]">{place.address.line1}</h2>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-sm text-ink/50">
              <MapPin className="size-4" /> {place.address.line2}
            </p>
            <button
              onClick={() => nav(`/mapa?destino=${place.id}`)}
              className="text-sm font-bold text-[#0B1B3F] underline underline-offset-2 active:scale-95"
            >
              Ver mapa
            </button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 bg-white/95 px-5 py-4 backdrop-blur">
        <button
          aria-label="Salvar local"
          className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#FDE8E4] text-[#1D3FA8] transition active:scale-95"
        >
          <Star className="size-6" />
        </button>
        <button
          onClick={() => nav(`/mapa?destino=${place.id}`)}
          className="h-14 flex-1 rounded-2xl bg-[#1D3FA8] text-[17px] font-bold text-white shadow-lg transition active:scale-[0.98]"
        >
          Criar rota até aqui
        </button>
      </div>
    </section>
  );
}

function InfoCard({
  icon, label, value, note,
}: { icon: ReactNode; label: string; value: string; note?: string }) {
  return (
    <div className="rounded-3xl border-2 border-[#1D3FA8]/15 bg-white px-4 py-4 text-center">
      <span className="mx-auto mb-1 flex justify-center text-[#1D3FA8]">{icon}</span>
      <p className="text-[11px] font-bold tracking-wide text-ink/50">{label}</p>
      <p className="text-lg font-bold text-[#0B1B3F]">{value}</p>
      {note && <p className="text-[13px] font-semibold text-[#16A34A]">{note}</p>}
    </div>
  );
}
