"use client";

import { PlusMinusIcon } from "@/icons";
import type { FaqAccordionItemProps } from "@/types/FAQ/FaqTypes";

export const FaqAccordionItem = ({
  item,
  isOpen,
  onToggle,
}: FaqAccordionItemProps) => (
  <div className="rounded-2xl bg-[#3B007F] p-5 md:p-6">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full cursor-pointer items-center justify-between text-left"
    >
      <span className="font-sans pr-4 text-base font-semibold text-white">
        {item.question}
      </span>
      <PlusMinusIcon open={isOpen} className="h-6 w-6 shrink-0 text-white" />
    </button>

    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        maxHeight: isOpen ? "500px" : "0",
        opacity: isOpen ? 1 : 0,
      }}
    >
      <p className="font-sans pt-4 text-sm leading-relaxed text-white/80">
        {item.answer}
      </p>
    </div>
  </div>
);
