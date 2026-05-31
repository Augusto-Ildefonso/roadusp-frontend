import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Graph = ({ data, highlightId, onNodeClick, aprovadasIds, cursandoIds }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.nodes || data.nodes.length === 0) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const links = (data.links || []).map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    const svg = d3.select(svgRef.current)
      .attr("width", "100vw")
      .attr("height", "100dvh")
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("position", "fixed")
      .style("top", 0)
      .style("left", 0)
      .style("touch-action", "none");

    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 16)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .append("path")
      .attr("d", "M 0,-4 L 8,0 L 0,4")
      .attr("fill", "#94a3b8");

    defs.append("marker")
      .attr("id", "arrowhead-highlight")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 16)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .append("path")
      .attr("d", "M 0,-4 L 8,0 L 0,4")
      .attr("fill", "#1094ab");

    defs.append("filter")
      .attr("id", "node-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")
      .each(function() {
        d3.select(this).append("feGaussianBlur")
          .attr("stdDeviation", "3")
          .attr("result", "blur");
        d3.select(this).append("feMerge")
          .selectAll("feMergeNode")
          .data(["blur", "SourceGraphic"])
          .join("feMergeNode")
          .attr("in", d => d);
      });

    defs.append("filter")
      .attr("id", "highlight-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")
      .each(function() {
        d3.select(this).append("feGaussianBlur")
          .attr("stdDeviation", "5")
          .attr("result", "blur");
        d3.select(this).append("feMerge")
          .selectAll("feMergeNode")
          .data(["blur", "blur", "SourceGraphic"])
          .join("feMergeNode")
          .attr("in", d => d);
      });

    defs.append("filter")
      .attr("id", "cursando-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")
      .each(function() {
        d3.select(this).append("feGaussianBlur")
          .attr("stdDeviation", "4")
          .attr("result", "blur");
        d3.select(this).append("feMerge")
          .selectAll("feMergeNode")
          .data(["blur", "SourceGraphic"])
          .join("feMergeNode")
          .attr("in", d => d);
      });

    const container = svg.append("g");

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .filter(event => {
        if (event.type.startsWith("touch")) {
          const target = d3.select(event.target);
          const tag = target.node().tagName;
          return tag !== "circle" && tag !== "text";
        }
        return !event.button || event.button === 0;
      })
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    const simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(0, 0))
      .force("x", d3.forceX().strength(0.1))
      .force("y", d3.forceY().strength(0.1));

    if (links.length > 0) {
      simulation.force("link", d3.forceLink(links).id(d => d.id).distance(100));
    }

    const link = container.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => {
        if (highlightId) {
          const isConnected = d.source.id === highlightId || d.target.id === highlightId;
          return isConnected ? "#1094ab" : "#94a3b8";
        }
        return "#94a3b8";
      })
      .attr("stroke-opacity", d => {
        if (highlightId) {
          const isConnected = d.source.id === highlightId || d.target.id === highlightId;
          return isConnected ? 0.9 : 0.5;
        }
        return 0.7;
      })
      .attr("stroke-width", d => {
        if (highlightId) {
          const isConnected = d.source.id === highlightId || d.target.id === highlightId;
          return isConnected ? 3 : 1.5;
        }
        return 1.5 + Math.sqrt(d.value || 1) * 0.5;
      })
      .attr("marker-end", d => {
        if (highlightId) {
          const isConnected = d.source.id === highlightId || d.target.id === highlightId;
          return isConnected ? "url(#arrowhead-highlight)" : "url(#arrowhead)";
        }
        return "url(#arrowhead)";
      });

    const semesters = Array.from(new Set(nodes.map(n => n.semestre)))
      .sort((a, b) => (a || '').toString().localeCompare((b || '').toString(), undefined, { numeric: true }));

    const redScale = [
      "#dc2626", "#ef4444", "#f87171", "#fb7185",
      "#f43f5e", "#e11d48", "#fca5a5", "#fda4af",
      "#fecaca", "#ffe4e6",
    ];
    const BRIGHT_IDX = 1;

    let nextIdx = -1;
    if (cursandoIds && cursandoIds.size > 0) {
      const cursandoSems = nodes
        .filter((n) => cursandoIds.has(n.id))
        .map((n) => Number(n.semestre))
        .filter((s) => !isNaN(s));
      if (cursandoSems.length > 0) {
        const maxSem = Math.max(...cursandoSems);
        nextIdx = semesters.findIndex((s) => Number(s) === maxSem + 1);
      }
    }

    const semesterPalette = semesters.map((_, i) => {
      if (nextIdx < 0) return redScale[Math.min(i, redScale.length - 1)];
      return redScale[Math.max(0, Math.min(redScale.length - 1, BRIGHT_IDX + (i - nextIdx)))];
    });
    const color = d3.scaleOrdinal().domain(semesters).range(semesterPalette);

    function getNodeStatus(d) {
      if (cursandoIds?.has(d.id)) return "cursando";
      if (aprovadasIds?.has(d.id)) return "aprovada";
      return null;
    }

    const node = container.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => {
        if (highlightId && d.id === highlightId) return 16;
        const status = getNodeStatus(d);
        if (status === "cursando") return 12;
        if (status === "aprovada") return 7;
        return 9;
      })
      .attr("fill", d => {
        if (highlightId && d.id === highlightId) return "#1094ab";
        const status = getNodeStatus(d);
        if (status === "cursando") return "#eab308";
        if (status === "aprovada") return "#22c55e";
        return color(d.semestre);
      })
      .attr("stroke", d => {
        if (highlightId && d.id === highlightId) return "#f1f5f9";
        const status = getNodeStatus(d);
        if (status === "cursando") return "#eab308";
        return color(d.semestre);
      })
      .attr("stroke-width", d => {
        if (highlightId && d.id === highlightId) return 3;
        if (cursandoIds?.has(d.id)) return 2;
        return 0;
      })
      .attr("opacity", 1)
      .attr("filter", d => {
        if (highlightId && d.id === highlightId) return "url(#highlight-glow)";
        if (cursandoIds?.has(d.id)) return "url(#cursando-glow)";
        return "url(#node-glow)";
      })
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("title")
      .text(d => `Código: ${d.id}\nNome: ${d.nome}\nCrédito Aula: ${d.credito_aula}\nCrédito Trabalho: ${d.credito_trabalho || "0"}\nCarga Horária: ${d.carga_horaria || "0"}\nCarga Horária de Estágio: ${d.carga_horaria_estagio || "0"}\nCarga horária de Práticas como Componentes Curriculares: ${d.carga_horaria_pratica || "0"}\nAtividades Teórico-Práticas de Aprofundamento: ${d.atividades_teoricos || "0"}`);

    let dragOccurred = false;

    node.on("click", function(event, d) {
      if (dragOccurred) return;
      event.stopPropagation();
      if (onNodeClick) onNodeClick(d);
    });

    const text = container.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.id)
      .attr("font-size", d => (highlightId && d.id === highlightId) ? "13px" : "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", d => {
        if (highlightId && d.id === highlightId) return "#f1f5f9";
        const status = getNodeStatus(d);
        if (status === "cursando") return "#eab308";
        if (status === "aprovada") return "#22c55e";
        return "#94a3b8";
      })
      .attr("font-weight", d => {
        if (highlightId && d.id === highlightId) return "bold";
        if (cursandoIds?.has(d.id)) return "bold";
        return "normal";
      })
      .attr("opacity", 1)
      .style("pointer-events", "none");

    function linkArc(d) {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy);
      const sourceRadius = 9;
      const targetRadius = 9;
      const sourceX = d.source.x + (dx * sourceRadius) / dr;
      const sourceY = d.source.y + (dy * sourceRadius) / dr;
      const targetX = d.target.x - (dx * targetRadius) / dr;
      const targetY = d.target.y - (dy * targetRadius) / dr;
      return { sourceX, sourceY, targetX, targetY };
    }

    simulation.on("tick", () => {
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

      node.attr("cx", d => d.x).attr("cy", d => d.y);
      text.attr("x", d => d.x).attr("y", d => d.y + 28);
    });

    function dragstarted(event) {
      dragOccurred = false;
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      dragOccurred = true;
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, highlightId, onNodeClick, aprovadasIds, cursandoIds]);

  return <svg ref={svgRef}></svg>;
};

export default Graph;
