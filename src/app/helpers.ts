export interface RecallData {
  recall_year: number;
  COMPONENT: string;
  RECALL_TYPE: string;
  POTENTIAL_UNITS_AFFECTED_PRED: number;
}

/** Calcula el promedio de unidades afectadas, o devuelve 0 si no hay datos */
export function calculateAverageUnits(data: RecallData[]): number {
  if (data.length === 0) return 0;

  const totalUnits = data.reduce(
    (sum, item) => sum + item.POTENTIAL_UNITS_AFFECTED_PRED,
    0
  );
  return totalUnits / data.length;
}

/** Calcula el total de unidades afectadas, o devuelve 0 si no hay datos */
export function calculateTotalUnits(data: RecallData[]): number {
  if (data.length === 0) return 0;

  return data.reduce(
    (sum, item) => sum + item.POTENTIAL_UNITS_AFFECTED_PRED,
    0
  );
}

/** Calcula la cantidad de recalls por año, o devuelve un objeto vacío si no hay datos */
export function calculateRecallsByYear(
  data: RecallData[]
): Record<number, number> {
  if (data.length === 0) return {};

  return data.reduce((acc, item) => {
    acc[item.recall_year] = (acc[item.recall_year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
}

/** Devuelve el componente más frecuente, o "N/A" si no hay datos */
export function calculateMostFrequentComponent(data: RecallData[]): string {
  if (data.length === 0) return "N/A";

  const recallsByComponent = data.reduce((acc, item) => {
    acc[item.COMPONENT] = (acc[item.COMPONENT] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(recallsByComponent).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];
}

/** Devuelve el tipo de recall más frecuente, o "N/A" si no hay datos */
export function calculateMostFrequentRecallType(data: RecallData[]): string {
  if (data.length === 0) return "N/A";

  const recallsByType = data.reduce((acc, item) => {
    acc[item.RECALL_TYPE] = (acc[item.RECALL_TYPE] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(recallsByType).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];
}
