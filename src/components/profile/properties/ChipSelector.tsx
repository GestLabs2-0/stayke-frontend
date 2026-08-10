"use client";

import { useState } from "react";

import { PlusIcon } from "@/icons/PlusIcon";
import { XIcon } from "@/icons/XIcon";
import type { ChipSelectorProps } from "@/types/property/ChipSelector";

export function ChipSelector({
  label,
  options,
  selected,
  onChange,
  allowCustom = false,
  placeholder = "Escribe un valor...",
}: ChipSelectorProps) {
  const [showInput, setShowInput] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customValue.trim();
    if (!trimmed) return;
    if (!selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustomValue("");
    setShowInput(false);
  };

  const customChips = selected.filter((s) => !options.includes(s));

  return (
    <div className="space-y-3">
      <p className="font-plus-jakarta text-[13px] font-semibold text-[#434654]">
        {label}
      </p>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`cursor-pointer rounded-full px-4 py-1.5 font-plus-jakarta text-[13px] font-semibold transition-all duration-150 ${
                isSelected
                  ? "border border-[#3b007f] bg-[#3b007f]/10 text-[#3b007f]"
                  : "border border-[#c3c6d6] bg-white text-[#434654] hover:border-[#a0a5b5]"
              }`}
            >
              {option}
            </button>
          );
        })}

        {customChips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#3b007f] bg-[#3b007f]/10 px-4 py-1.5 font-plus-jakarta text-[13px] font-semibold text-[#3b007f]"
          >
            {chip}
            <button
              type="button"
              onClick={() => onChange(selected.filter((s) => s !== chip))}
              aria-label={`Eliminar ${chip}`}
              className="flex size-4 items-center justify-center rounded-full text-current opacity-70 transition-opacity hover:opacity-100"
            >
              <XIcon className="size-3.5" />
            </button>
          </span>
        ))}

        {allowCustom && !showInput && (
          <button
            type="button"
            onClick={() => setShowInput(true)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-dashed border-[#c3c6d6] bg-white px-4 py-1.5 font-plus-jakarta text-[13px] font-semibold text-[#a0a5b5] transition-all duration-150 hover:border-[#3b007f] hover:text-[#3b007f]"
          >
            <PlusIcon className="size-4" />
            Agregar
          </button>
        )}

        {allowCustom && showInput && (
          <div className="inline-flex items-center gap-2">
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCustom();
                if (e.key === "Escape") {
                  setShowInput(false);
                  setCustomValue("");
                }
              }}
              placeholder={placeholder}
              className="rounded-full border border-[#c3c6d6] bg-white px-4 py-1.5 font-plus-jakarta text-[13px] text-[#434654] outline-none transition-colors placeholder:text-[#a0a5b5] focus:border-[#3b007f]"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              aria-label="Agregar"
              className="flex size-7 items-center justify-center rounded-full bg-[#3b007f] text-white transition-colors hover:bg-[#5307ad]"
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
