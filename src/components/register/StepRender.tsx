//Own components
import { StepPersonal } from "./StepPersonal";
import { StepContact } from "./StepContact";
import { RegisterFormData } from "@/src/types/RegisterFormData";
//Type

type StepRenderer = (props: {
  form: RegisterFormData;
  onChange: (field: keyof RegisterFormData, value: string | number) => void;
}) => React.ReactNode;

//Step Components
export const STEP_COMPONENTS: Record<number, StepRenderer> = {
  1: ({ form, onChange }) => <StepPersonal form={form} onChange={onChange} />,
  2: ({ form, onChange }) => (
    <StepContact form={form} onChange={onChange } />
  ),
};
