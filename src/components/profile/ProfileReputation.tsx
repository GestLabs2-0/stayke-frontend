"use client";
// import { UserType } from "@/src/types/api/user";
import { CalendarCheck, Star, Wallet } from "lucide-react";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { useWallets } from "@/src/lib/wallet";
import { MockReviews } from "@/src/app/profile/page";
import { DotBar } from "../loaders/DotBar";

export const ProfileReputation = ({ reviews }: { reviews: MockReviews[] }) => {
  const { wallets } = useWallets();
  const { balance, isLoading } = useTokenBalance(wallets[0]?.address);

  const avgRating = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : 4.7;
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="rounded-2xl border border-border bg-card px-4 py-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="h-3.5 w-3.5 text-primary fill-primary" />
          <p className="text-xs text-muted-foreground uppercase">Reputation</p>
        </div>
        <span className="font-display text-xl font-bold text-gradient">
          {avgRating.toFixed(1)}
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-card px-4 py-4">
        <CalendarCheck className="h-4 w-4 mb-2" />
        <span className="font-display text-xl font-bold text-gradient">2</span>
      </div>

      <div className="rounded-2xl border border-border bg-card px-4 py-4">
        <Wallet className="h-4 w-4 mb-2" />
        <span className="font-display text-xl font-bold text-gradient">
          {isLoading ? (
            <DotBar />
          ) : balance ? (
            `${balance} USD`
          ) : (
            "An error has ocurred. Reload"
          )}
        </span>
      </div>
    </div>
  );
};
