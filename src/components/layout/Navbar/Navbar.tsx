"use client";

import { useLogout, useUser } from "@dynamic-labs-sdk/react-hooks";
import { Globe, Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { AuthModal } from "@/components/auth/AuthModal";
import { NETWORK_SELECTOR } from "@/shared/constants";
import { linkNavegation } from "../../../constants/constants";
import { routes } from "../../../constants/routes";
import { LogoStayke } from "../../../icons/LogoStayke";
import { NetworkSelector } from "../NetworkSelector";
import { NavbarMenuDesktop } from "./NavbarMenuDesktop";
import { NavbarMobileDropdown } from "./NavbarMobile";
// import { NetworkSelector } from "./NetworkSelector";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const { data: user } = useUser();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
    setIsAuthOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background-navbar font-montserrat">
      <section className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Desktop Logo */}
        <div className="hidden md:flex items-center gap-6">
          <Link href={routes.Home} className="flex items-center gap-2">
            <LogoStayke className="text-white w-32 h-8 lg:w-36 lg:h-9" />
          </Link>
        </div>

        {/* Navegation Desktop */}
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
                text-letter-navbar
                transition-opacity
                hover:opacity-80
              "
            >
              {nav.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="#"
            target="_blank"
            className="
              whitespace-nowrap
              text-xs
              lg:text-sm
              xl:text-base
              font-semibold
              text-letter-navbar
            "
          >
            Aloja tu Casa
          </Link>

          <Globe className="size-4 lg:size-5 shrink-0 text-letter-navbar" />

          <div className="relative flex items-center gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  ref={menuTriggerRef}
                  onClick={() => setIsDesktopMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-4 py-2 transition-opacity hover:opacity-80"
                >
                  <Menu className="size-4 text-[#3B007f]" />
                  <span className="text-xs font-semibold text-[#3B007f]">
                    {user.email?.split("@")[0]}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-white/80 bg-white px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-4 py-2 transition-opacity hover:opacity-80"
              >
                <Menu className="size-4 text-[#3B007f]" />
                <UserRound className="size-4 text-[#3B007f]" />
              </button>
            )}

            {/* NavegationMenuDesktop */}
            <NavbarMenuDesktop
              isOpen={isDesktopMenuOpen}
              onClose={() => setIsDesktopMenuOpen(false)}
              triggerRef={menuTriggerRef}
            />
          </div>
        </div>
        {NETWORK_SELECTOR && (
          <div className="flex items-center gap-3">
            <NetworkSelector />
          </div>
        )}
        {/* Mobile Interface */}
        <div className="flex md:hidden items-center justify-between w-full">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-letter-navbar truncate max-w-[100px]">
                {user.email?.split("@")[0]}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-red-500 hover:text-red-600 font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label="Iniciar sesión"
              onClick={() => setIsAuthOpen(true)}
              className="p-2 text-letter-navbar hover:opacity-80 transition-opacity rounded-full border border-white "
            >
              <UserRound className="size-5" />
            </button>
          )}

          <Link href={routes.Home}>
            <LogoStayke className="text-white w-40 h-8" />
          </Link>

          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-letter-navbar hover:opacity-80 transition-opacity"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </section>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <NavbarMobileDropdown onClose={() => setIsMenuOpen(false)} />
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
};
