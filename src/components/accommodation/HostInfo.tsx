"use client";

import { address } from "@solana/kit";
import { useEffect, useMemo, useState } from "react";

import { AuthModal } from "@/components/auth/AuthModal";
import { useChat } from "@/context/ChatContext";
import { useGetUser } from "@/hooks/contracts/useGetUser";
import { useWalletContext } from "@/hooks/useWallet";
import { CheckIcon, ClockIcon, MessageIcon, StarIcon } from "@/icons";
import type { PropertyHost } from "@/types/api/propertyDetail";

interface HostInfoProps {
  host: PropertyHost;
  city?: string;
  property?: number | string;
}

const getInitials = (name: string, lastName: string) =>
  `${name.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();

export function HostInfo({ host, city, property }: HostInfoProps) {
  const hasReputation = host.reputation != null;
  const hostAddress = (() => {
    try {
      const addr = address(host.owner);
      return addr;
    } catch {
      return null;
    }
  })();

  const { isAuthenticated } = useWalletContext();
  const { openChat, createChat } = useChat();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { reputationProfile, fetchUserData } = useGetUser(hostAddress);

  // TODO: delete this line
  const hostedSinceYear = host.hostedSince
    ? new Date(host.hostedSince).getFullYear()
    : null;
  const yearsHosting = hostedSinceYear
    ? Math.max(new Date().getFullYear() - hostedSinceYear, 0)
    : null;

  const metaParts = [
    city,
    host.country,
    host.listings === 1 ? "1 publicación" : `${host.listings} publicaciones`,
  ].filter(Boolean);

  const handleChat = async () => {
    if (!isAuthenticated) {
      setIsAuthOpen(true);
      return;
    }
    const propId =
      typeof property === "number"
        ? property
        : property
          ? Number(property) || undefined
          : undefined;
    await createChat(host.owner, propId);
    openChat();
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const reputation = useMemo(() => {
    if (reputationProfile) {
      return reputationProfile.data.hostReviews > 0
        ? Number(reputationProfile.data.totalScoreHost) /
            reputationProfile.data.hostReviews
        : 0;
    }
    return 0;
  }, [reputationProfile]);

  return (
    <>
      <section className="card-white">
        <h2 className="font-montserrat text-2xl font-bold text-zinc-900">
          Tu anfitrión
        </h2>

        <div className="mt-5 flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary font-montserrat text-xl font-bold text-white"
          >
            {getInitials(host.name, host.lastName)}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-montserrat text-lg font-bold text-zinc-900">
                {host.name} {host.lastName}
              </p>
              {host.isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  <span className="flex items-center [&>svg]:size-3.5">
                    <CheckIcon />
                  </span>
                  Verificado
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-zinc-500">
              {metaParts.join(" · ")}
            </p>

            {yearsHosting != null && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-600">
                <span className="flex items-center [&>svg]:size-4 text-accent-warm">
                  <ClockIcon />
                </span>
                Anfitrión desde {hostedSinceYear}
                {yearsHosting > 0 && (
                  <span className="text-zinc-500">
                    · {yearsHosting} {yearsHosting === 1 ? "año" : "años"}
                  </span>
                )}
              </p>
            )}

            {hasReputation && (
              <div
                className="mt-1.5 flex items-center gap-1.5"
                role="img"
                aria-label={`Reputación ${host.reputation} de 5`}
              >
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="flex items-center [&>svg]:size-4">
                      <StarIcon
                        filled={i <= reputation}
                        className={
                          i <= reputation ? "text-accent-warm" : "text-zinc-300"
                        }
                      />
                    </span>
                  ))}
                </div>
                <span className="text-sm font-bold text-zinc-700">
                  {reputation}
                </span>
                <span className="text-sm text-zinc-500">reputación</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleChat}
          className="mt-5 cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-accent-warm px-4 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-warm-hover hover:shadow-lg active:translate-y-0"
        >
          <span className="flex items-center [&>svg]:size-5">
            <MessageIcon />
          </span>
          Chatear con {host.name.split(" ")[0]}
        </button>
      </section>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
