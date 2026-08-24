/** Mirrors useCreateBooking: a booking spanning two adjacent years is cross-year. */
export function isCrossYear(checkIn: number, checkOut: number): boolean {
  return (
    new Date(checkIn * 1000).getFullYear() + 1 ===
    new Date(checkOut * 1000).getFullYear()
  );
}

export function getYears(
  checkIn: number,
  checkOut: number,
): { checkInYear: number; checkOutYear: number } {
  return {
    checkInYear: new Date(checkIn * 1000).getFullYear(),
    checkOutYear: new Date(checkOut * 1000).getFullYear(),
  };
}
