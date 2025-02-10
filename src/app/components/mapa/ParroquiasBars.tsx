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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useState, useEffect } from "react";
import { CountResponse } from "@/types/response";
import { ParroquiasJSON } from "@/types/parroquia";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend
);

type ParroquiasBarsProps = {
  parroquias_counts?: CountResponse[];
  parroquias_json?: ParroquiasJSON;
};

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
      
      const colors = [
        getCSSVariable("--n"),
        // getCSSVariable("--b1"),
        // getCSSVariable("--b2"),
        // getCSSVariable("--b3"),
      ];
      
      const colorsRGB: string[] = colors.map((color) => `oklch(${color})`);
      setChartColors(colorsRGB);
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
        display: false,
        position: "top",
        labels: {
          font: {
            size: 20, // Mayor tamaño para la leyenda
            weight: "bold",
          },
        },
      },
      title: {
        display: true,
        text: "Número de Tweets por parroquia",
        font: {
          size: 22, // Mayor tamaño del título
          weight: "bold",
        },
      },
      datalabels: {
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'end',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Parroquias",
          font: {
            size: 20, // Mayor tamaño para el título del eje Y
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 20, // Mayor tamaño de etiquetas del eje Y
            weight: "bold",
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Número de tweets",
          font: {
            size: 18, // Mayor tamaño para el título del eje X
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 16, // Mayor tamaño de etiquetas del eje X
            weight: "bold",
          },
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
