// src/components/Guards.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

export function GuestOnly() {
  const { logged, onboarded } = useAuth();
  if (logged) return <Navigate to={onboarded ? "/" : "/onboarding"} replace />;
  return <Outlet />;
}

export function RequireAuth() {
  const { logged } = useAuth();
  return logged ? <Outlet /> : <Navigate to="/login" replace />;
}

/** só entra quem AINDA não terminou o tour */
export function OnboardingOnly() {
  const { onboarded } = useAuth();
  return onboarded ? <Navigate to="/" replace /> : <Outlet />;
}

/** só entra quem JÁ terminou o tour 👈 o que faltava */
export function AppOnly() {
  const { onboarded } = useAuth();
  return onboarded ? <Outlet /> : <Navigate to="/onboarding" replace />;
}
