import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useState, useEffect } from "react";
import { ParroquiaResponse } from "@/types/response";
import { ParroquiasJSON } from "@/types/parroquia";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ParroquiasBarsProps = {
  parroquias_counts?: ParroquiaResponse[];
  parroquias_json?: ParroquiasJSON;
};

//   type ParroquiasMap = {
//     [key: number]: ParroquiaSVG;
//   };

const ParroquiasBars: React.FC<ParroquiasBarsProps> = ({
  parroquias_counts,
  parroquias_json,
}) => {
  const [chartColors, setChartColors] = useState<string[]>([]);
  const labels: string[] = [];
  const numbers: number[] = [];
  useEffect(() => {
    if (typeof window !== "undefined") {
      const getCSSVariable = (variable: string): string =>
        getComputedStyle(document.documentElement)
          .getPropertyValue(variable)
          .trim();
      const convertOklchToRgb = (color_lhc: string): string => {
        const l = parseFloat(color_lhc.split(" ")[0]) / 100;
        const c = parseFloat(color_lhc.split(" ")[1]);
        const h = parseFloat(color_lhc.split(" ")[2]);
        const hue = h * (Math.PI / 180); // Convertir a radianes
        const r = Math.max(0, Math.min(1, l + c * Math.cos(hue)));
        const g = Math.max(0, Math.min(1, l + c * Math.sin(hue)));
        const b = Math.max(0, Math.min(1, l - c)); // Simplificación
        return `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
      };
      const colors = [
        getCSSVariable("--n"),
        getCSSVariable("--b1"),
        getCSSVariable("--b2"),
        getCSSVariable("--b3"),
      ];
      console.log(colors);
      const colorsRGB: string[] = []
      colors.forEach((color) => {
        colorsRGB.push(`oklch(${color})`)
        // colorsRGB.push(convertOklchToRgb(color))
      })
      setChartColors(colorsRGB);
      console.log(colorsRGB);
    }
  }, []);

  if (parroquias_counts != undefined && parroquias_json != undefined) {
    parroquias_counts.forEach((parroquia) => {
      labels.push(parroquias_json[parroquia.codigo].nombre);
      numbers.push(parroquia.total);
    });
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Número de Tweets",
        data: numbers,
        backgroundColor: chartColors,
        borderColor: chartColors,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top", // Posición de la leyenda
      },
      title: {
        display: true,
        text: "Número de Tweets por parroquia", // Título del gráfico
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Comienza el eje Y desde 0
        title: {
          display: true,
          text: "Número de Tweets",
        },
      },
      x: {
        title: {
          display: true,
          text: "Topicos",
        },
      },
    },
  };

  return (
    <div className="h-[800px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ParroquiasBars;
