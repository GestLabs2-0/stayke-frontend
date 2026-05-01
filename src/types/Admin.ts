export interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

//Dispute types

export type DisputeStatus = "pending" | "reviewing" | "resolved" | "rejected";

export interface Dispute {
  id: string;
  property: string;
  guest: string;
  host: string;
  amount: string;
  reason: string;
  status: DisputeStatus;
  date: string;
}
