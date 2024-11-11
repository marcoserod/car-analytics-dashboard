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
import StackedAreaChart from "../ui/charts/StackedChart";
import Heatmap from "../ui/charts/ComponentRecallHeatmap";
import HeatmapByYear from "../ui/charts/HeatmapByYear";
import BubbleChart from "../ui/charts/BubbleChart";

const chartData = chartDataRaw.map((item) => ({
  ...item,
  vehicle_age_at_recall:
    item.vehicle_age_at_recall < 0
      ? item.vehicle_age_at_recall * -1
      : item.vehicle_age_at_recall,
}));
const relevantMakers = [
  "Ford",
  "Chevrolet",
  "Nissan",
  "Toyota",
  "Honda",
  "Volkswagen",
  "BMW",
  "Jeep",
  "GMC",
  "Dodge",
  "Kia",
  "Mazda",
  "Audi",
  "Volvo",
  "Tesla",
  "Fiat",
  "Peugeot",
  "Suzuki",
].map((brand) => brand.toLowerCase()); // Convertir todas las marcas a minúsculas

console.log(
  chartData.filter((item) => relevantMakers.includes(item.MAKER.toLowerCase()))
);

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [selectedChart, setSelectedChart] = useState<"bar" | "line" | "area">(
    "line"
  );

  const searchParams = useSearchParams();

  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const year = searchParams.get("year");

  // Filtrar los datos basados en query params
  const filteredData = useMemo(() => {
    let filtered = chartData;

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
  }, [brand, model, year]);

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
      <div className="sticky top-4 bg-white z-10 p-4 shadow-md rounded-md space-y-8">
        <Filters chartData={chartData} />
      </div>
      {/* KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Componente Más Frecuente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {MOST_FREQUENT_COMPONENT !== null ? MOST_FREQUENT_COMPONENT : "N/A"}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico */}
      <div className="flex flex-wrap gap-4">
        <Card className="md:w-1/3">
          <CardContent className="pt-6">
            {filteredData.length ? (
              <RecallsByTypeChart data={filteredData} />
            ) : (
              <p>No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>
        <Card className="flex-1  md:w-2/3">
          <CardContent className="pt-6">
            {!brand && !model ? (
              filteredData.length > 0 ? (
                <Treemap data={filteredData} />
              ) : (
                <p className="text-center text-muted">
                  No hay datos disponibles
                </p>
              )
            ) : !year ? (
              filteredData.length ? (
                <HeatmapByYear data={filteredData} />
              ) : (
                <p>No hay datos disponibles</p>
              )
            ) : filteredData.length > 0 ? (
              <Heatmap data={filteredData} />
            ) : (
              <p className="text-center text-muted">No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>

        {!year ? (
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
                    <SelectItem value="area">Áreas Apiladas</SelectItem>
                    <SelectItem value="bar">Barras Apiladas</SelectItem>
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
        ) : null}
        {!year && brand ? (
          <Card className="w-full">
            <CardContent className="pt-6">
              {filteredData.length ? (
                <BubbleChart data={filteredData} />
              ) : (
                <p>No hay datos disponibles</p>
              )}
            </CardContent>
          </Card>
        ) : null}
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
