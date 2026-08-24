import type { GuestCounts } from "./SearchPanelProps";

export interface GuestMenuProps {
  guestCounts?: GuestCounts;
  onAdjustGuest?: (key: keyof GuestCounts, delta: number) => void;
}
