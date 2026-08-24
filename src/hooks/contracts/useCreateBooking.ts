"use client";

import type { Address } from "@solana/kit";
import { useCallback } from "react";
import { sileo } from "sileo";

import {
  DEFAULT_BOOKING_ERROR,
  getBookingErrorMessage,
} from "@/helpers/bookingErrors";
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
  /** Present when status is false; used to surface actionable on-chain errors. */
  error?: unknown;
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
        const checkInYear = dates.checkIn.getFullYear();
        const checkOutYear = dates.checkOut.getFullYear();

        if (checkInYear + 1 < checkOutYear) {
          throw new Error(
            "No se permiten bookings que incluyan 3 años diferentes",
          );
        }

        // Random offset en segundos (0..86399) para que el seed del PDA de Booking
        // siempre sea único y no choque, manteniendo el mismo día de calendario.
        const randomOffset = Math.floor(Math.random() * 86400);
        const checkIn =
          Math.floor(dates.checkIn.getTime() / 1000) + randomOffset;
        const checkOut =
          Math.floor(dates.checkOut.getTime() / 1000) + randomOffset;

        const { tx } = await buildCreateBookingInstruction({
          wallet: userWallet,
          hostWallet,
          property,
          checkIn,
          checkOut,
          client,
        });

        const txResult = await handleSignAndSend(tx);
        if (!txResult.status && !txResult.simulationFailed) {
          sileo.error({
            title:
              getBookingErrorMessage(txResult.error) ?? DEFAULT_BOOKING_ERROR,
          });
        }
        return txResult as CreateBookingResult;
      } catch (error) {
        console.error("Error building createBooking tx:", error);

        if (error instanceof Error) {
          if (
            error.message ===
            "No se permiten bookings que incluyan 3 años diferentes"
          ) {
            sileo.error({
              title: "Error preparando la reserva",
              description: error.message,
            });
          } else {
            sileo.error({
              title: "Error preparando la reserva",
            });
          }
        }
        return { status: false, error };
      }
    },
    [client, handleSignAndSend, hostWallet, property, userWallet],
  );

  return { createBooking, loading };
}
