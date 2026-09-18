// src/lib/fakeAuth.ts
const KEY = "auth:user";
const ONBOARD_KEY = "auth:onboarded";
const EVENT = "auth:change";

export type FakeUser = {
  name: string;
  handle: string;
  email: string;
  avatar: string;
};

type LoginArg = string | { email?: string; name?: string; password?: string };
type RegisterArg =
  | string
  | { name?: string; email?: string; password?: string };

const AVATAR = "/foto_carrasco.jpeg";
const FALLBACK_EMAIL = "visitante@exemplo.com";

const emit = () => window.dispatchEvent(new Event(EVENT));

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

const nickFrom = (email: unknown) => str(email).split("@")[0] || "visitante";

const prettify = (nick: string) =>
  nick.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const build = (email: string, name?: string): FakeUser => {
  const mail = email || FALLBACK_EMAIL;
  const nick = nickFrom(mail);
  return {
    name: str(name) || prettify(nick),
    handle: `@${nick.toLowerCase()}`,
    email: mail,
    avatar: AVATAR,
  };
};

const persist = (user: FakeUser, onboarded: boolean) => {
  localStorage.setItem(KEY, JSON.stringify(user));
  if (onboarded) localStorage.setItem(ONBOARD_KEY, "1");
  else localStorage.removeItem(ONBOARD_KEY);
  emit();
  return user;
};

const delay = (ms = 900) => new Promise((r) => setTimeout(r, ms));

export const fakeAuth = {
  EVENT,

  isLogged: () => Boolean(localStorage.getItem(KEY)),

  isOnboarded: () => localStorage.getItem(ONBOARD_KEY) === "1",

  setOnboarded: (value: boolean) => {
    if (value) localStorage.setItem(ONBOARD_KEY, "1");
    else localStorage.removeItem(ONBOARD_KEY);
    emit();
  },

  finishOnboarding: () => {
    localStorage.setItem(ONBOARD_KEY, "1");
    emit();
  },

  user: (): FakeUser | null => {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try {
      const u = JSON.parse(raw) as Partial<FakeUser>;
      if (!u || typeof u !== "object" || !str(u.email)) throw new Error("bad");
      return { ...build(str(u.email), u.name), ...u } as FakeUser;
    } catch {
      localStorage.removeItem(KEY); // dado corrompido? xô! 🧹
      return null;
    }
  },

  /** login("a@b.com", "123") ou login({ email, password }) — os dois valem 🛡️ */
  login: async (arg: LoginArg, _password?: string) => {
    await delay();
    const email = typeof arg === "string" ? str(arg) : str(arg?.email);
    const name = typeof arg === "string" ? "" : str(arg?.name);
    return persist(build(email, name), true); // vai direto pra Home
  },

  /** register("Fábio", "a@b.com", "123") ou register({ name, email, password }) */
  register: async (arg: RegisterArg, email?: string, _password?: string) => {
    await delay();
    const name = typeof arg === "string" ? str(arg) : str(arg?.name);
    const mail = typeof arg === "string" ? str(email) : str(arg?.email);
    return persist(build(mail, name), false); // cadastro faz o tour
  },

  /** Entrar sem login / social fake — cai no onboarding */
  loginAsGuest: (provider: unknown = "convidado") => {
    const p = str(provider) || "convidado";
    const slug = p.toLowerCase();
    return persist(
      {
        name: slug === "convidado" ? "Convidado" : prettify(p),
        handle: `@${slug}`,
        email: `${slug}@exemplo.com`,
        avatar: AVATAR,
      },
      false,
    );
  },

  update: (patch: Partial<FakeUser>) => {
    const current = fakeAuth.user();
    if (!current) return null;
    return persist({ ...current, ...patch }, fakeAuth.isOnboarded());
  },

  logout: () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem(ONBOARD_KEY);
    sessionStorage.clear();
    emit();
  },
};
