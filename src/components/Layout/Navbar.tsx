"use client";
//Library
import { Menu, X, Shield } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
//React
import { useState } from "react";
//Next
import Link from "next/link";
//Constants
import { navLinks } from "../../constants";
import { ENVIRONMENT } from "@/src/constant";
///Components
import { UserMenu } from "./UserMenu";
import { ClusterSelect } from "../cluster-select";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { ready, authenticated, login } = usePrivy();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between xl:px-[10%] px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-solana flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">
            Stay<span className="text-gradient">ke</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {ENVIRONMENT === "development" && <ClusterSelect />}
          {!ready ? null : authenticated ? (
            <UserMenu />
          ) : (
            <button
              onClick={login}
              className="inline-flex items-center gap-2 gradient-solana text-primary-foreground text-sm font-semibold px-4 py-[9.2px] rounded-md shadow-glow transition-opacity hover:opacity-90 cursor-pointer"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile: burger */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="md:hidden p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 pt-3 border-t border-border">
              {!ready ? null : authenticated ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => {
                    login();
                    setIsOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 gradient-solana text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-md shadow-glow transition-opacity hover:opacity-90"
                >
                  Login
                </button>
              )}
            </div>

            {ENVIRONMENT === "development" && (
              <div className="mt-2">
                <ClusterSelect />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
