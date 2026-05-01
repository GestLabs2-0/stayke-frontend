//Dispute_Configs
import { Dispute, DisputeStatus } from "@/src/types/Admin";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  LayoutDashboard,
  Scale,
  Users,
  Building2,
  BarChart3,
  Settings,
} from "lucide-react";

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: "DSP-001",
    property: "Beachfront Loft · Cartagena",
    guest: "Carlos M.",
    host: "Ana R.",
    amount: "$320 USDC",
    reason: "Property not as described",
    status: "pending",
    date: "Apr 28, 2026",
  },
  {
    id: "DSP-002",
    property: "Downtown Studio · Bogotá",
    guest: "Laura P.",
    host: "Diego F.",
    amount: "$150 USDC",
    reason: "Early checkout refund",
    status: "reviewing",
    date: "Apr 27, 2026",
  },
  {
    id: "DSP-003",
    property: "Mountain Cabin · Medellín",
    guest: "James T.",
    host: "Sofia L.",
    amount: "$480 USDC",
    reason: "Amenities missing",
    status: "resolved",
    date: "Apr 25, 2026",
  },
  {
    id: "DSP-004",
    property: "City View Apt · Cali",
    guest: "Maria G.",
    host: "Pedro A.",
    amount: "$90 USDC",
    reason: "Noise complaint",
    status: "rejected",
    date: "Apr 24, 2026",
  },
];

export const STATUS_CONFIG: {
  [K in DisputeStatus]: {
    label: string;
    icon: typeof Clock;
    className: string;
  };
} = {
  pending: {
    label: "Pending",
    icon: AlertCircle,
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  reviewing: {
    label: "Reviewing",
    icon: Clock,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export const FILTERS: { label: string; value: DisputeStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Resolved", value: "resolved" },
  { label: "Rejected", value: "rejected" },
];

//Admin Sidebar

export const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Disputes", href: "/admin/disputes", icon: Scale },
  { label: "Users", href: "/admin/users", icon: Users, soon: true },
  {
    label: "Properties",
    href: "/admin/properties",
    icon: Building2,
    soon: true,
  },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, soon: true },
  { label: "Settings", href: "/admin/settings", icon: Settings, soon: true },
];
