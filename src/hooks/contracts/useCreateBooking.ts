"use client";

import type { Address } from "@solana/kit";
import { useCallback } from "react";
import { sileo } from "sileo";

import useNetwork from "@/hooks/useNetwork";
import { useSignAndSendTx } from "@/hooks/useSignAndSendTx";
import { useWalletContext } from "@/hooks/useWallet";
import { buildCreateBookingInstruction } from "@/lib/contracts/buildCreateBookingInstruction";

interface UseCreateBookingParams {
  /** On-chain listing/property PDA. */
  property: Address | null;
  /** Host authority (owner) wallet address. */
  hostWallet: Address | null;
}

export interface CreateBookingResult {
  status: boolean;
  signature?: string;
}

/**
 * Builds, signs and sends the on-chain `createBooking` transaction for the
 * given property. Mirrors the existing on-chain flows in the app.
 */
export function useCreateBooking({
  property,
  hostWallet,
}: UseCreateBookingParams) {
  const { userWallet } = useWalletContext();
  const { client } = useNetwork();
  const { handleSignAndSend, loading } = useSignAndSendTx(userWallet);

  const createBooking = useCallback(
    async (dates: {
      checkIn: Date;
      checkOut: Date;
    }): Promise<CreateBookingResult> => {
      if (!userWallet) {
        sileo.error({ title: "Conecta tu wallet para reservar" });
        return { status: false };
      }
      if (!property || !hostWallet) {
        sileo.error({ title: "No pudimos preparar la reserva" });
        return { status: false };
      }

      try {
        const { tx } = await buildCreateBookingInstruction({
          wallet: userWallet,
          hostWallet,
          property,
          checkIn: Math.floor(dates.checkIn.getTime() / 1000),
          checkOut: Math.floor(dates.checkOut.getTime() / 1000),
          client,
        });
        return await handleSignAndSend(tx);
      } catch (error) {
        console.error("Error building createBooking tx:", error);
        sileo.error({ title: "Error preparando la reserva" });
        return { status: false };
      }
    },
    [client, handleSignAndSend, hostWallet, property, userWallet],
  );

  return { createBooking, loading };
}
