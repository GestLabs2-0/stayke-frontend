"use client";

import { AnimatePresence, motion } from "framer-motion";

import { XIcon } from "@/icons/XIcon";
import type { SearchPanelProps } from "@/types/header";
import { CalendarPanel } from "./CalendarPanel/CalendarPanel";
import { DestinationMenu } from "./DestinationMenu";
import { GuestMenu } from "./GuestMenu";

export const SearchPanel = ({
  activeField,
  onSelectDestination,
  guestCounts,
  onAdjustGuest,
  onClose,
}: SearchPanelProps) => {
  const getPanelTitle = () => {
    switch (activeField) {
      case "destination":
        return "¿A dónde quieres ir?";
      case "dates":
        return "Selecciona las fechas";
      case "guest":
        return "¿Quiénes viajan?";
      default:
        return "";
    }
  };

  const getDesktopPlacement = () => {
    switch (activeField) {
      case "destination":
        return "w-[420px] left-0";
      case "guest":
        return "w-[340px] right-0";
      default:
        return "w-[390px] left-1/3 -translate-x-1/4";
    }
  };

  return (
    <AnimatePresence>
      {activeField && (
        <>
          {/* ─── Desktop Floating Dropdown (≥ 980px) ─── */}
          <motion.div
            key="desktop-panel"
            layout
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{
              duration: 0.22,
              ease: [0.16, 1, 0.3, 1],
              layout: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
            }}
            className={`
              hidden min-[980px]:block absolute top-full mt-3 bg-white rounded-3xl
              shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-zinc-200/90 p-6 z-50
              ${getDesktopPlacement()}
            `}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeField}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {activeField === "destination" && (
                  <DestinationMenu onSelectDestination={onSelectDestination} />
                )}
                {activeField === "dates" && <CalendarPanel />}
                {activeField === "guest" && (
                  <GuestMenu
                    guestCounts={guestCounts}
                    onAdjustGuest={onAdjustGuest}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ─── Mobile / Tablet Bottom Sheet Modal (< 980px) ─── */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-[980px]:hidden fixed inset-0 z-1002 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onClose?.();
              }
            }}
          >
            <motion.div
              key="mobile-sheet"
              role="dialog"
              aria-modal="true"
              aria-label={getPanelTitle()}
              initial={{ y: "100%", opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 320,
                mass: 0.8,
              }}
              className="w-full sm:max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl p-5 sm:p-6 max-h-[85vh] flex flex-col"
            >
              {/* Sheet Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
                <h3 className="font-montserrat font-bold text-base text-zinc-900">
                  {getPanelTitle()}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar panel"
                  className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <XIcon />
                </button>
              </div>

              {/* Sheet Content with smooth transition */}
              <div className="overflow-y-auto flex-1 pr-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`mobile-${activeField}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    {activeField === "destination" && (
                      <DestinationMenu
                        onSelectDestination={(dest) => {
                          onSelectDestination?.(dest);
                          onClose?.();
                        }}
                      />
                    )}
                    {activeField === "dates" && <CalendarPanel />}
                    {activeField === "guest" && (
                      <GuestMenu
                        guestCounts={guestCounts}
                        onAdjustGuest={onAdjustGuest}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile Action Footer */}
              <div className="pt-4 mt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-[#3b007f] hover:bg-[#5307ad] active:scale-[0.98] text-white font-montserrat font-bold text-sm py-3 px-4 rounded-full shadow-md transition-all cursor-pointer"
                >
                  Listo
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
