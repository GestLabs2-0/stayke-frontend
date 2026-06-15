"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useNetwork from "@/hooks/useNetwork";
import { CLUSTERS } from "@/shared/constants";
import type { ClusterNames } from "@/types";

const CLUSTER_LABELS: Record<ClusterNames, string> = {
  mainnet: "Mainnet",
  devnet: "Devnet",
  testnet: "Testnet",
  localnet: "Localnet",
  custom: "Custom",
};

const CLUSTER_COLORS: Record<ClusterNames, string> = {
  mainnet: "bg-emerald-500",
  devnet: "bg-amber-500",
  testnet: "bg-red-500",
  localnet: "bg-violet-500",
  custom: "bg-sky-500",
};

export const NetworkSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedCluster, chooseCluster } = useNetwork();

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const select = useCallback(
    (cluster: ClusterNames) => {
      chooseCluster(cluster);
      setIsOpen(false);
    },
    [chooseCluster],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={`block h-2 w-2 rounded-full ${CLUSTER_COLORS[selectedCluster]}`}
        />
        {CLUSTER_LABELS[selectedCluster]}
        <svg
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-1 min-w-[180px] overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          role="listbox"
          aria-label="Select network"
        >
          {CLUSTERS.map((cluster) => (
            <button
              key={cluster}
              type="button"
              role="option"
              aria-selected={selectedCluster === cluster}
              onClick={() => select(cluster)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                selectedCluster === cluster
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
              }`}
            >
              <span
                className={`block h-2 w-2 shrink-0 rounded-full ${CLUSTER_COLORS[cluster]}`}
              />
              <span className="flex-1">{CLUSTER_LABELS[cluster]}</span>
              {selectedCluster === cluster && (
                <svg
                  className="h-4 w-4 text-zinc-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
