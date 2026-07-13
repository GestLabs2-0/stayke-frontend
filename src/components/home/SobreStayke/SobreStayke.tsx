import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { StaykeInfo } from "./StaykeInfo";
import { StaykeStats } from "./StaykeStats";

export const SobreStayke = () => {
  return (
    <SectionWrapper className="grid grid-cols-2 max-[800px]:grid-cols-1 min-[800px]:gap-12 gap-4 mt-6">
      <StaykeInfo />
      <StaykeStats />
    </SectionWrapper>
  );
};
