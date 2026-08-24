"use client";

import { Globe, LogOut, Star, UserRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { linkNavegation } from "../../../constants/constants";
import { routes } from "../../../constants/routes";
import type { NavbarMobileSidebarProps } from "../../../types/Navbar";

export const NavbarMobileSidebar = ({
  isOpen,
  onClose,
  isLoggedIn,
  isFullyRegistered,
  profile,
  userEmail,
  onLoginClick,
  onLogout,
  setHost,
}: NavbarMobileSidebarProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const displayName = userEmail?.split("@")[0] ?? "";

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar menú"
        className={`fixed inset-0 z-40 cursor-default bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed right-0 top-0 z-50 h-full w-72 transform bg-[#3b007f] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button + header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <span className="font-montserrat text-sm font-semibold text-white">
            Menú
          </span>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={onClose}
            className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ── User section ── */}
        {isFullyRegistered && profile ? (
          <div className="border-b border-white/15 px-5 py-4">
            <div className="flex items-center gap-3">
              {profile &&
                (profile.avatar !== null ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    width={40}
                    height={40}
                    className="size-10 rounded-full bg-white/20"
                  />
                ) : (
                  <div className="size-12">
                    <ImagePlaceholder
                      name={profile.name}
                      lastName={profile.lastName}
                    />
                  </div>
                ))}

              <div className="min-w-0 flex-1">
                <p className="truncate font-montserrat text-sm font-semibold text-white">
                  {profile.name}
                </p>
                <p className="truncate text-xs text-white/60">
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Reputation pills */}
            <div className="mt-3 flex gap-3">
              <div className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5">
                <Star className="size-3 fill-white text-white" />
                <span className="text-xs font-semibold text-white">
                  {profile.reputation.host}
                </span>
                <span className="text-[10px] text-white/50">anfitrión</span>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5">
                <Star className="size-3 fill-white text-white" />
                <span className="text-xs font-semibold text-white">
                  {profile.reputation.guest}
                </span>
                <span className="text-[10px] text-white/50">huésped</span>
              </div>
            </div>

            {/* Profile link */}
            <Link
              href={routes.Profile.index}
              onClick={onClose}
              className="mt-3 flex items-center justify-between rounded-xl bg-white/15 px-4 py-2.5 transition-colors hover:bg-white/25"
            >
              <div className="flex items-center gap-2">
                <UserRound className="size-4 text-white" />
                <span className="font-plus-jakarta text-sm font-semibold text-white">
                  Ver perfil
                </span>
              </div>
              {profile.isVerified && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                  Verificado
                </span>
              )}
            </Link>
          </div>
        ) : isLoggedIn ? (
          /* Logged in but not fully registered */
          <div className="border-b border-white/15 px-5 py-4">
            {displayName && (
              <p className="font-montserrat text-sm font-semibold text-white">
                {`Hola, ${displayName}`}
              </p>
            )}

            <Link
              href={routes.Register}
              onClick={onClose}
              className="mt-3 flex w-full items-center justify-center rounded-full bg-white px-4 py-2.5 font-plus-jakarta text-sm font-bold text-[#3b007f] transition-all hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
            >
              Culmina tu registro
            </Link>
          </div>
        ) : (
          /* Not logged in */
          <div className="border-b border-white/15 px-5 py-4">
            <button
              type="button"
              onClick={() => {
                onLoginClick();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 font-plus-jakarta text-sm font-bold text-[#3b007f] transition-all hover:bg-white/90"
            >
              <UserRound className="size-4" />
              Iniciar sesión
            </button>
          </div>
        )}

        {/* ── Navigation links ── */}
        <nav className="px-5 py-4">
          <ul className="flex flex-col gap-1">
            {linkNavegation.map((nav) => (
              <li key={nav.link}>
                <Link
                  href={nav.link}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2.5 font-montserrat text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {nav.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Host CTA ── */}
        <div className="mx-5 rounded-xl bg-white/10 px-4 py-3">
          <Link
            onClick={setHost}
            href={routes.Profile.properties.create}
            className="flex items-center gap-2"
          >
            <Globe className="size-4 text-white/80" />
            <span className="font-montserrat text-sm font-semibold text-white">
              Aloja tu Casa
            </span>
          </Link>
        </div>

        {/* ── Logout (fully registered only) ── */}
        {isLoggedIn && (
          <div className="px-5 pt-4 pb-6">
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </>
  );
};
