import { TopicoApiResponse } from "@/types/topico";
import { environment } from "@/environments/environment";

export const fetchTopicos = async (): Promise<TopicoApiResponse> => {
    const response = await fetch(`${environment.backendUrl}/api/topicos/`);

    if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data: TopicoApiResponse = await response.json();
    return data;
};