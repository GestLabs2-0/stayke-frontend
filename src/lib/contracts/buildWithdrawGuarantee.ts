import type { Address } from "@solana/kit";
import { createNoopSigner } from "@solana/kit";
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import { findGlobalConfigPda } from "@GestLabs2-0/stayke-config";
import {
  findUserProfilePda,
  STAYKE_CORE_PROGRAM_ADDRESS,
} from "@GestLabs2-0/stayke-core";
import {
  findConfigPda,
  findCpiAuthorityPda,
  findTreasuryPdaPda,
  findTreasuryVaultPda,
  getWithdrawGuaranteeInstructionAsync,
} from "@GestLabs2-0/stayke-treasury";
import type { SolanaClient } from "@/context/NetworkContext";
import { fromSolanaKitIns } from "@/helpers/web3Parsers";
import { FEE_PAYER } from "@/shared/constants";
import { USDC_MINT } from "./constants";
import { associatedTokenAccount, TOKEN_PROGRAM } from "./utils/deriveATA";
import { transformAmount } from "./utils/transformAmount";

export interface BuildWithdrawTX {
  wallet: Address;
  rawAmount: number;
  client: SolanaClient;
}

export async function buildWithdrawGuarantee({
  wallet,
  rawAmount,
  client,
}: BuildWithdrawTX) {
  const signer = createNoopSigner(wallet);
  const [cpiAuthority] = await findCpiAuthorityPda();
  const [globalConfig] = await findGlobalConfigPda();
  const [config] = await findConfigPda();
  const [treasuryVault] = await findTreasuryVaultPda();
  const [treasuryPda] = await findTreasuryPdaPda();
  const [userProfile] = await findUserProfilePda({ authority: wallet });

  const userTokenAccount = associatedTokenAccount(wallet);

  const amount = transformAmount(rawAmount);

  const ix = await getWithdrawGuaranteeInstructionAsync({
    amount,
    userTokenAccount,
    signer,
    treasuryVault,
    treasuryPda,
    usdcMint: USDC_MINT,
    config,
    cpiAuthority,
    globalConfig,
    staykeCoreProgram: STAYKE_CORE_PROGRAM_ADDRESS,
    tokenProgram: TOKEN_PROGRAM,
    userProfile,
  });

  const web3Ix = fromSolanaKitIns(ix);

  const { value: latestBlockhash } = await client.rpc
    .getLatestBlockhash()
    .send();

  const tx = new VersionedTransaction(
    new TransactionMessage({
      instructions: [web3Ix],
      payerKey: new PublicKey(FEE_PAYER),
      recentBlockhash: latestBlockhash.blockhash,
    }).compileToV0Message(),
  );

  return {
    tx,
  };
}
