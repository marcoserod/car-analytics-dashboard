"use client";

import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import TreemapModule from "highcharts/modules/treemap";
import { mapTreemapData } from "./mappers";
import { RecallData } from "@/data/types";

// Activar Treemap solo si se está en el cliente
if (typeof window !== "undefined") {
  TreemapModule(Highcharts);
}

interface TreemapProps {
  data: RecallData[];
}

const Treemap: React.FC<TreemapProps> = ({ data }) => {
  const chartOptions = useMemo(() => {
    const treemapData = mapTreemapData(data);

    return {
      chart: { type: "treemap" },
      title: { text: "Impacto de Recall por Fabricante" },
      colorAxis: {
        min: 1,
        max: Math.max(...treemapData.map((item) => item.value)),
        stops: [
          [0, "#2E8B57"], // Verde oscuro para valores bajos
          [0.5, "#FFD700"], // Amarillo para valores medios
          [0.75, "#FF8C00"], // Naranja para valores medio-altos
          [1, "#B22222"], // Rojo intenso para valores altos
        ],
      },
      tooltip: {
        pointFormat: `<b>{point.name}</b><br/>
                      Unidades Afectadas: {point.value.toLocaleString()}<br/>
                      Porcentaje del Total: {point.percentage:.2f}%`,
      },
      series: [
        {
          type: "treemap",
          layoutAlgorithm: "squarified",
          data: treemapData.map((item) => ({
            ...item,
            colorValue: item.value, // Vincular valor al color
          })),
        },
      ],
    };
  }, [data]);

  return typeof window !== "undefined" ? (
    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
  ) : null; // Evita renderizado en el servidor
};

export default Treemap;
