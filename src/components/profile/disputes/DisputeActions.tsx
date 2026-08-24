"use client";

import { address, isAddress } from "@solana/kit";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { sileo } from "sileo";

import { DisputeParty, DisputeState } from "@GestLabs2-0/stayke-disputes";
import { useChat } from "@/context/ChatContext";
import { isDisputeEscalationWindowElapsed } from "@/helpers/disputeTiming";
import { useCloseDisputeAction } from "@/hooks/contracts/useCloseDisputeAction";
import { useSolveDisputeBeforeAdminAction } from "@/hooks/contracts/useSolveDisputeBeforeAdminAction";
import useNetwork from "@/hooks/useNetwork";
import { fetchProfileAuthority } from "@/lib/contracts/utils/fetchProfileAuthority";
import type { DisputeActionsProps } from "@/types/profile/disputes";

export function DisputeActions({
  dispute,
  userRole,
  onRefresh,
}: DisputeActionsProps) {
  const { client } = useNetwork();
  const { openChat, createChat } = useChat();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const solveDispute = useSolveDisputeBeforeAdminAction();
  const closeDispute = useCloseDisputeAction();

  const isEscalationTime = isDisputeEscalationWindowElapsed(dispute.openedAt);
  const isOpenP2P = dispute.state === DisputeState.OpenP2P;
  const isResolved =
    dispute.state === DisputeState.ResolvedByAdmin ||
    dispute.state === DisputeState.ResolvedByP2P;

  const handleOpenChat = async () => {
    setIsStartingChat(true);
    try {
      const isInitiatorGuest = dispute.openedBy === DisputeParty.Guest;
      const counterpartyProfile =
        userRole === "initiator"
          ? isInitiatorGuest
            ? dispute.booking.host_profile_pda
            : dispute.booking.guest_profile_pda
          : isInitiatorGuest
            ? dispute.booking.guest_profile_pda
            : dispute.booking.host_profile_pda;

      if (!isAddress(counterpartyProfile)) {
        sileo.error({
          title: "Error",
          description: "No se pudo identificar la cuenta de la contraparte.",
        });
        return;
      }

      const counterpartyWallet = await fetchProfileAuthority(
        client,
        address(counterpartyProfile),
      );

      await createChat(counterpartyWallet);
      openChat();
    } catch (error) {
      console.error("Error opening chat from dispute:", error);
      sileo.error({
        title: "Error al abrir chat",
        description: "No se pudo iniciar la conversación con la contraparte.",
      });
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleSolveDispute = () => {
    sileo.action({
      title: "¿Resolver disputa entre las partes?",
      description:
        "Se restaurará el estado previo de la reserva y se marcará la disputa como resuelta.",
      position: "top-center",
      button: {
        title: "Resolver disputa",
        onClick: async () => {
          const res = await solveDispute.run(dispute);
          if (res.status) onRefresh?.();
        },
      },
    });
  };

  const handleEscalateNotice = () => {
    sileo.info({
      title: "Próximamente disponible",
      description:
        "El escalamiento automático a soporte estará disponible próximamente.",
    });
  };

  const handleCloseDispute = () => {
    sileo.action({
      title: "¿Cerrar la disputa?",
      description:
        "Se cerrará la cuenta de la disputa on-chain y se devolverá el rent correspondiente.",
      position: "top-center",
      button: {
        title: "Cerrar disputa",
        onClick: async () => {
          const res = await closeDispute.run(dispute);
          if (res.status) onRefresh?.();
        },
      },
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleOpenChat}
        disabled={isStartingChat}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#ebe7e7] bg-white px-3 py-1.5 font-plus-jakarta text-xs font-semibold text-[#434654] shadow-sm transition-all hover:bg-[#f8f9fa] hover:text-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isStartingChat ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <MessageSquare className="size-3.5 text-primary" />
        )}
        <span>Mensajes</span>
      </button>

      {isOpenP2P && userRole === "initiator" && !isEscalationTime && (
        <button
          type="button"
          onClick={handleSolveDispute}
          disabled={solveDispute.loading}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-warm px-3.5 py-1.5 font-plus-jakarta text-xs font-semibold text-white shadow-sm transition-all hover:bg-accent-warm-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {solveDispute.loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <CheckCircle className="size-3.5" />
          )}
          <span>Resolver disputa</span>
        </button>
      )}

      {isOpenP2P && isEscalationTime && (
        <button
          type="button"
          onClick={handleEscalateNotice}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-accent-warm/40 bg-accent-warm/10 px-3.5 py-1.5 font-plus-jakarta text-xs font-semibold text-accent-warm-hover transition-all hover:bg-accent-warm/20"
        >
          <AlertTriangle className="size-3.5" />
          <span>Escalar a Stayke</span>
        </button>
      )}

      {isResolved && (
        <button
          type="button"
          onClick={handleCloseDispute}
          disabled={closeDispute.loading}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 font-plus-jakarta text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {closeDispute.loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <XCircle className="size-3.5" />
          )}
          <span>Cerrar disputa</span>
        </button>
      )}
    </div>
  );
}
