import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";

const DeleteAccountModal = ({ onClose, onDeleted }) => {
  const { user, deleteAccount } = useAuth();
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

  const handleDelete = async () => {
    setError("");
    setLoading(true);
    try {
      await deleteAccount(user);
      onDeleted();
    } catch (err) {
      const data = err.response?.data;
      setError(data?.error || data?.message || "Erro ao deletar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 animate-in fade-in duration-200"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="w-[90%] max-w-md bg-surface-modal backdrop-blur-xl border border-border-subtle rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-text-primary text-lg font-bold mb-4">Deletar Conta</h2>

        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          Tem certeza que deseja deletar sua conta? Esta ação é irreversível e todos os seus dados serão removidos.
        </p>

        {error && (
          <div className="bg-semantic-error/10 border border-semantic-error/30 rounded-xl px-4 py-3 mb-4">
            <p className="text-semantic-error text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-border-default text-text-secondary hover:text-text-primary font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-semantic-error to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deletando...
              </span>
            ) : (
              "Deletar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
