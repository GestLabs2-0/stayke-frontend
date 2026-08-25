"use client";

import { GuestView } from "@/components/profile/GuestView";
import { HostView } from "@/components/profile/HostView";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { TreasuryCard } from "@/components/profile/TreasuryCard";
import { VerificationBanner } from "@/components/profile/VerificationBanner";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const { profile, mode, setMode, setMobileOpen } = useProfile();

  return (
    <>
      <ProfileHeader
        profile={profile}
        mode={mode}
        onChangeMode={setMode}
        onMenuOpen={() => setMobileOpen(true)}
      />

      <div className="animate-fade-in-up space-y-8">
        {!profile.isVerified && <VerificationBanner />}
        <TreasuryCard balanceUsd={profile.treasuryUsd} />
        {mode === "host" ? <HostView /> : <GuestView />}
      </div>
    </>
  );
}
