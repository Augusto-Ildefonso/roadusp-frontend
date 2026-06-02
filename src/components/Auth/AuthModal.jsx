import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";

const AuthModal = ({ onClose }) => {
  const { login, register, requestPasswordReset } = useAuth();
  const [tab, setTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !senha.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    if (tab === "register" && senha !== confirmarSenha) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      if (tab === "login") {
        await login(email.trim(), senha);
      } else {
        await register(email.trim(), senha);
      }
      onClose();
    } catch (err) {
      const data = err.response?.data;
      if (data?.details) {
        setError(data.details);
      } else if (data?.message) {
        setError(data.message);
      } else if (data?.error) {
        setError(data.error);
      } else {
        setError("Erro ao conectar com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setResetSent(false);

    if (!resetEmail.trim()) {
      setError("Digite seu email.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(resetEmail.trim());
      setResetSent(true);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.error || data?.message || "Erro ao solicitar redefinição.");
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={(e) => e.target === overlayRef.current && onClose()}
      >
        <div className="relative w-[90%] max-w-md animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary-DEFAULT to-secondary-DEFAULT opacity-40 blur-sm" />
          <div className="relative bg-surface-modal backdrop-blur-xl border border-border-subtle rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-text-primary text-lg font-bold">Redefinir Senha</h2>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary transition-colors p-1 cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            {resetSent ? (
              <div className="space-y-4">
                <div className="bg-semantic-success/10 border border-semantic-success/30 rounded-xl px-4 py-3">
                  <p className="text-semantic-success text-sm">
                    Se o email existir, você receberá um link de redefinição.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-DEFAULT to-primary-700 hover:from-accent-teal hover:to-primary-DEFAULT text-white font-bold text-sm transition-all cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-text-secondary text-sm leading-relaxed">
                  Digite seu email cadastrado e enviaremos um link para redefinir sua senha.
                </p>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1 mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="seu@email.usp.br"
                    className="w-full bg-surface-elevated/50 border border-border-default text-text-primary rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-primary-DEFAULT transition-all text-sm"
                  />
                </div>

                {error && (
                  <div className="bg-semantic-error/10 border border-semantic-error/30 rounded-xl px-4 py-3">
                    <p className="text-semantic-error text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(false); setError(""); setResetEmail(""); }}
                    className="flex-1 py-3 rounded-xl border border-border-default text-text-secondary hover:text-text-primary font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-DEFAULT to-primary-700 hover:from-accent-teal hover:to-primary-DEFAULT text-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      "Enviar Link"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-[90%] max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary-DEFAULT to-secondary-DEFAULT opacity-40 blur-sm" />
        <div className="relative bg-surface-modal backdrop-blur-xl border border-border-subtle rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center mb-6">
            <h2 className="text-text-primary text-xl font-bold">
              <span className="text-primary-DEFAULT">Road</span>
              <span className="text-secondary-DEFAULT">USP</span>
            </h2>
          </div>

          <p className="text-text-secondary text-sm mb-6 leading-relaxed">
            Novidade! Faça login para acompanhar seu histórico acadêmico e visualizar as disciplinas já cursadas no grafo.
          </p>

          <div className="flex mb-6 bg-surface-elevated/50 rounded-xl p-1">
            <button
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === "login"
                  ? "bg-primary-DEFAULT text-white shadow-lg shadow-primary-DEFAULT/20"
                  : "text-text-muted hover:text-text-primary"
              }`}
              onClick={() => { setTab("login"); setError(""); }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === "register"
                  ? "bg-primary-DEFAULT text-white shadow-lg shadow-primary-DEFAULT/20"
                  : "text-text-muted hover:text-text-primary"
              }`}
              onClick={() => { setTab("register"); setError(""); }}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1 mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.usp.br"
                className="w-full bg-surface-elevated/50 border border-border-default text-text-primary rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-primary-DEFAULT transition-all text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1 mb-2 block">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-elevated/50 border border-border-default text-text-primary rounded-xl p-3.5 pr-11 outline-none focus:ring-2 focus:ring-primary-DEFAULT transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  {showSenha ? (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4l12 12" />
                      <path d="M1 10s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" />
                      <circle cx="10" cy="10" r="2.5" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 10s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" />
                      <circle cx="10" cy="10" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {tab === "login" && (
              <button
                type="button"
                onClick={() => { setShowForgotPassword(true); setError(""); }}
                className="text-sm text-primary-DEFAULT hover:text-primary-700 transition-colors cursor-pointer ml-1 -mt-2"
              >
                Esqueci minha senha
              </button>
            )}

            {tab === "register" && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1 mb-2 block">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmarSenha ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-elevated/50 border border-border-default text-text-primary rounded-xl p-3.5 pr-11 outline-none focus:ring-2 focus:ring-primary-DEFAULT transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {showConfirmarSenha ? (
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 4l12 12" />
                        <path d="M1 10s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" />
                        <circle cx="10" cy="10" r="2.5" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 10s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" />
                        <circle cx="10" cy="10" r="2.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-semantic-error/10 border border-semantic-error/30 rounded-xl px-4 py-3">
                <p className="text-semantic-error text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-DEFAULT to-primary-700 hover:from-accent-teal hover:to-primary-DEFAULT text-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {tab === "login" ? "Entrando..." : "Criando conta..."}
                </span>
              ) : (
                tab === "login" ? "Entrar" : "Criar Conta"
              )}
            </button>
          </form>

          <button
            onClick={onClose}
            className="w-full mt-3 py-2 text-text-muted hover:text-text-primary text-sm transition-colors cursor-pointer"
          >
            Depois
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
