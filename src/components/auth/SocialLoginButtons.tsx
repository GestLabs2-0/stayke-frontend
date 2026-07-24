"use client";

import { useSignInWithSocialRedirect } from "@dynamic-labs-sdk/react-hooks";
import { useCallback } from "react";

import { GitHubIcon } from "@/icons/GitHubIcon";
import { GoogleIcon } from "@/icons/GoogleIcon";

type SocialProvider = "google" | "github";

const PROVIDERS: {
  key: SocialProvider;
  label: string;
  Icon: typeof GoogleIcon;
}[] = [
  { key: "google", label: "Google", Icon: GoogleIcon },
  { key: "github", label: "GitHub", Icon: GitHubIcon },
];

export function SocialLoginButtons() {
  const { mutate: signInWithRedirect, isPending } =
    useSignInWithSocialRedirect();

  const handleLogin = useCallback(
    (provider: SocialProvider) => {
      signInWithRedirect({ provider, redirectUrl: window.location.href });
    },
    [signInWithRedirect],
  );

  return (
    <div className="flex flex-col gap-3">
      {PROVIDERS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => handleLogin(key)}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#C3C6D6] bg-white px-4 py-3 font-plus-jakarta font-semibold text-[#171717] transition-colors hover:bg-[#EBE7E7] disabled:opacity-50"
        >
          <Icon className="size-5 shrink-0" />
          {label}
        </button>
      ))}
    </div>
  );
}
