import type { Address } from "@solana/kit";
import { address } from "@solana/kit";
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import { USDC_MINT } from "../constants";

export const TOKEN_PROGRAM: Address = address(TOKEN_PROGRAM_ID.toBase58());
export function associatedTokenAccount(owner: Address): Address {
  return address(
    getAssociatedTokenAddressSync(
      new PublicKey(USDC_MINT),
      new PublicKey(owner),
      false,
      TOKEN_PROGRAM_ID,
    ).toBase58(),
  );
}
