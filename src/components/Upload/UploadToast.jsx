import { useEffect, useState } from "react";

const UploadToast = ({ status, message, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === "uploading") {
      setVisible(true);
    }
    if (status === "done" || status === "error") {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, onDismiss]);

  if (!visible && !["uploading", "done", "error"].includes(status)) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[1000] transition-all duration-300 ${
        visible
          ? "animate-in fade-in slide-in-from-right-4"
          : "animate-out fade-out slide-out-to-right-4 opacity-0"
      }`}
    >
      <div className="bg-surface-card backdrop-blur-xl border border-border-subtle rounded-xl px-5 py-4 shadow-2xl min-w-[220px]">
        {status === "uploading" && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary-DEFAULT animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.6s" }}
                />
              ))}
            </div>
            <span className="text-text-secondary text-sm font-medium">
              Fazendo upload...
            </span>
          </div>
        )}

        {status === "done" && (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-semantic-success/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#22c55e" strokeWidth="2.5">
                <path d="M3 7l3 3 5-5" />
              </svg>
            </div>
            <span className="text-text-primary text-sm font-medium">Finalizado</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-semantic-error/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#ef4444" strokeWidth="2.5">
                <path d="M4 4l6 6M10 4l-6 6" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-semantic-error text-sm font-medium">Erro</span>
              {message && (
                <span className="text-text-muted text-xs mt-0.5">{message}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadToast;
