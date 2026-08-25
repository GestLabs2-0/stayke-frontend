import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { Booking } from "./api/booking";
import type { PropertyResponse } from "./api/property";

// ── Domain types ──

export type ProfileMode = "host" | "guest" | "all";

export interface ProfileData {
  name: string;
  lastName: string;
  email: string;
  avatar: string | null;
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
  reservations?: Reserva[];
}

// ── HostView ──

export interface HostViewProps {
  hostings?: Hosting[];
  properties?: Propiedad[];
}

// ── HostView Subsections ──

export interface HostActiveHostingsProps {
  bookings: Booking[];
  loading: boolean;
  onCreateProperty?: () => void;
}

export interface HostPastHostingsProps {
  bookings: Booking[];
  loading: boolean;
  onCreateProperty?: () => void;
}

export interface HostActivePropertiesProps {
  properties: PropertyResponse[];
  loading: boolean;
  onCreateProperty?: () => void;
}

// ── GuestView Subsections ──

export interface GuestActiveReservationProps {
  booking: Booking | null;
  loading: boolean;
  onExplore?: () => void;
}

export interface GuestPastReservationsProps {
  bookings: Booking[];
  loading: boolean;
  onExplore?: () => void;
}

// ── ListCard ──

export interface ListCardProps {
  image: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  active?: boolean;
}

export interface ListCardSkeletonProps {
  count?: number;
}

// ── EmptyState ──

export interface EmptyStateProps {
  message: string;
  description?: string;
  action?: string;
  onAction?: () => void;
}

// ── TreasuryCard ──

export type {
  TreasuryCardProps,
  TreasuryDepositFormProps,
  TreasuryFormValues,
  TreasuryModalProps,
  TreasuryTab,
  TreasuryWithdrawFormProps,
} from "./profile/treasury";

// ── ProfileHeader ──

export interface ProfileAvatarProps {
  avatar: string | null;
  name: string;
  lastName: string;
  editable?: boolean;
}

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
  onNavigate: (id: string, link: string) => void;
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
  onSelect: (item: NavItem) => void;
  profile?: ProfileData;
  mode: ProfileMode;
  onChangeMode: (m: ProfileMode) => void;
  onNavigate: (id: string, link: string) => void;
}

// ── SidebarModeFooter ──

export interface SidebarModeFooterProps {
  mode: ProfileMode;
  expanded: boolean;
  onChangeMode: (m: ProfileMode) => void;
  onNavigate: (id: string, link: string) => void;
}

// ── SidebarNav ──

export interface NavItem {
  id: string;
  label: string;
  role: ProfileMode;
  icon: LucideIcon;
  action?:
    | { type: "navigate"; link: string }
    | { type: "switch-mode" }
    | { type: "logout" };
}

export interface SidebarNavProps {
  items: NavItem[];
  onSelect: (item: NavItem) => void;
  expanded: boolean;
  mode: ProfileMode;
}

// ── SectionCard ──

export interface SectionCardProps {
  icon: ReactNode;
  title: string;
  headingLevel?: "h2" | "h3" | "h4";
  rightContent?: ReactNode;
  children: ReactNode;
}
