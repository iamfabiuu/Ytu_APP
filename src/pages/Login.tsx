import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { fakeAuth } from "../lib/fakeAuth";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // ignora rotas de fluxo pra não cair no onboarding depois do login
  const raw = (location.state as { from?: string } | null)?.from ?? "/";
  const from = [
    "/login",
    "/cadastro",
    "/onboarding",
    "/personalizacao",
  ].includes(raw)
    ? "/"
    : raw;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const go = async (mail: string, pass: string, to = from) => {
    setLoading(true);
    try {
      await fakeAuth.login(mail, pass);
      if (remember) localStorage.setItem("remember", "1");
      navigate(to, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 4) {
      setError("Confere o e-mail e uma senha com 4+ caracteres 😉");
      return;
    }
    await go(email, password);
  };

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden bg-[#1D4ED8]">
      {/* padrão de fundo */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-20"
        style={{
          backgroundImage: "url('/image 59.svg')",
          backgroundSize: "320px",
        }}
      />

      {/* LOGO */}
      <div className="relative flex h-[46vh] min-h-[240px] shrink-0 items-center justify-center px-8">
        <img
          src="/logo.svg"
          alt="Logo"
          className="w-48 max-w-[60%] drop-shadow-xl"
        />
      </div>

      {/* CARD */}
      <div className="relative z-10 flex-1 rounded-t-[36px] bg-white px-6 pb-10 pt-8 shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">
        <h1 className="text-3xl font-extrabold text-[#1D2B6B]">Olá de novo!</h1>
        <p className="mt-1.5 text-sm text-[#7C8AC9]">
          Faça login para continuar sua aventura cultural.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* E-MAIL */}
          <label className="block">
            <span className="text-[13px] font-semibold text-[#1D2B6B]">
              E-mail
            </span>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A8B2DE]">
                <MailIcon />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="seuemail@exemplo.com"
                className="w-full rounded-2xl border border-[#C9D2F2] bg-white py-3.5 pl-12 pr-4 text-sm text-ink placeholder:text-[#A8B2DE] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20"
              />
            </div>
          </label>

          {/* SENHA */}
          <label className="mt-4 block">
            <span className="text-[13px] font-semibold text-[#1D2B6B]">
              Senha
            </span>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A8B2DE]">
                <LockIcon />
              </span>
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••••"
                className="w-full rounded-2xl border border-[#C9D2F2] bg-white py-3.5 pl-12 pr-16 text-sm text-ink placeholder:text-[#A8B2DE] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#1D4ED8]"
              >
                {show ? "Ocultar" : "Ver"}
              </button>
            </div>
          </label>

          {/* LEMBRAR / ESQUECEU */}
          <div className="mt-4 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-5 rounded-md border-2 border-[#F3A0A0] accent-[#1D4ED8]"
              />
              <span className="text-[13px] text-[#9AA4CF]">Lembrar de mim</span>
            </label>

            <Link
              to="/recuperar-senha"
              className="text-[13px] font-bold text-[#DC4A0C]"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-[#DC4A0C]/10 px-3 py-2 text-[12px] font-semibold text-[#DC4A0C]">
              {error}
            </p>
          )}

          {/* ENTRAR */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1D4ED8] px-5 py-4 text-[15px] font-extrabold text-white shadow-lg shadow-[#1D4ED8]/25 transition active:scale-[0.98] hover:bg-[#1A45BE] disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>

          {/* DIVISOR */}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#F3C3B4]" />
            <span className="text-[12px] font-semibold text-[#DC4A0C]">
              ou continue com
            </span>
            <span className="h-px flex-1 bg-[#F3C3B4]" />
          </div>

          {/* SOCIAL */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => go("google@recife.com", "social")}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#C9D2F2] bg-white py-3.5 text-sm font-semibold text-[#1D2B6B] transition active:scale-[0.97] hover:bg-[#F7F9FF]"
            >
              <GoogleIcon /> Google
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => go("apple@recife.com", "social")}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#C9D2F2] bg-white py-3.5 text-sm font-semibold text-[#1D2B6B] transition active:scale-[0.97] hover:bg-[#F7F9FF]"
            >
              <AppleIcon /> Apple
            </button>
          </div>

          {/* SEM LOGIN */}
          <button
            type="button"
            disabled={loading}
            onClick={() => go("convidado@recife.com", "guest", "/")}
            className="mt-6 w-full text-center text-[15px] font-extrabold text-[#DC4A0C] transition active:scale-95"
          >
            Entrar sem o login
          </button>

          <p className="mt-5 text-center text-[12px] text-ink/50">
            Não tem conta?{" "}
            <Link to="/cadastro" className="font-bold text-[#1D4ED8]">
              Criar agora
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

/* ---------- ícones ---------- */
const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="10" width="16" height="11" rx="3" />
    <path d="M8 10V7a4 4 0 1 1 8 0v3" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5">
    <path
      fill="#4285F4"
      d="M23 12.2c0-.8-.1-1.6-.2-2.3H12v4.4h6.2A5.3 5.3 0 0 1 16 17.6v3h3.5c2-1.9 3.5-4.8 3.5-8.4Z"
    />
    <path
      fill="#34A853"
      d="M12 23.5c3 0 5.4-1 7.2-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.7 1.1a6.5 6.5 0 0 1-6.1-4.5H2.3v2.8A11.5 11.5 0 0 0 12 23.5Z"
    />
    <path
      fill="#FBBC05"
      d="M5.9 14.7a6.9 6.9 0 0 1 0-4.4V7.5H2.3a11.5 11.5 0 0 0 0 10l3.6-2.8Z"
    />
    <path
      fill="#EA4335"
      d="M12 5.4c1.7 0 3.2.6 4.3 1.7l3.2-3.2A11.4 11.4 0 0 0 2.3 7.5l3.6 2.8A6.5 6.5 0 0 1 12 5.4Z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
    <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.7-1.8-3.3-1.8-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.9-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.8 3-.8s1.8.8 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.4-1-2.4-3.4ZM14.3 5.5c.6-.8 1.1-1.9 1-3-1 0-2.2.7-2.9 1.5-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.6 2.9-1.4Z" />
  </svg>
);

export default Login;
