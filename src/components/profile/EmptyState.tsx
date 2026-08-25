"use client";

import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

import type { EmptyStateProps } from "@/types/profile";

export function EmptyState({
  message,
  description,
  action,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center rounded-2xl bg-[#ebe7e7] px-6 py-12 text-center"
    >
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Inbox className="size-8 text-accent-warm" />
      </motion.div>
      <p className="mt-3 font-sans text-sm font-semibold text-[#171717]">
        {message}
      </p>
      {description && (
        <p className="mt-1 font-sans text-xs text-[#434654]">{description}</p>
      )}
      {action && onAction && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAction}
          className="mt-4 cursor-pointer rounded-full bg-accent-warm px-5 py-2 font-sans text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-accent-warm-hover"
        >
          {action}
        </motion.button>
      )}
    </motion.div>
  );
}
