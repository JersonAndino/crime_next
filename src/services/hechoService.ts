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
    } catch (error: any) {
      console.error("Error en el POST:", error.response || error.message);
      throw new Error(error.response?.data?.message || "Error en la solicitud");
    }
  }
}

export default new ApiService();
