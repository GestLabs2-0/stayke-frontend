"use client";

import {
  useConnectAndVerifyWithWalletProvider,
  useGetAvailableWalletProvidersData,
} from "@dynamic-labs-sdk/react-hooks";
import Image from "next/image";
import { useCallback } from "react";

export function WalletLoginList() {
  const { data: providers = [] } = useGetAvailableWalletProvidersData();
  const { mutate: connectWallet, isPending } =
    useConnectAndVerifyWithWalletProvider();

  console.log(providers);

  const handleConnect = useCallback(
    (key: string) => {
      connectWallet({ walletProviderKey: key });
    },
    [connectWallet],
  );

  if (providers.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="text-center text-xs font-plus-jakarta font-semibold uppercase tracking-wider text-[#A0A5B5]">
        O conecta tu wallet
      </div>

      {providers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {providers.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => handleConnect(p.key)}
              disabled={isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#C3C6D6] bg-white px-4 py-3 font-plus-jakarta text-sm font-semibold text-[#434654] transition-colors hover:bg-[#EBE7E7] disabled:opacity-50 min-w-0"
            >
              {p.metadata?.icon && (
                <Image
                  width={25}
                  height={25}
                  src={p.metadata.icon}
                  alt=""
                  className="size-6 shrink-0 rounded-full"
                />
              )}
              <span className="truncate">
                {p.metadata?.displayName ?? p.key}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
