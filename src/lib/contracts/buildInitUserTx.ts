import type { Address } from "@solana/kit";
import { createNoopSigner } from "@solana/kit";
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import { getInitializeUserProfileInstructionAsync } from "@GestLabs2-0/stayke-core";
import type { SolanaClient } from "@/context/NetworkContext";
import { fromSolanaKitIns } from "@/helpers/web3Parsers";
import { FEE_PAYER } from "@/shared/constants";

export async function buildInitUserTx(addr: Address, client: SolanaClient) {
  const authority = createNoopSigner(addr);
  const payer = createNoopSigner(FEE_PAYER);
  console.log(addr);

  const instruction = await getInitializeUserProfileInstructionAsync({
    authority: authority,
    // TODO: in the future we will use a backend relayer
    payer,
  });

  const web3Instruction = fromSolanaKitIns(instruction);

  const { value: latestBlockhash } = await client.rpc
    .getLatestBlockhash()
    .send();

  console.log(latestBlockhash);
  const tx = new VersionedTransaction(
    new TransactionMessage({
      instructions: [web3Instruction],
      payerKey: new PublicKey(FEE_PAYER),
      recentBlockhash: latestBlockhash.blockhash,
    }).compileToV0Message(),
  );

  return {
    userProfile: instruction.accounts[2].address,
    reputationProfile: instruction.accounts[3].address,
    tx,
  };
}
