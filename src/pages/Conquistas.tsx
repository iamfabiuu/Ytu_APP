import { Link } from "react-router-dom";
import { ACHIEVEMENTS, USER_STATS } from "../data/achievements";

export default function Conquistas() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.progress >= a.goal);
  const pct = Math.min(100, (USER_STATS.xp / USER_STATS.nextLevelXp) * 100);

  return (
    <div className="min-h-screen bg-[#FDF6EC] pb-24">
      {/* Header */}
      <header className="bg-[#123C8C] px-5 pt-6 pb-8 text-white rounded-b-3xl">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl">←</Link>
          <h1 className="text-2xl font-extrabold">Conquistas</h1>
        </div>

        <div className="mt-5 rounded-2xl bg-white/10 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-[#FFC629]">
                NÍVEL {USER_STATS.level}
              </p>
              <p className="text-lg font-bold">Explorador do Recife</p>
            </div>
            <p className="text-sm">
              {USER_STATS.xp}
              <span className="opacity-70">/{USER_STATS.nextLevelXp} XP</span>
            </p>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-[#FFC629] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs opacity-80">
            {unlocked.length} de {ACHIEVEMENTS.length} conquistas desbloqueadas 🎉
          </p>
        </div>
      </header>

      {/* Grid */}
      <section className="px-5 pt-6">
        <h2 className="mb-3 font-extrabold text-[#123C8C]">Suas medalhas</h2>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a) => {
            const done = a.progress >= a.goal;
            const p = Math.min(100, (a.progress / a.goal) * 100);
            return (
              <div
                key={a.id}
                className={`rounded-2xl border p-4 transition ${
                  done
                    ? "border-[#FFC629] bg-white shadow-sm"
                    : "border-black/5 bg-white/60"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                    done ? "bg-[#FFF3D1]" : "bg-black/5 grayscale opacity-50"
                  }`}
                >
                  {done ? a.icon : "🔒"}
                </div>

                <p className="mt-3 text-sm font-bold leading-tight text-[#123C8C]">
                  {a.title}
                </p>
                <p className="mt-1 text-xs leading-snug text-black/55">{a.desc}</p>

                {done ? (
                  <p className="mt-3 text-xs font-bold text-[#E2483D]">
                    +{a.xp} XP • conquistada
                  </p>
                ) : (
                  <>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                      <div
                        className="h-full rounded-full bg-[#123C8C]"
                        style={{ width: `${p}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-black/50">
                      {a.progress}/{a.goal}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}