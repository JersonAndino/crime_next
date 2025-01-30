"use client";
import { useState, useEffect } from "react";
import { Topico } from "@/types/topico";
import { ParroquiasJSON } from "@/types/parroquia";
import { fetchTopicos } from "@/services/topicoService";
import { fetchParroquias } from "@/services/parroquiaService";
import { PostMapResponse} from "@/types/response";

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

  const [selectedTopic, setSelectedTopic] = useState(1);

  useEffect(() => {
    const loadParroquias = async () => {
      // setLoadingParroquias(true);
      // setErrorParroquias(null);
      console.log("parroquias");
      try {
        const data = await fetchParroquias();
        const parroquiasJSON: ParroquiasJSON = {}
        data.data.forEach((parroquia) => {
          parroquiasJSON[parroquia.codigo] = parroquia;
        })
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
        if (data.data.length == 0) {
          setErrorTopicos("No se recupero ningún tópico.");
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
        setLoadingData(true);
        const data = {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          topico_id: selectedTopic,
        };

        const response = await ApiService.post<PostMapResponse>(
          "/api/hechos_map/",
          data
        );
        if (response.data.total == null){
          setErrorData("No se ha podido recuperar la información.")  
        }else{
          setData(response);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorData(err.message)
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
        const data = {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          topico_id: selectedTopic,
        };
        const response = await ApiService.post<PostMapResponse>(
          "/api/hechos_map/",
          data
        );
        setData(response);
      } catch (error) {
        console.error("Error al enviar datos:", error);
      }
    };
    sendData();
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
          <form onSubmit={handleSubmit} className="min-h-[508px]">
            <div>
              <div className="collapse-title text-xl font-medium">Tópicos</div>
              {loadingTopicos && <SkeletonLoader />}
              {errorTopicos && (
                <p className="text-red-500 p-[10px]">Error al cargar los topicos</p>
              )}
              {!loadingTopicos &&
                !errorTopicos && topicos.length > 0 &&
                topicos.map((topico) => (
                  <div key={topico.codigo}>
                    <label className="label cursor-pointer">
                      <span className="label-text">{topico.nombre}</span>
                      <input
                        type="radio"
                        name="topico"
                        value={topico.codigo}
                        onClick={handleClickRadio}
                        defaultChecked = {selectedTopic == topico.codigo}
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
        <div className="flex w-full col-span-7">
          <Mapa
            parroquias_counts={data?.data.parroquias_counts}
            num_dias={data?.data.num_dias}
          />
          <div className="divider divider-horizontal m-0"></div>
        </div>
        <div className="col-span-5">
          <div className="flex w-full flex-col border-opacity-50">
            <div className="flex items-center justify-center">
              <div className="stats w-full">
                <div className="stat">
                  <div className="stat-title">Tweets Totales Registrados</div>
                  {loadingData && <SkeletonLoader />}
              {errorData && (
                <p className="text-red-500 p-[10px]">No se ha podido recuperar la información</p>
              )}
              {!loadingData &&
                !errorData &&
                <div className="stat-value">{data?.data.total}</div>
              }
                  
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
