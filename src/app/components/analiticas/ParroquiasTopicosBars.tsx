import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, ChartOptions, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CountResponse } from "@/types/response";
import { ParroquiasJSON } from "@/types/parroquia";

Chart.register(...registerables, ChartDataLabels);

type ParroquiasTopicosBarsProps = {
  parroquias_topicos_counts?: {
    codigo: number;
    topicos: CountResponse[];
  }[];
  parroquias_json?: ParroquiasJSON;
};

const ParroquiasTopicosBars: React.FC<ParroquiasTopicosBarsProps> = ({
  parroquias_topicos_counts, parroquias_json
}) => {
  const data: {
    title: number,
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderWidth: number;
    }[];
  }[] = [];

  if (parroquias_topicos_counts != undefined) {
    parroquias_topicos_counts.forEach((parroquia) => {
      const labels: string[] = [];
      const numbers: number[] = [];
      parroquia.topicos.forEach((topico) => {
        labels.push(topico.codigo.toString());
        numbers.push(topico.total);
      });

      data.push({
        title: parroquia.codigo,
        labels: labels,
        datasets: [
          {
            label: "Número de Tweets",
            data: numbers,
            borderWidth: 1,
          },
        ],
      });
    });
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 18,
            weight: "bold",
          },
        },
      },
      title: {
        display: true,
        text: "Número de Tweets por Tópico",
        font: {
          size: 22,
          weight: "bold",
        },
      },
      datalabels: {
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'top',
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
          text: "Número de Tweets",
          font: {
            size: 18,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Tópicos",
          font: {
            size: 18,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <section className="ParroquiasCounts">
      <div className="grid grid-cols-12 gap-4">
        {data.map((dataset, index) => (
          <div key={index} className="col-span-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  {parroquias_json != undefined
                    ? parroquias_json[dataset.title].nombre.toUpperCase()
                    : ""}
                </h2>
              </div>
              <figure className="h-[400px] w-full p-4">
                <Bar data={dataset} options={options} />
              </figure>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ParroquiasTopicosBars;
