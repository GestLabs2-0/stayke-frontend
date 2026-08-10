"use client";

import {
  useGetWalletAccounts,
  useLogout,
  useUser,
} from "@dynamic-labs-sdk/react-hooks";
import type { Account, Address } from "@solana/kit";
import { address, isAddress } from "@solana/kit";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReputationProfile,
  UserProfile as UserProfileOnchain,
} from "@GestLabs2-0/stayke-core";
import { routes } from "@/constants/routes";
import { useGetUser } from "@/hooks/contracts/useGetUser";
import { useAutoCreateWaasWallets } from "@/hooks/useAutoCreateWallets";
import { staykeApi } from "@/lib/staykeApi";
import type { UserProfileResponse } from "@/types/api/auth";

type WalletContextProps = {
  userWallet: Address | null;
  isAuthenticated: boolean;
  logout: () => void;
  reputationProfile: Account<ReputationProfile> | null;
  userProfile: Account<UserProfileOnchain> | null;
  userBackend: UserProfileResponse | null;
  isLoadingUser: boolean;
  refetchAccounts: () => Promise<void>;
};

export const WalletContext = createContext<WalletContextProps>({
  userWallet: null,
  isAuthenticated: false,
  logout: () => {},
  reputationProfile: null,
  userProfile: null,
  userBackend: null,
  isLoadingUser: false,
  refetchAccounts: () => Promise.resolve(),
});

export const WalletContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useAutoCreateWaasWallets();
  const { data: walletAccounts } = useGetWalletAccounts();
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const [userBackend, setUserBackend] = useState<UserProfileResponse | null>(
    null,
  );
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const userWallet = useMemo(() => {
    if (walletAccounts && walletAccounts.length > 0) {
      if (isAddress(walletAccounts[0].address))
        return address(walletAccounts[0].address);
    }
    return null;
  }, [walletAccounts]);

  const { fetchUserData, reputationProfile, userProfile } =
    useGetUser(userWallet);

  const fetchUserBackend = useCallback(async () => {
    if (userWallet) {
      setIsLoadingUser(true);
      try {
        const response = await staykeApi.me();
        if (response.status) {
          setUserBackend(response.data);
        }
      } catch (error) {
        console.error("Error fetching user backend data:", error);
        setUserBackend(null);
      } finally {
        setIsLoadingUser(false);
      }
    } else {
      setUserBackend(null);
      setIsLoadingUser(false);
    }
  }, [userWallet]);

  useEffect(() => {
    Promise.all([fetchUserData(), fetchUserBackend()]).catch((error) => {
      console.error("Error fetching user data:", error);
    });
  }, [fetchUserData, fetchUserBackend]);

  useEffect(() => {
    if (!userBackend && userWallet) {
      router.push(routes.Register);
    }
  }, [userBackend, userWallet, router]);

  const refetchAccounts = useCallback(async () => {
    await Promise.all([fetchUserData(), fetchUserBackend()]).catch((error) => {
      console.error("Error refetching user data:", error);
    });
  }, [fetchUserData, fetchUserBackend]);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/");
  }, [logout, router]);

  return (
    <WalletContext.Provider
      value={{
        userWallet,
        isAuthenticated: Boolean(user),
        logout: handleLogout,
        reputationProfile,
        userProfile,
        userBackend,
        isLoadingUser,
        refetchAccounts,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
