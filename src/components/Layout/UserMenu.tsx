"use client";

import {
  User,
  PlusSquare,
  LogOut,
  ChevronDown,
  CalendarCheck,
  Star,
  Copy,
  Check,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { usePrivy, useWallets } from "@privy-io/react-auth";

import { useSolBalance } from "../hooks/useSolBalance";
import { useCreateWallet } from "@privy-io/react-auth/solana";

export const UserMenu = () => {
  const { user, logout } = usePrivy();
  const { wallets } = useWallets();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const solanaWallet = user?.linkedAccounts?.find(
    (acc) => acc.type === "wallet" && acc.chainType === "solana"
  );

  //   if (!solanaWallet) {
  //     useCreateWallet;
  //   }

  //@ts-ignore
  const address = solanaWallet?.address;

  const { balance, isLoading: loadingBalance } = useSolBalance(address);

  const userThings = {
    firstName: "User",
    image: null,
    reputation: 4.8,
    isHost: true,
  };

  console.log(solanaWallet);
  console.log(wallets);
  console.log(user);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/");
  };

  return (
    <div className="relative">
      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-primary hover:shadow-glow transition-all duration-200"
      >
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full gradient-solana shrink-0 ">
          {userThings?.image ? (
            <img
              src={userThings.image}
              alt={userThings.firstName}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-3.5 w-3.5 text-primary-foreground" />
          )}
          <span className="absolute top-5 -right-[.9px] h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-card z" />
        </div>
        <span className="max-w-20 truncate">{userThings?.firstName}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2.5 w-72 rounded-2xl border border-border bg-card shadow-card z-50 overflow-hidden">
          {/* ── Wallet banner ── */}
          <div className="relative overflow-hidden px-4 pt-4 pb-5">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 gradient-solana opacity-10" />
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-secondary/10 blur-xl" />

            {/* Contenido */}
            <div className="relative">
              {/* Top: Phantom pill + copy */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/60 backdrop-blur-sm px-2.5 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium text-foreground">
                    Phantom
                  </span>
                </div>

                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/60 backdrop-blur-sm px-2.5 py-1 text-xs text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      {address.slice(0, 4)}…{address.slice(-4)}
                    </>
                  )}
                </button>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 tracking-wider uppercase">
                  Balance
                </p>
                <div className="flex items-baseline gap-2">
                  {loadingBalance ? (
                    <div className="h-8 w-24 rounded-lg bg-muted/40 animate-pulse" />
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-2xl font-bold text-foreground">
                          {balance !== null ? balance.toFixed(4) : "—"}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          SOL
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        {/* <span className="font-display text-xl font-bold text-primary">
                            {usdcBalance !== null ? usdcBalance.toFixed(2) : "—"}
                          </span> */}
                        {/* <span className="text-xs font-medium text-muted-foreground uppercase">
                            USDC
                          </span> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats row ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
            <div className="px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Reputation</p>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                <span className="text-sm font-bold text-foreground">
                  {userThings?.reputation ?? "—"}
                </span>
                <span className="text-xs text-muted-foreground">/ 5.0</span>
              </div>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Role</p>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold  
                    
                    ${
                      userThings?.isHost
                        ? "bg-primary/10 text-primary"
                        : "bg-primary/20 text-white"
                    }`}
              >
                <div className="h-2 w-2 rounded-full bg-emerald-400 mr-2" />
                {userThings?.isHost ? "Host" : "Client"}
              </span>
            </div>
          </div>

          <div className="p-1.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <User className="h-4 w-4 shrink-0" />
              My Profile
            </Link>

            <Link
              href="/bookings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <CalendarCheck className="h-4 w-4 shrink-0" />
              My Bookings
            </Link>

            {userThings?.isHost && (
              <Link
                href="/list-property"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <PlusSquare className="h-4 w-4 shrink-0" />
                Add Property
              </Link>
            )}

            <div className="my-1 border-t border-border" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
