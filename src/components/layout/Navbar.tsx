"use client";

import { Globe, Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { LogoStayke } from "../../components/Icons/LogoStayke.tsx";
import { linkNavegation } from "../../constants/constants.ts";
import { routes } from "../../constants/routes.ts";
import { NavbarMenuDesktop } from "./NavbarMenuDesktop.tsx";
import { NavbarMobile, NavbarMobileDropdown } from "./NavbarMobile.tsx";
// import { NetworkSelector } from "./NetworkSelector.tsx";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  console.log(isDesktopMenuOpen, "desktop Menu");
  console.log(isMenuOpen, "Is Menu Open");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-(--background-navbar) font-montserrat relative">
      <section className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href={routes.Home} className="flex items-center gap-2">
            <LogoStayke className="h-5 w-auto md:h-8 lg:h-10" />
            <span
              className="
                text-lg
                md:text-xl
                lg:text-2xl
                font-bold
                tracking-wide
                text-(--letter-navbar)
              "
            >
              STAYKE
            </span>
          </Link>
        </div>

        {/* Navegación Desktop */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-8">
          {linkNavegation.map((nav) => (
            <Link
              key={nav.link}
              href={nav.link}
              className="
                text-xs
                md:text-xs
                lg:text-xs
                xl:text-base
                font-semibold
                text-(--letter-navbar)
                transition-opacity
                hover:opacity-80
              "
            >
              {nav.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span
            className="
              whitespace-nowrap
              text-xs
              lg:text-sm
              xl:text-base
              font-semibold
              text-(--letter-navbar)
            "
          >
            Aloja tu Casa
          </span>

          <Globe className="size-4 lg:size-5 shrink-0 text-(--letter-navbar)" />

          <div className="relative">
            <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-4 py-2">
              <button
                type="button"
                ref={menuTriggerRef}
                onClick={() => setIsDesktopMenuOpen((prev) => !prev)}
                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Menu className="size-4 text-[#3B007f]" />
              </button>
              <UserRound className="size-4 text-[#3B007f]" />
              {/* TODO: Tenerlo en cuenta para uso desktop/mobile (Aún no se sabe si netamente para pruebas o para usarlo normal también)
              <div className="flex items-center gap-3">
                <NetworkSelector />
              </div>
               */}
            </div>

            <NavbarMenuDesktop
              isOpen={isDesktopMenuOpen}
              onClose={() => setIsDesktopMenuOpen(false)}
              triggerRef={menuTriggerRef}
            />
          </div>
        </div>

        {/* Mobile Trigger — Menu + UserRound pill */}
        <NavbarMobile onToggle={() => setIsMenuOpen((prev) => !prev)} />
      </section>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <NavbarMobileDropdown onClose={() => setIsMenuOpen(false)} />
      )}
    </nav>
  );
};
