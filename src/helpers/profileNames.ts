export function shortAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function fullName(
  name: string,
  lastName: string,
  fallback: string,
): string {
  const full = `${name} ${lastName}`.trim();
  return full.length > 0 ? full : shortAddress(fallback);
}
