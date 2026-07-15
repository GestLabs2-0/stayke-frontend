import Image from "next/image";

import { SearchBar } from "./SearchBar/SearchBar";

export const Header = () => {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <Image
        src="/70f5214e729b4a6480493b35a7102dca0c795d2c.jpg"
        alt="Modern coastal home"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="relative z-20 flex flex-col items-center gap-8 px-4">
        <h1 className="text-white lg:text-3xl xl:text-5xl font-montserrat font-bold leading-tight text-center">
          Hospedajes únicos, elegidos para viajeros extraordinarios.
        </h1>
        <div className="max-[980px]:hidden">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};
