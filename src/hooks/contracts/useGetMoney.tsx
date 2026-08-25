import type { Address } from "@solana/kit";
import { useCallback, useState } from "react";

import type { SolanaClient } from "@/context/NetworkContext";
import { associatedTokenAccount } from "@/lib/contracts/utils/deriveATA";

export const useGetMoney = (wallet: Address | null, client: SolanaClient) => {
  const [money, setMoney] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMoney = useCallback(async () => {
    if (!wallet) {
      setMoney(0);
      return;
    }
    setLoading(true);

    try {
      const usdcAccount = associatedTokenAccount(wallet);
      const {
        value: { uiAmountString },
      } = await client.rpc.getTokenAccountBalance(usdcAccount).send();
      const parsedAmount = parseFloat(uiAmountString);

      if (parsedAmount && !Number.isNaN(parsedAmount)) {
        setMoney(parsedAmount);
      } else {
        setMoney(0);
      }
    } catch {
      setMoney(0);
    } finally {
      setLoading(false);
    }
  }, [wallet, client]);

  return { money, fetchMoney, loading };
};
