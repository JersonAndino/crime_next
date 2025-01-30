import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";
import { CountResponse } from "@/types/response";
import { TopicosJSON } from "@/types/topico";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type DistribucionProps = {
  topicos_counts?: CountResponse[];
  topicos_json?: TopicosJSON;
  total?: number;
};

const Distribucion: React.FC<DistribucionProps> = ({
  topicos_counts,
  topicos_json,
  total,
}) => {
  //   const topics:  = [];
  const counts: number[] =
    topicos_counts != undefined
      ? topicos_counts.map((topico) => topico.total)
      : [];

  const labels: string[] =
    topicos_counts != undefined && topicos_json != undefined
      ? topicos_counts.map(
          (topico) => `${topico.codigo}. ${topicos_json[topico.codigo].nombre}`
        )
      : [];

  const data1 = {
    labels: labels,
    datasets: [
      {
        label: "Distribucion",

        data: counts,
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(3,4,94)",
          "rgb(2,62,138)",
          "rgb(0,119,182)",
          "rgb(0,150,199)",
          "rgb(0,180,216)",
          "rgb(72,202,228)",
          "rgb(144,224,239)",
          "rgb(173,232,244)",
          "rgb(202,240,248)",
        ],
        hoverOffset: 20,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "rgb(0,0,0)",
        font: {
          size: 20,
          weight: "bold",
        },
        formatter: (value) => {
          return (
            ((parseFloat(value) * 100) / parseFloat(total != undefined ? total.toString() : '100')).toFixed(1) + "%"
          );
        },
      },
    },
  };

  return (
    <section className="CrimeDistributionAll">
      <div className="crimeDistributionElementPieChartAll w-[600px] m-auto">
        <Pie data={data1} options={options} />
      </div>
    </section>
  );
};

export default Distribucion;