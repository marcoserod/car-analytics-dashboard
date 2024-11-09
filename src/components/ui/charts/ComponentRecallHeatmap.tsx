"use client";

import React, { useEffect, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HeatmapModule from "highcharts/modules/heatmap";
import { RecallData } from "@/data/types";
import { mapHeatmapData } from "./mappers";

interface HeatmapProps {
  data: RecallData[];
}

// Activar Heatmap solo en el cliente
if (typeof window !== "undefined") {
  HeatmapModule(Highcharts);
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const chartOptions = useMemo(() => {
    const { categoriesX, categoriesY, heatmapData } = mapHeatmapData(data);

    const sanitizedHeatmapData = heatmapData.map(([x, y, value]) =>
      value > 0 ? [x, y, value] : [x, y, 0.0001]
    );

    const maxHeatmapValue = Math.max(
      ...sanitizedHeatmapData.map(([, , value]) => value)
    );

    return {
      chart: { type: "heatmap" },
      title: { text: "Mapa de Calor de Componentes vs Tipo de Recall" },
      xAxis: { categories: categoriesX },
      yAxis: { categories: categoriesY, title: { text: "Tipos de Recall" } },
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
          return `<b>Componente:</b> ${
            this.series.xAxis.categories[this.point.x]
          }<br/>
                  <b>Tipo de Recall:</b> ${
                    this.series.yAxis.categories[this.point.y]
                  }<br/>
                  <b>Unidades Afectadas:</b> ${this.point.value.toLocaleString()}`;
        },
      },
    };
  }, [data]);

  return typeof window !== "undefined" ? (
    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
  ) : null; // No renderiza nada en el servidor
};

export default Heatmap;
