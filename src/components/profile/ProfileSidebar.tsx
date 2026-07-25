"use client";

import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";

import type { NavItem, ProfileSidebarProps } from "@/types/profile";
import { SidebarMobile } from "./SidebarMobile";
import { SidebarModeFooter } from "./SidebarModeFooter";
import { SidebarNav } from "./SidebarNav";

const NAV_ITEMS: NavItem[] = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "settings", label: "Configuración", icon: Settings },
  {
    id: "logout",
    label: "Cerrar sesión",
    icon: LogOut,
    action: "logout",
  },
];

export function ProfileSidebar({
  expanded,
  onToggleExpand,
  activeItem,
  onNavigate,
  mode,
  onChangeMode,
  mobileOpen,
  onMobileClose,
  minimized = false,
  profile,
}: ProfileSidebarProps) {
  const baseWidth = minimized ? "w-16" : expanded ? "w-64" : "w-16";

  const handleSelect = (item: NavItem) => {
    if (item.action === "logout") {
      onNavigate("logout");
    } else {
      onNavigate(item.id);
    }
    onMobileClose();
  };

  return (
    <>
      <aside
        className={`hidden sticky top-16 md:flex h-[calc(100dvh-4rem)] flex-col overflow-hidden border-r border-border transition-all duration-300 ease-out ${baseWidth}`}
      >
        <div className="flex h-full flex-col bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-4">
            {expanded && profile && (
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full"
                unoptimized
              />
            )}
            {expanded && profile && (
              <span className="font-montserrat text-sm font-semibold text-foreground">
                ¡Hola, {profile.name}!
              </span>
            )}
            <button
              type="button"
              onClick={onToggleExpand}
              className={`rounded-lg p-1.5 text-secondary hover:bg-white/80 transition-colors ${expanded ? "ml-auto" : "mx-auto"}`}
              aria-label={expanded ? "Colapsar menú" : "Expandir menú"}
            >
              {expanded ? (
                <ChevronLeft className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
          </div>

          <SidebarNav
            items={NAV_ITEMS}
            activeItem={activeItem}
            onSelect={handleSelect}
            expanded={expanded}
          />

          <SidebarModeFooter
            mode={mode}
            expanded={expanded}
            onChangeMode={onChangeMode}
            onNavigate={onNavigate}
          />
        </div>
      </aside>

      <SidebarMobile
        open={mobileOpen}
        onClose={onMobileClose}
        items={NAV_ITEMS}
        activeItem={activeItem}
        onSelect={handleSelect}
        profile={profile}
        mode={mode}
        onChangeMode={onChangeMode}
        onNavigate={onNavigate}
      />
    </>
  );
}
