import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, ChartOptions, registerables } from "chart.js";
import { CountResponse } from "@/types/response";
import { ParroquiasJSON } from "@/types/parroquia";

Chart.register(...registerables);

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
    // console.log(parroquias_vs_topics);
    parroquias_topicos_counts.map((parroquia) => {
      const labels: string[] = [];
      const numbers: number[] = [];
      parroquia.topicos.map((topico) => {
        labels.push(topico.codigo.toString());
        numbers.push(topico.total);
      });
      data.push({
        title: parroquia.codigo,
        labels: labels, // Etiquetas de parroquias
        datasets: [
          {
            label: "Número de Tweets",
            data: numbers, // Número de tweets por parroquia
            // backgroundColor: [
            //   "rgba(75, 192, 192, 0.2)",
            //   "rgba(54, 162, 235, 0.2)",
            //   "rgba(255, 206, 86, 0.2)",
            //   "rgba(153, 102, 255, 0.2)",
            // ],
            // borderColor: [
            //   "rgba(75, 192, 192, 1)",
            //   "rgba(54, 162, 235, 1)",
            //   "rgba(255, 206, 86, 1)",
            //   "rgba(153, 102, 255, 1)",
            // ],
            borderWidth: 1,
          },
        ],
      });
    });
  }

  console.log(data);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top", // Posición de la leyenda
      },
      title: {
        display: true,
        text: "Número de Tweets por Tópico", // Título del gráfico
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
          text: "Tópicos",
        },
      },
    },
  };

  return (
    <section className="ParroquiasCounts">
      <div className="grid grid-cols-12 gap-4">
        {data.map((dataset, index) => (
          <div key={index} className="col-span-6 ">
            <div className="card bg-base-100 shadow-xl ">
              <div className="card-body">
                <h2 className="card-title">
                  {parroquias_json != undefined ? parroquias_json[dataset.title].nombre.toUpperCase() : ""}
                </h2>
              </div>
              <figure>
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
