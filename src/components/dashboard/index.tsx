"use client";

import { useState, useMemo, useEffect } from "react";

import chartDataRaw from "../../data/data.json";
import {
  calculateAverageUnits,
  calculateMostFrequentComponent,
  calculateMostFrequentRecallType,
  calculateTotalUnits,
} from "@/app/helpers";
import { useSearchParams } from "next/navigation";
import Filters from "../ui/Filters.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import RecallsByTypeChart from "../ui/charts/RecallsByTypeChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import Treemap from "../ui/charts/TreeMap";
import RecallsByComponentDonut from "../ui/charts/RecallsByComponentChart";
import StackedAreaChart from "../ui/charts/StackedChart";
import Heatmap from "../ui/charts/ComponentRecallHeatmap";

const chartData = chartDataRaw.map((item) => ({
  ...item,
  vehicle_age_at_recall:
    item.vehicle_age_at_recall < 0
      ? item.vehicle_age_at_recall * -1
      : item.vehicle_age_at_recall,
}));

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [selectedChart, setSelectedChart] = useState<"bar" | "line" | "area">(
    "line"
  );

  const searchParams = useSearchParams();

  const brands = useMemo(() => {
    return Array.from(new Set(chartData.map((item) => item.MAKER)));
  }, [chartData]);

  const models = useMemo(() => {
    return Array.from(new Set(chartData.map((item) => item.MODEL)));
  }, [chartData]);

  const years = useMemo(() => {
    return Array.from(
      new Set(chartData.map((item) => item["VEHIC-YEAR"]))
    ).sort((a, b) => b - a);
  }, [chartData]);

  // Filtrar los datos basados en query params
  const filteredData = useMemo(() => {
    let filtered = chartData;

    const brand = searchParams.get("brand");
    const model = searchParams.get("model");
    const year = searchParams.get("year");

    if (brand) {
      filtered = filtered.filter((item) => item.MAKER === brand);
    }

    if (model) {
      filtered = filtered.filter((item) => item.MODEL === model);
    }

    if (year) {
      filtered = filtered.filter(
        (item) => item["VEHIC-YEAR"] === parseInt(year, 10)
      );
    }

    return filtered;
  }, [searchParams]);

  const TOTAL_UNITS_AFFECTED = calculateTotalUnits(filteredData);
  const AVERAGE_UNITS_AFFECTED = calculateAverageUnits(filteredData);
  const MOST_FREQUENT_COMPONENT = calculateMostFrequentComponent(filteredData);
  const MOST_FREQUENT_RECALL_TYPE =
    calculateMostFrequentRecallType(filteredData);

  if (!isClient) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard de Análisis</h1>
      <div className="sticky top-4 bg-white z-10 p-4 shadow-md rounded-md space-y-8">
        <Filters brands={brands} models={models} years={years} />
        {/* KPIs */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Unidades Afectadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {TOTAL_UNITS_AFFECTED !== null
                  ? TOTAL_UNITS_AFFECTED.toLocaleString()
                  : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Promedio Unidades Afectadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {AVERAGE_UNITS_AFFECTED !== null
                  ? AVERAGE_UNITS_AFFECTED.toLocaleString()
                  : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Componente Más Frecuente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {MOST_FREQUENT_COMPONENT !== null
                  ? MOST_FREQUENT_COMPONENT
                  : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Recall Más Frecuente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {MOST_FREQUENT_RECALL_TYPE}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráfico */}
      <div className="flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[300px] md:w-1/2">
          <CardContent className="pt-6">
            {filteredData.length ? (
              <RecallsByTypeChart data={filteredData} />
            ) : (
              <p>No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[300px] md:w-1/2">
          <CardContent className="pt-6">
            {filteredData.length ? (
              <RecallsByComponentDonut data={filteredData} />
            ) : (
              <p>No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="w-full space-y-4">
              <Select
                value={selectedChart}
                onValueChange={(value) =>
                  setSelectedChart(value as "bar" | "line" | "area")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un tipo de gráfico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Líneas Apiladas</SelectItem>
                  <SelectItem value="bar">Barras Apiladas</SelectItem>
                  <SelectItem value="area">Áreas Apiladas</SelectItem>
                </SelectContent>
              </Select>
              {filteredData.length > 0 ? (
                <StackedAreaChart data={filteredData} type={selectedChart} />
              ) : (
                <p className="text-center text-muted">
                  No hay datos disponibles
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="pt-6">
            {filteredData.length > 0 ? (
              <Heatmap data={filteredData} />
            ) : (
              <p className="text-center text-muted">No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="pt-6">
            {filteredData.length > 0 ? (
              <Treemap data={filteredData} />
            ) : (
              <p className="text-center text-muted">No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Datos */}
      {/*  <Card>
        <CardHeader>
          <CardTitle>Datos Detallados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Marca
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Modelo
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Año
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Score
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Recall
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Confiabilidad
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Seguridad
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Precio
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredData.map((car, index) => (
                  <tr
                    key={index}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">{car.brand}</td>
                    <td className="p-4 align-middle">{car.model}</td>
                    <td className="p-4 align-middle">{car.year}</td>
                    <td className="p-4 align-middle">{car.autoScore}</td>
                    <td className="p-4 align-middle">
                      {(car.recallPrediction * 100).toFixed(1)}%
                    </td>
                    <td className="p-4 align-middle">{car.reliability}</td>
                    <td className="p-4 align-middle">{car.safety}</td>
                    <td className="p-4 align-middle">
                      ${car.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
