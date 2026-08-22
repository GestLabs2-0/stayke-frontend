
/** Convierte "YYYY-MM-DD" a timestamp Unix (media noche local). */
export function dateToUnix(date: string): number | undefined {
  if (!date) return undefined;
  const ms = new Date(`${date}T00:00:00`).getTime();
  return Number.isNaN(ms) ? undefined : Math.floor(ms / 1000);
}
