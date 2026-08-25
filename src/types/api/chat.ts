import type { ApiResponse } from "@/types/http";

/** Contacto (guest/host) que viaja dentro de una conversación. */
export interface ApiContact {
  owner: string;
  name: string;
  lastName: string;
  avatarUrl: string | null;
}

/** Shape de `GET /chat/conversations` y `POST /chat/conversations`. */
export interface ApiConversation {
  id: number;
  guestId: string;
  hostId: string;
  propertyId: number | null;
  createdAt?: string;
  updatedAt?: string;
  guest: ApiContact;
  host: ApiContact;
}

/** Shape de `GET /chat/conversations/:id/messages` y del evento `chat:new`. */
export interface ApiMessage {
  id: number;
  conversationId: number;
  senderId: string;
  content: string;
  readAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Resultado de `createConversation`. Igual que `ApiResponse<ApiConversation>`
 * pero expone `conflict: true` cuando el backend responde 409 (la conversación
 * guest-host ya existe). El caller puede inspeccionar `conflict` para recuperar
 * la conversación existente en lugar de mostrar un error.
 */
export interface CreateConversationResult extends ApiResponse<ApiConversation> {
  conflict?: boolean;
}
