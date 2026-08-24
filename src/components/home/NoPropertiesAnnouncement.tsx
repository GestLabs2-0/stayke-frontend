import Link from "next/link";

import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { routes } from "@/constants/routes";
import { IconHouse, PlusIcon } from "@/icons";
import type { NoPropertiesAnnouncementProps } from "@/types/home";

export const NoPropertiesAnnouncement = ({
  className = "",
}: NoPropertiesAnnouncementProps) => {
  return (
    <SectionWrapper
      ariaLabel="Anuncio para publicar alojamientos"
      className={className}
    >
      <div className="rounded-3xl border border-[#C3C6D6] bg-gradient-to-b from-purple-50/70 via-white to-white p-8 sm:p-12 text-center my-6 shadow-sm flex flex-col items-center">
        {/* Icon Badge */}
        <div className="size-16 rounded-2xl bg-purple-100 text-[#3b007f] flex items-center justify-center mb-6 shadow-inner">
          <div className="size-8">
            <IconHouse />
          </div>
        </div>

        {/* Heading */}
        <h3 className="font-montserrat font-bold text-2xl sm:text-3xl text-zinc-900 tracking-tight max-w-xl mb-3">
          ¿Tienes un alojamiento para alquilar?
        </h3>

        {/* Description in neutral Spanish */}
        <p className="text-zinc-600 text-sm sm:text-base max-w-lg leading-relaxed mb-8">
          Ayúdanos a expandir las opciones de hospedaje en Stayke. Publica tu
          espacio y comienza a recibir huéspedes con la seguridad y confianza de
          nuestra plataforma.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={routes.Profile.properties.create}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#3b007f] px-8 py-3.5 font-montserrat font-bold text-sm text-white shadow-md transition-all hover:bg-[#5307ad] hover:shadow-lg active:scale-95"
          >
            <div className="size-4">
              <PlusIcon />
            </div>
            <span>Publicar mi alojamiento</span>
          </Link>

          <Link
            href={routes.Destinys}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3.5 font-semibold text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Explorar destinos
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
};
