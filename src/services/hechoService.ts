import axios, { AxiosInstance } from "axios";
import { environment } from "@/environments/environment";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    const baseURL = environment.backendUrl;
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.api.post<T>(endpoint, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error en el POST (Axios):", error.response);
        const errorMessage = error.response?.data?.message || "Error en la solicitud con Axios";
        throw new Error(errorMessage);
      } else {
        console.error("Error desconocido:", error);
        throw new Error("Ocurrió un error inesperado");
      }
    }
  }
}

const apiService = new ApiService();
export default apiService;
