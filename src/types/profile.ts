import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// ── Domain types ──

export type ProfileMode = "host" | "guest";

export interface ProfileData {
  name: string;
  lastName: string;
  email: string;
  avatar: string;
  isVerified: boolean;
  reputation: {
    host: number;
    guest: number;
  };
  treasuryUsd: number;
}

export interface Hosting {
  id: string;
  propertyName: string;
  location: string;
  active: boolean;
  checkIn: string;
  checkOut: string;
  guest: string;
  image: string;
}

export interface Propiedad {
  id: string;
  name: string;
  location: string;
  published: boolean;
  image: string;
}

export interface Reserva {
  id: string;
  propertyName: string;
  location: string;
  active: boolean;
  checkIn: string;
  checkOut: string;
  host: string;
  totalUsd: number;
  image: string;
}

// ── ModeSwitch ──

export interface ModeSwitchProps {
  isHost: boolean;
  changeMode: (m: ProfileMode) => void;
}

// ── GuestView ──

export interface GuestViewProps {
  reservations: Reserva[];
}

// ── HostView ──

export interface HostViewProps {
  hostings: Hosting[];
  properties: Propiedad[];
}

// ── ListCard ──

export interface ListCardProps {
  image: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  active?: boolean;
}

// ── EmptyState ──

export interface EmptyStateProps {
  message: string;
  description?: string;
  action?: string;
  onAction?: () => void;
}

// ── TreasuryCard ──

export interface TreasuryCardProps {
  balanceUsd: number;
}

// ── ProfileHeader ──

export interface ProfileHeaderProps {
  profile: ProfileData;
  mode: ProfileMode;
  onChangeMode: (m: ProfileMode) => void;
  onMenuOpen?: () => void;
}

// ── ProfileSidebar ──

export interface ProfileSidebarProps {
  expanded: boolean;
  onToggleExpand: () => void;
  activeItem: string;
  onNavigate: (id: string) => void;
  mode: ProfileMode;
  onChangeMode: (m: ProfileMode) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  minimized?: boolean;
  profile?: ProfileData;
}

// ── SidebarMobile ──

export interface SidebarMobileProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  activeItem: string;
  onSelect: (item: NavItem) => void;
  profile?: ProfileData;
  mode: ProfileMode;
  onChangeMode: (m: ProfileMode) => void;
  onNavigate: (id: string) => void;
}

// ── SidebarModeFooter ──

export interface SidebarModeFooterProps {
  mode: ProfileMode;
  expanded: boolean;
  onChangeMode: (m: ProfileMode) => void;
  onNavigate: (id: string) => void;
}

// ── SidebarNav ──

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  action?: "navigate" | "switch-mode" | "logout";
}

export interface SidebarNavProps {
  items: NavItem[];
  activeItem: string;
  onSelect: (item: NavItem) => void;
  expanded: boolean;
}

// ── SectionCard ──

export interface SectionCardProps {
  icon: ReactNode;
  title: string;
  headingLevel?: "h2" | "h3" | "h4";
  rightContent?: ReactNode;
  children: ReactNode;
}
