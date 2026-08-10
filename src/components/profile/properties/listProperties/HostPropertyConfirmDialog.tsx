"use client";

import { useEffect, useRef } from "react";

import { XIcon } from "@/icons/XIcon";
import type { HostPropertyConfirmDialogProps } from "@/types/property/HostProperties";

export function HostPropertyConfirmDialog({
  open,
  property,
  onClose,
  onConfirm,
}: HostPropertyConfirmDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open || !property) return null;

  const deactivating = property.active;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: is allowed
    // biome-ignore lint/a11y/useKeyWithClickEvents: this is ok
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="host-property-dialog-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-start justify-between gap-4">
          <h3
            id="host-property-dialog-title"
            className="font-montserrat text-lg font-bold text-[#171717]"
          >
            {deactivating ? "Desactivar propiedad" : "Activar propiedad"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ebe7e7] text-[#434654] transition-colors hover:bg-[#c3c6d6]"
          >
            <XIcon />
          </button>
        </div>

        <p className="mt-3 font-sans text-sm text-[#434654]">
          {deactivating
            ? `¿Querés dejar de recibir reservas en "${property.name}"? Podrás volver a activarla cuando quieras.`
            : `¿Querés habilitar de nuevo "${property.name}" para recibir reservas?`}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#c3c6d6] bg-white px-5 py-2.5 font-plus-jakarta text-[13px] font-semibold text-[#434654] transition-colors hover:bg-[#ebe7e7]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-full px-5 py-2.5 font-plus-jakarta text-[13px] font-semibold text-white transition-colors ${
              deactivating
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#3b007f] hover:bg-[#5307ad]"
            }`}
          >
            {deactivating ? "Desactivar" : "Activar"}
          </button>
        </div>
      </div>
    </div>
  );
}
