"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FiltersProps {
  brands: string[];
  models: string[];
  years: number[];
}

const Filters: React.FC<FiltersProps> = ({ brands, models, years }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQueryParam = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { shallow: true, scroll: false });
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      {/* Filtro por Marca */}
      <div className="space-y-2">
        <Label>Marca</Label>
        <Select
          onValueChange={(value) => updateQueryParam("brand", value)}
          value={searchParams.get("brand") || "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar Marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {brands.map((brand) => (
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
          onValueChange={(value) => updateQueryParam("model", value)}
          value={searchParams.get("model") || "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar Modelo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los modelos</SelectItem>
            {models.map((model) => (
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
            {years.map((year) => (
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
