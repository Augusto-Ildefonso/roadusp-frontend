import api from "../services/api";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Graph from "../components/Graph/Graph";
import DisciplineModal from "../components/DisciplineModal/DisciplineModal";

const Legend = ({ items = [] }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden mb-1 ml-auto block bg-surface-card/80 backdrop-blur-xl border border-border-subtle rounded-lg p-2 shadow-lg cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
          <rect x="2" y="2" width="4" height="4" rx="1" />
          <rect x="10" y="2" width="4" height="4" rx="1" />
          <rect x="2" y="10" width="4" height="4" rx="1" />
          <rect x="10" y="10" width="4" height="4" rx="1" />
        </svg>
      </button>
      {isOpen && (
        <div className="bg-surface-card/80 backdrop-blur-xl border border-border-subtle rounded-xl p-3 md:p-4 shadow-lg max-w-[160px] md:max-w-none">
          <div className="flex flex-col gap-1.5 md:gap-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2 md:gap-3">
                <div
                  className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-text-secondary text-xs md:text-sm font-medium leading-tight truncate">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GraphPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(location.state?.graphData || null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const unidade = searchParams.get("unidade");
  const curso = searchParams.get("curso");
  const navigate = useNavigate();

  const { historicoStatus } = useAuth();
  const aprovadasIds = useMemo(() => new Set(historicoStatus?.aprovadas || []), [historicoStatus]);
  const cursandoIds = useMemo(() => new Set(historicoStatus?.cursando || []), [historicoStatus]);

  const searchRef = useRef(null);

  const handleNodeClick = useCallback((node) => {
    setSelectedDiscipline(node);
  }, []);

  const legendItems = useMemo(() => {
    const items = [];
    if (!data || !data.nodes) return items;

    const hasStatus = aprovadasIds.size > 0 || cursandoIds.size > 0;
    if (hasStatus) {
      if (cursandoIds.size > 0) items.push({ color: "#eab308", label: "Cursando" });
      if (aprovadasIds.size > 0) items.push({ color: "#22c55e", label: "Cursada" });
    }

    const semesters = Array.from(new Set(data.nodes.map(n => n.semestre)))
      .sort((a, b) => (a || '').toString().localeCompare((b || '').toString(), undefined, { numeric: true }));
    const palette = ["#dc2626", "#ef4444", "#f87171", "#fb7185", "#f43f5e", "#e11d48", "#fca5a5", "#fda4af", "#fecaca", "#ffe4e6"];
    semesters.forEach((s, i) => items.push({ color: palette[i % palette.length], label: `${s}` }));
    return items;
  }, [data, aprovadasIds, cursandoIds]);

  const [searchCode, setSearchCode] = useState("");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedCode, setHighlightedCode] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (location.state?.graphData) {
      setData(location.state.graphData);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await api.get(`/api/v1/cursos/disciplina/?unidade=${encodeURIComponent(unidade)}&curso=${encodeURIComponent(curso)}`);
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
      }
    };

    if (unidade && curso) {
      fetchData();
    }
  }, [unidade, curso, location.state]);

  function handleTyping(value) {
    setSearchCode(value);
    if (!value || !data || !data.nodes) {
      setSuggestions([]);
      return;
    }
    const q = value.trim().toLowerCase();
    const matches = data.nodes
      .filter(n => n.id.toLowerCase().includes(q) || (n.nome || '').toLowerCase().includes(q))
      .slice(0, 10);
    setSuggestions(matches);
  }

  function handleSelectSuggestion(code) {
    setSearchCode(code);
    setSuggestions([]);
    setHighlightedCode(code);
  }

  function handleEnter() {
    const q = (searchCode || "").trim().toLowerCase();
    if (!q) return;
    if (suggestions && suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0].id);
      return;
    }
    if (data && data.nodes) {
      const exactId = data.nodes.find(n => n.id && n.id.toLowerCase() === q);
      if (exactId) { handleSelectSuggestion(exactId.id); return; }
      const exactName = data.nodes.find(n => (n.nome || '').toLowerCase() === q);
      if (exactName) { handleSelectSuggestion(exactName.id); return; }
      const partial = data.nodes.find(
        n => (n.id || '').toLowerCase().includes(q) || (n.nome || '').toLowerCase().includes(q)
      );
      if (partial) { handleSelectSuggestion(partial.id); return; }
    }
    setHighlightedCode(null);
    setSuggestions([]);
    setMessage("Disciplina não encontrada");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div className="relative min-h-screen w-full bg-surface-base">
      <Graph data={data} highlightId={highlightedCode} onNodeClick={handleNodeClick} aprovadasIds={aprovadasIds} cursandoIds={cursandoIds} />
      <Legend items={legendItems} />

      <button
        onClick={() => navigate("/", { state: { fromGraph: true } })}
        className="fixed top-4 left-4 z-50 bg-surface-card/80 backdrop-blur-xl border border-border-subtle rounded-xl p-3 shadow-lg text-text-muted hover:text-text-primary hover:border-border-default transition-all cursor-pointer"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 10H4M9 5l-5 5 5 5" />
        </svg>
      </button>

      <div className="fixed left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-2 z-[120]">
        {message && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/80 text-text-primary text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            {message}
          </div>
        )}
        <input
          ref={searchRef}
          className="w-48 sm:w-64 px-4 py-2.5 rounded-full bg-surface-elevated/80 backdrop-blur-md border border-border-default text-text-primary placeholder-text-muted outline-none focus:ring-2 focus:ring-primary-DEFAULT/50 transition-all text-sm"
          placeholder="Buscar disciplina..."
          value={searchCode}
          onChange={e => handleTyping(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleEnter(); }}
          onFocus={() => setTimeout(() => searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 300)}
        />
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-20 w-56 sm:w-72 bg-surface-card backdrop-blur-xl border border-border-subtle rounded-xl shadow-lg z-[140] max-h-56 overflow-y-auto">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="px-3 py-2.5 cursor-pointer text-text-secondary text-sm border-b border-border-subtle last:border-0 hover:bg-primary-DEFAULT/10 hover:text-text-primary transition-colors"
              onClick={() => handleSelectSuggestion(s.id)}
            >
              <span className="font-mono text-primary-DEFAULT">{s.id}</span>
              <span className="text-text-muted"> — </span>
              <span>{s.nome}</span>
            </div>
          ))}
        </div>
      )}

      {searchCode && suggestions && suggestions.length === 0 && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-20 w-56 sm:w-72 bg-surface-card backdrop-blur-xl border border-border-subtle rounded-xl shadow-lg z-[140]">
          <div className="px-3 py-2.5 text-text-muted text-sm">Nenhum resultado</div>
        </div>
      )}

      {selectedDiscipline && (
        <DisciplineModal
          discipline={selectedDiscipline}
          onClose={() => setSelectedDiscipline(null)}
        />
      )}
    </div>
  );
};

export default GraphPage;
