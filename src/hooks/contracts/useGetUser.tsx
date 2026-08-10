import type { Account, Address } from "@solana/kit";
import { useCallback, useState } from "react";

import type { ReputationProfile, UserProfile } from "@GestLabs2-0/stayke-core";
import {
  fetchMaybeReputationProfile,
  fetchMaybeUserProfile,
  findReputationProfilePda,
  findUserProfilePda,
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

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    if (!wallet) {
      return;
    }
    try {
      const [[userProfilePda], [userReputationPda]] = await Promise.all([
        findUserProfilePda({ authority: wallet }),
        findReputationProfilePda({
          authority: wallet,
        }),
      ]);

      const [userProfileData, reputationProfileData] = await Promise.all([
        fetchMaybeUserProfile(client.rpc, userProfilePda),
        fetchMaybeReputationProfile(client.rpc, userReputationPda),
      ]);
      if (userProfileData.exists && reputationProfileData.exists) {
        setUserProfile(userProfileData);
        setReputationProfile(reputationProfileData);
      }
      console.log(userProfileData, reputationProfileData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [wallet, client.rpc]);

  return {
    fetchUserData,
    loading,
    userProfile,
    reputationProfile,
  };
}

// async function fetchUserData(wallet: Address | null) {
//   setLoading(true);
//   if (!wallet) {
//     return;
//   }
//   try {
//     const [[userProfilePda], [userReputationPda]] = await Promise.all([
//       findUserProfilePda({ authority: wallet }),
//       findReputationProfilePda({
//         authority: wallet,
//       }),
//     ]);

//     const [userProfileData, reputationProfileData] = await Promise.all([
//       fetchMaybeUserProfile(client.rpc, userProfilePda),
//       fetchMaybeReputationProfile(client.rpc, userReputationPda),
//     ]);
//     if (userProfileData.exists && reputationProfileData.exists) {
//       setUserProfile(userProfileData);
//       setReputationProfile(reputationProfileData);
//     }
//     console.log(userProfileData, reputationProfileData);
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//   } finally {
//     setLoading(false);
//   }
// }
