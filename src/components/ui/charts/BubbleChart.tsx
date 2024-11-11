"use client";

import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { RecallData } from "@/data/types";

// Asegurarse de que highcharts-more se cargue solo en el cliente
let isHighchartsMoreLoaded = false;

const loadHighchartsMore = () => {
  if (typeof window !== "undefined" && !isHighchartsMoreLoaded) {
    const More = require("highcharts/highcharts-more");
    More(Highcharts);
    isHighchartsMoreLoaded = true;
  }
};

interface BubbleChartProps {
  data: RecallData[];
}

const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadHighchartsMore();
  }, []);

  const chartOptions = useMemo(() => {
    if (!isClient) return null;

    const bubbleData = data.map((item) => ({
      x: item["VEHIC-YEAR"], // Año del vehículo
      y: item.POTENTIAL_UNITS_AFFECTED_PRED, // Unidades afectadas
      z: item.vehicle_age_at_recall, // Edad del vehículo en el recall
      name: item.RECALL_TYPE, // Tipo de recall
    }));

    return {
      chart: { type: "bubble", zoomType: "xy" },
      title: { text: "Impacto de Recalls en Vehículos" },
      xAxis: {
        title: { text: "Año del Vehículo" },
      },
      yAxis: {
        title: { text: "Unidades Potenciales Afectadas" },
      },
      tooltip: {
        pointFormat: "Antigüedad: {point.z} años<br/>Unidades: {point.y}",
      },
      series: [
        {
          type: "bubble",
          name: "Recalls",
          data: bubbleData,
          colorByPoint: true, // Cada burbuja tendrá un color distinto
        },
      ],
    };
  }, [data, isClient]);

  if (!isClient) {
    return null; // Evitar renderización en el servidor
  }

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default BubbleChart;
