import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Graph from "../components/Graph/Graph";
import "../style/GraphPage.css";
import axios from "axios";

// Componente de Legenda com CSS nativo
const Legend = ({ items = [
  { color: "#fcb421", label: "Disciplinas Obrigatórias" },
  { color: "#fcb421", label: "Disciplinas Optativas" },
  { color: "#fcb421", label: "Disciplinas Pendentes" }
] }) => {
  return (
    <div className="legend">
      <div className="legend-items">
        {items.map((item, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color"
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-text">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const GraphPage = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const unidade = searchParams.get("unidade");
  const curso = searchParams.get("curso");

  // Configure suas cores e legendas aqui
  const legendItems = [
    { color: "#fcb421", label: "Disciplinas Obrigatórias" },
    { color: "#1094ab", label: "Disciplinas Eletivas" },
    { color: "#64c4d1", label: "Disciplinas Optativas" }
  ];
  const [searchCode, setSearchCode] = useState("");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedCode, setHighlightedCode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://roadusp-backend.onrender.com/disciplinas?unidade=${unidade}&curso=${curso}`);
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
      }
    };
    
    if (unidade && curso) {
      fetchData();
    }
  }, [unidade, curso]);

  return (
    <div className="GraphPage">
      <Graph data={data} highlightId={highlightedCode} />
      <Legend items={legendItems} />

      <div className="search-bar-container">
        {message && <div className="search-message">{message}</div>}
        <input
          className="search-input"
          placeholder="Código ou nome da disciplina"
          value={searchCode}
          onChange={e => handleTyping(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleEnter(); }}
        />
        <button className="search-button" style={{display: 'none'}}>Buscar</button>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((s, i) => (
            <div key={i} className="suggestion-item" onClick={() => handleSelectSuggestion(s.id)}>
              {s.id} - {s.nome}
            </div>
          ))}
        </div>
      )}

      {searchCode && suggestions && suggestions.length === 0 && (
        <div className="suggestions">
          <div className="suggestion-empty">Nenhum resultado</div>
        </div>
      )}
    </div>
  );

  function handleTyping(value){
    setSearchCode(value);
    if (!value || !data || !data.nodes) {
      setSuggestions([]);
      return;
    }
    const q = value.trim().toLowerCase();
    const matches = data.nodes.filter(n => n.id.toLowerCase().includes(q) || (n.nome || '').toLowerCase().includes(q)).slice(0, 10);
    setSuggestions(matches);
  }

  function handleSelectSuggestion(code){
    setSearchCode(code);
    setSuggestions([]);
    setHighlightedCode(code);
  }

  function handleEnter(){
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
      const partial = data.nodes.find(n => (n.id || '').toLowerCase().includes(q) || (n.nome || '').toLowerCase().includes(q));
      if (partial) { handleSelectSuggestion(partial.id); return; }
    }
    setHighlightedCode(null);
    setSuggestions([]);
    setMessage("Disciplina não encontrada");
    setTimeout(() => setMessage(""), 3000);
  }
};

export default GraphPage;