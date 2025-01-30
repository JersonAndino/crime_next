"use client";
import { useState, useEffect } from "react";
import { Topico } from "@/types/topico";
import { Parroquia, ParroquiasJSON } from "@/types/parroquia";
import { fetchTopicos } from "@/services/topicoService";
import { fetchParroquias } from "@/services/parroquiaService";
import { PostAnaliticResponse } from "@/types/response";

import ParroquiasTopicosBars from "../components/analiticas/ParroquiasTopicosBars";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import ApiService from "@/services/hechoService";

export default function ParroquiasTab() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [parroquias, setParroquias] = useState<Parroquia[]>([]);
  const [parroquiasJSON, setParroquiasJSON] = useState<ParroquiasJSON>();
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [loadingParroquias, setLoadingParroquias] = useState<boolean>(false);
  const [loadingTopicos, setLoadingTopicos] = useState<boolean>(false);
  const [errorParroquias, setErrorParroquias] = useState<string | null>(null);
  const [errorTopicos, setErrorTopicos] = useState<string | null>(null);

  const [selectedTopics, setSelectedTopics] = useState([1]);
  const [selectedParroquias, setSelectedParroquias] = useState([1]);
  const [data, setData] = useState<PostAnaliticResponse>();
  // const [loadingData, setLoadingData] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<string | null>(null);

  useEffect(() => {
    const loadParroquias = async () => {
      setLoadingParroquias(true);
      setErrorParroquias(null);
      try {
        const data = await fetchParroquias();
        if (data.data.length == 0){
          setErrorParroquias("Error al recuperar la información.");
        }else{
          const parroquiasJson: ParroquiasJSON = {};
          data.data.forEach((parroquia) => {
            parroquiasJson[parroquia.codigo] = parroquia;
          });
          setParroquiasJSON(parroquiasJson);
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
      setErrorData(null);
      try {
        const data = {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          topicos: selectedTopics,
          parroquias: selectedParroquias,
        };

        const response = await ApiService.post<PostAnaliticResponse>(
          "/api/hechos_analitica/",
          data
        );
        console.log(response.data.parroquias_topicos_counts.length);
        if (response.data.parroquias_topicos_counts.length == 0) {
          setErrorData("Error al recuperar la información.")
        }else{
          setData(response);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorData(err.message);
          console.error("Error al enviar datos:", err.message);
        } else {
          setErrorData("Ocurrió un error inesperado.");
        }
      }
    };
    sendData();
  }, [selectedTopics, selectedParroquias, fechaInicio, fechaFin]);

  const handleFechaInicioChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setFechaInicio(value);
    if (fechaFin && value > fechaFin) {
      setFechaFin(value);
    }
  };

  const handleFechaFinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFechaFin(value);
    if (fechaInicio && value < fechaInicio) {
      setFechaInicio(value);
    }
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
          fecha_fin: fechaFin,
          topicos: selectedTopics,
          parroquias: selectedParroquias,
        };

        const response = await ApiService.post<PostAnaliticResponse>(
          "/api/hechos_analitica/",
          data
        );
        setData(response);
      } catch (error) {
        console.error("Error al enviar datos:", error);
      }
    };
    sendData();
  };

  const toggleSelectAllTopics = () => {
    if (selectedTopics.length === topicos.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(topicos.map((item) => item.codigo));
    }
  };

  const handleCheckboxTopicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;

    setSelectedTopics((prevState) =>
      checked
        ? [...prevState, parseInt(name)]
        : prevState.filter((item) => item !== parseInt(name))
    );
  };

  const toggleSelectAllParroquias = () => {
    if (selectedParroquias.length === parroquias.length) {
      setSelectedParroquias([]);
    } else {
      setSelectedParroquias(parroquias.map((item) => item.codigo));
    }
  };

  const handleCheckboxParroquiaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;

    setSelectedParroquias((prevState) =>
      checked
        ? [...prevState, parseInt(name)]
        : prevState.filter((item) => item !== parseInt(name))
    );
  };

  const isSelectAllTopicosChecked = selectedTopics.length === topicos.length;
  const isSelectAllParroquiasChecked =
    selectedParroquias.length === parroquias.length;

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
              <label htmlFor="fechaFin">Fecha Fin:</label>
              <input
                className="input w-full max-w-xs"
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={fechaFin}
                min={fechaInicio}
                max={getCurrentDate()}
                onChange={handleFechaFinChange}
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
                    <p className="text-red-500 p-[10px]">
                      Error al cargar las parroquias
                    </p>
                  )}
                  {!loadingParroquias && !errorParroquias && (
                    <div className="">
                      <div>
                        <label className="label cursor-pointer">
                          <span className="label-text">
                            {isSelectAllParroquiasChecked
                              ? "Deseleccionar todas las parroquias"
                              : "Seleccionar todas las parroquias"}
                          </span>
                          <input
                            className="checkbox"
                            type="checkbox"
                            checked={isSelectAllParroquiasChecked}
                            onChange={toggleSelectAllParroquias}
                          />
                        </label>
                      </div>
                      {parroquias.map((item) => (
                        <div key={item.codigo}>
                          <label className="label cursor-pointer">
                            <span className="label-text">{item.nombre}</span>
                            <input
                              className="checkbox"
                              type="checkbox"
                              name={item.codigo.toString()}
                              checked={selectedParroquias.includes(item.codigo)}
                              onChange={handleCheckboxParroquiaChange}
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
                    <p className="text-red-500 p-[10px]">Error al cargar los topicos</p>
                  )}
                  {!loadingTopicos && !errorTopicos && (
                    <div className="">
                      <div>
                        <label className="label cursor-pointer">
                          <span className="label-text">
                            {isSelectAllTopicosChecked
                              ? "Deseleccionar todos los tópicos"
                              : "Seleccionar todos los tópicos"}
                          </span>
                          <input
                            className="checkbox"
                            type="checkbox"
                            checked={isSelectAllTopicosChecked}
                            onChange={toggleSelectAllTopics}
                          />
                        </label>
                      </div>
                      {topicos.map((item) => (
                        <div key={item.codigo}>
                          <label className="label cursor-pointer">
                            <span className="label-text">{item.nombre}</span>
                            <input
                              className="checkbox"
                              type="checkbox"
                              name={item.codigo.toString()} // Usamos el id como nombre
                              checked={selectedTopics.includes(item.codigo)}
                              onChange={handleCheckboxTopicChange}
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
          <h1 className="text-center text-xl font-medium">
            VISUALIZACION DE TOPICOS POR PARROQUIA
          </h1>
        </div>
        <p className="col-span-12 px-[100px] py-[20px]">
          Este módulo ofrece una representación detallada del comportamiento de
          los crímenes en distintas zonas geográficas, mostrando un gráfico de
          barras por parroquia con el número total de menciones de cada tópico,
          como robos, fraudes o violencia. Al permitir la visualización
          individual de cada parroquia, los usuarios pueden identificar
          rápidamente cuáles zonas presentan mayor o menor incidencia en ciertos
          tipos de delitos. Este análisis geográfico facilita la comparación
          entre diferentes parroquias, ayudando a detectar patrones locales y
          tendencias en la ocurrencia de crímenes. El módulo es fundamental para
          la planificación y toma de decisiones en materia de seguridad pública,
          al destacar las áreas que requieren atención prioritaria o donde se
          observa un aumento significativo en ciertos tópicos de crimen.
        </p>
        <div className="col-span-12">
          {!errorData && (
            <ParroquiasTopicosBars
              parroquias_topicos_counts={data?.data.parroquias_topicos_counts}
              parroquias_json={parroquiasJSON}
            />
          )}
          {errorData && (
            <div>
              <p className="text-red-500 p-[10px]">No se encontró información con los datos seleccionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
