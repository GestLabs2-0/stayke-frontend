import * as Yup from "yup";

const AGE_OF_MAJORITY = 18;
const MIN_BIRTH_YEAR = "1900-01-01";

/** Convierte una fecha local a YYYY-MM-DD para comparaciones sin desfase de zona horaria */
const toISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const registerValidationSchema = Yup.object({
  nombre: Yup.string()
    .required("Este campo es obligatorio")
    .min(3, "El nombre tiene como minimo dos caracteres")
    .max(50, "El nombre tiene como maximo 50 caracteres"),
  apellido: Yup.string()
    .required("Este campo es obligatorio")
    .min(3, "El apellido tiene como minimo dos caracteres")
    .max(50, "El apellido tiene como maximo 50 caracteres"),
  telefono: Yup.string().required("Este campo es obligatorio"),
  direccion: Yup.string().required("Este campo es obligatorio"),
  pais: Yup.string().required("Seleccioná un país"),
  fechaNacimiento: Yup.string()
    .required("Este campo es obligatorio")
    .test(
      "no-futura",
      "La fecha no puede ser futura",
      (value) => !value || value <= toISODate(new Date()),
    )
    .test("mayor-de-edad", "Debes ser mayor de 18 años", (value) => {
      if (!value) return true;
      const majorityDate = new Date();
      majorityDate.setFullYear(majorityDate.getFullYear() - AGE_OF_MAJORITY);
      return value <= toISODate(majorityDate);
    })
    .test(
      "rango-valido",
      "Ingresa una fecha válida",
      (value) => !value || value >= MIN_BIRTH_YEAR,
    ),
});
