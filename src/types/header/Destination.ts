import type React from "react";

export type Destination = {
  ciudad: string;
  descripcion: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};
