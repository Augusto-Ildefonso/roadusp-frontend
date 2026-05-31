import { useEffect, useRef } from "react";

const DisciplineModal = ({ discipline: d, onClose }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const info = [
    { label: "Código", value: d.id },
    { label: "Crédito Aula", value: d.credito_aula },
    { label: "Crédito Trabalho", value: d.credito_trabalho || "0" },
    { label: "Carga Horária", value: d.carga_horaria || "0" },
    { label: "Carga Horária de Estágio", value: d.carga_horaria_estagio || "0" },
    { label: "Carga Horária de Práticas", value: d.carga_horaria_pratica || "0" },
    { label: "Atividades Teórico-Práticas", value: d.atividades_teoricos || "0" },
  ];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="relative w-[90%] max-w-lg animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary-DEFAULT to-secondary-DEFAULT opacity-40 blur-sm" />
        <div className="relative bg-surface-modal backdrop-blur-xl border border-border-subtle rounded-2xl p-6 shadow-2xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-text-primary text-lg font-bold leading-tight">{d.nome}</h3>
              <span className="text-text-muted text-sm font-mono mt-1 block">{d.id}</span>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors p-1 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            {info.map((item) => (
              <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-border-subtle last:border-0">
                <span className="text-text-muted text-sm">{item.label}</span>
                <span className="text-text-primary text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="mt-5 w-full py-2.5 rounded-xl bg-primary-DEFAULT hover:bg-primary-600 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisciplineModal;
