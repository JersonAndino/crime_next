import { ParroquiaApiResponse } from "@/types/parroquia";
import { environment } from "@/environments/environment";

export const fetchParroquias = async (): Promise<ParroquiaApiResponse> => {
    const response = await fetch(`${environment.backendUrl}/api/parroquias/`);

    if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data: ParroquiaApiResponse = await response.json();
    return data;
};
