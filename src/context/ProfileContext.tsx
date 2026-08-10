"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { profileMock } from "@/components/profile/mockData";
import type { ProfileData, ProfileMode } from "@/types/profile";

// ── Context shape ──

interface ProfileContextValue {
  mode: ProfileMode;
  setMode: (m: ProfileMode) => void;
  profile: ProfileData;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

// ── Provider ──

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ProfileMode>("host");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ProfileContext.Provider
      value={{
        mode,
        setMode,
        profile: profileMock,
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

// ── Hook ──

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}
