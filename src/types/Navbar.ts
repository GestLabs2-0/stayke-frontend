import type { RefObject } from "react";

import type { ProfileData } from "./profile";

/* ─── Navbar Mobile ─── */

export interface NavbarMobileTriggerProps {
  onToggle: () => void;
}

export interface NavbarMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  isFullyRegistered: boolean;
  profile: ProfileData | null;
  userEmail: string | null | undefined;
  onLoginClick: () => void;
  onLogout: () => void;
  setHost: () => void;
}

/* ─── Navbar Desktop ─── */

export interface NavbarMenuDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  profile: ProfileData;
  onLogout: () => void;
}
