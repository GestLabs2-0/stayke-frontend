import type { Address, ProgramDerivedAddress } from "@solana/kit";
import {
  getAddressEncoder,
  getBytesEncoder,
  getProgramDerivedAddress,
  getU32Encoder,
} from "@solana/kit";

export type BookingDaysSeeds = {
  property: Address;
  year: number;
};

export async function findBookingDaysPda(
  seeds: BookingDaysSeeds,
  config: { programAddress?: Address | undefined } = {},
): Promise<ProgramDerivedAddress> {
  const {
    programAddress = "68ipZiXiUhsaSYSqEM3619vXgKy5CqFmNE6rYzxrXu6a" as Address<"68ipZiXiUhsaSYSqEM3619vXgKy5CqFmNE6rYzxrXu6a">,
  } = config;
  return await getProgramDerivedAddress({
    programAddress,
    seeds: [
      getBytesEncoder().encode(
        new Uint8Array([
          98, 111, 111, 107, 105, 110, 103, 95, 100, 97, 121, 115,
        ]),
      ),
      getAddressEncoder().encode(seeds.property),
      getU32Encoder().encode(seeds.year),
    ],
  });
}
