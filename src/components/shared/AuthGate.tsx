"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Loader2, ShieldAlert, ArrowRight, LogOut } from "lucide-react";
import { useUserContext } from "../contexts/UserContext";
import { ROUTES } from "@/src/constant";
import Link from "next/link";

const EXEMPT_PATHS = [ROUTES.REGISTER];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useUserContext();
  const { logout } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();

  const isExempt = EXEMPT_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (status === "no_onchain" && !isExempt) {
      router.push(ROUTES.REGISTER);
    }
  }, [status, isExempt, router]);

  useEffect(() => {
    if (status === "complete" && pathname === ROUTES.REGISTER) {
      router.push(ROUTES.HOME);
    }
  }, [status, pathname, router]);

  return (
    <>
      {children}

      {status === "loading" && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full gradient-solana opacity-20 animate-ping" />
              <div className="relative h-14 w-14 rounded-full gradient-solana flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-primary-foreground animate-spin" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium tracking-wide">
              Loading
            </p>
          </div>
        </div>
      )}

      {/* Blocking screen — shown when PDA exists but no backend record */}
      {status === "onchain_only" && !isExempt && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background px-4">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 20%, hsl(var(--primary)/0.35) 0%, transparent 70%)",
            }}
          />

          <div className="relative w-full max-w-md">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-card text-center">
              <div className="mx-auto mb-6 h-16 w-16 rounded-2xl gradient-solana flex items-center justify-center shadow-glow">
                <ShieldAlert className="h-8 w-8 text-primary-foreground" />
              </div>

              <p className="font-display text-2xl font-bold text-foreground mb-1">
                Stay<span className="text-gradient">ke</span>
              </p>

              <h1 className="font-display text-xl font-semibold text-foreground mt-4 mb-2">
                Almost there!
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                We found your on-chain account, but your profile is not yet
                registered in our system. Complete your registration to start
                using Stayke.
              </p>

              <div className="mb-8 flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full gradient-solana flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                    ✓
                  </span>
                  On-chain account
                </span>
                <span className="h-px w-8 bg-border" />
                <span className="flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    2
                  </span>
                  Profile info
                </span>
              </div>

              <Link
                href={`${ROUTES.REGISTER}?offchain=true`}
                className="inline-flex w-full items-center justify-center gap-2 gradient-solana rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
              >
                Complete Registration
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={() => logout()}
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
