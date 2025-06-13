import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import "./Graph.css"

const Graph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Verificar se temos dados válidos
    if (!data || !data.nodes || data.nodes.length === 0) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const colorScheme = ["#fcb421", "#1094ab"];
    const color = d3.scaleOrdinal(colorScheme);
   
    // Garantir que links existe, mesmo que vazio
    const links = (data.links || []).map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove(); // Clear previous renders

    // Definir marcadores de seta
    const defs = svg.append("defs");
    
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 13) // Posição da seta em relação ao final da linha
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#999")
      .style("stroke", "none");

    // Criar um grupo para conter todos os elementos que serão afetados pelo zoom
    const container = svg.append("g");

    // Configurar zoom
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Criar a simulação - só adicionar força de link se existirem links
    const simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(0, 0))
      .force("x", d3.forceX().strength(0.1))
      .force("y", d3.forceY().strength(0.1));

    // Só adicionar força de link se existirem links
    if (links.length > 0) {
      simulation.force("link", d3.forceLink(links).id(d => d.id).distance(100));
    }

    // Criar links (só se existirem) - agora dentro do container
    const link = container.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value || 1))
      .attr("marker-end", "url(#arrowhead)"); // Adicionar seta no final da linha

    // Criar nós - agora dentro do container
    const node = container.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", d => color(d.group))
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .style("cursor", "pointer");

    // Adicionar tooltip com o ID da disciplina
    node.append("title")
      .text(d => `Código: ${d.id}\nNome: ${d.nome}\nCrédito Aula: ${d.credito_aula}\nCrédito Trabalho: ${d.credito_trabalho || "0"}\nCarga Horária: ${d.carga_horaria || "0"}\nCarga Horária de Estágio: ${d.carga_horaria_estagio || "0"}\nCarga horária de Práticas como Componentes Curriculares: ${d.carga_horaria_pratica || "0"}\nAtividades Teórico-Práticas de Aprofundamento: ${d.atividades_teoricos || "0"}`);

    // Adicionar evento de clique aos nós
    node.on("click", function(event, d) {
      // Prevenir propagação do evento
      event.stopPropagation();
      
      // Remover modal existente se houver
      d3.select("#disciplina-modal").remove();
      
      // Criar modal
      const modal = d3.select("body")
        .append("div")
        .attr("id", "disciplina-modal")
        .style("position", "fixed")
        .style("top", "0")
        .style("left", "0")
        .style("width", "100%")
        .style("height", "100%")
        .style("background-color", "rgba(0, 0, 0, 0.5)")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("z-index", "1000");
      
      // Conteúdo da modal
      const modalContent = modal.append("div")
        .style("background", "white")
        .style("padding", "20px")
        .style("border-radius", "8px")
        .style("max-width", "90%")
        .style("max-height", "80%")
        .style("overflow-y", "auto")
        .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)");
      
      // Título
      modalContent.append("h3")
        .style("margin-top", "0")
        .style("color", "#333")
        .text(d.nome);
      
      // Informações
      const info = [
        { label: "Código", value: d.id },
        { label: "Nome", value: d.nome },
        { label: "Crédito Aula", value: d.credito_aula },
        { label: "Crédito Trabalho", value: d.credito_trabalho || "0" },
        { label: "Carga Horária", value: d.carga_horaria || "0" },
        { label: "Carga Horária de Estágio", value: d.carga_horaria_estagio || "0" },
        { label: "Carga Horária de Práticas", value: d.carga_horaria_pratica || "0" },
        { label: "Atividades Teórico-Práticas", value: d.atividades_teoricos || "0" }
      ];
      
      info.forEach(item => {
        const row = modalContent.append("div")
          .style("margin-bottom", "8px");
        
        row.append("strong")
          .text(item.label + ": ");
        
        row.append("span")
          .text(item.value);
      });
      
      // Botão fechar
      modalContent.append("button")
        .style("margin-top", "15px")
        .style("padding", "8px 16px")
        .style("background", "#007bff")
        .style("color", "white")
        .style("border", "none")
        .style("border-radius", "4px")
        .style("cursor", "pointer")
        .text("Fechar")
        .on("click", () => modal.remove());
      
      // Fechar ao clicar fora
      modal.on("click", function(event) {
        if (event.target === this) {
          modal.remove();
        }
      });
    });

  // Fechar modal com ESC
  d3.select("body").on("keydown", function(event) {
    if (event.key === "Escape") {
      d3.select("#disciplina-modal").remove();
    }
  });

    // Adicionar texto com o código da disciplina embaixo do nó - agora dentro do container
    const text = container.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.id)
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .style("pointer-events", "none");

    // Função para calcular posição da linha considerando o raio do nó
    function linkArc(d) {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy);
      
      // Calcular pontos na borda dos círculos
      const sourceRadius = 10;
      const targetRadius = 10;
      
      const sourceX = d.source.x + (dx * sourceRadius) / dr;
      const sourceY = d.source.y + (dy * sourceRadius) / dr;
      const targetX = d.target.x - (dx * targetRadius) / dr;
      const targetY = d.target.y - (dy * targetRadius) / dr;
      
      return { sourceX, sourceY, targetX, targetY };
    }

    // Função de tick da simulação
    simulation.on("tick", () => {
      // Atualizar posição dos links (só se existirem)
      if (links.length > 0) {
        link.each(function(d) {
          const positions = linkArc(d);
          d3.select(this)
            .attr("x1", positions.sourceX)
            .attr("y1", positions.sourceY)
            .attr("x2", positions.targetX)
            .attr("y2", positions.targetY);
        });
      }

      // Atualizar posição dos nós
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      // Atualizar posição do texto (embaixo do nó)
      text
        .attr("x", d => d.x)
        .attr("y", d => d.y + 35); // 35px abaixo do centro do nó (raio 25 + 10px de espaço)
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop(); // Cleanup on unmount
    };
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default Graph;