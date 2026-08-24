import { getInitials } from "@/helpers/getInitials";

export const ImagePlaceholder = ({
  name,
  lastName,
}: {
  name: string;
  lastName: string;
}) => {
  return (
    <span
      aria-hidden="true"
      className="flex size-full shrink-0 items-center justify-center rounded-full bg-primary font-montserrat text-xl font-bold text-white"
    >
      {getInitials(name, lastName)}
    </span>
  );
};
