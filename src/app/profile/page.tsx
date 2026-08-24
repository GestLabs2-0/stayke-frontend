"use client";

import { GuestView } from "@/components/profile/GuestView";
import { HostView } from "@/components/profile/HostView";
import {
  hostingsMock,
  propertiesMock,
  reservationsMock,
} from "@/components/profile/mockData";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { TreasuryCard } from "@/components/profile/TreasuryCard";
import { VerificationBanner } from "@/components/profile/VerificationBanner";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const { profile, mode, setMode, setMobileOpen } = useProfile();

  const hostings = hostingsMock;
  const properties = propertiesMock;
  const reservations = reservationsMock;

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
        {mode === "host" ? (
          <>
            <TreasuryCard balanceUsd={profile.treasuryUsd} />
            <HostView hostings={hostings} properties={properties} />
          </>
        ) : (
          <>
            <TreasuryCard balanceUsd={profile.treasuryUsd} />
            <GuestView reservations={reservations} />
          </>
        )}
      </div>
    </>
  );
}
