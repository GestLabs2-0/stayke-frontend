import type { ClusterNames } from "@/types";

export function getExplorerUrl(
  path: string,
  cluster: ClusterNames,
  customUrl?: string,
): string {
  const base = "https://explorer.solana.com";
  const url = new URL(path, base);

  if (cluster !== "mainnet") {
    if (cluster === "localnet") {
      url.searchParams.set("cluster", "custom");
      url.searchParams.set("customUrl", customUrl ?? "http://localhost:8899");
    } else {
      url.searchParams.set("cluster", cluster);
    }
  }

  return url.toString();
}
