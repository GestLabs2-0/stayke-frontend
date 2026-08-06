import Image from "next/image";
import Link from "next/link";

import { routes } from "@/constants/routes";

export function DestinySearchHero() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Image
        src="/destinySearchLogo.svg"
        alt="Ilustración de exploración de destinos"
        width={627}
        height={593}
        unoptimized
        preload
        className="h-auto w-full max-w-[85%]"
      />

      <h1 className="mt-6 font-plus-jakarta text-[48px] font-extrabold leading-[56px] tracking-[-0.02em] text-primary">
        Planifica tu pr&oacute;ximo destino
      </h1>

      <p className="mt-4 font-sans text-base leading-[30px] text-neutral-800">
        Despu&eacute;s de reservar un hospedaje, vuelve aqu&iacute; para
        consultar los detalles,{" "}
        <span className="font-semibold">
          Explorar el mapa y guardar lugares para visitar.
        </span>
      </p>

      <Link
        href={routes.Home}
        className="mt-8 inline-flex items-center justify-center rounded-[12px] bg-[#AC59EB] px-[50px] py-[10px] font-sans text-xl font-bold text-white transition-colors hover:bg-[#9A3EE0]"
      >
        Buscar Hospedaje
      </Link>
    </div>
  );
}
