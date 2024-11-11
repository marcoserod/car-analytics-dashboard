"use client";

import React, { useEffect, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HeatmapModule from "highcharts/modules/heatmap";
import { RecallData } from "@/data/types";

// Activar Heatmap solo en el cliente
if (typeof window !== "undefined") {
  HeatmapModule(Highcharts);
}

interface HeatmapByYearProps {
  data: RecallData[];
}

const HeatmapByYear: React.FC<HeatmapByYearProps> = ({ data }) => {
  const chartOptions = useMemo(() => {
    // Agrupación de datos por año y componente
    const groupedData = data.reduce((acc, item) => {
      const year = item["VEHIC-YEAR"];
      const component = item.COMPONENT;

      if (!acc[year]) acc[year] = {};
      acc[year][component] = (acc[year][component] || 0) + 1;

      return acc;
    }, {} as Record<number, Record<string, number>>);

    // Generar categorías y datos para el heatmap
    const categoriesX = Array.from(
      new Set(data.map((item) => item["VEHIC-YEAR"]))
    ).sort();
    const categoriesY = Array.from(new Set(data.map((item) => item.COMPONENT)));

    const heatmapData = categoriesX.flatMap((year, xIndex) =>
      categoriesY.map((component, yIndex) => [
        xIndex,
        yIndex,
        groupedData[year]?.[component] || 0,
      ])
    );

    // Sanitización: reemplazar valores 0 o subcero con un valor mínimo positivo
    const sanitizedHeatmapData = heatmapData.map(([x, y, value]) =>
      value > 0 ? [x, y, value] : [x, y, 0.0001]
    );

    const maxHeatmapValue = Math.max(
      ...sanitizedHeatmapData.map(([, , value]) => value)
    );

    return {
      chart: { type: "heatmap" },
      title: { text: "Mapa de Calor de Componentes vs Año" },
      xAxis: { categories: categoriesX, title: { text: "Año" } },
      yAxis: { categories: categoriesY, title: { text: "Componente" } },
      colorAxis: {
        type: maxHeatmapValue > 0 ? "logarithmic" : "linear",
        min: 0.0001,
        max: maxHeatmapValue,
        stops: [
          [0, "#FFFFFF"],
          [0.33, "#FFD700"],
          [0.66, "#FF8C00"],
          [1, "#FF0000"],
        ],
      },
      series: [
        {
          type: "heatmap",
          data: sanitizedHeatmapData,
        },
      ],
      tooltip: {
        formatter: function () {
          return `<b>Año:</b> ${this.series.xAxis.categories[this.point.x]}<br/>
                  <b>Componente:</b> ${
                    this.series.yAxis.categories[this.point.y]
                  }<br/>
                  <b>Recalls:</b> ${this.point.value.toLocaleString()}`;
        },
      },
    };
  }, [data]);

  return typeof window !== "undefined" ? (
    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
  ) : null; // No renderiza nada en el servidor
};

export default HeatmapByYear;
