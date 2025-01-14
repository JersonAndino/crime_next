export interface Topico {
    codigo: number;
    nombre: string;
    descripcion: string;
}

export interface TopicoApiResponse {
    data: Topico[];
}

export type TopicosJSON = {
    [key: number]: Topico;
  };