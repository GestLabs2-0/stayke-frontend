"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

interface NavbarMenuDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export const NavbarMenuDesktop = ({
  isOpen,
  onClose,
  triggerRef,
}: NavbarMenuDesktopProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (triggerRef.current?.contains(target)) return;

      if (menuRef.current && !menuRef.current.contains(target)) {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full z-50 mt-0.5 w-56 origin-top-right rounded-lg bg-fuchsia-300 py-1 shadow-lg"
    >
      <div className="px-4 py-2 text-sm font-semibold text-(--letter-navbar)">
        Hola
      </div>
    </div>
  );
};
