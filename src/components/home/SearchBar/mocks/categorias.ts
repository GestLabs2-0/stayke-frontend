export type Categoria = {
  label: string;
  descripcion: string;
  key: "adultos" | "ninos" | "bebes" | "mascotas";
};

export const categorias: Categoria[] = [
  { label: "Adultos", descripcion: "Edad: 13 años o más", key: "adultos" },
  { label: "Niños", descripcion: "Edades 2 – 12", key: "ninos" },
  { label: "Bebés", descripcion: "Menos de 2 años", key: "bebes" },
  {
    label: "Mascotas",
    descripcion: "¿Traes a un animal de servicio?",
    key: "mascotas",
  },
];
