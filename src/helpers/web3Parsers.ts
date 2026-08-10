import type {
  AccountLookupMeta,
  AccountMeta,
  Instruction,
  ReadonlyUint8Array,
} from "@solana/kit";
import { AccountRole } from "@solana/kit";
import type { AccountMeta as AccountMetaWeb3 } from "@solana/web3.js";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";

export function fromSolanaKitIns(
  instruction: Instruction,
): TransactionInstruction {
  const { programAddress, accounts, data } = instruction;

  const metaAccounts = toAccountMetaWeb3(accounts);
  const bufferData = toBufferIns(data);

  return new TransactionInstruction({
    data: bufferData,
    keys: metaAccounts,
    programId: new PublicKey(programAddress),
  });
}

export function toBufferIns(
  data: ReadonlyUint8Array<ArrayBufferLike> | undefined,
): Buffer | undefined {
  if (!data) return undefined;
  return Buffer.from(data);
}

/**
 * This function does not take into consideration AccountLookupMeta
 * @param accounts
 * @returns
 */
export function toAccountMetaWeb3(
  accounts:
    | readonly (AccountLookupMeta<string, string> | AccountMeta<string>)[]
    | undefined,
): AccountMetaWeb3[] {
  return Array.isArray(accounts)
    ? accounts.map((acc) => {
        let isWritable = false;
        let isSigner = false;

        if (
          acc.role === AccountRole.WRITABLE_SIGNER ||
          acc.role === AccountRole.READONLY_SIGNER
        ) {
          isSigner = true;
        }
        if (
          acc.role === AccountRole.WRITABLE_SIGNER ||
          acc.role === AccountRole.WRITABLE
        ) {
          isWritable = true;
        }

        return {
          isSigner,
          isWritable,
          pubkey: new PublicKey(acc.address),
        };
      })
    : [];
}
