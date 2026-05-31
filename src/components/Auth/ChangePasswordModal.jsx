import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";

const ChangePasswordModal = ({ onClose }) => {
  const { user, changePassword } = useAuth();
  const [email, setEmail] = useState(user || "");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [showSenhaAntiga, setShowSenhaAntiga] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    if (!email.trim() || !senhaAntiga.trim() || !novaSenha.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    if (novaSenha.length < 4) {
      setError("A nova senha deve ter pelo menos 4 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(email.trim(), senhaAntiga, novaSenha);
      setSuccess("Senha alterada com sucesso!");
      setTimeout(onClose, 1500);
    } catch (err) {
      const data = err.response?.data;
      if (data?.error) {
        setError(data.error);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("Erro ao alterar a senha.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="relative w-[90%] max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary-DEFAULT to-secondary-DEFAULT opacity-40 blur-sm" />
        <div className="relative bg-surface-modal backdrop-blur-xl border border-border-subtle rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-text-primary text-lg font-bold">Alterar Senha</h2>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors p-1 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
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
                Senha Antiga
              </label>
              <div className="relative">
                <input
                  type={showSenhaAntiga ? "text" : "password"}
                  value={senhaAntiga}
                  onChange={(e) => setSenhaAntiga(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-elevated/50 border border-border-default text-text-primary rounded-xl p-3.5 pr-11 outline-none focus:ring-2 focus:ring-primary-DEFAULT transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowSenhaAntiga(!showSenhaAntiga)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  {showSenhaAntiga ? (
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
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-elevated/50 border border-border-default text-text-primary rounded-xl p-3.5 pr-11 outline-none focus:ring-2 focus:ring-primary-DEFAULT transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  {showNovaSenha ? (
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

            {error && (
              <div className="bg-semantic-error/10 border border-semantic-error/30 rounded-xl px-4 py-3">
                <p className="text-semantic-error text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-semantic-success/10 border border-semantic-success/30 rounded-xl px-4 py-3">
                <p className="text-semantic-success text-sm">{success}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-border-default text-text-secondary hover:text-text-primary font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-DEFAULT to-primary-700 hover:from-accent-teal hover:to-primary-DEFAULT text-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Alterando...
                  </span>
                ) : (
                  "Alterar Senha"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
