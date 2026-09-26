// src/layouts/AppShell.tsx
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col bg-[#FDF6EC]">
      {/* pinta a status bar de amarelo */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-30 bg-amber-300"
        style={{ height: "env(safe-area-inset-top)" }}
      />

      <div className="flex-1 overflow-y-auto overscroll-contain">
        {children}
        {/* respiro final: altura da tab bar + gesture bar */}
        <div
          aria-hidden
          className="h-[calc(5rem+env(safe-area-inset-bottom))]"
        />
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-[#FDF6EC]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        {/* ícones */}
      </nav>
    </div>
  );
}
