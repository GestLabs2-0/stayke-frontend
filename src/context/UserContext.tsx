import type { Address } from "@solana/kit";
import { createContext } from "react";

type UserContextProps = {
  userWallet: Address | null;
};

export const UserContext = createContext<UserContextProps>({
  userWallet: null,
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  <UserContext.Provider value={{ userWallet: null }}>
    {children}
  </UserContext.Provider>;
};
