// src/lib/useAuth.ts
import { useEffect, useState } from "react";
import { fakeAuth } from "./fakeAuth";

const snap = () => ({
  logged: fakeAuth.isLogged(),
  onboarded: fakeAuth.isOnboarded(),
  user: fakeAuth.user(),
});

export function useAuth() {
  const [state, setState] = useState(snap);

  useEffect(() => {
    const sync = () => setState(snap());
    window.addEventListener("storage", sync);
    window.addEventListener(fakeAuth.EVENT, sync);
    sync(); // pega o que mudou antes do listener entrar
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(fakeAuth.EVENT, sync);
    };
  }, []);

  return state; // { logged, onboarded, user }
}
