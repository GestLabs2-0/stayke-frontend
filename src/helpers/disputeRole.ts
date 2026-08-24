import { DisputeParty } from "@GestLabs2-0/stayke-disputes";
import type { Dispute } from "@/types/api/disputes";
import type { UserRoleInDispute } from "@/types/profile/disputes";

/**
 * Deriva el rol del usuario actual en una disputa ("initiator", "accused" o null).
 */
export function userRoleInDispute(
  dispute: Dispute,
  userWallet: string | null,
  userProfileAddress?: string | null,
): UserRoleInDispute {
  if (!userWallet && !userProfileAddress) return null;

  const guestIsUser =
    (userWallet !== null && dispute.booking.guest_profile_pda === userWallet) ||
    (userProfileAddress !== null &&
      dispute.booking.guest_profile_pda === userProfileAddress);
  const hostIsUser =
    (userWallet !== null && dispute.booking.host_profile_pda === userWallet) ||
    (userProfileAddress !== null &&
      dispute.booking.host_profile_pda === userProfileAddress);
  const openedByGuest = dispute.openedBy === DisputeParty.Guest;

  if (openedByGuest ? guestIsUser : hostIsUser) return "initiator";
  if (guestIsUser || hostIsUser) return "accused";
  return null;
}
