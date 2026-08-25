"use client";

import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

import { useDepositGuarantee } from "@/hooks/contracts/useDepositGuarantee";
import type {
  TreasuryDepositFormProps,
  TreasuryFormValues,
} from "@/types/profile/treasury";
import {
  createTreasuryDepositValidationSchema,
  TREASURY_FORM_INITIAL_VALUES,
} from "@/types/profile/treasury";

export function TreasuryDepositForm({
  walletBalance,
  onSuccess,
  onClose,
}: TreasuryDepositFormProps) {
  const { run: deposit, loading } = useDepositGuarantee();

  const validationSchema = useMemo(
    () => createTreasuryDepositValidationSchema(walletBalance),
    [walletBalance],
  );

  const formik = useFormik<TreasuryFormValues>({
    initialValues: TREASURY_FORM_INITIAL_VALUES,
    validationSchema,
    validateOnChange: true,
    onSubmit: async (values) => {
      const numAmount = Number(values.amount);
      if (Number.isNaN(numAmount) || numAmount <= 0) return;

      const result = await deposit(numAmount);
      if (result.status) {
        onSuccess?.();
        onClose?.();
      }
    },
  });

  const handleSetPercentage = (pct: number) => {
    const calculated = (walletBalance * pct).toFixed(2);
    formik.setFieldValue("amount", calculated);
    formik.setFieldTouched("amount", true);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="deposit-amount-input"
            className="font-sans text-xs font-semibold uppercase tracking-wider text-[#434654]"
          >
            Monto a depositar (USDC)
          </label>
          <span className="font-sans text-xs text-[#7C838F]">
            Disponible:{" "}
            <span className="font-semibold text-[#171717]">
              ${walletBalance.toFixed(2)} USDC
            </span>
          </span>
        </div>

        <div className="relative mt-2">
          <input
            id="deposit-amount-input"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
            className={`w-full min-h-[48px] rounded-xl border bg-white px-4 py-3 font-montserrat text-lg font-bold text-[#171717] outline-none transition-all placeholder:text-[#A0A5B5] focus:ring-2 ${
              formik.touched.amount && formik.errors.amount
                ? "border-red-500 focus:ring-red-200"
                : "border-[#C3C6D6] focus:border-[#3B007F] focus:ring-[#3B007F]/20"
            }`}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-sans text-sm font-semibold text-[#7C838F]">
            USDC
          </span>
        </div>

        {formik.touched.amount && formik.errors.amount ? (
          <p className="mt-1 font-sans text-xs text-red-500">
            {formik.errors.amount}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "25%", value: 0.25 },
          { label: "50%", value: 0.5 },
          { label: "75%", value: 0.75 },
          { label: "Máx", value: 1 },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleSetPercentage(item.value)}
            disabled={loading || walletBalance <= 0}
            className="flex min-h-[40px] items-center justify-center rounded-lg border border-[#EFF3F6] bg-[#EFF3F6] py-2 font-sans text-xs font-semibold text-[#434654] transition-colors hover:border-[#3B007F]/30 hover:bg-[#3B007F]/10 hover:text-[#3B007F] active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="font-sans text-xs leading-relaxed text-[#7C838F]">
        El depósito de garantía respalda tus operaciones en la plataforma y se
        mantiene en custodia en el contrato inteligente de tesorería.
      </p>

      <button
        type="submit"
        disabled={loading || walletBalance <= 0}
        className="flex w-full min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3B007F] py-3.5 font-sans text-sm font-semibold text-white transition-all hover:bg-[#2A005B] active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Procesando depósito...</span>
          </>
        ) : (
          <span>Confirmar depósito</span>
        )}
      </button>
    </form>
  );
}
