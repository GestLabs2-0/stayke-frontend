"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useChatSocket } from "@/hooks/useChatSocket";
import { useWalletContext } from "@/hooks/useWallet";
import {
  mapConversationToFrontend,
  mapMessageToFrontend,
} from "@/lib/chatMappers";
import { staykeApi } from "@/lib/staykeApi";
import type { ApiMessage } from "@/types/api/chat";
import type { ChatConversation, ChatMessage } from "@/types/chats";

interface ChatContextValue {
  isOpen: boolean;
  selected: ChatConversation | null;
  conversations: ChatConversation[];
  loading: boolean;
  error: string | null;
  openChat: (conversation?: ChatConversation) => void;
  selectConversation: (conversation: ChatConversation | null) => void;
  sendMessage: (content: string) => void;
  closeChat: () => void;
  createChat: (hostId: string, propertyId?: number) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

/**
 * Merge mensajes por id sin duplicar: el snapshot de listMessages puede
 * resolver DESPUÉS de un chat:new en vuelo; reemplazar el array lo pisaría.
 * Los entrantes que ya existen (por id) se descartan, los nuevos se agregan.
 */
function mergeMessages(
  existing: ChatMessage[],
  incoming: ChatMessage[],
): ChatMessage[] {
  const seen = new Set(existing.map((m) => m.id));
  return [...existing, ...incoming.filter((m) => !seen.has(m.id))];
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { userWallet, isAuthenticated } = useWalletContext();

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<ChatConversation | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wallet = userWallet ? String(userWallet) : "";
  const authenticated = isAuthenticated && wallet !== "";

  /** chat:new — append al final de la conversación seleccionada (si coincide). */
  const handleNewMessage = useCallback(
    (message: ApiMessage) => {
      const mapped = mapMessageToFrontend(message, wallet);
      setSelected((prev) => {
        if (!prev || prev.apiId !== message.conversationId) return prev;
        const already = prev.messages.some((m) => m.id === mapped.id);
        if (already) return prev;
        return { ...prev, messages: [...prev.messages, mapped] };
      });
      setConversations((prev) =>
        prev.map((c) => {
          if (c.apiId !== message.conversationId) return c;
          const already = c.messages.some((m) => m.id === mapped.id);
          return already ? c : { ...c, messages: [...c.messages, mapped] };
        }),
      );
    },
    [wallet],
  );

  // El socket vive mientras el panel está abierto (y autenticado): para cuando
  // se selecciona una conversación ya está conectado.
  const {
    joinConversation,
    sendMessage: socketSend,
    markRead,
  } = useChatSocket(userWallet, isOpen && authenticated, {
    onMessage: handleNewMessage,
    onException: (payload) => setError(payload.message),
  });

  // Carga de conversaciones al montar / cuando cambia el usuario autenticado.
  useEffect(() => {
    if (!authenticated) {
      setConversations([]);
      setSelected(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    staykeApi
      .listConversations()
      .then((res) => {
        if (cancelled) return;
        const items = res.data;
        if (res.status && items) {
          setConversations(
            items.map((c) => mapConversationToFrontend(c, wallet)),
          );
        } else {
          setError(
            typeof res.message === "string"
              ? res.message
              : "No se pudieron cargar las conversaciones.",
          );
        }
      })
      .catch(() => {
        if (!cancelled) setError("No se pudieron cargar las conversaciones.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authenticated, wallet]);

  // Al cerrar el panel se limpia la conversación seleccionada.
  useEffect(() => {
    if (!isOpen) setSelected(null);
  }, [isOpen]);

  const selectConversation = useCallback(
    (conversation: ChatConversation | null) => {
      setSelected(conversation);
      if (!conversation || conversation.apiId === undefined) return;

      const conversationId = conversation.apiId;
      joinConversation(conversationId);
      markRead(conversationId);

      staykeApi
        .listMessages(conversationId)
        .then((res) => {
          const items = res.data;
          const messages =
            res.status && items
              ? items.map((m) => mapMessageToFrontend(m, wallet))
              : [];
          setSelected((prev) =>
            prev && prev.apiId === conversationId
              ? { ...prev, messages: mergeMessages(prev.messages, messages) }
              : prev,
          );
          setConversations((prev) =>
            prev.map((c) =>
              c.apiId === conversationId
                ? { ...c, messages: mergeMessages(c.messages, messages) }
                : c,
            ),
          );
        })
        .catch(() => {
          /* la lista ya quedó seleccionada; el error se muestra al enviar */
        });
    },
    [joinConversation, markRead, wallet],
  );

  const openChat = useCallback(
    (conversation?: ChatConversation) => {
      setIsOpen(true);
      if (conversation) selectConversation(conversation);
    },
    [selectConversation],
  );

  const sendMessage = useCallback(
    (content: string) => {
      if (!selected || selected.apiId === undefined) return;
      socketSend(selected.apiId, content);
    },
    [selected, socketSend],
  );

  const closeChat = useCallback(() => setIsOpen(false), []);

  const createChat = useCallback(
    async (hostId: string, propertyId?: number) => {
      staykeApi
        .createConversation(hostId, propertyId)
        .then((response) => {
          console.log(response);
          if (response?.conflict) {
            const lookedUp = conversations.find(
              (conversation) => conversation.contact.id === hostId,
            );
            setSelected(lookedUp ?? null);
          }
          if (response.data !== null && response.status) {
            const c = response.data;
            setConversations((prev) => {
              return [...prev, mapConversationToFrontend(c, wallet)];
            });
          }
        })
        .catch((err) => {
          // We already selected chat
          console.log(err);
        });
    },
    [conversations, wallet],
  );

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        selected,
        conversations,
        loading,
        error,
        openChat,
        selectConversation,
        sendMessage,
        closeChat,
        createChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return ctx;
}
