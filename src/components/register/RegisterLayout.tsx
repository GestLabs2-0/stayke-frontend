"use client";

import { useUser } from "@dynamic-labs-sdk/react-hooks";
import Link from "next/link";

import { RouteGuard } from "@/components/auth/RouteGuard";
import { routes } from "@/constants/routes";
import { ChevronLeftIcon } from "@/icons/ChevronLeftIcon";
import { EmailVerificationStep } from "./EmailVerificationStep";
import { RegisterCard } from "./RegisterCard";

export function RegisterLayout() {
  const { data: user } = useUser();
  const needsEmailVerification = Boolean(user && !user.email);

  return (
    <RouteGuard mode="guest-only">
      <div className="relative mx-auto w-full max-w-135 lg:max-w-160">
        <div className="relative overflow-hidden rounded-[26px] bg-linear-to-b from-[rgba(59,0,127,0.3)] to-[rgba(255,255,255,0.5)] p-8 shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] backdrop-blur-sm sm:p-10 lg:p-12">
          <Link
            href={routes.Home}
            aria-label="Volver"
            className="mb-6 flex size-10 items-center justify-center rounded-2xl bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] transition-opacity hover:opacity-80"
          >
            <ChevronLeftIcon />
          </Link>

          {needsEmailVerification ? (
            <EmailVerificationStep onSuccess={() => {}} />
          ) : (
            <RegisterCard />
          )}
        </div>

        <p className="mt-4 text-center font-plus-jakarta text-[11px] font-medium leading-relaxed text-white/80">
          Al registrarte, aceptas nuestros Términos de servicio y Política de
          privacidad.
        </p>
      </div>
    </RouteGuard>
  );
}
