import * as Yup from "yup";

export type TreasuryTab = "deposit" | "withdraw";

export interface TreasuryFormValues {
  amount: number | string;
}

export const TREASURY_FORM_INITIAL_VALUES: TreasuryFormValues = {
  amount: "",
};

export const createTreasuryDepositValidationSchema = (
  maxWalletBalance: number,
) =>
  Yup.object().shape({
    amount: Yup.number()
      .typeError("Ingresa un monto numérico válido")
      .positive("El monto debe ser mayor a 0")
      .max(
        maxWalletBalance,
        `El monto supera tu saldo en billetera ($${maxWalletBalance.toFixed(2)} USDC)`,
      )
      .required("El monto es requerido"),
  });

export const createTreasuryWithdrawValidationSchema = (
  maxGuaranteeBalance: number,
) =>
  Yup.object().shape({
    amount: Yup.number()
      .typeError("Ingresa un monto numérico válido")
      .positive("El monto debe ser mayor a 0")
      .max(
        maxGuaranteeBalance,
        `El monto supera tu garantía disponible ($${maxGuaranteeBalance.toFixed(2)} USDC)`,
      )
      .required("El monto es requerido"),
  });

export interface TreasuryModalProps {
  open: boolean;
  initialTab?: TreasuryTab;
  guaranteeBalance: number;
  walletBalance: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface TreasuryDepositFormProps {
  walletBalance: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface TreasuryWithdrawFormProps {
  guaranteeBalance: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface TreasuryCardProps {
  /** Saldo de garantía depositada en USD/USDC (opcional si se lee del contexto). */
  balanceUsd?: number;
  /** Saldo en billetera en USDC (opcional si se lee con useGetMoney). */
  walletUsdc?: number;
}
