import { useContext } from "react";

import { WalletContext } from "@/context/WalletContext";

export const useWalletContext = () => {
  return useContext(WalletContext);
};
