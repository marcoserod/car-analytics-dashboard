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
      chart: { type: "bar" },
      title: { text: "Distribución de Recalls por Tipo" },
      xAxis: {
        categories: Object.keys(mappedData),
        title: { text: "Tipo de Recall" },
      },
      yAxis: { title: { text: "Cantidad" } },
      series: [
        {
          type: "bar",
          name: "Recalls",
          data: Object.values(mappedData),
        },
      ],
    } as Highcharts.Options;
  }, [data]);

  return <Chart options={chartOptions} />;
};

export default RecallsByTypeChart;
