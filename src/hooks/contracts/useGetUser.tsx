import type { Account, Address } from "@solana/kit";
import { useState } from "react";

import type { ReputationProfile, UserProfile } from "@GestLabs2-0/stayke-core";
import {
  fetchReputationProfile,
  fetchUserProfile,
} from "@GestLabs2-0/stayke-core";
import useNetwork from "../useNetwork";

export function useGetUser(wallet: Address | null) {
  const { client } = useNetwork();
  const [userProfile, setUserProfile] = useState<Account<UserProfile> | null>(
    null,
  );
  const [reputationProfile, setReputationProfile] =
    useState<Account<ReputationProfile> | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchUserData() {
    setLoading(true);
    if (!wallet) {
      return;
    }
    try {
      const [userProfileData, reputationProfileData] = await Promise.all([
        fetchUserProfile(client.rpc, wallet),
        fetchReputationProfile(client.rpc, wallet),
      ]);
      setUserProfile(userProfileData);
      setReputationProfile(reputationProfileData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }

  return {
    fetchUserData,
    loading,
    userProfile,
    reputationProfile,
  };
}
