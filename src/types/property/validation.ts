import * as Yup from "yup";

export const formValidationSchema = Yup.object({
  title: Yup.string()
    .min(2, "El título debe tener al menos 2 caracteres")
    .required("El título es obligatorio"),
  description: Yup.string(),
  propertyType: Yup.string()
    .oneOf(["casa", "apto", "cabaña", "otro"], "Tipo de propiedad inválido")
    .required("El tipo de propiedad es obligatorio"),
  countryCode: Yup.string()
    .length(2, "El código de país debe tener 2 caracteres")
    .required("El país es obligatorio"),
  city: Yup.string().required("La ciudad es obligatoria"),
  state: Yup.string().required("El departamento o estado es obligatorio"),
  address: Yup.string(),
  addressHint: Yup.string(),
  latitude: Yup.number().nullable().required("Marca la ubicación en el mapa"),
  longitude: Yup.number().nullable().required("Marca la ubicación en el mapa"),
  images: Yup.array()
    .min(1, "Agrega al menos una foto")
    .max(1, "Por ahora solo se permite una foto"),
  amenities: Yup.array().of(Yup.string()),
  houseRules: Yup.array().of(Yup.string()),
  maxGuest: Yup.number()
    .min(1, "Debe haber al menos 1 huésped")
    .required("Campo obligatorio"),
  bedrooms: Yup.number().min(0, "No puede ser negativo"),
  bathrooms: Yup.number().min(0, "No puede ser negativo"),
  price: Yup.number()
    .min(1, "El precio debe ser mayor a 0")
    .required("Campo obligatorio"),
  minNights: Yup.number()
    .min(1, "Mínimo 1 noche")
    .required("Campo obligatorio"),
  maxNights: Yup.number()
    .min(1, "Mínimo 1 noche")
    .required("Campo obligatorio"),
  checkinTime: Yup.string(),
  checkoutTime: Yup.string(),
});
