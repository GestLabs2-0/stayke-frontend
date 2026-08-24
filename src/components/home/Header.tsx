import Image from "next/image";

import { SearchBar } from "./SearchBar/SearchBar";

export const Header = () => {
  return (
    <section className="relative min-h-[100dvh] md:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6">
      {/* Background Image */}
      <Image
        src="/70f5214e729b4a6480493b35a7102dca0c795d2c.jpg"
        alt="Modern coastal home"
        fill
        className="object-cover object-center pointer-events-none"
        priority
      />

      {/* Cinematic dark overlay for text contrast & legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75 z-10 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center gap-6 sm:gap-8 w-full max-w-5xl mx-auto px-2 sm:px-4 animate-fade-in-up">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-white font-montserrat font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.12] max-w-4xl text-balance drop-shadow-md">
            Hospedajes únicos, elegidos para viajeros extraordinarios.
          </h1>
        </div>

        <div className="w-full mt-2">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};
