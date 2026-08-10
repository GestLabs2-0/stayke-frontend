"use client";

import { useLogout, useUser } from "@dynamic-labs-sdk/react-hooks";
import { Globe, Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { AuthModal } from "@/components/auth/AuthModal";
import { useProfile } from "@/hooks/useProfile";
import { useWalletContext } from "@/hooks/useWallet";
import { linkNavegation } from "../../../constants/constants";
import { routes } from "../../../constants/routes";
import { LogoStayke } from "../../../icons/LogoStayke";
import { NavbarMenuDesktop } from "./NavbarMenuDesktop";
import { NavbarMobileSidebar } from "./NavbarMobileSidebar";

export const Navbar = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const { userBackend, userProfile, reputationProfile } = useWalletContext();
  const { profile, setMode } = useProfile();

  const isLoggedIn = Boolean(user);
  const isFullyRegistered = Boolean(
    user && userBackend && userProfile && reputationProfile,
  );

  const handleLogout = () => {
    logout();
    setIsAuthOpen(false);
  };

  const setHost = () => {
    setMode("host");
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
              onClick={() => {
                setMode("host");
              }}
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

        {/* Desktop — Right section */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={routes.Profile.properties.create}
            onClick={setHost}
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
            {isLoggedIn && !isFullyRegistered ? (
              <Link
                href={routes.Register}
                className="rounded-full bg-white px-4 py-2 font-plus-jakarta text-xs font-bold text-[#3b007f] transition-all hover:bg-white/90 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]"
              >
                Culmina tu registro
              </Link>
            ) : isFullyRegistered ? (
              <>
                <button
                  type="button"
                  ref={menuTriggerRef}
                  onClick={() => setIsDesktopMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-4 py-2 transition-opacity hover:opacity-80"
                >
                  <Menu className="size-4 text-[#3b007f]" />
                  <span className="text-xs font-semibold text-[#3b007f]">
                    {userBackend?.name}
                  </span>
                </button>

                <NavbarMenuDesktop
                  isOpen={isDesktopMenuOpen}
                  onClose={() => setIsDesktopMenuOpen(false)}
                  triggerRef={menuTriggerRef}
                  profile={profile}
                  onLogout={handleLogout}
                />
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 font-semibold rounded-2xl border border-white/80 bg-white px-4 py-2 transition-opacity hover:opacity-80"
              >
                Inicia sesión
              </button>
            )}
          </div>
        </div>

        {/* Mobile Interface */}
        <div className="flex md:hidden items-center justify-between w-full">
          <Link href={routes.Home}>
            <LogoStayke className="text-white w-40 h-8" />
          </Link>

          <div className="flex items-center gap-2">
            {isLoggedIn && !isFullyRegistered ? (
              <Link
                href={routes.Register}
                className="rounded-full bg-white px-3 py-1.5 font-plus-jakarta text-[11px] font-bold text-[#3b007f]"
              >
                Culmina tu registro
              </Link>
            ) : (
              <button
                type="button"
                aria-label={isFullyRegistered ? "Perfil" : "Iniciar sesión"}
                onClick={() => {
                  if (isFullyRegistered) {
                    setIsMobileSidebarOpen(true);
                  } else {
                    setIsAuthOpen(true);
                  }
                }}
                className="flex items-center gap-1.5 rounded-full border border-white/80 px-3 py-1.5 text-letter-navbar hover:opacity-80 transition-opacity"
              >
                <UserRound className="size-4" />
                {isFullyRegistered ? (
                  <span className="font-plus-jakarta text-base font-semibold">
                    Perfil
                  </span>
                ) : (
                  <span className="font-plus-jakarta text-base font-semibold">
                    Inicia sesion
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 ml-3 text-letter-navbar cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Sidebar */}
      <NavbarMobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        isFullyRegistered={isFullyRegistered}
        profile={profile}
        userEmail={user?.email}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        setHost={setHost}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
};
