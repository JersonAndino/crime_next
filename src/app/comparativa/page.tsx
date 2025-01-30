"use client";
import { useState, useEffect } from "react";
import { Topico } from "@/types/topico";
import { Parroquia } from "@/types/parroquia";
import { fetchTopicos } from "@/services/topicoService";
import { fetchParroquias } from "@/services/parroquiaService";
import { PostComparacionResponse } from "@/types/response";
import ComparacionLines from "../components/comparativa/ComparacionLineas";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import ApiService from "@/services/hechoService";
import ComparacionLineasCompleto from "../components/comparativa/ComparacionLineasCompleto";
export default function ComparativaTab() {
  const [fechaInicio, setFechaInicio] = useState("2024-01-01");
  const [fechaFin, setFechaFin] = useState("");
  const [parroquias, setParroquias] = useState<Parroquia[]>([]);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [loadingParroquias, setLoadingParroquias] = useState<boolean>(false);
  const [loadingTopicos, setLoadingTopicos] = useState<boolean>(false);
  const [errorParroquias, setErrorParroquias] = useState<string | null>(null);
  const [errorTopicos, setErrorTopicos] = useState<string | null>(null);


  const [selectedTopic, setSelectedTopic] = useState(2);
  const [selectedParroquia, setSelectedParroquia] = useState(0);

  const [meses, setMeses] = useState(2);
  const [data, setData] = useState<PostComparacionResponse>();

  const [grafica, setGrafica] = useState(false);

  useEffect(() => {
    const loadParroquias = async () => {
      setLoadingParroquias(true);
      setErrorParroquias(null);
      try {
        const data = await fetchParroquias();
        if (data.data.length == 0){
          setErrorParroquias("Error al recuperar la información.")
        }else{
          setParroquias(data.data);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorParroquias(err.message);
        } else {
          setErrorParroquias("Ocurrió un error inesperado.");
        }
      } finally {
        setLoadingParroquias(false);
      }
    };

    loadParroquias();
  }, []);

  useEffect(() => {
    const loadTopicos = async () => {
      setLoadingTopicos(true);
      setErrorTopicos(null);
      try {
        const data = await fetchTopicos();
        if (data.data.length == 0){
          setErrorTopicos("Error al recuperar la información.")
        }else{
          setTopicos(data.data);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorTopicos(err.message);
        } else {
          setErrorTopicos("Ocurrió un error inesperado.");
        }
      } finally {
        setLoadingTopicos(false);
      }
    };

    loadTopicos();
  }, []);

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = {
          fecha_inicio: fechaInicio,
          selected_parroquia: selectedParroquia,
          selected_topico: selectedTopic,
          meses: meses,
        };

        const response = await ApiService.post<PostComparacionResponse>(
          "/api/hechos_comparativa/",
          data
        );
        setData(response);
      } catch (error) {
        console.error("Error al enviar datos:", error);
      }
    };
    sendData();
  }, [selectedTopic, selectedParroquia, fechaInicio, meses]);

  const handleFechaInicioChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setFechaInicio(value);
    if (fechaFin && value > fechaFin) {
      setFechaFin(value);
    }
  };

  const handleMesesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMeses(parseInt(value));
  };
  
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sendData = async () => {
      try {
        const data = {
          fecha_inicio: fechaInicio,
          selected_parroquia: selectedParroquia,
          selected_topico: selectedTopic,
          meses: meses,
        };

        const response = await ApiService.post<PostComparacionResponse>(
          "/api/hechos_comparativa/",
          data
        );
        setData(response);
      } catch (error) {
        console.error("Error al enviar datos:", error);
      }
    };
    sendData();
  };

  const handleClickRadioTopico = (
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    const inputElement = event.target as HTMLInputElement;
    setSelectedTopic(parseInt(inputElement.value));
  };

  const handleClickRadioParroquia = (
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    const inputElement = event.target as HTMLInputElement;
    setSelectedParroquia(parseInt(inputElement.value));
  };
  
  const handleCheckboxGraficaChange = () => {
    setGrafica(!grafica);
  };

  return (
    <div className="grid grid-cols-12">
      <div className="flex w-full col-span-3 min-h-[776px]">
        <div className="space-y-6 min-w-[357.66px]">
          <div>
            <div className="collapse-title text-xl font-medium">Fechas</div>
            <div>
              <label htmlFor="fechaInicio">Fecha Inicio:</label>
              <input
                className="input w-full max-w-xs"
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={fechaInicio}
                max={fechaFin || getCurrentDate()}
                onChange={handleFechaInicioChange}
              />
            </div>
            <div>
              <label htmlFor="meses">Meses:</label>
              <input
                className="input w-full max-w-xs"
                type="number"
                id="meses"
                name="meses"
                value={meses}
                min="1"
                onChange={handleMesesChange}
              />
            </div>
          </div>
          <div className="divider m-0"></div>
          <form onSubmit={handleSubmit}>
            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="accordion-parroquias" defaultChecked />
              <div className="collapse-title text-xl font-medium">
                Parroquias
              </div>
              <div className="collapse-content">
                <div className="h-96 overflow-y-auto">
                  {loadingParroquias && <SkeletonLoader />}
                  {errorParroquias && (
                    <p className="text-red-500">
                      Error al cargar las parroquias
                    </p>
                  )}
                  {!loadingParroquias && !errorParroquias && (
                    <div className="">
                      {parroquias.map((item) => (
                        <div key={item.codigo}>
                          <label className="label cursor-pointer">
                            <span className="label-text">
                              {item.nombre.toUpperCase()}
                            </span>
                            <input
                              type="radio"
                              name="parroquia"
                              value={item.codigo}
                              onClick={handleClickRadioParroquia}
                              defaultChecked = {selectedParroquia == item.codigo}
                              className="radio"
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="divider m-0"></div>
            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="accordion-parroquias" />
              <div className="collapse-title text-xl font-medium">Topicos</div>
              <div className="collapse-content">
                <div className="h-96 overflow-y-auto">
                  {loadingTopicos && <SkeletonLoader />}
                  {errorTopicos && (
                    <p className="text-red-500">Error al cargar los topicos</p>
                  )}
                  {!loadingTopicos && !errorTopicos && (
                    <div className="">
                      {topicos.map((topico) => (
                        <div key={topico.codigo}>
                          <label className="label cursor-pointer">
                            <span className="label-text">{topico.nombre}</span>
                            <input
                              type="radio"
                              name="topico"
                              value={topico.codigo}
                              onClick={handleClickRadioTopico}
                              defaultChecked = {selectedTopic == topico.codigo}
                              // checked={selectedTopico === topico.id_topico.toString()}
                              className="radio"
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button className="btn btn-neutral  bottom-6 " type="submit">
              Enviar
            </button>
          </form>
        </div>
        <div className="divider divider-horizontal m-0"></div>
      </div>
      <div className="col-span-9 grid grid-cols-12">
        <div className="col-span-12">
          <h1 className=" text-xl font-medium">
            VISUALIZACION DE TOPICOS POR PARROQUIA
          </h1>
          <p className="px-[100px] py-[20px]">
            Este módulo te permite analizar cómo han cambiado los tweets
            relacionados con delincuencia en Quito antes y después de un evento
            específico. Puedes visualizar una gráfica con dos líneas: una
            muestra el comportamiento de los tweets antes del evento y la otra
            después.
          </p>
        </div>
        <div className="col-span-12 grid grid-cols-10">
          <div className="col-span-4">
            <div className="stats w-full">
              <div className="stat">
                <div className="stat-title text-right">
                  Tweets Totales Antes del Evento
                </div>
                <div className="stat-value text-right">
                  {data?.data.total_antes}
                </div>
                {/* <div className="stat-value text-right">100</div> */}
                {/* <div className="stat-desc">21% more than last month</div> */}
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="stats w-full bg-base-300">
              <div className="stat">
                <div className="stat-title text-center">FECHA ANALIZADA</div>
                <div className="stat-value text-center">{fechaInicio}</div>
                {/* <div className="stat-desc">21% more than last month</div> */}
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <div className="stats w-full">
              <div className="stat">
                <div className="stat-title">
                  Tweets Totales Después del evento
                </div>
                <div className="stat-value">{data?.data.total_despues}</div>
                {/* <div className="stat-value">200</div> */}
                {/* <div className="stat-desc">21% more than last month</div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 grid grid-cols-12">
          <div className="col-span-12">
            {grafica ? (
              <ComparacionLines
                totales_antes={data?.data.totales_antes}
                totales_despues={data?.data.totales_despues}
              />
            ) : (
              <ComparacionLineasCompleto
                totales_antes={data?.data.totales_antes}
                totales_despues={data?.data.totales_despues}
              />
            )}
          </div>
          <div className="col-span-12 grid grid-cols-11">
            <div className="col-start-4 col-span-2 text-right">
              <h1>Grafica superpuesta</h1>
            </div>
            <div className="col-span-1 m-auto text-center">
              <input
                type="checkbox"
                className="toggle border-neutral bg-blue-neutral [--tglbg:gray] hover:bg-neutral m-auto"
                defaultChecked
                onChange={handleCheckboxGraficaChange}
              />
            </div>
            <div className="col-span-2">
              <h1>Grafica completa</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
