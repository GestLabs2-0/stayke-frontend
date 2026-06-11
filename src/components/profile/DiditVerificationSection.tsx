"use client";

import { useState } from "react";
import {
  Loader2,
  BadgeCheck,
  ShieldCheck,
  ExternalLink,
  Search,
} from "lucide-react";
import { useUserContext } from "@/src/components/contexts/UserContext";
import {staykeApi} from "@/src/lib/staykeAPI";
import { toast } from "sonner";

import { DiditSdk } from "@didit-protocol/sdk-web";
import { VerificationProgress } from "@/src/types/api/user";

export default function DidItVerificationSection() {
  const { backendUser } = useUserContext();
  const [loading, setLoading] = useState(false);

  // Only show the section when the user has an off-chain profile
  if (!backendUser) return null;
  const { verified } = backendUser;

  const handleVerify = async () => {
    setLoading(true);
    try {
      const result = await staykeApi.getDiditUrl();
      if (result.status && result.data?.url) {
        DiditSdk.shared.startVerification({ url: result.data.url });
      } else {
        toast.error(
          typeof result.message === "string"
            ? result.message
            : "Could not fetch verification URL."
        );
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <h2 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
          Identity Verification
        </h2>
      </div>

      {verified == VerificationProgress.Verified ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <BadgeCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-400">
              Identity Verified
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your identity has been successfully verified.
            </p>
          </div>
        </div>
      ) : verified == VerificationProgress.InProgress ? (
        <div className="flex items-center">
          <Search className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            We are currently verifying your identity. This process may take a
            few minutes. Thank you for your patience.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Verify your identity to unlock all features and build trust with
            hosts and guests.
          </p>
          <button
            id="btn-verify-identity"
            onClick={handleVerify}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 gradient-solana rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 transition-opacity hover:opacity-90 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting…
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4" />
                Verify Your Identity
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
