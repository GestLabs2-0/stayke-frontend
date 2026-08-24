"use client";

import { X } from "lucide-react";
import Image from "next/image";

import type { SidebarMobileProps } from "@/types/profile";
import { ImagePlaceholder } from "../shared/ImagePlaceholder";
import { SidebarModeFooter } from "./SidebarModeFooter";
import { SidebarNav } from "./SidebarNav";

export function SidebarMobile({
  open,
  onClose,
  items,
  onSelect,
  profile,
  mode,
  onChangeMode,
  onNavigate,
}: SidebarMobileProps) {
  return (
    <div
      className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: click handler on overlay is intentional*/}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: allow */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside
        className={`absolute left-0 top-0 h-full w-72 bg-white/95 backdrop-blur-md shadow-xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-4 py-4">
            {profile &&
              (profile.avatar !== null ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={32}
                  height={32}
                  className="size-8 shrink-0 rounded-full"
                  unoptimized
                />
              ) : (
                <div className="size-12">
                  <ImagePlaceholder
                    name={profile.name}
                    lastName={profile.lastName}
                  />
                </div>
              ))}
            <span className="font-montserrat text-sm font-semibold text-[#171717]">
              {profile ? `¡Hola, ${profile.name}!` : "Menú"}
            </span>
            <button
              onClick={onClose}
              type="button"
              className="ml-auto rounded-lg p-1.5 text-[#434654] hover:bg-white/80 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="size-5" />
            </button>
          </div>

          <SidebarNav
            mode={mode}
            items={items}
            onSelect={onSelect}
            expanded={true}
          />

          <SidebarModeFooter
            mode={mode}
            expanded={true}
            onChangeMode={onChangeMode}
            onNavigate={onNavigate}
          />
        </div>
      </aside>
    </div>
  );
}
