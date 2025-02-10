import { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend
);

type ComparativeLinesProps = {
  totales_antes?: { total: number }[];
  totales_despues?: { total: number }[];
};

const ComparacionLines: React.FC<ComparativeLinesProps> = ({
  totales_antes,
  totales_despues,
}) => {
  const counts_antes: number[] =
    totales_antes != undefined ? totales_antes.map((total) => total.total) : [];
  const counts_despues: number[] =
    totales_despues != undefined
      ? totales_despues.map((total) => total.total)
      : [];
  const range = Array.from(
    { length: counts_antes.length },
    (_, number) => 1 + number
  );

  const data = {
    labels: range,
    datasets: [
      {
        label: "Antes del evento",
        data: counts_antes,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Después del evento",
        data: counts_despues,
        fill: false,
        borderColor: "rgb(75, 192, 50)",
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 18, // Tamaño de la fuente de la leyenda
            weight: "bold", // Negrita
          },
        },
      },
      title: {
        display: true,
        text: "Comparación Antes y Después del Evento",
        font: {
          size: 22, // Tamaño del título
          weight: "bold", // Negrita
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
      x: {
        title: {
          display: true,
          text: "Número de Observaciones",
          font: {
            size: 18, // Tamaño del título del eje X
            weight: "bold", // Negrita
          },
        },
        ticks: {
          font: {
            size: 16, // Tamaño de etiquetas del eje X
            weight: "bold", // Negrita
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Totales",
          font: {
            size: 18, // Tamaño del título del eje Y
            weight: "bold", // Negrita
          },
        },
        ticks: {
          font: {
            size: 16, // Tamaño de etiquetas del eje Y
            weight: "bold", // Negrita
          },
        },
      },
    },
  };

  return (
    <section className="ComparacionLines">
      <Line data={data} options={options} />
    </section>
  );
};

export default ComparacionLines;
