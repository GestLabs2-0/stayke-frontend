"use client";

import { getDefaultClient } from "@dynamic-labs-sdk/client";
import type { Address } from "@solana/kit";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

import { API_URL, LOCAL_STORAGE_KEYS } from "@/shared/constants";
import type { ApiMessage } from "@/types/api/chat";

/**
 * La URL del socket es la base del API_URL pero SIN el prefijo `/api/v1.0`
 * (el gateway de Socket.IO de NestJS no lo usa).
 * Ej: `http://localhost:3000/api/v1.0` → `http://localhost:3000`.
 * En prod, si el gateway vive en otro host, seteá NEXT_PUBLIC_SOCKET_URL
 * (env var explícita) y esto no cambia.
 */
const SOCKET_BASE_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? API_URL.replace(/\/api\/v1\.0\/?$/, "");

export interface ChatSocketHandlers {
  /** Server → client `chat:new`: Message completo del room `conversation:{id}`. */
  onMessage?: (message: ApiMessage) => void;
  /** Server → client `chat:read`: { conversationId, readBy }. */
  onRead?: (payload: { conversationId: number; readBy: string }) => void;
  /** Server → client `exception`: { status: "error", message }. */
  onException?: (payload: { status: string; message: string }) => void;
}

/**
 * Hook de socket para el chat. Crea la conexión con `auth: { token }` usando el
 * mismo Bearer token que HttpClient (getDefaultClient de Dynamic o el accessToken
 * de localStorage). Expone emitters `chat:join`, `chat:send` y `chat:read`.
 *
 * - `enabled`: solo conecta cuando el chat está abierto/autenticado.
 * - Los handlers se leen desde un ref, así no se reconecta el socket por cambio
 *   de callbacks.
 * - Si `joinConversation` se llama antes de conectar (ej. primer render), el join
 *   queda pendiente y se emite al dispararse `connect`.
 */
export function useChatSocket(
  userWallet: string | Address | null,
  enabled = true,
  handlers: ChatSocketHandlers = {},
) {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const pendingJoinRef = useRef<number | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !userWallet) return;

    const token =
      getDefaultClient().token ??
      localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);

    const socket = io(SOCKET_BASE_URL, { auth: { token } });
    socketRef.current = socket;
    setConnected(false);

    socket.on("connect", () => {
      setConnected(true);
      if (pendingJoinRef.current !== null) {
        socket.emit("chat:join", { conversationId: pendingJoinRef.current });
        pendingJoinRef.current = null;
      }
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("chat:new", (message: ApiMessage) =>
      handlersRef.current.onMessage?.(message),
    );
    socket.on(
      "chat:read",
      (payload: { conversationId: number; readBy: string }) =>
        handlersRef.current.onRead?.(payload),
    );
    socket.on("exception", (payload: { status: string; message: string }) =>
      handlersRef.current.onException?.(payload),
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, userWallet]);

  const joinConversation = useCallback((conversationId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("chat:join", { conversationId });
    } else {
      pendingJoinRef.current = conversationId;
    }
  }, []);

  const sendMessage = useCallback((conversationId: number, content: string) => {
    // El servidor hace broadcast `chat:new` al room (el emisor también lo
    // recibe): no hacer optimistic append duplicado en el caller.
    socketRef.current?.emit("chat:send", { conversationId, content });
  }, []);

  const markRead = useCallback((conversationId: number) => {
    socketRef.current?.emit("chat:read", { conversationId });
  }, []);

  return { connected, joinConversation, sendMessage, markRead };
}
