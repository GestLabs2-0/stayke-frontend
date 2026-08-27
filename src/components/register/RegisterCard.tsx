"use client";

import { useUser } from "@dynamic-labs-sdk/react-hooks";
import type { Address } from "@solana/kit";
import type { FormikHelpers } from "formik";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { sileo } from "sileo";

import { COUNTRIES } from "@/constants/countries";
import { routes } from "@/constants/routes";
import useNetwork from "@/hooks/useNetwork";
import { useSignAndSendTx } from "@/hooks/useSignAndSendTx";
import { useWalletContext } from "@/hooks/useWallet";
import { buildInitUserTx } from "@/lib/contracts/buildInitUserTx";
import { staykeApi } from "@/lib/staykeApi";
import type { RegisterUser } from "@/types/api/auth";
import { registerValidationSchema } from "@/types/auth/validation";
import { FormDateField } from "./FormDateField";
import { FormField } from "./FormField";
import { FormSelect } from "./FormSelect";

type RegisterValues = {
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  pais: string;
  fechaNacimiento: string;
};

const initialValues: RegisterValues = {
  nombre: "",
  apellido: "",
  telefono: "",
  direccion: "",
  pais: "",
  fechaNacimiento: "",
};

const renderBackendErrors = (result: {
  errors?: string[] | null;
  message?: string | string[] | null;
}) => {
  let content: ReactNode;

  if (Array.isArray(result.errors) && result.errors.length > 0) {
    content = (
      <ul className="list-disc pl-5">
        {result.errors.map((err) => (
          <li className="text-sm font-medium" key={err}>
            {err}
          </li>
        ))}
      </ul>
    );
  } else if (Array.isArray(result.message) && result.message.length > 0) {
    content = (
      <ul className="list-disc pl-5">
        {result.message.map((msg) => (
          <li className="text-sm font-medium" key={msg}>
            {msg}
          </li>
        ))}
      </ul>
    );
  } else {
    content = (
      <p>{result.message || "Ocurrió un error al completar el registro."}</p>
    );
  }

  sileo.error({
    title: "Ocurrió un error al completar el registro",
    description: content,
    styles: {
      description: "text-base text-white/80",
      title: "text-xl font-semibold",
    },
  });
};

export const RegisterCard = () => {
  const { client } = useNetwork();
  const {
    userWallet,
    reputationProfile,
    userProfile,
    refetchAccounts,
    userBackend,
  } = useWalletContext();
  const { handleSignAndSend, loading: loadingSignAndSend } =
    useSignAndSendTx(userWallet);
  const router = useRouter();
  const { data: user } = useUser();

  useEffect(() => {
    if (userWallet && reputationProfile && userProfile && userBackend) {
      router.push(routes.Profile.index);
    }
  }, [userWallet, reputationProfile, userProfile, userBackend, router]);

  const ensureOnChainProfiles = async (): Promise<{
    reputationProfileAddr: Address<string>;
    userProfileAddr: Address<string>;
  } | null> => {
    if (!userWallet) {
      sileo.error({
        title: "Error",
        description: "No se pudo obtener la wallet del usuario.",
      });
      return null;
    }

    if (userProfile && reputationProfile) {
      return {
        userProfileAddr: userProfile.address,
        reputationProfileAddr: reputationProfile.address,
      };
    }

    try {
      const {
        reputationProfile: reputationProfileAd,
        userProfile: userProfileAd,
        tx,
      } = await buildInitUserTx(userWallet, client);

      const { status, simulationFailed } = await handleSignAndSend(tx);

      if (!status) {
        if (!simulationFailed) {
          sileo.error({
            title: "Error",
            description:
              "No se pudo crear la cuenta en blockchain. Por favor, inténtalo de nuevo.",
          });
        }
        return null;
      }

      return {
        reputationProfileAddr: reputationProfileAd,
        userProfileAddr: userProfileAd,
      };
    } catch (error) {
      console.error("Error creating on-chain user profile:", error);
      sileo.error({
        title: "Error",
        description:
          "Ocurrió un error al preparar la transacción en blockchain.",
      });
      return null;
    }
  };

  const handleCreateOnChainAccount = async () => {
    const profiles = await ensureOnChainProfiles();
    if (profiles) {
      await refetchAccounts();
      sileo.success({ title: "¡Cuenta creada en blockchain con éxito!" });
    }
  };

  const handleSubmit = async (
    values: RegisterValues,
    { resetForm }: FormikHelpers<RegisterValues>,
  ) => {
    if (!userWallet) {
      sileo.error({
        title: "Error",
        description: "No se pudo obtener la wallet del usuario.",
      });
      return;
    }

    if (!user?.email) {
      sileo.error({
        title: "Error",
        description:
          "No se pudo obtener el email del usuario. Por favor, inténtalo de nuevo.",
      });
      return;
    }

    const profiles = await ensureOnChainProfiles();
    if (!profiles) {
      return;
    }

    const { reputationProfileAddr, userProfileAddr } = profiles;

    const payload: RegisterUser = {
      owner: userWallet.toString(),
      name: values.nombre.trim(),
      lastName: values.apellido.trim(),
      dateOfBirth: values.fechaNacimiento,
      identity:
        userProfile?.data.identity.__option === "Some"
          ? userProfile?.data.identity.value
          : null,
      country: values.pais,
      address: values.direccion.trim(),
      phone: values.telefono.trim(),
      reputation: reputationProfileAddr.toString(),
      userProfile: userProfileAddr.toString(),
      lending: userProfile ? Number(userProfile.data.lending) : 0,
      deposited: userProfile ? Number(userProfile.data.deposited) : 0,
      staked: userProfile ? Number(userProfile.data.staked) : 0,
      isVerified: false,
      listings: userProfile?.data.listings ?? 0,
      activeStay:
        userProfile?.data.activeBooking.__option === "Some"
          ? userProfile?.data.activeBooking.value
          : null,
      email: user.email,
    };

    const result = await staykeApi.register(payload);

    if (result.status) {
      await refetchAccounts();
      sileo.success({ title: "¡Registro completado con éxito!" });
      resetForm();
      return;
    }

    renderBackendErrors(result);
  };

  const needsOnChainAccount = Boolean(
    userBackend && (!userProfile || !reputationProfile),
  );

  if (needsOnChainAccount) {
    return (
      <>
        <h1 className="font-plus-jakarta text-[32px] font-extrabold leading-tight text-white">
          Finalizá tu registro
        </h1>
        <p className="mt-2 font-plus-jakarta text-[14px] font-medium text-white/70">
          Tus datos ya están registrados en el sistema. Es necesario inicializar
          tu cuenta en la blockchain para completar el registro.
        </p>

        <button
          type="button"
          onClick={handleCreateOnChainAccount}
          disabled={loadingSignAndSend}
          className="mt-8 w-full cursor-pointer rounded-full bg-[#3B007F] px-6 py-3.5 font-plus-jakarta text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#5307AD] hover:shadow-[0_4px_12px_rgba(59,0,127,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingSignAndSend
            ? "Creando cuenta en blockchain..."
            : "Crear cuenta en blockchain"}
        </button>
      </>
    );
  }

  return (
    <>
      <h1 className="font-plus-jakarta text-[32px] font-extrabold leading-tight text-white">
        Culminá tu registro
      </h1>
      <p className="mt-2 font-plus-jakarta text-[14px] font-medium text-white/70">
        Solo unos datos más y terminamos
      </p>

      <Formik<RegisterValues>
        initialValues={initialValues}
        validationSchema={registerValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="mt-8 space-y-4" noValidate>
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

            <FormDateField name="fechaNacimiento" label="Fecha de nacimiento" />

            <FormField
              name="telefono"
              label="Teléfono"
              type="tel"
              autoComplete="tel"
              placeholder="+58 412 123 4567"
            />

            <FormField
              name="direccion"
              label="Dirección"
              type="text"
              autoComplete="street-address"
              placeholder="Calle, ciudad, código postal"
            />

            <FormSelect
              name="pais"
              label="País"
              placeholder="Seleccioná tu país"
              options={COUNTRIES.map((country) => ({
                value: country.iso2,
                label: country.nameES,
              }))}
            />

            <button
              type="submit"
              disabled={isSubmitting || loadingSignAndSend}
              className="mt-6 w-full cursor-pointer rounded-full bg-[#3B007F] px-6 py-3.5 font-plus-jakarta text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#5307AD] hover:shadow-[0_4px_12px_rgba(59,0,127,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Culminando registro..." : "Culminar registro"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};
