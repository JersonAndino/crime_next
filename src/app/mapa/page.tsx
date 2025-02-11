"use client";
import { useState, useEffect } from "react";
import { Topico, TopicosJSON } from "@/types/topico";
import { ParroquiasJSON } from "@/types/parroquia";
import { fetchTopicos } from "@/services/topicoService";
import { fetchParroquias } from "@/services/parroquiaService";
import { PostMapResponse } from "@/types/response";

import ApiService from "@/services/hechoService";
import Mapa from "../components/mapa/Mapa";
import ParroquiasBars from "../components/mapa/ParroquiasBars";
import SkeletonLoader from "../components/ui/SkeletonLoader";

export default function MapaTab() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [parroquias, setParroquias] = useState<ParroquiasJSON>();
  const [topicos, setTopicos] = useState<Topico[]>([]);
  // const [loadingParroquias, setLoadingParroquias] = useState<boolean>(false);
  const [loadingTopicos, setLoadingTopicos] = useState<boolean>(false);
  // const [errorParroquias, setErrorParroquias] = useState<string | null>(null);
  const [errorTopicos, setErrorTopicos] = useState<string | null>(null);

  const [data, setData] = useState<PostMapResponse>();
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<string | null>(null);

  const [selectedTopic, setSelectedTopic] = useState(0);
  const [topicosJSON, setTopicosJSON] = useState<TopicosJSON>({});

  useEffect(() => {
    const loadParroquias = async () => {
      // setLoadingParroquias(true);
      // setErrorParroquias(null);
      try {
        const data = await fetchParroquias();
        const parroquiasJSON: ParroquiasJSON = {};
        data.data.forEach((parroquia) => {
          parroquiasJSON[parroquia.codigo] = parroquia;
        });
        setParroquias(parroquiasJSON);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log("Ocurrió un error inesperado.");
        }
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
          const topicosJSON: TopicosJSON = {};
          data.data.forEach((topico) => {
            topicosJSON[topico.codigo] = topico;
          });
          setTopicosJSON(topicosJSON);
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
        setLoadingData(true);
        setErrorData(null);
        const data = {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          topico_id: selectedTopic,
        };
        console.log(data);
        const response = await ApiService.post<PostMapResponse>(
          "/api/hechos_map/",
          data
        );
        if (response.data.total == null) {
          setErrorData("No se ha podido recuperar la información.");
        } else {
          setData(response);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorData(err.message);
          console.error("Error al enviar datos:", err);
        } else {
          setErrorData("Ocurrió un error inesperado.");
        }
      } finally {
        setLoadingData(false);
      }
    };
    sendData();
  }, [selectedTopic, fechaInicio, fechaFin]);

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

  const handleClickRadio = (event: React.MouseEvent<HTMLInputElement>) => {
    const inputElement = event.target as HTMLInputElement;
    setSelectedTopic(parseInt(inputElement.value));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sendData = async () => {
      try {
        setLoadingData(true);
        setErrorData(null);
        const data = {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          topico_id: selectedTopic,
        };

        const response = await ApiService.post<PostMapResponse>(
          "/api/hechos_map/",
          data
        );
        if (response.data.total == null) {
          setErrorData("No se ha podido recuperar la información.");
        } else {
          setData(response);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorData(err.message);
          console.error("Error al enviar datos:", err);
        } else {
          setErrorData("Ocurrió un error inesperado.");
        }
      } finally {
        setLoadingData(false);
      }
    };
    sendData();
  };

  return (
    <div className="grid grid-cols-12">
      <div className="flex w-full col-span-3 min-h-[776px]">
        <div className="space-y-6 min-w-[357.66px]">
          <div>
            <div className="collapse-title text-3xl font-bold">Fechas</div>
            <div>
              <label htmlFor="fechaInicio" className="font-medium text-2xl">Fecha de Inicio:</label>
              <input
                className="input w-full max-w-xs font-medium text-2xl"
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={fechaInicio}
                max={fechaFin || getCurrentDate()}
                onChange={handleFechaInicioChange}
              />
            </div>
            <div>
              <label htmlFor="fechaFin" className="font-medium text-2xl">Fecha de Fin:</label>
              <input
                className="input w-full max-w-xs font-medium text-2xl"
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
          <form onSubmit={handleSubmit} className="min-h-[508px]">
            <div>
              <div className="collapse-title text-3xl font-bold">Tópicos</div>
              {loadingTopicos && <SkeletonLoader />}
              {errorTopicos && (
                <p className="text-red-500 p-[10px] text-2xl font-bold">
                  Error al cargar los topicos
                </p>
              )}
              {!loadingTopicos &&
                !errorTopicos &&
                topicos.length > 0 &&
                topicos.map((topico) => (
                  <div key={topico.codigo}>
                    <label className="label cursor-pointer">
                      <span className="label-text font-medium text-2xl">{topico.nombre}</span>
                      <input
                        type="radio"
                        name="topico"
                        value={topico.codigo}
                        onClick={handleClickRadio}
                        defaultChecked={selectedTopic == topico.codigo}
                        className="radio"
                      />
                    </label>
                  </div>
                ))}
            </div>

            <button className="btn btn-neutral" type="submit">
              Enviar
            </button>
          </form>
        </div>
        <div className="divider divider-horizontal m-0"></div>
      </div>
      <div className="col-span-9 grid grid-cols-12">
        <div className="flex w-full col-span-6 p-[20px]">
          <Mapa
            parroquias_counts={data?.data.parroquias_counts}
            num_dias={data?.data.num_dias}
          />
          {/* <div className="divider divider-horizontal m-0"></div> */}
        </div>
        <div className="col-span-6">
          <div className="flex w-full flex-col border-opacity-50">
            <div className="flex items-center justify-center">
              <div className="stats w-full">
                <div className="stat">
                  <div className="stat-title font-bold text-2xl">Tweets Totales Registrados: <br /> <p className="text-neutral">{topicosJSON[selectedTopic] != undefined && topicosJSON[selectedTopic].nombre}</p></div>
                  {loadingData && <SkeletonLoader />}
                  {errorData && (
                    <p className="text-red-500 p-[10px] font-bold text-2xl">
                      No se ha podido recuperar la información
                    </p>
                  )}
                  {!loadingData && !errorData && (
                    <div className="grid grid-cols-5 gap-1">
                      {data?.data.total_parroquias != undefined &&
                        data?.data.total_parroquias > 0 && (
                          <div className="col-span-2">
                            <div className="stat-value">
                              {data?.data.total_parroquias}
                            </div>
                            <div className="stat-desc font-bold text-black text-xl">
                              Tweets con localización
                            </div>
                          </div>
                        )}
                      <div className="col-span-2">
                        <div className="stat-value">{data?.data.total}</div>
                        <div className="stat-desc font-bold text-black text-xl">Tweets sin localización</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="bg-base-200 rounded-2xl">
              <ParroquiasBars
                parroquias_counts={data?.data.parroquias_counts}
                parroquias_json={parroquias}
              />
            </div>
            <div className="divider"></div>
            <div className="bg-base-200 rounded-2xl">
              {/* <TopCrimes data={data.top_topicos} topicos={parroquias_json} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
