// src/components/ui/Chart.tsx
"use client";

import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

interface ChartProps {
  options: Highcharts.Options;
}

const Chart: React.FC<ChartProps> = ({ options }) => {
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Chart;
