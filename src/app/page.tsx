import { EscapadasCerca } from "@/components/home/EscapadasCerca";
import { propertiesData } from "@/components/home/EscapadasCerca/mocks";
import { Header } from "@/components/home/Header";
import { SobreStayke } from "@/components/home/SobreStayke";
import { Testimonios } from "@/components/home/Testimonios";

export default function Home() {
  return (
    <div className="bg-white">
      <Header />
      <EscapadasCerca
        properties={propertiesData}
        periodLabel="12 - 14 de junio"
      />
      <SobreStayke />
      <Testimonios />
    </div>
  );
}
