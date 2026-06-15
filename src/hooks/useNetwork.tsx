import { NetworkContext } from "@/context/NetworkContext";
import { useContext } from "react";

export default function useNetwork() {
  return useContext(NetworkContext);
}
