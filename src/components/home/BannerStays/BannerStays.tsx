import Image from "next/image";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

// TODO: esto se refactorizara cuando se implemente una accion en el boton de Anunciar alojamiento
const CONTENT = (
  <>
    <h3 className="text-xl sm:text-4xl lg:text-3xl font-bold text-zinc-900 leading-tight">
      Alquila tu alojamiento con seguridad en Stayke
    </h3>
    <p className="mt-4 text-xs sm:text-sm text-zinc-600 leading-relaxed">
      Anúnciate en Stayke y no tendrás que preocuparte de nada, ya que podrás
      registrarte rápidamente, contar con asistencia en tiempo real y recibir
      huéspedes muy bien valorados. ¡Será como si estuvieras de vacaciones!
    </p>
    <button
      type="button"
      className="mt-6 inline-flex items-center rounded-full bg-[#3B007F] w-full justify-center lg:w-auto lg:justify-start px-6 py-3 text-sm lg:px-8 lg:py-4 lg:text-base font-semibold text-white transition-colors hover:bg-[#5307AD] cursor-pointer"
    >
      Anunciar alojamiento
    </button>
  </>
);

export const BannerStays = () => {
  return (
    <SectionWrapper className="mt-6">
      {/* Mobile */}
      <div className="flex flex-col lg:hidden">
        <div className="bg-[#EBE7E7] rounded-t-2xl p-6">{CONTENT}</div>
        <div className="relative h-70 w-full overflow-hidden rounded-b-2xl">
          <Image
            src="/bannerResponsive.webp"
            alt="Alquila tu alojamiento con seguridad en Stayke"
            fill
            className="object-cover pointer-events-none"
            quality={100}
            sizes="100vw"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="relative hidden h-110 w-full overflow-hidden rounded-2xl lg:block">
        <Image
          src="/image-security-location.webp"
          alt="Alquila tu alojamiento con seguridad en Stayke"
          fill
          className="object-cover pointer-events-none"
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
        />

        <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 w-[90%] sm:w-100 lg:w-115 rounded-2xl bg-white/95 backdrop-blur-sm p-6 sm:p-8 shadow-lg">
          {CONTENT}
        </div>
      </div>
    </SectionWrapper>
  );
};
