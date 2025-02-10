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
    labels: labels,
    datasets: [
      {
        label: "Distribución",
        data: counts,
        backgroundColor: generateFixedColors(counts.length),
        hoverOffset: 20,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false, // Permite un tamaño fijo sin importar la leyenda
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 18, // Tamaño de fuente de la leyenda
            weight: "bold",
          },
        },
      },
      datalabels: {
        color: "rgb(0,0,0)",
        font: {
          size: 18, // Aumentar tamaño de etiquetas
          weight: "bold",
        },
        formatter: (value, context) => {
          const index = context.dataIndex;
          const percentage = (
            (parseFloat(value) * 100) /
            parseFloat(total != undefined ? total.toString() : "100")
          ).toFixed(1);
          return `${percentage}%`; // Mostrar porcentaje
        },
      },
    },
  };

  return (
    <section className="CrimeDistributionAll">
      <div 
        className="crimeDistributionElementPieChartAll m-auto"
        style={{ width: "700px", height: "900px" }} // Tamaño fijo
      >
        <Pie data={data1} options={options} />
      </div>
    </section>
  );
};

export default Distribucion;
