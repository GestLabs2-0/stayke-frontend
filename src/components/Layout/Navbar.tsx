"use client";

import { Menu, X, Shield } from "lucide-react";

import Link from "next/link";
import { useState } from "react";

import { usePrivy } from "@privy-io/react-auth";

import { navLinks } from "../../constants";
import { UserMenu } from "./UserMenu";
import { ClusterSelect } from "../cluster-select";
import { ENVIRONMENT } from "@/src/constant";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { ready, authenticated, login } = usePrivy();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between xl:px-[10%] px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-solana flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">
            Stay<span className="text-gradient">ke</span>
          </span>
        </Link>

        <div className="hidden md:flex gap-8">
          {navLinks.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex">
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

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X /> : <Menu />}
        </button>

        {ENVIRONMENT === "development" && <ClusterSelect />}
      </div>
    </nav>
  );
};
