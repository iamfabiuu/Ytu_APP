import { Navigate, Outlet } from "react-router-dom";
import { fakeAuth } from "../layouts/lib/fakeAuth";

export function RequireAuth() {
  return fakeAuth.isLogged() ? <Outlet /> : <Navigate to="/login" replace />;
}
