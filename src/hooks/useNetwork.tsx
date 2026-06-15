import { useContext } from "react";
import { NetworkContext } from "@/context/NetworkContext";

export default function useNetwork() {
  return useContext(NetworkContext);
}
