"use client";

import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, FileText } from "lucide-react";
import { DOCUMENT_TYPES } from "../../ui/DOCUMENT_TYPES";
import { DocumentTypeSelectorProps } from "@/src/types/DocumentMenuOption";

export const DocumentTypeSelector = ({
  id,
  open,
  onToggle,
  onChange,
  selectedValue,
}: DocumentTypeSelectorProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (open) onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onToggle]);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger — mismo estilo exacto que CountrySelector */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-muted/40  focus:border-primary focus:outline-none  transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        id={id}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedValue ? (
            <>
              <span className="text-lg leading-none">{selectedValue.icon}</span>
              <span className="truncate text-foreground">
                {selectedValue.label}
              </span>
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="truncate text-muted-foreground">
                Select document type
              </span>
            </>
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md overflow-hidden bg-black"
          >
            <ul
              role="listbox"
              className="py-1 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            >
              {DOCUMENT_TYPES.map((dt) => (
                <li
                  key={dt.value}
                  role="option"
                  aria-selected={selectedValue?.value === dt.value}
                  onClick={() => {
                    onChange(dt.value);
                    onToggle();
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors
                    ${
                      selectedValue?.value === dt.value
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-popover-foreground hover:bg-muted"
                    }`}
                >
                  <span className="text-base leading-none">{dt.icon}</span>
                  <span>{dt.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
