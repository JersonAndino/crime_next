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
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  console.log(range); // Salida: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
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
        label: "Despues del evento",
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
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Comparación Antes y Después del Evento",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Número de Observaciones",
        },
      },
      y: {
        title: {
          display: true,
          text: "Totales",
        },
      },
    },
  };
  return (
    <section className="ComparacionLines">
      <Line data={data} options={options}/>
    </section>
  );
};

export default ComparacionLines;
