import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { StaykeInfo } from "./StaykeInfo";
import { StaykeStats } from "./StaykeStats";

export const SobreStayke = () => {
  return (
    <SectionWrapper className="grid grid-cols-2 max-[800px]:grid-cols-1 gap-12">
      <StaykeInfo />
      <StaykeStats />
    </SectionWrapper>
  );
};
