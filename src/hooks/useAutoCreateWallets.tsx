import {
  getChainsMissingWaasWalletAccounts,
  shouldAutoCreateWalletForChain,
} from "@dynamic-labs-sdk/client/waas";
import {
  useCreateWaasWalletAccounts,
  useUser,
} from "@dynamic-labs-sdk/react-hooks";
import { useEffect } from "react";

export function useAutoCreateWaasWallets() {
  const { data: user } = useUser();

  const { mutate: createWallets } = useCreateWaasWalletAccounts();

  useEffect(() => {
    if (!user) return;
    const chains = getChainsMissingWaasWalletAccounts().filter((chain) =>
      shouldAutoCreateWalletForChain({ chain }),
    );
    if (chains.length > 0) createWallets({ chains });
  }, [user, createWallets]);
}
