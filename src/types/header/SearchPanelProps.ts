export interface GuestCounts {
  adultos: number;
  ninos: number;
  bebes: number;
  mascotas: number;
}

export type SearchPanelProps = {
  activeField: string | null;
  onSelectDestination?: (dest: {
    name: string;
    lat: number;
    long: number;
  }) => void;
  guestCounts?: GuestCounts;
  onAdjustGuest?: (key: keyof GuestCounts, delta: number) => void;
  onClose?: () => void;
};
