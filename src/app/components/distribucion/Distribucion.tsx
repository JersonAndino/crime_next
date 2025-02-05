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

      const fixedColors = [
        "rgb(54, 162, 235)",  // Azul estándar
        "rgb(75, 192, 192)",  // Verde azulado
        "rgb(153, 204, 255)", // Azul claro pastel
        "rgb(0, 119, 182)",   // Azul oscuro intenso
        "rgb(173, 216, 230)", // Azul cielo claro
        "rgb(30, 144, 255)",  // Azul Dodger
        "rgb(0, 180, 216)",   // Azul brillante
        "rgb(135, 206, 250)", // Azul claro cielo
        "rgb(72, 202, 228)",  // Turquesa claro
        "rgb(2, 62, 138)",    // Azul marino oscuro
        "rgb(201, 203, 207)", // Gris claro neutro
        "rgb(70, 130, 180)",  // Azul acero
        "rgb(176, 224, 230)", // Azul claro pálido
        "rgb(123, 104, 238)", // Azul púrpura (Blue Violet)
        "rgb(0, 191, 255)",   // Azul cielo profundo
      ];
      
      
      const generateFixedColors = (numColors: number) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
          colors.push(fixedColors[i % fixedColors.length]); // Ciclar colores
        }
        return colors;
      };
      
      const data1 = {
        labels: labels, // Define las etiquetas de tu gráfico
        datasets: [
          {
            label: "Distribucion",
            data: counts, // Define los datos
            backgroundColor: generateFixedColors(counts.length), // Usar la paleta de colores fija
            hoverOffset: 20,
          },
        ],
      };
      

  const options: ChartOptions<"pie"> = {
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        color: "rgb(0,0,0)",
        font: {
          size: 15,
          weight: "bold",
        },
        formatter: (value, context) => {
        const index = context.dataIndex; // Obtén el índice del dato actual
        const topicNumber = context.chart.data.labels
          ? context.chart.data.labels[index]
          : index; // Asume que las etiquetas son los números de tópico
        const percentage = (
          (parseFloat(value) * 100) /
          parseFloat(total != undefined ? total.toString() : "100")
        ).toFixed(1);
        return `${percentage}%`; // Muestra número de tópico y porcentaje
      },
      },
    },
  };

  return (
    <section className="CrimeDistributionAll">
      <div className="crimeDistributionElementPieChartAll w-[700px] m-auto">
        <Pie data={data1} options={options} />
      </div>
    </section>
  );
};

export default Distribucion;