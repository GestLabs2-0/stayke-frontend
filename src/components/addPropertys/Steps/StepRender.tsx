import { AddPropertyFormData } from "@/src/types/AddPropertyFormData";
import { StepBasics } from "./StepBasics";
import { StepDetails } from "./StepDetails";
import { StepLocation } from "./StepLocation";
import { StepPhotos } from "./StepsPhoto";

type StepRenderer = (props: {
  step: number;
  form: AddPropertyFormData;
  onChange: (field: keyof AddPropertyFormData, value: any) => void;
}) => React.ReactNode;

export const renderStep: StepRenderer = ({ step, form, onChange }) => {
  switch (step) {
    case 1:
      return <StepBasics form={form} onChange={onChange} />;
    case 2:
      return <StepLocation form={form} onChange={onChange} />;
    case 3:
      return <StepDetails form={form} onChange={onChange} />;
    case 4:
      return <StepPhotos form={form} onChange={onChange} />;
    default:
      return null;
  }
};

// ── Step renderer ─────────────────────────────────────────────────────────────
export const STEP_LABELS: Record<number, { title: string; subtitle: string }> =
  {
    1: {
      title: "Tell us about your property",
      subtitle: "Start with the basics",
    },
    2: { title: "Where is it located?", subtitle: "Help guests find you" },
    3: { title: "Rooms, guests & pricing", subtitle: "Set your nightly rate" },
    4: {
      title: "Add a cover photo",
      subtitle: "Make a great first impression",
    },
  };
