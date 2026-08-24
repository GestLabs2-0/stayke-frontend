import type { Address } from "@solana/kit";

import { fetchMaybeUserProfile } from "@GestLabs2-0/stayke-core";
import type { SolanaClient } from "@/context/NetworkContext";

export async function fetchProfileAuthority(
  client: SolanaClient,
  profile: Address,
): Promise<Address> {
  const account = await fetchMaybeUserProfile(client.rpc, profile);
  return account.exists ? account.data.authority : profile;
}
