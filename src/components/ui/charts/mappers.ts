import { RecallData } from "@/data/types";

export function mapRecallsByType(data: RecallData[]) {
  return data.reduce((acc: Record<string, number>, item) => {
    acc[item.RECALL_TYPE] = (acc[item.RECALL_TYPE] || 0) + 1;
    return acc;
  }, {});
}

export function mapRecallsByComponent(data: RecallData[]) {
  return data.reduce((acc: Record<string, number>, item) => {
    acc[item.COMPONENT] = (acc[item.COMPONENT] || 0) + 1;
    return acc;
  }, {});
}

export function mapRecallsByVehicleYear(data: RecallData[]) {
  return data.reduce((acc: Record<number, number>, item) => {
    acc[item["VEHIC-YEAR"]] = (acc[item["VEHIC-YEAR"]] || 0) + 1;
    return acc;
  }, {});
}

export function mapRecallTrends(data: RecallData[]) {
  return data.reduce((acc: Record<string, number>, item) => {
    const month = item.RECALL_DATE.substring(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
}

export function mapComponentRecallHeatmap(data: RecallData[]) {
  const map: Record<string, number> = {};

  data.forEach((item) => {
    const key = `${item.COMPONENT}-${item.RECALL_TYPE}`;
    map[key] = (map[key] || 0) + 1;
  });

  const categoriesX = Array.from(new Set(data.map((item) => item.COMPONENT)));
  const categoriesY = Array.from(new Set(data.map((item) => item.RECALL_TYPE)));
  const heatmapData: [number, number, number][] = [];

  categoriesX.forEach((component, i) => {
    categoriesY.forEach((recallType, j) => {
      heatmapData.push([i, j, map[`${component}-${recallType}`] || 0]);
    });
  });

  return { categoriesX, categoriesY, heatmapData };
}

/** Mapea los datos para el gráfico de barras apiladas */
export function mapRecallsByYearAndType(data: RecallData[]) {
  return data.reduce((acc, item) => {
    acc[item.RECALL_TYPE] = acc[item.RECALL_TYPE] || {};
    acc[item.RECALL_TYPE][item.recall_year] =
      (acc[item.RECALL_TYPE][item.recall_year] || 0) +
      item.POTENTIAL_UNITS_AFFECTED_PRED;
    return acc;
  }, {});
}

/** Mapea los datos para el gráfico de burbujas */
export function mapBubbleChartData(data: RecallData[]) {
  return data.map((item) => ({
    x: item["VEHIC-YEAR"],
    y: item.POTENTIAL_UNITS_AFFECTED_PRED,
    z: item.vehicle_age_at_recall,
    name: item.RECALL_TYPE,
  }));
}

/** Mapea los datos para el gráfico de series temporales */
export function mapTimeSeriesData(data: RecallData[]) {
  return data.reduce((acc, item) => {
    acc[item.recall_year] =
      (acc[item.recall_year] || 0) + item.POTENTIAL_UNITS_AFFECTED_PRED;
    return acc;
  }, {});
}

/** Mapea los datos para el heatmap */
export function mapHeatmapData(data: RecallData[]) {
  const map: Record<string, number> = {};
  data.forEach((item) => {
    const key = `${item.COMPONENT}-${item.RECALL_TYPE}`;
    map[key] = (map[key] || 0) + item.POTENTIAL_UNITS_AFFECTED_PRED;
  });

  const categoriesX = Array.from(new Set(data.map((item) => item.COMPONENT)));
  const categoriesY = Array.from(new Set(data.map((item) => item.RECALL_TYPE)));
  const heatmapData: [number, number, number][] = [];

  categoriesX.forEach((component, i) => {
    categoriesY.forEach((recallType, j) => {
      heatmapData.push([i, j, map[`${component}-${recallType}`] || 0]);
    });
  });

  return { categoriesX, categoriesY, heatmapData };
}

/** Mapea los datos para el treemap */
export function mapTreemapData(data: RecallData[]) {
  const totalUnits = data.reduce(
    (sum, item) => sum + item.POTENTIAL_UNITS_AFFECTED_PRED,
    0
  );
  const manufacturerData = data.reduce((acc, item) => {
    acc[item.MAKER] =
      (acc[item.MAKER] || 0) + item.POTENTIAL_UNITS_AFFECTED_PRED;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(manufacturerData).map(([name, value]) => ({
    name,
    value,
    percentage: (value / totalUnits) * 100, // Calcula el porcentaje
  }));
}
