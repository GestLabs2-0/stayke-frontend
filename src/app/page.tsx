import { Header } from "@/components/home/Header";
import { EscapadasCerca } from "@/components/home/EscapadasCerca";
import { propertiesData } from "@/components/home/EscapadasCerca/mocks";

export default function Home() {
  return (
    <div className="bg-white">
      <Header />
      <EscapadasCerca
        properties={propertiesData}
        periodLabel="Se muestran ofertas para este periodo: 12 jun-14 jun"
      />
    </div>
  );
}
