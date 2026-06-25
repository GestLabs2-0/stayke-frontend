import { StaykeInfo } from "./StaykeInfo";
import { StaykeStats } from "./StaykeStats";

export const SobreStayke = () => {
  return (
    <section className="w-full mx-auto px-6 py-12 md:px-10 lg:px-12 max-w-[1200px]">
      <div className="grid grid-cols-2 gap-12">
        <StaykeInfo />
        <StaykeStats />
      </div>
    </section>
  );
};
