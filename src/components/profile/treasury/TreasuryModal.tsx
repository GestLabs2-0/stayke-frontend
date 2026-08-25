"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { XIcon } from "@/icons/XIcon";
import type { TreasuryModalProps, TreasuryTab } from "@/types/profile/treasury";
import { TreasuryDepositForm } from "./TreasuryDepositForm";
import { TreasuryWithdrawForm } from "./TreasuryWithdrawForm";

export function TreasuryModal({
  open,
  initialTab = "deposit",
  guaranteeBalance,
  walletBalance,
  onClose,
  onSuccess,
}: TreasuryModalProps) {
  const [activeTab, setActiveTab] = useState<TreasuryTab>(initialTab);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="treasury-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Full-screen backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EFF3F6] pb-4">
              <h3
                id="treasury-modal-title"
                className="font-montserrat text-lg font-bold text-[#171717]"
              >
                Gestión de Tesorería
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar modal"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full text-[#7C838F] transition-colors hover:bg-[#EFF3F6] hover:text-[#171717]"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            {/* Tab switchers */}
            <div className="mt-4 grid grid-cols-2 gap-1.5 rounded-xl bg-[#EFF3F6] p-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("deposit")}
                className={`cursor-pointer rounded-lg py-2.5 font-sans text-xs font-semibold transition-all min-h-[40px] ${
                  activeTab === "deposit"
                    ? "bg-white text-[#3B007F] shadow-sm"
                    : "text-[#7C838F] hover:text-[#171717]"
                }`}
              >
                Depositar garantía
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("withdraw")}
                className={`cursor-pointer rounded-lg py-2.5 font-sans text-xs font-semibold transition-all min-h-[40px] ${
                  activeTab === "withdraw"
                    ? "bg-white text-[#171717] shadow-sm"
                    : "text-[#7C838F] hover:text-[#171717]"
                }`}
              >
                Retirar garantía
              </button>
            </div>

            {/* Form body */}
            <div className="mt-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {activeTab === "deposit" ? (
                    <TreasuryDepositForm
                      walletBalance={walletBalance}
                      onSuccess={onSuccess}
                      onClose={onClose}
                    />
                  ) : (
                    <TreasuryWithdrawForm
                      guaranteeBalance={guaranteeBalance}
                      onSuccess={onSuccess}
                      onClose={onClose}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
