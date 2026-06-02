import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Link inválido ou expirado. Solicite uma nova redefinição de senha.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!novaSenha.trim() || !confirmarSenha.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    if (novaSenha.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, novaSenha);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.error || data?.message || "Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-surface-base flex flex-col items-center justify-center p-4">
      <div className="relative w-[90%] max-w-md">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary-DEFAULT to-secondary-DEFAULT opacity-40 blur-sm" />
        <div className="relative bg-surface-modal backdrop-blur-xl border border-border-subtle rounded-2xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black tracking-tighter mb-1">
              <span className="text-primary-DEFAULT">Road</span>
              <span className="text-secondary-DEFAULT">USP</span>
            </h1>
            <p className="text-text-secondary text-sm">Redefinir senha</p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="bg-semantic-success/10 border border-semantic-success/30 rounded-xl px-4 py-3">
                <p className="text-semantic-success text-sm">Senha redefinida com sucesso! Redirecionando...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!token && error && (
                <div className="bg-semantic-error/10 border border-semantic-error/30 rounded-xl px-4 py-3">
                  <p className="text-semantic-error text-sm">{error}</p>
                </div>
              )}

              {token && (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1 mb-2 block">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showSenha ? "text" : "password"}
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
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

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1 mb-2 block">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showSenha ? "text" : "password"}
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-surface-elevated/50 border border-border-default text-text-primary rounded-xl p-3.5 pr-11 outline-none focus:ring-2 focus:ring-primary-DEFAULT transition-all text-sm"
                      />
                    </div>
                  </div>

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
                        Redefinindo...
                      </span>
                    ) : (
                      "Redefinir Senha"
                    )}
                  </button>
                </>
              )}

              {!token && (
                <Link
                  to="/"
                  className="block w-full py-3 rounded-xl bg-gradient-to-r from-primary-DEFAULT to-primary-700 hover:from-accent-teal hover:to-primary-DEFAULT text-white font-bold text-sm transition-all text-center cursor-pointer"
                >
                  Voltar ao início
                </Link>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
