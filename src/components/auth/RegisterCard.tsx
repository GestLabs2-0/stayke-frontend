"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAppKitWallet } from "@reown/appkit-wallet-button/react";
import Link from "next/link";

import { BinanceIcon } from "@/icons/BinanceIcon";
import { ChevronLeftIcon } from "@/icons/ChevronLeftIcon";
import { FacebookIcon } from "@/icons/FacebookIcon";
import { GitHubIcon } from "@/icons/GitHubIcon";
import { GoogleIcon } from "@/icons/GoogleIcon";
import { MetamaskIcon } from "@/icons/MetamaskIcon";
import { MoreIcon } from "@/icons/MoreIcon";
import { PhantomIcon } from "@/icons/PhantomIcon";

const socialProviders = [
  { id: "google", icon: GoogleIcon, label: "Google", type: "google" },
  { id: "facebook", icon: FacebookIcon, label: "Facebook", type: "facebook" },
  { id: "phantom", icon: PhantomIcon, label: "Phantom", type: "phantom" },
  { id: "binance", icon: BinanceIcon, label: "Binance", type: "binance" },
  { id: "metamask", icon: MetamaskIcon, label: "MetaMask", type: "metamask" },
  { id: "github", icon: GitHubIcon, label: "GitHub", type: "github" },
] as const;

export const RegisterCard = () => {
  const { connect } = useAppKitWallet({
    namespace: "solana",
    onSuccess: (address: unknown) => {
      console.log("Connected to Solana: ", address);
    },
  });
  const { open } = useAppKit();

  return (
    <div className="relative mx-auto w-full max-w-135 lg:max-w-160">
      {/* Card con gradiente y sombra */}
      <div className="relative overflow-hidden rounded-[26px] bg-linear-to-b from-[rgba(59,0,127,0.3)] to-[rgba(255,255,255,0.5)] p-8 shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] backdrop-blur-sm sm:p-10 lg:p-12">
        {/* Back button */}
        <Link
          href={"/"}
          aria-label="Volver"
          className="mb-6 flex size-10 items-center justify-center rounded-2xl bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] transition-opacity hover:opacity-80"
        >
          <ChevronLeftIcon />
        </Link>

        {/* Title */}
        <h1 className="font-plus-jakarta text-[32px] font-extrabold leading-tight text-white">
          Bienvenido a Stayke
        </h1>

        {/* Email input + Continue button */}
        <div className="mt-8 flex items-center justify-between gap-2 rounded-[10px] bg-[#EFF3F6] pl-5 pr-2">
          <input
            id="email"
            type="text"
            placeholder="Dirección de correo electrónico"
            className="font-plus-jakarta text-[14px] h-4 font-semibold text-[#7C838F] focus-visible:outline-0 w-3/4"
          />

          <button
            onClick={() => {
              // open()
              connect("email");
            }}
            type="button"
            className="my-1 rounded-full bg-[#3B007F] cursor-pointer px-5 py-2.5 font-plus-jakarta text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Continuar
          </button>
        </div>

        {/* OR Divider */}
        <div className="relative my-7 flex items-center">
          <div className="h-px flex-1 bg-[rgba(219,219,219,0.3)]" />
          <span className="mx-4 font-plus-jakarta text-[14px] font-semibold text-[#EDEDEE]">
            OR
          </span>
          <div className="h-px flex-1 bg-[rgba(219,219,219,0.3)]" />
        </div>

        {/* Wallet/social buttons */}
        <div className="grid grid-cols-4 gap-3">
          {socialProviders.slice(0, 4).map((provider) => (
            <button
              key={provider.id}
              onClick={() => {
                connect(provider.type);
              }}
              type="button"
              aria-label={`Registrarse con ${provider.label}`}
              className="flex h-12.5 cursor-pointer items-center justify-center rounded-[10px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90"
            >
              <provider.icon className="size-7" />
            </button>
          ))}
          {socialProviders.slice(4).map((provider) => (
            <button
              key={provider.id}
              onClick={() => {
                connect(provider.type);
              }}
              type="button"
              aria-label={`Registrarse con ${provider.label}`}
              className="flex h-12.5 cursor-pointer items-center justify-center rounded-[10px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90"
            >
              <provider.icon className="size-7" />
            </button>
          ))}
          {/* More wallets button — abre el modal nativo de AppKit */}
          <button
            onClick={() => open()}
            type="button"
            aria-label="Más wallets"
            className="flex h-12.5 cursor-pointer items-center justify-center rounded-[10px] bg-white/70 shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] transition-opacity hover:opacity-80"
          >
            <MoreIcon className="size-6 text-[#3B007F]" />
          </button>
        </div>
      </div>

      {/* Wave decoration */}
      {/*<svg
        className="mx-auto -mt-2 h-3 w-auto"
        viewBox="0 0 159 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M158.554 7.3592C157.956 10.0951 154.975 8.31663 153.033 8.08517C143.1 6.94758 133.031 6.60701 123.264 4.21697C117.028 2.62157 111.797 3.4988 105.646 2.36654C100.691 1.45707 95.6375 0.22573 90.5824 0.224248C84.8664 0.222637 79.1505 0.775618 73.3736 2.12847C67.831 3.42334 62.1954 4.83173 56.5098 5.08992C50.1185 5.38096 43.7144 4.76055 37.2439 5.08992C32.7767 5.31469 28.7226 6.42257 24.3371 7.40038C19.1906 8.54548 14.0363 9.63326 8.75794 10.077C5.90244 10.3113 0.244092 10.6798 1.45231 6.97946C1.94863 5.53957 3.90602 5.47055 5.15568 5.34662"
          stroke="white"
          strokeWidth="0.506494"
          strokeLinecap="round"
        />
      </svg>*/}

      <p className="mt-4 text-center font-plus-jakarta text-[11px] font-medium leading-relaxed text-white/80">
        Al registrarte, aceptas nuestros Términos de servicio y Política de
        privacidad.
      </p>
    </div>
  );
};
