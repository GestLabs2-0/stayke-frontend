import { FilterBar } from "@/components/home/FilterBar/FilterBar";
import { Header } from "@/components/home/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <section className="pb-6 pt-10">
        <FilterBar />
      </section>
    </div>
  );
}
