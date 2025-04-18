import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styles from "./MapComponent.module.css";

const MapComponent = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [geoData, setGeoData] = useState(null);
  const [data, setData] = useState([]);

  // Carrega GeoJSON
  useEffect(() => {
    d3.json("/dados/bvisualizacao_fcbairro.geojson")
      .then((json) => setGeoData(json))
      .catch((err) => console.error("Erro GeoJSON:", err));
  }, []);

  useEffect(() => {
    
    fetch("https://sistema-odonto-legal.onrender.com/api/dash/cases/district")
      .then((res) => {
        if (!res.ok) throw new Error(`Erro na API: ${res.status}`);
        return res.json();
      })
      .then((serverData) => {
        const normalized = serverData.map((d) => ({
          bairro: d.bairro
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim(),
          casos: d.casos,
        }));
        setData(normalized);
      })
      .catch((err) =>
        console.error("Erro ao carregar dados do dashboard:", err)
      );
  }, []);

  // Prepara escala e thresholds
  const maxCases = d3.max(data, (d) => d.casos) ?? 1;
  const colorScale = d3.scaleSequential([0, maxCases], d3.interpolateReds);
  const thresholds = [0, Math.round(maxCases / 2), maxCases];

  // desenha / atualiza o mapa
  useEffect(() => {
    if (!geoData || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const WIDTH = 530;
    const HEIGHT = 350;
    const projection = d3
      .geoIdentity()
      .reflectY(true)
      .fitSize([WIDTH, HEIGHT], geoData);
    const path = d3.geoPath().projection(projection);
    const dataMap = new Map(data.map((d) => [d.bairro, d.casos]));

    // desenha os bairros
    const paths = svg
      .selectAll("path")
      .data(geoData.features)
      .join("path")
      .attr("d", path)
      .attr("stroke", "#444")
      .attr("stroke-width", 0.5);

    // anima o fill
    paths
      .transition()
      .duration(750)
      .attr("fill", (f) => {
        const raw = f.properties.EBAIRRNOMEOF || f.properties.EBAIRRNOME || "";
        const chave = raw
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim();
        const casos = dataMap.get(chave) || 0;
        return casos > 0 ? colorScale(casos) : "#f0f0f0";
      });

    // tooltip
    paths
      .on("mouseover", (e, f) => {
        const raw = (
          f.properties.EBAIRRNOMEOF || f.properties.EBAIRRNOME
        ).trim();
        const chave = raw
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim();
        const casos = dataMap.get(chave) || 0;
        const [x, y] = d3.pointer(e, svgRef.current);
        d3.select(tooltipRef.current)
          .style("top", `${y + 10}px`)
          .style("left", `${x + 10}px`)
          .style("visibility", "visible")
          .text(`${raw}: ${casos} caso(s)`);
      })
      .on("mouseout", () =>
        d3.select(tooltipRef.current).style("visibility", "hidden")
      );
  }, [geoData, data]);

  return (
    <>
      <h2 className={styles.title}>Mapa de casos em Recife</h2>
      <p className={styles.description}>
        Aqui você vê, bairro a bairro, a quantidade de casos registrados.
      </p>

      <div className={styles.mapContainer}>
        <svg ref={svgRef} />
        <div ref={tooltipRef} className={styles.tooltip} />
        <div className={styles.legend}>
          {thresholds.map((t, i) => (
            <div key={i} className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ background: colorScale(t) }}
              />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MapComponent;
