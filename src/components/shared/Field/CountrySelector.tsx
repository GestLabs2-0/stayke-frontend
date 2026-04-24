"use client";

import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { COUNTRIES } from "../../ui/COUNTRIES";
import type { SelectMenuOption } from "@/src/types/SelectMenuOption";

interface CountrySelectorProps {
  id: string;
  open: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  selectedValue: SelectMenuOption;
}

export const CountrySelector = ({
  id,
  open,
  onToggle,
  onChange,
  selectedValue,
}: CountrySelectorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  // Cierra al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (open) onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onToggle]);

  const filtered = COUNTRIES.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger button */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-muted/40  focus:border-primary focus:outline-none  transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        id={id}
      >
        <span className="flex items-center gap-2 truncate">
          <span className="text-lg leading-none">{selectedValue.label}</span>
          <span className="truncate">{selectedValue.title}</span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-muted-foreground"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md overflow-hidden"
          >
            {/* Search */}
            <div className="flex items-center gap-2 border-b border-border px-3 py-2 bg-black">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Options */}
            <ul
              role="listbox"
              className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent bg-black"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  No countries found
                </li>
              ) : (
                filtered.map((country) => (
                  <li
                    key={country.value}
                    role="option"
                    aria-selected={selectedValue.value === country.value}
                    onClick={() => {
                      onChange(country.value);
                      setQuery("");
                      onToggle();
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors
                      ${
                        selectedValue.value === country.value
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-popover-foreground hover:bg-muted"
                      }`}
                  >
                    <span className="text-base leading-none">
                      {country.label}
                    </span>
                    <span>{country.title}</span>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
