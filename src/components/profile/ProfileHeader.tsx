"use client";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { usePrivy } from "@/src/lib/wallet";

import { UserType } from "@/src/types/api/user";

export const ProfileHeader = ({ user }: { user: UserType }) => {
  const { logout } = usePrivy();

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6">
      <div className="relative h-24 gradient-solana opacity-60" />
      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-10 mb-4">
          {/* Avatar */}
          <div className="h-20 w-20 z-10 rounded-full border-4 border-card gradient-solana flex items-center justify-center shadow-glow">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.firstName}
                width={500}
                height={300}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-9 w-9 text-primary-foreground" />
            )}
          </div>

          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Disconnect
            </button>
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-0.5">
          {user.wallet}
        </p>
      </div>
    </div>
  );
};
