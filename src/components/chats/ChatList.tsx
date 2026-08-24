"use client";

import Image from "next/image";

import type { ChatConversation } from "@/types/chats";

interface ChatListProps {
  conversations: ChatConversation[];
  onSelect: (conversation: ChatConversation) => void;
}

function lastPreview(conversation: ChatConversation): string {
  const last = conversation.messages[conversation.messages.length - 1];
  if (!last) return "Sin mensajes";
  return last.author === "me" ? `Tú: ${last.text}` : last.text;
}

function formatWhen(conversation: ChatConversation): string {
  const last = conversation.messages[conversation.messages.length - 1];
  return last?.sentAt ?? "";
}

export const ChatList = ({ conversations, onSelect }: ChatListProps) => {
  return (
    <ul className="divide-y divide-border overflow-y-auto">
      {conversations.map((conversation) => (
        <li key={conversation.id}>
          <button
            type="button"
            onClick={() => onSelect(conversation)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface/60 focus:outline-none focus-visible:bg-surface/60"
          >
            <span className="relative shrink-0">
              <div className="size-11 rounded-full overflow-hidden">
                <Image
                  src={conversation.contact.avatarUrl}
                  alt={conversation.contact.name}
                  width={44}
                  height={44}
                  className="size-full bg-surface object-cover"
                />
              </div>
              {conversation.contact.online && (
                <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white bg-emerald-500" />
              )}
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate font-plus-jakarta text-sm font-semibold text-foreground">
                  {conversation.contact.name}
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {formatWhen(conversation)}
                </span>
              </span>
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-sm text-secondary">
                  {lastPreview(conversation)}
                </span>
                {(conversation.contact.unread ?? 0) > 0 && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
                    {conversation.contact.unread}
                  </span>
                )}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};
