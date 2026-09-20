// src/App.tsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { Home } from "./pages/Home";
import { MapScreen } from "./screens/MapScreen";
import { Nearby } from "./pages/Nearby";
import { Saved } from "./pages/Saved";
import { Profile } from "./pages/Profile";
import { PlaceDetail } from "./pages/PlaceDetail";
import { Coupons } from "./pages/Coupons";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Onboarding from "./pages/Onboarding";
import Personalizacao from "./pages/Personalizacao";
import { RouteDetail } from "./pages/RouteDetail";
import { WeeklyRouteDetail } from "./pages/WeeklyRouteDetail";
import { useAuth } from "./layouts/lib/useAuth";
import { PlaceRoute } from "./pages/PlaceRoute";
import { CaisDoSertao } from "./pages/CaisDoSertao";
import { MercadoBoaVista } from "./pages/MercadoBoaVista";
import {
  GuestOnly,
  RequireAuth,
  OnboardingOnly,
  AppOnly, // 👈 o esquecido
} from "./components/Guards";

import "@maptiler/sdk/dist/maptiler-sdk.css";

const NO_NAV = ["/login", "/cadastro", "/onboarding", "/personalizacao"];
const FULL_BLEED = ["/onboarding", "/personalizacao", "/map"];

export default function App() {
  const { pathname } = useLocation();
  const { logged } = useAuth();

  const isFullBleed = FULL_BLEED.includes(pathname);
  const showNav = !NO_NAV.includes(pathname) && logged;

  return (
    <div className="min-h-dvh bg-canvas">
      <main
        className={
          isFullBleed
            ? "h-dvh w-full overflow-hidden"
            : showNav
              ? "mx-auto w-full max-w-md pb-[calc(4.75rem+env(safe-area-inset-bottom))]"
              : "mx-auto w-full max-w-md"
        }
      >
        <Routes>
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route element={<OnboardingOnly />}>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/personalizacao" element={<Personalizacao />} />
            </Route>

            <Route element={<AppOnly />}>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapScreen />} />
              <Route path="/nearby" element={<Nearby />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/cupons" element={<Coupons />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/place/:id" element={<PlaceDetail />} />
              <Route path="/rotas/:id" element={<RouteDetail />} />
              <Route path="/rotas/destaque" element={<WeeklyRouteDetail />} />
              <Route path="/lugar/cais-do-sertao" element={<CaisDoSertao />} />
              <Route path="/lugar/mercado-da-boa-vista" element={<MercadoBoaVista />} />
              <Route path="/lugar/:id" element={<PlaceRoute />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>


      </main>

      {showNav && <BottomNav />}
    </div>
  );
}

