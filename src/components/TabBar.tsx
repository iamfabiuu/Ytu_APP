// src/components/TabBar.tsx
import { NavLink } from "react-router-dom";
import { Home, Map, MapPin, Star, User } from "lucide-react";

const TABS = [
  { to: "/", icon: Home },
  { to: "/mapa", icon: Map },
  { to: "/proximos", icon: MapPin },
  { to: "/favoritos", icon: Star },
  { to: "/perfil", icon: User },
];

export default function TabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="flex">
        {TABS.map(({ to, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === "/"}
              className="flex flex-col items-center gap-1.5 py-3"
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={
                      isActive
                        ? "h-6 w-6 text-blue-700"
                        : "h-6 w-6 text-slate-500"
                    }
                    strokeWidth={isActive ? 2.4 : 1.9}
                  />
                  <span
                    className={`h-0.5 w-6 rounded-full ${isActive ? "bg-orange-500" : "bg-transparent"}`}
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
