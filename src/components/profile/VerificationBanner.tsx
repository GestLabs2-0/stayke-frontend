"use client";

import { DiditSdk } from "@didit-protocol/sdk-web";
import { Hourglass, ShieldAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { sileo } from "sileo";

import { useWalletContext } from "@/hooks/useWallet";
import { staykeApi } from "@/lib/staykeApi";
import { IS_MVP } from "@/shared/constants";
import type { DiditSessionStatus } from "@/types/api/didit";

export function VerificationBanner() {
  const { userProfile, userWallet, userBackend, refetchAccounts } =
    useWalletContext();
  const [diditSessionStatus, setDiditSessionStatus] =
    useState<DiditSessionStatus>("Not Started");
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isVerifyingMvp, setIsVerifyingMvp] = useState(false);

  const fetchDiditProgress = useCallback(async () => {
    setIsLoadingProgress(true);
    try {
      const response = await staykeApi.getDiditProgress();
      if (response.status && response.data) {
        setDiditSessionStatus(response.data.diditSessionStatus);
      }
    } catch (error) {
      console.error("Error fetching Didit progression:", error);
    } finally {
      setIsLoadingProgress(false);
    }
  }, []);

  useEffect(() => {
    fetchDiditProgress();
  }, [fetchDiditProgress]);

  const isVerified =
    (userProfile?.data.identity.__option === "Some" &&
      !userProfile?.data.banned &&
      diditSessionStatus === "Approved") ||
    Boolean(userBackend?.isVerified);

  if (isVerified) {
    return null;
  }

  const handleVerifyMvp = async () => {
    if (!userWallet || isVerifyingMvp) return;
    setIsVerifyingMvp(true);
    try {
      const response = await staykeApi.verifyIdentity();
      if (response.status) {
        setDiditSessionStatus("Approved");
        await refetchAccounts();
        sileo.success({
          title: "Identidad verificada",
          description: "Identidad verificada y vinculada exitosamente.",
        });
      } else {
        const message =
          Array.isArray(response.errors) && response.errors.length > 0
            ? response.errors.join(", ")
            : response.message;
        sileo.error({
          title: "Error",
          description: message || "No se pudo verificar la identidad.",
        });
      }
    } catch (error) {
      console.error("Error verifying identity (MVP):", error);
      sileo.error({
        title: "Error",
        description: "No se pudo verificar la identidad.",
      });
    } finally {
      setIsVerifyingMvp(false);
    }
  };

  const handleVerify = async () => {
    if (!userWallet || isCreatingSession) return;
    setIsCreatingSession(true);
    try {
      const response = await staykeApi.createDiditSession();
      if (!response.status || !response.data) {
        const message = Array.isArray(response.message)
          ? response.message.join(", ")
          : response.message;
        sileo.error({
          title: "Error",
          description: message || "No se pudo iniciar la verificación.",
        });
        setIsCreatingSession(false);
        return;
      }

      DiditSdk.shared.onComplete = async (result) => {
        try {
          if (result.type === "completed") {
            const progress = await staykeApi.getDiditProgress();
            if (
              progress.status &&
              progress.data?.diditSessionStatus === "Approved"
            ) {
              setDiditSessionStatus("Approved");
              await refetchAccounts();
              sileo.success({ title: "Identidad verificada" });
            } else if (
              progress.data?.diditSessionStatus === "In Progress" ||
              progress.data?.diditSessionStatus === "In Review"
            ) {
              sileo.info({
                title: "Verificación en revisión",
                description: "Tu verificación está en revisión.",
              });
            } else {
              sileo.error({
                title: "Error",
                description:
                  "No pudimos verificar tu identidad. Intenta de nuevo.",
              });
            }
          } else if (result.type === "cancelled") {
            sileo.info({
              title: "Verificación cancelada",
              description: "La verificación fue cancelada.",
            });
          } else {
            sileo.error({
              title: "Error",
              description: "No se pudo completar la verificación.",
            });
          }
        } catch (error) {
          console.error("Error processing Didit verification result:", error);
        } finally {
          setIsCreatingSession(false);
          DiditSdk.shared.onComplete = undefined;
        }
      };

      await DiditSdk.shared.startVerification({ url: response.data.url });
    } catch (error) {
      console.error("Error creating Didit session:", error);
      DiditSdk.shared.onComplete = undefined;
      sileo.error({
        title: "Error",
        description: "No se pudo iniciar la verificación.",
      });
      setIsCreatingSession(false);
    }
  };

  if (diditSessionStatus === "In Progress") {
    return (
      <div className="card-surface flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-warm">
          <Hourglass className="size-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-sans text-sm font-semibold text-[#171717]">
            Verificación en progreso
          </p>
          <p className="mt-1 font-sans text-sm leading-relaxed text-[#434654]">
            Estamos procesando tu verificación de identidad con Didit. Te
            avisaremos cuando cambie el estado.
          </p>
          {IS_MVP && (
            <button
              type="button"
              onClick={handleVerifyMvp}
              disabled={isVerifyingMvp}
              className="mt-3 rounded-full border border-accent-warm bg-transparent cursor-pointer px-5 py-2 font-sans text-xs font-semibold tracking-wide text-accent-warm uppercase transition-colors hover:bg-accent-warm hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifyingMvp ? "Verificando..." : "Forzar Verificación (MVP)"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card-surface flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-warm">
        <ShieldAlert className="size-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-sans text-sm font-semibold text-[#171717]">
          Verifica tu identidad
        </p>
        <p className="mt-1 font-sans text-sm leading-relaxed text-[#434654]">
          Aumenta tu reputación y genera confianza en la comunidad verificando
          tu identidad con Didit.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleVerify}
            disabled={isCreatingSession || isLoadingProgress || isVerifyingMvp}
            className="rounded-full bg-accent-warm cursor-pointer px-5 py-2 font-sans text-xs font-semibold tracking-wide text-white uppercase transition-colors bg-accent-warm-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingSession ? "Verificando..." : "Verificar con Didit"}
          </button>

          {IS_MVP && (
            <button
              type="button"
              onClick={handleVerifyMvp}
              disabled={
                isVerifyingMvp || isCreatingSession || isLoadingProgress
              }
              className="rounded-full border border-accent-warm bg-transparent cursor-pointer px-5 py-2 font-sans text-xs font-semibold tracking-wide text-accent-warm uppercase transition-colors hover:text-white hover:bg-(--color-accent-warm-hover) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifyingMvp ? "Verificando..." : "Verificar (MVP)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
