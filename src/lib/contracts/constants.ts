import type { Address } from "@solana/kit";
import { address } from "@solana/kit";

/**
 * On-chain contract constants used by the booking flow.
 *
 * NOTE(TS-STK-287): `USDC_MINT` must match the token mint configured in the
 * deployed stayke global config (`globalConfig.usdcMint`), otherwise the
 * createBooking instruction will be rejected. Defaults to the standard
 * devnet USDC mint.
 */
export const USDC_MINT: Address = address(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
);
