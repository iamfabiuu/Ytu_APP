import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { fakeAuth } from "../lib/fakeAuth";
import logo from "/logo.svg";
import padrao from "/image 59.svg";
import googleIcon from "/icons/google.svg";
import appleIcon from "/icons/apple.svg";

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmar: "",
  });
  const [aceito, setAceito] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // loga como usuário NOVO (onboarded = false) -> GuestOnly manda pro /onboarding
  const signup = (nome?: string, email?: string) => {
    fakeAuth.login({
      name: nome || "Convidado",
      email: email || "convidado@exemplo.com",
    });
    fakeAuth.setOnboarded?.(false);
    window.dispatchEvent(new Event("auth:change"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.senha !== form.confirmar) return alert("As senhas não conferem");
    if (!aceito) return alert("Aceite os termos para continuar");
    signup(form.nome, form.email);
  };

  return (
    <div className="min-h-screen bg-[#1132B0] flex flex-col">
      <header
        className="relative flex items-center justify-center h-56 shrink-0"
        style={{ backgroundImage: `url(${padrao})`, backgroundSize: "cover" }}
      >
        <img src={logo} alt="Logo" className="h-36 w-auto drop-shadow-lg" />
      </header>

      <main className="flex-1 bg-white rounded-t-[28px] -mt-6 px-6 pt-7 pb-8">
        <h1 className="text-[34px] font-extrabold text-[#0B0B0B] leading-none">
          Criar conta
        </h1>
        <p className="mt-2 text-[15px] text-[#7C93D8]">
          Preencha os dados abaixo para começar a explorar
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Nome completo" icon={<User size={18} />}>
            <input
              type="text"
              value={form.nome}
              onChange={set("nome")}
              placeholder="Seu nome completo"
              className={inputCls}
            />
          </Field>

          <Field label="E-mail" icon={<Mail size={18} />}>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="seuemail@exemplo.com"
              className={inputCls}
            />
          </Field>

          <Field label="Senha" icon={<Lock size={18} />}>
            <input
              type="password"
              value={form.senha}
              onChange={set("senha")}
              placeholder="Crie sua senha"
              className={inputCls}
            />
          </Field>

          <Field label="Confirmar senha" icon={<Lock size={18} />}>
            <input
              type="password"
              value={form.confirmar}
              onChange={set("confirmar")}
              placeholder="Repita a senha"
              className={inputCls}
            />
          </Field>

          <label className="flex items-start gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={aceito}
              onChange={(e) => setAceito(e.target.checked)}
              className="mt-[2px] h-4 w-4 rounded-[4px] border-2 border-[#D62B1F] accent-[#D62B1F]"
            />
            <span className="text-[13px] text-[#3C3C3C]">
              Li e aceito os{" "}
              <Link to="/termos" className="font-bold text-[#D62B1F]">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link to="/privacidade" className="font-bold text-[#D62B1F]">
                Política de Privacidade
              </Link>
            </span>
          </label>

          <button
            type="submit"
            className="w-full h-[52px] rounded-xl bg-[#12369F] text-white font-bold text-[16px] shadow-md active:scale-[.99] transition"
          >
            Cadastrar
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-[1px] bg-[#F0B8B4]" />
          <span className="text-[13px] text-[#D62B1F]">ou cadastre-se com</span>
          <span className="flex-1 h-[1px] bg-[#F0B8B4]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SocialButton
            icon={googleIcon}
            label="Google"
            onClick={() => signup("Usuário Google", "google@exemplo.com")}
          />
          <SocialButton
            icon={appleIcon}
            label="Apple"
            onClick={() => signup("Usuário Apple", "apple@exemplo.com")}
          />
        </div>

        <div className="mt-7 flex items-center justify-between">
          <p className="text-[14px] text-[#9AA5C4]">
            Já tem conta?{" "}
            <Link to="/login" className="font-bold text-[#D62B1F]">
              Entrar
            </Link>
          </p>
          <button
            type="button"
            onClick={() => signup()}
            className="text-[14px] font-bold text-[#D62B1F]"
          >
            Entrar sem o login
          </button>
        </div>
      </main>
    </div>
  );
}

const inputCls =
  "w-full h-[50px] pl-11 pr-4 rounded-xl border border-[#C9D4F5] text-[15px] text-[#0B0B0B] placeholder:text-[#B9C4E0] outline-none focus:border-[#12369F] transition";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block mb-2 text-[14px] font-semibold text-[#12369F]">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B9C4E0]">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[50px] rounded-xl border border-[#C9D4F5] flex items-center justify-center gap-2 font-semibold text-[#0B0B0B] active:scale-[.99] transition"
    >
      <img src={icon} alt={label} className="h-5 w-5" />
      {label}
    </button>
  );
}
