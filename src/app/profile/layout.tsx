"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { routes } from "@/constants/routes";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";
import { useWalletContext } from "@/hooks/useWallet";

function ProfileShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { mode, setMode, profile, mobileOpen, setMobileOpen } = useProfile();
  const router = useRouter();
  const { logout } = useWalletContext();

  const [expanded, setExpanded] = useState(false);

  // Determine active sidebar item from the current path
  const activeItem = pathname === "/profile" ? "profile" : "profile";

  const handleNavigate = (id: string) => {
    if (id === "logout") {
      logout();
    }
    if (id === "profile") {
      router.push(routes.Profile);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] bg-linear-to-br from-primary/5 to-[#e8604c]/5">
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
        profile={profile}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-8">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <ProfileShell>{children}</ProfileShell>
    </ProfileProvider>
  );
}
