import * as Yup from "yup";

export const formValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es obligatorio"),
  description: Yup.string(),
  address: Yup.string(),
  addressGuide: Yup.string(),
  latitude: Yup.number().nullable().required("Marca la ubicación en el mapa"),
  longitude: Yup.number().nullable().required("Marca la ubicación en el mapa"),
  images: Yup.array(),
  amenities: Yup.array().of(Yup.string()),
  rules: Yup.array().of(Yup.string()),
  checkIn: Yup.string(),
  checkOut: Yup.string(),
  maxGuests: Yup.number().min(1, "Debe haber al menos 1 huésped"),
  pricePerNight: Yup.number().min(1, "El precio debe ser mayor a 0"),
});
