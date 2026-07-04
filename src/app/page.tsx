import { EscapadasCerca } from "@/components/home/EscapadasCerca";
import { propertiesData } from "@/components/home/EscapadasCerca/mocks";
import { FilterBar } from "@/components/home/FilterBar/FilterBar";
import { Header } from "@/components/home/Header";

export default function Home() {
  return (
    <>
      <Header />
      <section className="pb-6 pt-10 px-35 max-[1210px]:px-[42px]">
        <FilterBar />
        <EscapadasCerca
          properties={propertiesData}
          periodLabel="12 - 14 de junio"
        />
      </section>
    </>
  );
}
