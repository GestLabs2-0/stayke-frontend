import { type RefObject } from "react";

/* ─── Navbar Mobile ─── */

export interface NavbarMobileTriggerProps {
  onToggle: () => void;
}

export interface NavbarMobileDropdownProps {
  onClose: () => void;
}

/* ─── Navbar Desktop ─── */

export interface NavbarMenuDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}
