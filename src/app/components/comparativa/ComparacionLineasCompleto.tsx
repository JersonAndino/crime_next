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
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from "react-chartjs-2";

// Registrar los componentes necesarios, incluido el plugin de anotaciones
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

type ComparativeLineasCompletoProps = {
  totales_antes?: { total: number }[];
  totales_despues?: { total: number }[];
};

const ComparacionLineasCompleto: React.FC<ComparativeLineasCompletoProps> = ({
  totales_antes,
  totales_despues,
}) => {
  const counts_antes: (number|null)[] = [];
  const counts_despues: (number|null)[] = [];

  if (totales_antes != undefined) {
    totales_antes.map((total, index) => {
      if (index === totales_antes.length - 1) {
        counts_antes.push(total.total);
        counts_despues.push(total.total);
      } else {
        counts_antes.push(total.total);
        counts_despues.push(null);
      }
    });
  }
  if (totales_despues != undefined) {
    totales_despues.map((total) => {
      counts_antes.push(null);
      counts_despues.push(total.total);
    });
  }

  const range = Array.from(
    { length: counts_antes.length },
    (_, number) => 1 + number
  );

  const posicion: number = totales_antes != undefined ? totales_antes?.length - 1: 0; 

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

  // Opciones del gráfico con la anotación
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
      annotation: {
        annotations: {
          verticalLine: {
            type: "line",
            xMin: posicion, // Posición de la línea en el eje x
            xMax: posicion, // Mismo valor para que sea una línea vertical
            borderColor: "red",
            borderWidth: 3,
            label: {
              content: "Evento",
            //   enabled: true,
              position: "start",
              backgroundColor: "rgba(255, 99, 132, 0.8)",
            },
          },
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

export default ComparacionLineasCompleto;
