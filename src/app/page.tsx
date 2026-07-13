import { BannerStays } from "@/components/home/BannerStays";
import { EscapadasCerca } from "@/components/home/EscapadasCerca";
import { propertiesData } from "@/components/home/EscapadasCerca/mocks";
import { FAQ } from "@/components/home/FAQ";
import { FilterBar } from "@/components/home/FilterBar/FilterBar";
import { Header } from "@/components/home/Header";
import { PopularStays } from "@/components/home/PopularStays";
import { popularStaysData } from "@/components/home/PopularStays/mocks";
import { SobreStayke } from "@/components/home/SobreStayke";
import { Testimonios } from "@/components/home/Testimonios";

export default function Home() {
  return (
    <>
      <Header />
      <section className="pb-6 pt-10">
        <FilterBar />
        <EscapadasCerca
          properties={propertiesData}
          periodLabel="12 - 14 de junio"
        />
        <PopularStays
          title="Alojamientos populares en Caracas"
          properties={popularStaysData}
        />
        <PopularStays
          title="Alojamientos populares en Medellín"
          properties={popularStaysData}
        />
        <PopularStays
          title="Alojamientos populares en Trujillo"
          properties={popularStaysData}
        />
        <SobreStayke />
        <BannerStays />
        <Testimonios />
        <FAQ />
      </section>
    </>
  );
}
