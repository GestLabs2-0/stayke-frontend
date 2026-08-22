export type ChatAuthor = "me" | "them";

export interface ChatMessage {
  id: string;
  author: ChatAuthor;
  text: string;
  sentAt: string;
}

export interface ChatContact {
  id: string;
  name: string;
  avatarUrl: string;
  online: boolean;
  unread?: number;
}

export interface ChatConversation {
  id: string;
  /** id numérico real de la conversación en el backend (para fetches por id / socket). */
  apiId?: number;
  contact: ChatContact;
  messages: ChatMessage[];
}
