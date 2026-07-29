"use client";

import {
  useGetWalletAccounts,
  useLogout,
  useUser,
} from "@dynamic-labs-sdk/react-hooks";
import type { Address } from "@solana/kit";
import { address, isAddress } from "@solana/kit";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useMemo } from "react";

import { useAutoCreateWaasWallets } from "@/hooks/useAutoCreateWallets";

type WalletContextProps = {
  userWallet: Address | null;
  isAuthenticated: boolean;
  logout: () => void;
  // isConnected: boolean;
  // signTransaction: (transaction: Transaction) => Promise<string>;
};

export const WalletContext = createContext<WalletContextProps>({
  userWallet: null,
  isAuthenticated: false,
  logout: () => {},
  // isConnected: false,
  // signTransaction: async () => {
  //   return await Promise.resolve("placeholder");
  // },
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

  const userWallet = useMemo(() => {
    if (walletAccounts && walletAccounts.length > 0) {
      if (isAddress(walletAccounts[0].address))
        return address(walletAccounts[0].address);
    }
    return null;
  }, [walletAccounts]);

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
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
