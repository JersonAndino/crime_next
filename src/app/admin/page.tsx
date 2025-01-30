"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/services/authService";
import axios from "axios";
import { environment } from "@/environments/environment";

const Admin = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState<File | null>(null);
    const fileType = "HECHO";
    const [uploadMessage, setUploadMessage] = useState<string>("");

    useEffect(() => {
        const checkAuthentication = () => {
            const isLoggedIn = isAuthenticated();
            if (!isLoggedIn) {
                router.push("/login");
            } else {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, [router]);

    const handleLogout = async () => {
        try {
            await axios.post(environment.backendUrl + "/auth/logout/", {}, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("accessToken")}`,
                },
            });
        } catch (error) {
            console.error("Error during logout", error);
        } finally {
            localStorage.removeItem("authToken");
            router.push("/login");
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            setUploadMessage("Por favor selecciona un archivo para subir.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", fileType);

        try {
            const accessToken = localStorage.getItem("accessToken");

            const response = await axios.post(environment.backendUrl + "/api/upload/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setUploadMessage("Archivo subido exitosamente.");
            console.log(response.data);
        } catch (error) {
            setUploadMessage("Error al subir el archivo. Intenta nuevamente.");
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl font-medium">Verificando autenticación...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Admin Panel</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Cerrar sesión
                    </button>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Subir archivos</h2>
                    
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Selecciona un archivo:</label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleFileUpload}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Subir archivo
                    </button>
                    {uploadMessage && <p className="mt-4 text-lg">{uploadMessage}</p>}
                </div>

                {/* Contenido adicional del panel de administración */}
                {/* <div className="mt-8">
                    <ul>
                        <li className="mb-4">Gestión de usuarios</li>
                        <li className="mb-4">Estadísticas</li>
                        <li className="mb-4">Configuraciones</li>
                    </ul>
                </div> */}
            </div>
        </div>
    );
};

export default Admin;
