import React, { useMemo } from "react";
import { mapRecallsByType } from "./mappers";

import { RecallData } from "@/data/types";
import Chart from "./BaseChart";

interface RecallsByTypeChartProps {
  data: RecallData[];
}

const RecallsByTypeChart: React.FC<RecallsByTypeChartProps> = ({ data }) => {
  const chartOptions = useMemo(() => {
    const mappedData = mapRecallsByType(data);
    return {
      chart: { type: "column" }, // Cambiar a "column" para barras verticales
      title: { text: "Distribución de Recalls por Tipo" },
      xAxis: {
        categories: Object.keys(mappedData),
        title: { text: "Tipo de Recall" },
      },
      yAxis: {
        title: { text: "Cantidad" },
        allowDecimals: false, // Evitar valores decimales en el eje Y si no son necesarios
      },
      series: [
        {
          type: "column", // Tipo "column" coincide con barras verticales
          name: "Recalls",
          data: Object.values(mappedData),
        },
      ],
      plotOptions: {
        column: {
          colorByPoint: true, // Colores diferentes para cada barra
        },
      },
    } as Highcharts.Options;
  }, [data]);

  return <Chart options={chartOptions} />;
};

export default RecallsByTypeChart;
