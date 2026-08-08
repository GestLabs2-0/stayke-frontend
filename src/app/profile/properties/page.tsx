"use client";

import { Home as HomeIcon } from "lucide-react";

import { HostProperties } from "@/components/profile/properties/listProperties/HostProperties";
import { useProfile } from "@/hooks/useProfile";

function HostPropertiesGated({ onEnable }: { onEnable: () => void }) {
  return (
    <div className="card-white flex flex-col items-center px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent-warm/15">
        <HomeIcon className="size-6 text-accent-warm" />
      </span>
      <h1 className="mt-4 font-montserrat text-[20px] font-bold text-[#171717]">
        Esta sección es solo para anfitriones
      </h1>
      <p className="mt-2 max-w-sm font-sans text-sm text-[#434654]">
        Cambiá tu modo para gestionar tus propiedades, ver tus reseñas y
        controlar tus reservas.
      </p>
      <button
        type="button"
        onClick={onEnable}
        className="mt-5 cursor-pointer rounded-full bg-accent-warm px-5 py-2.5 font-plus-jakarta text-[14px] font-semibold text-white transition-colors hover:bg-accent-warm-hover"
      >
        Cambiar a modo anfitrión
      </button>
    </div>
  );
}

export default function PropertiesPage() {
  const { mode, setMode } = useProfile();

  if (mode !== "host") {
    return <HostPropertiesGated onEnable={() => setMode("host")} />;
  }

  return <HostProperties />;
}
