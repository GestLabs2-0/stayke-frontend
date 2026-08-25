"use client";

import type { ReactNode } from "react";
import { createContext, useEffect, useMemo, useState } from "react";

import { buildImageUrl } from "@/helpers/buildImageUrl";
import { useWalletContext } from "@/hooks/useWallet";
import { MINT_DECIMALS } from "@/shared/constants";
import type { ProfileData, ProfileMode } from "@/types/profile";

// ── Context shape ──

export interface ProfileContextValue {
  mode: ProfileMode;
  setMode: (m: ProfileMode) => void;
  profile: ProfileData;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}
export const ProfileContext = createContext<ProfileContextValue | null>(null);

function computeScore(totalScore: bigint, reviews: number): number {
  if (reviews <= 0) return 0;
  const average = Number(totalScore) / reviews;
  return Math.round(average * 10) / 10;
}

const LOCAL_STORAGE_KEYS = {
  mode: "mode",
};

// ── Provider ──

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ProfileMode>(() => {
    if (typeof window !== "undefined") {
      const localMode = localStorage.getItem(LOCAL_STORAGE_KEYS.mode);
      if (localMode && (localMode === "host" || localMode === "guest"))
        return localMode;
    }
    return "guest";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userProfile, userBackend, reputationProfile } = useWalletContext();

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.mode, mode);
  }, [mode]);

  const profile: ProfileData = useMemo(() => {
    const hasIdentityPda = userProfile?.data.identity.__option === "Some";
    const isBanned = Boolean(userProfile?.data.banned);

    const avatar = userBackend?.avatarUrl
      ? (buildImageUrl(userBackend?.avatarUrl) ?? null)
      : null;

    return {
      name: userBackend?.name ?? "",
      lastName: userBackend?.lastName ?? "",
      email: userBackend?.email ?? "",
      avatar,
      isVerified:
        (hasIdentityPda && !isBanned) || Boolean(userBackend?.isVerified),
      reputation: {
        host: computeScore(
          reputationProfile?.data.totalScoreHost ?? 0n,
          reputationProfile?.data.hostReviews ?? 0,
        ),
        guest: computeScore(
          reputationProfile?.data.totalScoreClient ?? 0n,
          reputationProfile?.data.clientReviews ?? 0,
        ),
      },
      // Depósito on-chain en USD (convertido desde unidades mínimas de USDC con MINT_DECIMALS)
      treasuryUsd: userProfile?.data?.deposited
        ? Number(userProfile.data.deposited) / 10 ** MINT_DECIMALS
        : 0,
    };
  }, [userProfile, userBackend, reputationProfile]);

  return (
    <ProfileContext.Provider
      value={{
        mode,
        setMode,
        profile,
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
