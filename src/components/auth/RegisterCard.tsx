"use client";

import type { FormikHelpers } from "formik";
import { Form, Formik } from "formik";
import Link from "next/link";
import { sileo } from "sileo";

import { COUNTRIES } from "@/constants/countries";
import { routes } from "@/constants/routes";
import { ChevronLeftIcon } from "@/icons/ChevronLeftIcon";
import { staykeApi } from "@/lib/staykeApi";
import type { RegisterUser } from "@/types/api/auth";
import { registerValidationSchema } from "@/types/auth/validation";
import { FormDateField } from "./FormDateField";
import { FormField } from "./FormField";
import { FormSelect } from "./FormSelect";

// Datos on-chain mockeados hasta que se integre la wallet
const MOCKED_ON_CHAIN_DATA = {
  owner: "APrSWUWf45Ka3Jx62dnhMhvPg5SD1jTikWzJTHxxZ",
  userProfile: "APrSWUWf45Ka3Jx62dnhMPg5SD1jTikCBBWzJTHxxZ",
  reputation: "APWUWf45Ka3Jx62dnhMhvPg5SD1jTikCBBWzJTHxxZ",
} as const;

type RegisterValues = {
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  pais: string;
  fechaNacimiento: string;
};

const initialValues: RegisterValues = {
  email: "",
  nombre: "",
  apellido: "",
  telefono: "",
  direccion: "",
  pais: "",
  fechaNacimiento: "",
};

export const RegisterCard = () => {
  const handleSubmit = async (
    values: RegisterValues,
    { resetForm }: FormikHelpers<RegisterValues>,
  ) => {
    const payload: RegisterUser = {
      owner: MOCKED_ON_CHAIN_DATA.owner,
      name: values.nombre.trim(),
      lastName: values.apellido.trim(),
      dateOfBirth: values.fechaNacimiento,
      identity: null,
      country: values.pais,
      address: values.direccion.trim(),
      phone: values.telefono.trim(),
      reputation: MOCKED_ON_CHAIN_DATA.reputation,
      userProfile: MOCKED_ON_CHAIN_DATA.userProfile,
      lending: 0,
      deposited: 0,
      staked: 0,
      isVerified: false,
      listings: 0,
      activeStay: null,
      ...(values.email ? { email: values.email } : {}),
    };

    const result = await staykeApi.register(payload);

    if (result.status) {
      sileo.success({ title: "¡Cuenta creada con éxito!" });
      resetForm();
      return;
    }

    const message = Array.isArray(result.message) ? (
      result.message.map((message) => (
        <li className="text-sm font-medium" key={message}>
          {message}
        </li>
      ))
    ) : (
      <p> {result.message || "Ocurrió un error al crear la cuenta."}</p>
    );

    const errorDetails = Array.isArray(result.errors)
      ? result.errors.map((err) => (
          <li className="text-sm font-medium" key={err}>
            {err}
          </li>
        ))
      : "";

    if (errorDetails) {
      sileo.error({
        title: "Ocurrio un error al crear la cuenta",
        description: (
          <>
            {Array.isArray(errorDetails) ? (
              <ul className="list-disc pl-5">{errorDetails}</ul>
            ) : (
              errorDetails
            )}
          </>
        ),
        styles: {
          description: "text-base text-white/80",
          title: "text-xl font-semibold",
        },
      });
    } else if (message) {
      sileo.error({
        title: "Ocurrio un error al crear la cuenta",
        description: (
          <>
            {Array.isArray(message) ? (
              <ul className="list-disc pl-5">{message}</ul>
            ) : (
              message
            )}
          </>
        ),
        styles: {
          description: "text-base text-white/80",
          title: "text-xl font-semibold",
        },
      });
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-135 lg:max-w-160">
      {/* Card con gradiente y sombra */}
      <div className="relative overflow-hidden rounded-[26px] bg-linear-to-b from-[rgba(59,0,127,0.3)] to-[rgba(255,255,255,0.5)] p-8 shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] backdrop-blur-sm sm:p-10 lg:p-12">
        {/* Back button */}
        <Link
          href={routes.Home}
          aria-label="Volver"
          className="mb-6 flex size-10 items-center justify-center rounded-2xl bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] transition-opacity hover:opacity-80"
        >
          <ChevronLeftIcon />
        </Link>

        {/* Title */}
        <h1 className="font-plus-jakarta text-[32px] font-extrabold leading-tight text-white">
          Crear cuenta
        </h1>
        <p className="mt-2 font-plus-jakarta text-[14px] font-medium text-white/70">
          Completa tus datos para registrarte en Stayke
        </p>

        {/* Form */}
        <Formik<RegisterValues>
          initialValues={initialValues}
          validationSchema={registerValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-4" noValidate>
              {/* Nombre + Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="nombre"
                  label="Nombre"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Tu nombre"
                />
                <FormField
                  name="apellido"
                  label="Apellido"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Tu apellido"
                />
              </div>

              {/* Fecha de nacimiento */}
              <FormDateField
                name="fechaNacimiento"
                label="Fecha de nacimiento"
              />

              {/* Teléfono */}
              <FormField
                name="telefono"
                label="Teléfono"
                type="tel"
                autoComplete="tel"
                placeholder="+58 412 123 4567"
              />

              {/* Dirección */}
              <FormField
                name="direccion"
                label="Dirección"
                type="text"
                autoComplete="street-address"
                placeholder="Calle, ciudad, código postal"
              />

              {/* País */}
              <FormSelect
                name="pais"
                label="País"
                placeholder="Seleccioná tu país"
                options={COUNTRIES.map((country) => ({
                  value: country.iso2,
                  label: country.nameES,
                }))}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full cursor-pointer rounded-full bg-[#3B007F] px-6 py-3.5 font-plus-jakarta text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#5307AD] hover:shadow-[0_4px_12px_rgba(59,0,127,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Términos */}
      <p className="mt-4 text-center font-plus-jakarta text-[11px] font-medium leading-relaxed text-white/80">
        Al registrarte, aceptas nuestros Términos de servicio y Política de
        privacidad.
      </p>
    </div>
  );
};
