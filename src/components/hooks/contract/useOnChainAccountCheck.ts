"use client";

import { useEffect, useState } from "react";
import { address } from "@solana/kit";
import {
  findUserProfilePda,
  fetchMaybeUserProfile,
} from "@/src/generated/stayke_core";
import { useSolanaClient } from "@/src/lib/solanaClientContext";

interface OnChainAccountState {
  hasAccount: boolean | null;
  /** The stringified address of the UserProfile PDA, if it exists. */
  pda: string | null;
  loading: boolean;
}

/**
 * Checks whether the given wallet has an initialized UserProfile account
 * on the Stayke Core program.
 *
 * Returns `hasAccount = null` while the check is in progress or when no
 * walletAddress is provided.
 */
export function useOnChainAccountCheck(
  walletAddress: string | null | undefined
): OnChainAccountState {
  const solanaClient = useSolanaClient();
  const [state, setState] = useState<OnChainAccountState>({
    hasAccount: null,
    pda: null,
    loading: false,
  });

  useEffect(() => {
    if (!walletAddress) {
      setState({ hasAccount: null, pda: null, loading: false });
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true }));

    const check = async () => {
      try {
        const [userProfilePda] = await findUserProfilePda({
          authority: address(walletAddress),
        });

        const maybeAccount = await fetchMaybeUserProfile(
          solanaClient.rpc,
          userProfilePda
        );

        if (!cancelled) {
          if (maybeAccount.exists) {
            setState({ hasAccount: true, pda: userProfilePda, loading: false });
          } else {
            setState({ hasAccount: false, pda: null, loading: false });
          }
        }
      } catch {
        if (!cancelled) {
          setState({ hasAccount: false, pda: null, loading: false });
        }
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [walletAddress, solanaClient.rpc]);

  return state;
}
