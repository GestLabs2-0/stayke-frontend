"use client";

import { Globe, Menu, UserRound } from "lucide-react";
import Link from "next/link";

import { linkNavegation } from "../../../constants/constants";
import type {
  NavbarMobileDropdownProps,
  NavbarMobileTriggerProps,
} from "../../../types/Navbar";

export const NavbarMobile = ({ onToggle }: NavbarMobileTriggerProps) => {
  return (
    <div className="md:hidden flex items-center gap-2">
      <button
        type="button"
        aria-label="Abrir menú"
        onClick={onToggle}
        className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-4 py-2"
      >
        <Menu className="size-4 text-[#3B007f]" />
        <UserRound className="size-4 text-[#3B007f]" />
      </button>
    </div>
  );
};

export const NavbarMobileDropdown = ({
  onClose,
}: NavbarMobileDropdownProps) => {
  return (
    <section className="md:hidden border-t border-white/20 px-6 py-4">
      <div className="flex flex-col items-end gap-4">
        {linkNavegation.map((nav) => (
          <Link
            key={nav.link}
            href={nav.link}
            onClick={onClose}
            className="
              text-sm
              font-semibold
              text-(--letter-navbar)
              transition-opacity
              hover:opacity-80
            "
          >
            {nav.name}
          </Link>
        ))}

        <div className="mt-2 flex items-center gap-2">
          <Globe className="size-4 text-(--letter-navbar)" />

          <span className="text-sm font-semibold text-(--letter-navbar)">
            Aloja tu Casa
          </span>
        </div>
      </div>
    </section>
  );
};
