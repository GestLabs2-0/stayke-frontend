import type { ApiContact, ApiConversation, ApiMessage } from "@/types/api/chat";
import type { ChatConversation, ChatMessage } from "@/types/chats";

/**
 * Avatar por defecto cuando el backend no trae `avatarUrl` (igual que el mock
 * anterior): seed con el owner de la wallet.
 */
function dicebearAvatar(seed: string): string {
  return `https://api.dicebear.com/9x/avataaars/svg?seed=${seed}`;
}

/** Versión corta de una wallet Solana: "4ABC…xyz". */
export function shortAddress(owner: string): string {
  if (owner.length <= 7) return owner;
  return `${owner.slice(0, 4)}…${owner.slice(-3)}`;
}

/** Nombre de contacto: "name lastName" o fallback al address cortado. */
export function contactDisplayName(contact: ApiContact): string {
  const full = `${contact.name} ${contact.lastName}`.trim();
  return full || shortAddress(contact.owner);
}

/**
 * Formatea createdAt a una etiqueta relativa mínima: hora ("10:24"), "Ayer",
 * "12 jun" o "12 jun 2024". Mantiene el idioma de la UI (es).
 */
export function formatMessageTime(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / 86_400_000,
  );

  if (dayDiff <= 0) {
    return date.toLocaleTimeString("es", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (dayDiff === 1) return "Ayer";

  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
  };
  if (date.getFullYear() !== now.getFullYear()) opts.year = "numeric";
  return date.toLocaleDateString("es", opts);
}

/**
 * ApiConversation → ChatConversation. El contacto es el participante que NO es
 * el usuario autenticado (guest o host según corresponda). `apiId` guarda el id
 * numérico real para los fetches por id y los eventos de socket.
 */
export function mapConversationToFrontend(
  api: ApiConversation,
  userWallet: string,
): ChatConversation {
  const contactApi = api.hostId === userWallet ? api.guest : api.host;

  return {
    id: String(api.id),
    apiId: api.id,
    contact: {
      id: contactApi.owner,
      name: contactDisplayName(contactApi),
      avatarUrl: contactApi.avatarUrl ?? dicebearAvatar(contactApi.owner),
      // El backend no expone presencia: siempre offline (el badge no se pinta).
      online: false,
      unread: 0,
    },
    messages: [],
  };
}

/** ApiMessage → ChatMessage con `id` como string y `author` según senderId. */
export function mapMessageToFrontend(
  api: ApiMessage,
  userWallet: string,
): ChatMessage {
  return {
    id: String(api.id),
    author: api.senderId === userWallet ? "me" : "them",
    text: api.content,
    sentAt: formatMessageTime(api.createdAt),
  };
}
