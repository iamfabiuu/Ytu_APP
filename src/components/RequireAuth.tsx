import { Navigate, Outlet } from "react-router-dom";
import { fakeAuth } from "../lib/fakeAuth";

export function RequireAuth() {
  return fakeAuth.isLogged() ? <Outlet /> : <Navigate to="/login" replace />;
}
