import React, { useEffect, useMemo, useState } from "react";
import Chart from "./BaseChart"; // Componente base de Highcharts

import { Button } from "../button";
import { RecallData } from "@/data/types";
import { Slider } from "../slider";
import { PauseIcon, PlayIcon } from "lucide-react";

interface RecallsByComponentDonutProps {
  data: RecallData[];
}

const RecallsByComponentDonut: React.FC<RecallsByComponentDonutProps> = ({
  data,
}) => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [yearIndex, setYearIndex] = useState(0);
  const [uniqueYears, setUniqueYears] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const years = Array.from(
      new Set(data.map((item) => item["VEHIC-YEAR"]))
    ).sort();
    setUniqueYears(years);
    setCurrentYear(years[0]);
  }, [data]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setYearIndex((prev) => {
          const nextIndex = (prev + 1) % uniqueYears.length;
          setCurrentYear(uniqueYears[nextIndex]);
          return nextIndex;
        });
      }, 2000); // Cambia el año cada 2 segundos
    }

    return () => clearInterval(interval);
  }, [isPlaying, uniqueYears]);

  const handleSliderChange = (value: number[]) => {
    const selectedValue = value[0]; // Radix Slider devuelve un array
    setYearIndex(selectedValue);
    setCurrentYear(uniqueYears[selectedValue]);
    setIsPlaying(false); // Pausar la animación si se usa el slider manualmente
  };
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const chartOptions = useMemo(() => {
    if (!currentYear) return null;

    const filteredData = data.filter(
      (item) => item["VEHIC-YEAR"] === currentYear
    );
    const componentCounts = filteredData.reduce(
      (acc: Record<string, number>, item) => {
        acc[item.COMPONENT] = (acc[item.COMPONENT] || 0) + 1;
        return acc;
      },
      {}
    );

    return {
      chart: {
        type: "pie",
      },
      title: {
        text: `Distribución de Recalls por Componente - Año ${currentYear}`,
      },
      plotOptions: {
        pie: {
          innerSize: "50%",
          allowPointSelect: true,
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.y}",
          },
        },
      },
      series: [
        {
          type: "pie",
          name: "Recalls",
          data: Object.entries(componentCounts).map(([key, value]) => ({
            name: key,
            y: value,
          })),
        },
      ],
    } as Highcharts.Options;
  }, [currentYear, data]);

  return (
    <>
      <div className="flex items-center space-x-4 mt-4">
        <Button onClick={togglePlayPause} className="px-4 py-2">
          {isPlaying ? (
            <PauseIcon className="h-6 w-6 text-white" />
          ) : (
            <PlayIcon className="h-6 w-6 text-white" />
          )}
        </Button>
        <Slider
          min={0}
          max={uniqueYears.length - 1}
          value={[yearIndex]}
          onValueChange={handleSliderChange}
          className="flex-1" // Ocupa el espacio restante
        />
      </div>
      {chartOptions && <Chart options={chartOptions} />}
    </>
  );
};

export default RecallsByComponentDonut;
