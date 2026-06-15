import type { ClusterNames } from "@/context/NetworkContext";

export function getExplorerUrl(path: string, cluster: ClusterNames): string {
  const base = "https://explorer.solana.com";
  const url = new URL(path, base);

  if (cluster !== "mainnet") {
    if (cluster === "localnet") {
      url.searchParams.set("cluster", "custom");
      url.searchParams.set("customUrl", "http://localhost:8899");
    } else {
      url.searchParams.set("cluster", cluster);
    }
  }

  return url.toString();
}
