"use client";

import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { countries } from "country-data-list";
import { CircleFlag } from "react-circle-flags";
import type { SelectMenuOption } from "@/src/types/SelectMenuOption";

const COUNTRIESLIST = countries.all
  .filter((c) => c.alpha2 && c.alpha2.trim() !== "")
  .map((c) => ({
    value: c.alpha2.toLowerCase(),
    title: c.name,
    label: c.alpha2.toLowerCase(),
  }));

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

  const filtered = COUNTRIESLIST.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (open) onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onToggle]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger button */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-muted/40 focus:border-primary focus:outline-none transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        id={id}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedValue.value ? (
            <>
              <CircleFlag
                countryCode={selectedValue.value}
                height={20}
                width={20}
                className="shrink-0"
              />
              <span className="truncate text-foreground">
                {selectedValue.title}
              </span>
            </>
          ) : (
            <span className="truncate text-muted-foreground">
              🌎 Select nationality
            </span>
          )}
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
                className="w-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none "
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
                filtered.map((country, index) => (
                  <li
                    key={`${country.value}-${index}`}
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
                    <CircleFlag
                      countryCode={country.value}
                      height={20}
                      width={20}
                      className="shrink-0"
                    />
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
