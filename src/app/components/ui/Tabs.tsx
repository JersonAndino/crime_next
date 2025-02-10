"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { isAuthenticated } from "@/services/authService";
// import { useEffect, useState } from "react";
// import { environment } from "@/environments/environment";
// import axios from "axios";

const Tabs = () => {
  const pathname = usePathname();
  // const router = useRouter();
  // const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // useEffect(() => {
  //   const checkAuth = () => {
  //     if (isAuthenticated()) {
  //       setLoggedIn(true);
  //     } else {
  //       setLoggedIn(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  // const handleLogin = () => {
  //   router.push("/login"); // Assuming you have a login page at /login
  // };

  // const handleLogout = async () => {
  //   try {
  //     const response = await axios.post(environment.backendUrl + '/auth/logout/');
  //     console.log(response);
  //     localStorage.removeItem('authToken');
  //     setLoggedIn(false);
  //     // setMessage(response.data.message);
  //   } catch (error: any) {
  //     // setMessage(error.response?.data?.error || 'An error occurred');
  //   }
  // };

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-10">
        <div role="tablist" className="tabs tabs-lifted w-[400px]">
          <Link
            href="/mapa"
            role="tab"
            className={`tab ${pathname === "/mapa" ? "tab-active" : ""}`}
          >
            <span className="text-2xl font-bold">Mapa</span>
          </Link>
          <Link
            href="/distribucion"
            role="tab"
            className={`tab ${pathname === "/distribucion" ? "tab-active" : ""}`}
          >
            <span className="text-2xl font-bold">Distribución</span>
          </Link>
          <Link
            href="/analiticas"
            role="tab"
            className={`tab ${pathname === "/analiticas" ? "tab-active" : ""}`}
          >
            <span className="text-2xl font-bold">Parroquias</span>
          </Link>
          <Link
            href="/comparativa"
            role="tab"
            className={`tab ${pathname === "/comparativa" ? "tab-active" : ""}`}
          >
            <span className="text-2xl font-bold">Comparación</span>
          </Link>
        </div>
      </div>

      <div className="col-span-2">
      <div role="tablist" className="tabs tabs-lifted">
          <Link
            href="/admin"
            role="tab"
            className={`tab ${pathname === "/admin" || pathname === "/login" ? "tab-active" : ""}`}
          >
            <span className="text-2xl font-bold">Administración</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
