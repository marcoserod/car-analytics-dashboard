"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RecallData } from "@/data/types";

interface FiltersProps {
  chartData: RecallData[];
}

const Filters: React.FC<FiltersProps> = ({ chartData }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Obtener valores actuales de los filtros desde los parámetros de búsqueda
  const currentBrand = searchParams.get("brand") || "all";
  const currentModel = searchParams.get("model") || "all";

  // Construir un diccionario jerárquico Marca -> Modelo -> Año
  const dataDict = useMemo(() => {
    const dict: Record<string, Record<string, number[]>> = {};

    chartData.forEach((item) => {
      const brand = item.MAKER;
      const model = item.MODEL;
      const year = item["VEHIC-YEAR"];

      if (!dict[brand]) {
        dict[brand] = {};
      }

      if (!dict[brand][model]) {
        dict[brand][model] = [];
      }

      if (!dict[brand][model].includes(year)) {
        dict[brand][model].push(year);
      }
    });

    return dict;
  }, [chartData]);

  console.log(dataDict); // Verificación de la estructura

  // Obtener todas las marcas ordenadas ascendentemente
  const availableBrands = useMemo(() => {
    return Object.keys(dataDict).sort((a, b) => a.localeCompare(b));
  }, [dataDict]);

  // Filtrar modelos según la marca seleccionada o mostrar todos si no hay marca seleccionada
  const availableModels = useMemo(() => {
    if (currentBrand !== "all" && dataDict[currentBrand]) {
      return Object.keys(dataDict[currentBrand]).sort((a, b) =>
        a.localeCompare(b)
      );
    }
    return Object.values(dataDict)
      .flatMap((models) => Object.keys(models))
      .sort((a, b) => a.localeCompare(b));
  }, [currentBrand, dataDict]);

  // Filtrar años según la marca y modelo seleccionados o mostrar todos si no hay modelo seleccionado
  const availableYears = useMemo(() => {
    if (
      currentBrand !== "all" &&
      currentModel !== "all" &&
      dataDict[currentBrand]?.[currentModel]
    ) {
      return dataDict[currentBrand][currentModel].sort((a, b) => b - a);
    }
    return Object.values(dataDict)
      .flatMap((models) => Object.values(models).flat())
      .sort((a, b) => b - a);
  }, [currentBrand, currentModel, dataDict]);

  const updateQueryParam = (
    key: string,
    value: string | number | null,
    resetKeys: string[] = []
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }

    // Eliminar las claves dependientes
    resetKeys.forEach((resetKey) => params.delete(resetKey));

    router.push(`?${params.toString()}`, { shallow: true, scroll: false });
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      {/* Filtro por Marca */}
      <div className="space-y-2">
        <Label>Marca</Label>
        <Select
          onValueChange={
            (value) => updateQueryParam("brand", value, ["model", "year"]) // Resetear modelo y año
          }
          value={currentBrand}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar Marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {availableBrands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Modelo */}
      <div className="space-y-2">
        <Label>Modelo</Label>
        <Select
          onValueChange={
            (value) => updateQueryParam("model", value, ["year"]) // Resetear año
          }
          value={currentModel}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar Modelo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los modelos</SelectItem>
            {Array.from(new Set(availableModels)).map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Año */}
      <div className="space-y-2">
        <Label>Año</Label>
        <Select
          onValueChange={(value) =>
            updateQueryParam("year", value !== "all" ? Number(value) : null)
          }
          value={searchParams.get("year") || "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar Año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los años</SelectItem>
            {Array.from(new Set(availableYears)).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filters;
