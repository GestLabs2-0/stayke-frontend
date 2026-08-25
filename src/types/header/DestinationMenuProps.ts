export interface DestinationMenuProps {
  onSelectDestination?: (dest: {
    name: string;
    lat: number;
    long: number;
  }) => void;
}
