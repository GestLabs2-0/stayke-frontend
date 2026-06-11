"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePrivy, useWallets } from "@/src/lib/wallet";
import { staykeApi } from "@/src/lib/staykeAPI";
import { UserType } from "@/src/types/api/user";
import { useOnChainAccountCheck } from "../hooks/contract/useOnChainAccountCheck";
import { UserProfile } from "@GestLabs2-0/stayke-core";

// ─── Status machine ────────────────────────────────────────────────────────
//
//  'loading'        → Privy ready, user authenticated, checks in progress
//  'unauthenticated'→ Privy ready, user NOT authenticated
//  'no_onchain'     → authenticated, no UserProfile PDA on-chain
//                     → redirect to /register (full flow)
//  'onchain_only'   → authenticated, PDA exists, no backend record
//                     → show blocking screen → /register?offchain=true
//  'complete'       → both on-chain and off-chain records exist
//
export type UserStatus =
  | "loading"
  | "unauthenticated"
  | "no_onchain"
  | "onchain_only"
  | "complete";

interface UserContextValue {
  status: UserStatus;
  backendUser: UserType | null;
  userProfilePda: string | null;
  refetch: () => void;
  userProfile: UserProfile | null;
}

const UserContext = createContext<UserContextValue>({
  status: "loading",
  backendUser: null,
  userProfilePda: null,
  refetch: () => {},
  userProfile: null,
});

export function useUserContext() {
  return useContext(UserContext);
}

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();

  // First connected Solana wallet (embedded or external)
  const walletAddress = wallets?.[0]?.address ?? null;

  // A token that increments on refetch() to re-trigger the effect
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);
  // On-chain check
  const {
    hasAccount,
    pda: userProfilePda,
    loading: checkingOnChain,
    dataAccount: userProfile,
  } = useOnChainAccountCheck(authenticated ? walletAddress : null, tick);

  // Off-chain (backend) check
  const [backendUser, setBackendUser] = useState<UserType | null>(null);
  const [checkingOffChain, setCheckingOffChain] = useState(false);
  const [offChainChecked, setOffChainChecked] = useState(false);

  // When onchain account is confirmed, check the backend
  useEffect(() => {
    if (!authenticated || !walletAddress || hasAccount !== true) return;
    let cancelled = false;
    function getData() {
      setCheckingOffChain(true);
      setOffChainChecked(false);

      staykeApi.getUserProfile(walletAddress).then((result) => {
        if (cancelled) return;
        setBackendUser(result.status ? result.data : null);
        setCheckingOffChain(false);
        setOffChainChecked(true);
      });
    }
    getData();

    return () => {
      cancelled = true;
    };
  }, [authenticated, walletAddress, hasAccount, tick]);

  // Reset backend state when wallet changes or user logs out
  if (!authenticated && backendUser !== null) {
    setBackendUser(null);
    setOffChainChecked(false);
  }

  // ── Derive status ─────────────────────────────────────────────────────────
  let status: UserStatus = "loading";

  if (!ready) {
    status = "loading";
  } else if (!authenticated || !walletAddress) {
    status = "unauthenticated";
  } else if (checkingOnChain || checkingOffChain) {
    status = "loading";
  } else if (hasAccount === false) {
    status = "no_onchain";
  } else if (hasAccount === true && offChainChecked && !backendUser) {
    status = "onchain_only";
  } else if (hasAccount === true && offChainChecked && backendUser) {
    status = "complete";
  }

  return (
    <UserContext.Provider
      value={{ status, backendUser, userProfilePda, refetch, userProfile }}
    >
      {children}
    </UserContext.Provider>
  );
}
