"use client";

import { LogOut, Star, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { routes } from "../../../constants/routes";
import type { NavbarMenuDesktopProps } from "../../../types/Navbar";

export const NavbarMenuDesktop = ({
  isOpen,
  onClose,
  triggerRef,
  profile,
  onLogout,
}: NavbarMenuDesktopProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (triggerRef.current?.contains(target)) return;

      if (menuRef.current && !menuRef.current.contains(target)) {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-2xl bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]"
    >
      {/* Header — greeting */}
      <div className="border-b border-[#c3c6d6]/30 px-5 py-4">
        <p className="font-montserrat text-sm font-semibold text-[#3b007f]">
          Hola, {profile.name}
        </p>
        <p className="mt-0.5 text-xs text-[#434654]">{profile.email}</p>
      </div>

      {/* Profile link */}
      <Link
        href={routes.Profile.index}
        onClick={onClose}
        className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-[#ebe7e7]"
      >
        <div className="flex items-center gap-3">
          <UserRound className="size-4 text-[#3b007f]" />
          <span className="font-plus-jakarta text-sm font-semibold text-[#171717]">
            Perfil
          </span>
        </div>
        {profile.isVerified && (
          <span className="rounded-full bg-[#3b007f]/10 px-2 py-0.5 text-[11px] font-semibold text-[#3b007f]">
            Verificado
          </span>
        )}
      </Link>

      {/* Reputation */}
      <div className="border-t border-[#c3c6d6]/30 px-5 py-3">
        <p className="font-plus-jakarta text-xs font-semibold text-[#434654]">
          Reputación
        </p>
        <div className="mt-2 flex gap-4">
          <div className="flex items-center gap-1.5">
            <Star className="size-3.5 fill-[#3b007f] text-[#3b007f]" />
            <span className="text-xs font-semibold text-[#171717]">
              {profile.reputation.host}
            </span>
            <span className="text-[10px] text-[#a0a5b5]">anfitrión</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="size-3.5 fill-[#3b007f] text-[#3b007f]" />
            <span className="text-xs font-semibold text-[#171717]">
              {profile.reputation.guest}
            </span>
            <span className="text-[10px] text-[#a0a5b5]">huésped</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="border-t border-[#c3c6d6]/30 px-3 py-2">
        <button
          type="button"
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut className="size-3.5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
