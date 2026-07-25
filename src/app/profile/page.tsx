"use client";

import { useState } from "react";

import { GuestView } from "@/components/profile/GuestView";
import { HostView } from "@/components/profile/HostView";
import {
  hostingsMock,
  profileMock,
  propertiesMock,
  reservationsMock,
} from "@/components/profile/mockData";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { TreasuryCard } from "@/components/profile/TreasuryCard";
import { VerificationBanner } from "@/components/profile/VerificationBanner";
import type { ProfileMode } from "@/types/profile";

export default function PaginaPerfil() {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState<ProfileMode>("host");
  const [activeItem, setActiveItem] = useState("profile");

  const hostings = hostingsMock;
  const properties = propertiesMock;
  const reservations = reservationsMock;

  const handleNavigate = (id: string) => {
    if (id === "logout") {
      if (window.confirm("¿Estás seguro de que querés cerrar sesión?")) {
        // TODO: implementar logout real
      }
      return;
    }
    setActiveItem(id);
  };

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] bg-gradient-to-br from-primary/5 to-[#e8604c]/[0.05]">
      <ProfileSidebar
        expanded={expanded}
        onToggleExpand={() => setExpanded((e) => !e)}
        activeItem={activeItem}
        onNavigate={(id) => {
          handleNavigate(id);
          setMobileOpen(false);
        }}
        mode={mode}
        onChangeMode={(m) => {
          setMode(m);
          setMobileOpen(false);
        }}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        profile={profileMock}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <ProfileHeader
              profile={profileMock}
              mode={mode}
              onChangeMode={setMode}
              onMenuOpen={() => setMobileOpen(true)}
            />
            {activeItem === "settings" ? (
              <div className="card-white">
                <p className="font-montserrat text-lg font-bold text-foreground">
                  Configuración
                </p>
                <p className="mt-2 font-sans text-sm text-secondary">
                  Preferencias de cuenta, notificaciones y más ajustes.
                </p>
              </div>
            ) : (
              <div key={mode} className="animate-fade-in-up space-y-8">
                {!profileMock.isVerified && <VerificationBanner />}
                {mode === "host" ? (
                  <>
                    <TreasuryCard balanceUsd={profileMock.treasuryUsd} />
                    <HostView hostings={hostings} properties={properties} />
                  </>
                ) : (
                  <>
                    <TreasuryCard balanceUsd={profileMock.treasuryUsd} />
                    <GuestView reservations={reservations} />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
