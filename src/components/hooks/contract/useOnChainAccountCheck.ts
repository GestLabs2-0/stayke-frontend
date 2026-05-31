"use client";

import { useEffect, useState } from "react";
import { address } from "@solana/kit";
import {
  findUserProfilePda,
  fetchMaybeUserProfile,
  type UserProfile,
} from "@GestLabs2-0/stayke-core";
import { useSolanaClient } from "@/src/lib/solanaClientContext";

interface OnChainAccountState {
  hasAccount: boolean | null;
  /** The stringified address of the UserProfile PDA, if it exists. */
  pda: string | null;
  loading: boolean;
  dataAccount: UserProfile | null;
}

/**
 * Checks whether the given wallet has an initialized UserProfile account
 * on the Stayke Core program.
 *
 * Returns `hasAccount = null` while the check is in progress or when no
 * walletAddress is provided.
 */
export function useOnChainAccountCheck(
  walletAddress: string | null | undefined,
  tick: number
): OnChainAccountState {
  const solanaClient = useSolanaClient();
  const [state, setState] = useState<OnChainAccountState>({
    hasAccount: null,
    pda: null,
    loading: false,
    dataAccount: null,
  });

  useEffect(() => {
    if (!walletAddress) {
      setState({
        hasAccount: null,
        pda: null,
        loading: false,
        dataAccount: null,
      });
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
            setState({
              hasAccount: true,
              pda: userProfilePda,
              loading: false,
              dataAccount: maybeAccount.data,
            });
          } else {
            setState({
              hasAccount: false,
              pda: null,
              loading: false,
              dataAccount: null,
            });
          }
        }
      } catch {
        if (!cancelled) {
          setState({
            hasAccount: false,
            pda: null,
            loading: false,
            dataAccount: null,
          });
        }
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [walletAddress, solanaClient.rpc, tick]);

  return state;
}
