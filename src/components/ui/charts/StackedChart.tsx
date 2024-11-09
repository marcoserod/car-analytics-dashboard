import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { mapRecallsByYearAndType } from "./mappers";
import { RecallData } from "@/data/types";

interface StackedAreaChartProps {
  data: RecallData[];
  type: "line" | "bar" | "stacked";
}

const StackedAreaChart: React.FC<StackedAreaChartProps> = ({ data, type }) => {
  const chartOptions = useMemo(() => {
    const recallsByYearType = mapRecallsByYearAndType(data);
    const categories = Array.from(
      new Set(data.map((item) => item.recall_year))
    ).sort();

    return {
      chart: { type },
      title: { text: "Impacto de Recalls por Año y Tipo" },
      xAxis: { categories },
      yAxis: {
        min: 0,
        title: { text: "Unidades Potenciales Afectadas" },
      },
      plotOptions: {
        area: { stacking: "normal" },
      },
      series: Object.keys(recallsByYearType).map((type) => ({
        name: type,
        data: categories.map((year) => recallsByYearType[type][year] || 0),
      })),
    };
  }, [data, type]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default StackedAreaChart;
