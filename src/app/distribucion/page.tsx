"use client";
import { useState, useEffect } from "react";
import { Topico, TopicosJSON } from "@/types/topico";
import { Parroquia } from "@/types/parroquia";
import { fetchTopicos } from "@/services/topicoService";
import { fetchParroquias } from "@/services/parroquiaService";
import { PostDistribucionResponse } from "@/types/response";

import ApiService from "@/services/hechoService";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import Distribucion from "../components/distribucion/Distribucion";

export default function DistribucionTab() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [topicosJSON, setTopicosJSON] = useState<TopicosJSON>({});
  const [loadingTopicos, setLoadingTopicos] = useState<boolean>(false);
  const [errorTopicos, setErrorTopicos] = useState<string | null>(null);
  const [data, setData] = useState<PostDistribucionResponse>();

  const [selectedTopics, setSelectedTopics] = useState([1]);

  useEffect(() => {
    const loadTopicos = async () => {
      setLoadingTopicos(true);
      setErrorTopicos(null);
      try {
        const data = await fetchTopicos();
        const topicosJSON: TopicosJSON = {};
        data.data.forEach((topico) => {
          topicosJSON[topico.codigo] = topico;
        });
        setTopicosJSON(topicosJSON);
        setTopicos(data.data);
      } catch (err: any) {
        setErrorTopicos(err.message);
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
          fecha_fin: fechaFin,
          topicos: selectedTopics,
        };

        const response = await ApiService.post<PostDistribucionResponse>(
          "/api/hechos_distribucion/",
          data
        );
        setData(response);
      } catch (error) {
        console.error("Error al enviar datos:", error);
      }
    };
    sendData();
  }, [selectedTopics, fechaInicio, fechaFin]);

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
        };

        const response = await ApiService.post<PostDistribucionResponse>(
          "/api/hechos_distribucion/",
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
      setSelectedTopics(topicos.map((item) => item.codigo)); // Seleccionar todos
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

  const isSelectAllChecked = selectedTopics.length === topicos.length;

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
            <div className="collapse-title text-xl font-medium">Topicos</div>
            {loadingTopicos && <SkeletonLoader />}
            {errorTopicos && (
              <p className="text-red-500">Error al cargar los topicos</p>
            )}
            {!loadingTopicos && !errorTopicos && (
              <div className="">
                <div>
                  <label className="label cursor-pointer">
                    <span className="label-text">
                      {isSelectAllChecked
                        ? "Deseleccionar todos los tópicos"
                        : "Seleccionar todos los tópicos"}
                    </span>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={isSelectAllChecked}
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
            <button className="btn btn-neutral  bottom-6 " type="submit">
              Enviar
            </button>
          </form>
        </div>
        <div className="divider divider-horizontal m-0"></div>
      </div>
      <div className="col-span-9 grid grid-cols-12">
        <div className="col-span-12">
          <h1 className=" text-xl font-medium text-center">
            DISTRIBUCION DE TOPICOS
          </h1>
        </div>
        <div className="col-span-5">
          <br />
          {data?.data.topicos_counts.map((topico, index) => (
            <div className="topic-label-element p-0" key={topico.codigo}>
              <div
                tabIndex={0}
                className="relative collapse collapse-plus border-base-300 bg-base-200 border"
              >
                <div className="collapse-title text-xl font-small flex p-2 z-10">
                  <div
                    id={"topic" + index}
                    className="box-topic rounded-box"
                  ></div>
                  <h1 className="h-[20px]">
                    {topico.codigo}. {topicosJSON[topico.codigo].nombre}
                  </h1>
                </div>
                <div className="collapse-content p-1 text-right">
                  <p>{topicosJSON[topico.codigo].descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-7">
          <div className="block-description">
            <p>
              Este gráfico de pastel muestra la distribución de los diferentes
              tópicos relacionados con la delincuencia en Quito, en base al
              número de tweets registrados según los filtros seleccionados:
              rango de fechas, tópicos y parroquias. Los porcentajes reflejan la
              proporción de menciones de cada tema dentro del total de tweets
              recopilados, permitiendo identificar las preocupaciones
              predominantes en las áreas y períodos de tiempo definidos.
            </p>
          </div>
          <Distribucion
            topicos_counts={data?.data.topicos_counts}
            topicos_json={topicosJSON}
            total={data?.data.total}
          />
        </div>
      </div>
    </div>
  );
}
