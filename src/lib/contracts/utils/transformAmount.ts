import { MINT_DECIMALS } from "@/shared/constants";

export const transformAmount = (amount: number) =>
  Math.round(amount * 10 ** MINT_DECIMALS);
