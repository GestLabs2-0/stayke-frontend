"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useGetMoney } from "@/hooks/contracts/useGetMoney";
import useNetwork from "@/hooks/useNetwork";
import { useProfile } from "@/hooks/useProfile";
import { useWalletContext } from "@/hooks/useWallet";
import { MINT_DECIMALS } from "@/shared/constants";
import type { TreasuryCardProps, TreasuryTab } from "@/types/profile/treasury";
import { TreasuryModal } from "./treasury/TreasuryModal";

export function TreasuryCard({
  balanceUsd,
  walletUsdc: propWalletUsdc,
}: TreasuryCardProps) {
  const { userWallet, userProfile, refetchAccounts } = useWalletContext();
  const { profile } = useProfile();
  const { client } = useNetwork();
  const {
    money: fetchedWalletUsdc,
    fetchMoney,
    loading: loadingBalance,
  } = useGetMoney(userWallet, client);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<TreasuryTab>("deposit");

  useEffect(() => {
    fetchMoney();
  }, [fetchMoney]);

  const guaranteeUsd = useMemo(() => {
    if (balanceUsd !== undefined) return balanceUsd;
    if (userProfile?.data?.deposited !== undefined) {
      return Number(userProfile.data.deposited) / 10 ** MINT_DECIMALS;
    }
    return profile?.treasuryUsd ?? 0;
  }, [balanceUsd, userProfile, profile]);

  const walletBalance =
    propWalletUsdc !== undefined ? propWalletUsdc : fetchedWalletUsdc;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);

  const handleOpenModal = (tab: TreasuryTab) => {
    setModalTab(tab);
    setModalOpen(true);
  };

  const handleSuccess = async () => {
    await Promise.all([refetchAccounts(), fetchMoney()]);
  };

  return (
    <>
      <div className="card-white overflow-hidden">
        <div className="flex flex-col gap-6 sm:items-center sm:justify-between">
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 w-full">
            {/* Balance 1: Garantía Depositada */}
            <div className="flex items-start justify-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#3B007F]/10 text-[#3B007F]">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#434654]">
                  Garantía depositada
                </p>
                <p className="mt-1 font-montserrat text-2xl font-bold text-[#171717]">
                  {formatCurrency(guaranteeUsd)}
                </p>
                <p className="mt-0.5 font-sans text-xs text-[#7C838F]">
                  Fondos en custodia en tesorería
                </p>
              </div>
            </div>

            {/* Balance 2: Saldo en billetera USDC */}
            <div className="flex items-start justify-center gap-3.5 border-t border-[#EFF3F6] pt-4 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-warm/15 text-accent-warm">
                <Wallet className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#434654]">
                    Saldo en USDC
                  </p>
                  <button
                    type="button"
                    onClick={() => fetchMoney()}
                    disabled={loadingBalance}
                    title="Actualizar saldo"
                    aria-label="Actualizar saldo"
                    className="cursor-pointer text-[#7C838F] transition-colors hover:text-[#171717] disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`size-3.5 ${
                        loadingBalance ? "animate-spin text-[#3B007F]" : ""
                      }`}
                    />
                  </button>
                </div>
                <p className="mt-1 font-montserrat text-2xl font-bold text-[#171717]">
                  {formatCurrency(walletBalance)}
                </p>
                <p className="mt-0.5 font-sans text-xs text-[#7C838F]">
                  Disponible en tu billetera
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 sm:flex-col sm:items-stretch lg:flex-row">
            <button
              type="button"
              onClick={() => handleOpenModal("deposit")}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3B007F] px-4 py-2.5 font-sans text-xs font-semibold text-white transition-all hover:bg-[#2A005B] active:scale-98"
            >
              <ArrowDownLeft className="size-4" />
              <span>Depositar</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenModal("withdraw")}
              disabled={guaranteeUsd <= 0}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#C3C6D6] bg-white px-4 py-2.5 font-sans text-xs font-semibold text-[#171717] transition-all hover:bg-[#EFF3F6] active:scale-98 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUpRight className="size-4" />
              <span>Retirar</span>
            </button>
          </div>
        </div>
      </div>

      <TreasuryModal
        open={modalOpen}
        initialTab={modalTab}
        guaranteeBalance={guaranteeUsd}
        walletBalance={walletBalance}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
