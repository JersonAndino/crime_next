"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Tabs = () => {
  const pathname = usePathname();

  return (
    <div role="tablist" className="tabs tabs-lifted w-[400px]">
      <Link
        href="/mapa"
        role="tab"
        className={`tab ${pathname === "/mapa" ? "tab-active" : ""}`}
      >
        <span className="text-xl font-medium">Mapa</span>
      </Link>
      <Link
        href="/distribucion"
        role="tab"
        className={`tab ${pathname === "/distribucion" ? "tab-active" : ""}`}
      >
        <span className="text-xl font-medium">Distribucion</span>
      </Link>
      <Link
        href="/analiticas"
        role="tab"
        className={`tab ${pathname === "/analiticas" ? "tab-active" : ""}`}
      >
        <span className="text-xl font-medium">Parroquias</span>
      </Link>
      <Link
        href="/comparativa"
        role="tab"
        className={`tab ${pathname === "/comparativa" ? "tab-active" : ""}`}
      >
        <span className="text-xl font-medium">Comparacion</span>
      </Link>
    </div>
  );
};

export default Tabs;
