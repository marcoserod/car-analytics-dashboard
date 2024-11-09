import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { RecallData } from "@/data/types";
import More from "highcharts/highcharts-more";

More(Highcharts);

interface BubbleChartProps {
  data: RecallData[];
}

const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
  const chartOptions = useMemo(() => {
    const bubbleData = data.map((item) => ({
      x: item["VEHIC-YEAR"], // Año del vehículo
      y: item.POTENTIAL_UNITS_AFFECTED_PRED, // Unidades afectadas
      z: item.vehicle_age_at_recall, // Edad del vehículo en el recall
      name: item.RECALL_TYPE, // Tipo de recall
    }));

    return {
      chart: { type: "scatter", zoomType: "xy" },
      title: { text: "Impacto de Recalls en Vehículos" },
      xAxis: {
        title: { text: "Año del Vehículo" },
        min: 1995, // Ajusta para que empiece un poco antes del primer dato
        max: 2025, // Ajusta según el rango de los datos
      },
      yAxis: {
        title: { text: "Unidades Potenciales Afectadas" },
        min: 0, // Asegúrate de que no haya valores negativos si no son posibles
        max: 20000000, // Ajusta esto al valor máximo de tus datos para mejorar la escala
      },
      tooltip: {
        pointFormat: "Antiguedad: {point.z} años<br/>Unidades: {point.y}",
      },
      series: [
        {
          type: "scatter",
          name: "Recalls",
          data: bubbleData,
          colorByPoint: true, // Cada burbuja tendrá un color distinto
        },
      ],
    };
  }, [data]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default BubbleChart;
