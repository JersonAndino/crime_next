export interface CountResponse {
  codigo: number;
  total: number;
}

export interface PostMapResponse {
  data: {
    parroquias_counts: CountResponse[];
    total: number;
    num_dias: number;
  };
}

export interface PostDistribucionResponse {
  data: {
    topicos_counts: CountResponse[];
    total: number;
  };
}

export interface PostAnaliticResponse {
  data: {
    parroquias_topicos_counts: {
      codigo: number;
      topicos: CountResponse[];
    }[];
  };
}

export interface PostComparacionResponse {
  data: {
    totales_antes: {
      total: number;
    }[];
    totales_despues: {
      total: number;
    }[];
    total_antes: number;
    total_despues: number;
  };
}
