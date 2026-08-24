/**
 * Converts a hex string (e.g. a sha256 hex digest) into a Uint8Array.
 * Used to map the backend's `hashedValue` (64-char hex) into the 32-byte
 * `stateHash`/`contentRef` fields expected by the on-chain Listing account.
 */
export function hexToUint8Array(hex: string): Uint8Array {
  const normalized = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (normalized.length % 2 !== 0) {
    throw new Error("Invalid hex string: odd length");
  }

  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
