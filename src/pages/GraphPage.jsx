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
      <Graph data={data} />
      <Legend items={legendItems} />
    </div>
  );
};

export default GraphPage;