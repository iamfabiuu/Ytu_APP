import { NavLink } from "react-router-dom";
import { House, Map, MapPin, Star, User } from "lucide-react";

const ITEMS = [
  { to: "/", icon: House, label: "Início" },
  { to: "/map", icon: Map, label: "Mapa" },
  { to: "/nearby", icon: MapPin, label: "Por perto" },
  { to: "/saved", icon: Star, label: "Favoritos" },
  { to: "/profile", icon: User, label: "Perfil" },
] as const;

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-sand/95 backdrop-blur border-t border-black/5
                pb-[env(safe-area-inset-bottom)] z-50"
    >
      <ul className="mx-auto flex w-full max-w-md items-stretch justify-around px-2">
        {ITEMS.map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === "/"}
              aria-label={label}
              className="flex flex-col items-center gap-1.5 pt-3.5 pb-3
                         outline-none transition active:scale-90
                         focus-visible:ring-2 focus-visible:ring-navy/40
                         focus-visible:rounded-xl"
            >
              {({ isActive }) => (
                <>
                  <Icon
                    absoluteStrokeWidth
                    strokeWidth={2}
                    aria-hidden
                    className={`size-6 text-navy transition-opacity ${
                      isActive ? "opacity-100" : "opacity-60"
                    }`}
                  />
                  <span
                    aria-hidden
                    className={`h-[3px] w-6 rounded-full bg-accent origin-center
                                transition-transform duration-200 will-change-transform
                                ${isActive ? "scale-x-100" : "scale-x-0"}`}
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
