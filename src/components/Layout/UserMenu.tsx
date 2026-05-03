"use client";

//Library
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
import { usePrivy, useWallets } from "@privy-io/react-auth";
//Next
import Link from "next/link";
import { useRouter } from "next/navigation";

//React
import { useState } from "react";

//hooks
import { useSolBalance } from "../hooks/useSolBalance";

//Constants
import { ROUTES } from "@/src/constant";

const userThings = {
  firstName: "User",
  image: null,
  reputation: 4.8,
  isHost: true,
};

export const UserMenu = () => {
  const { user, logout } = usePrivy();
  const { wallets } = useWallets();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const solanaWallet = user?.linkedAccounts?.find(
    (acc) => acc.type === "wallet" && acc.chainType === "solana"
  );
  // @ts-ignore
  const address = solanaWallet?.address;
  const { balance, isLoading: loadingBalance } = useSolBalance(address);

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
    <div className="relative w-full md:w-auto">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-primary hover:shadow-glow transition-all duration-200 w-full md:w-auto"
      >
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full gradient-solana shrink-0">
          {userThings?.image ? (
            <img
              src={userThings.image}
              alt={userThings.firstName}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-3.5 w-3.5 text-primary-foreground" />
          )}
          <span className="absolute top-5 -right-[.9px] h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-card" />
        </div>
        <span className="max-w-20 truncate">{userThings?.firstName}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ml-auto ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          {/* Backdrop mobile */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />

          <div
            className="absolute right-0 mt-2.5 w-72 rounded-2xl border border-border bg-card shadow-card z-50 overflow-hidden
            md:right-0
            max-md:left-0 max-md:right-0 max-md:w-full"
          >
            {/* Wallet banner */}
            <div className="relative overflow-hidden px-4 pt-4 pb-5">
              <div className="absolute inset-0 gradient-solana opacity-10" />
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-secondary/10 blur-xl" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
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
                        {address?.slice(0, 4)}…{address?.slice(-4)}
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row */}
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
                    ${userThings?.isHost ? "bg-primary/10 text-primary" : "bg-primary/20 text-white"}`}
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-400 mr-2" />
                  {userThings?.isHost ? "Host" : "Client"}
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="p-1.5">
              <Link
                href={ROUTES.PROFILE}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <User className="h-4 w-4 shrink-0" />
                My Profile
              </Link>
              <Link
                href={ROUTES.BOOKINGS}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <CalendarCheck className="h-4 w-4 shrink-0" />
                My Bookings
              </Link>
              {userThings?.isHost && (
                <Link
                  href={ROUTES.ADD_PROPERTIES}
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
        </>
      )}
    </div>
  );
};
