import { BookingStatus } from "@GestLabs2-0/stayke-escrow";

/**
 * Clases Tailwind semánticas por estado de reserva. El color es señal de
 * estado (colorize/product: Restrained, semántico, no decorativo) y siempre
 * va acompañado del texto de la etiqueta para no depender solo del color.
 */
export const STATUS_BADGE_CLASSES: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: "bg-amber-100 text-amber-800",
  [BookingStatus.HostAccepted]: "bg-sky-100 text-sky-800",
  [BookingStatus.Active]: "bg-green-100 text-green-700",
  [BookingStatus.Completed]: "bg-teal-100 text-teal-800",
  [BookingStatus.Released]: "bg-emerald-100 text-emerald-800",
  [BookingStatus.Cancelled]: "bg-zinc-100 text-zinc-600",
  [BookingStatus.Disputed]: "bg-red-100 text-red-700",
  [BookingStatus.DisputeResolved]: "bg-indigo-100 text-indigo-700",
  [BookingStatus.DisputeRejected]: "bg-rose-100 text-rose-700",
};

/** Punto de color usado como marcador de sección/estado. */
export const STATUS_DOT_CLASSES: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: "bg-amber-500",
  [BookingStatus.HostAccepted]: "bg-sky-500",
  [BookingStatus.Active]: "bg-green-500",
  [BookingStatus.Completed]: "bg-teal-500",
  [BookingStatus.Released]: "bg-emerald-500",
  [BookingStatus.Cancelled]: "bg-zinc-400",
  [BookingStatus.Disputed]: "bg-red-500",
  [BookingStatus.DisputeResolved]: "bg-indigo-500",
  [BookingStatus.DisputeRejected]: "bg-rose-500",
};
