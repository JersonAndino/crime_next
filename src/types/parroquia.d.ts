export interface Parroquia {
  codigo: number;
  nombre: string;
  descripcion: string;
}

export interface ParroquiaApiResponse {
  data: Parroquia[];
}

export type ParroquiaSVG = {
  id: string;
  d: string;
  transform: string;
  transform_2: string;
  fill: string;
};

export type ParroquiasJSON = {
  [key: number]: Parroquia;
};

export type ParroquiasJSONApiResponse = {
  data: ParroquiasJSON;
};

