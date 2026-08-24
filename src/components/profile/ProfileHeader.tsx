"use client";

import { Menu, Star } from "lucide-react";

import type { ProfileHeaderProps } from "@/types/profile";
import { ModeSwitch } from "./ModeSwitch";
import { ProfileAvatar } from "./ProfileAvatar";
import { VerifiedBadge } from "./VerifiedBadge";

export function ProfileHeader({
  profile,
  mode,
  onChangeMode,
  onMenuOpen,
}: ProfileHeaderProps) {
  const score =
    mode === "host" ? profile.reputation.host : profile.reputation.guest;
  const label = mode === "host" ? "Anfitrión" : "Huésped";

  return (
    <div className="card-white">
      <div className="mb-5 flex items-center justify-between">
        {onMenuOpen && (
          <button
            type="button"
            onClick={onMenuOpen}
            className="rounded-lg p-2 text-[#434654] hover:bg-[#ebe7e7] transition-colors md:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="size-5" />
          </button>
        )}

        <ModeSwitch isHost={mode === "host"} changeMode={onChangeMode} />
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <ProfileAvatar
          avatar={profile.avatar}
          name={profile.name}
          lastName={profile.lastName}
        />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap">
            <p className="font-montserrat text-xl font-bold text-[#171717]">
              {profile.name} {profile.lastName}
            </p>
            {profile.isVerified && <VerifiedBadge />}
          </div>

          <p className="mt-1 font-sans text-sm text-[#434654]">
            {profile.email}
          </p>

          <div className="mt-3 flex items-center justify-center gap-1.5 sm:justify-start">
            <Star className="size-4 fill-accent-warm text-accent-warm" />
            <span className="font-sans text-sm font-semibold text-accent-warm">
              {score}
            </span>
            <span className="font-sans text-xs text-[#a0a5b5]">· {label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
