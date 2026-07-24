"use client";

import { useUser } from "@dynamic-labs-sdk/react-hooks";

import { LogoStayke } from "@/icons/LogoStayke";
import { MailIcon } from "@/icons/MailIcon";
import type { AuthViewMainProps } from "@/types/auth";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { WalletLoginList } from "./WalletLoginList";

export function AuthViewMain({ onEmailClick, onClose }: AuthViewMainProps) {
  const { data: user } = useUser();

  if (user) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <LogoStayke size={140} className="h-9 text-[#3B007F]" />
        </div>

        <div>
          <h4 className="font-plus-jakarta text-lg font-bold text-[#171717]">
            Ya iniciaste sesión
          </h4>
          <p className="mt-1 text-sm text-[#434654]">
            {user.email ?? user.alias ?? "Usuario"}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[#3B007F] px-4 py-3 font-plus-jakarta font-semibold text-white transition-colors hover:bg-[#5307ad]"
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <LogoStayke size={140} className="h-9 text-[#3B007F]" />
        </div>
        <h4 className="font-plus-jakarta text-lg font-bold text-[#171717]">
          Inicia sesión o regístrate
        </h4>
        <p className="mt-1 text-sm text-[#434654]">
          Elige cómo quieres continuar
        </p>
      </div>

      {/* Social login */}
      <SocialLoginButtons />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#EBE7E7]" />
        <span className="text-xs font-plus-jakarta font-semibold uppercase tracking-wider text-[#A0A5B5]">
          Continua con
        </span>
        <div className="h-px flex-1 bg-[#EBE7E7]" />
      </div>

      {/* Email login */}
      <button
        type="button"
        onClick={onEmailClick}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#C3C6D6] bg-white px-4 py-3 font-plus-jakarta font-semibold text-[#171717] transition-colors hover:bg-[#EBE7E7]"
      >
        <MailIcon className="size-5 shrink-0 text-[#434654]" />
        Correo electrónico
      </button>

      {/* Wallet login */}
      <WalletLoginList />
    </div>
  );
}
