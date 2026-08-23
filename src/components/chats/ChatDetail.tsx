"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ChevronLeftIcon } from "@/icons";
import type { ChatConversation } from "@/types/chats";

interface ChatDetailProps {
  conversation: ChatConversation;
  onBack: () => void;
  onSend: (content: string) => void;
}

export const ChatDetail = ({
  conversation,
  onBack,
  onSend,
}: ChatDetailProps) => {
  const { contact, messages } = conversation;
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-correr el scroll al llegar mensajes nuevos
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    const content = text.trim();
    if (!content) return;
    onSend(content);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver a la lista de chats"
          className="flex size-9 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface hover:text-primary"
        >
          <ChevronLeftIcon className="size-5" />
        </button>

        <Image
          src={contact.avatarUrl}
          alt={contact.name}
          width={40}
          height={40}
          className="size-10 rounded-full bg-surface"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate font-plus-jakarta text-sm font-semibold text-foreground">
            {contact.name}
          </p>
          <p
            className={`text-xs ${
              contact.online ? "text-emerald-600" : "text-muted"
            }`}
          >
            {contact.online ? "En línea" : "Conectado recientemente"}
          </p>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto bg-surface/40 px-4 py-4"
      >
        {messages.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">
            Sin mensajes todavía. ¡Saludá!
          </p>
        )}
        {messages.map((message) => {
          const mine = message.author === "me";
          return (
            <div
              key={message.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  mine
                    ? "rounded-br-sm bg-primary text-white"
                    : "rounded-bl-sm bg-white text-foreground"
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
                <p
                  className={`mt-1 text-right text-[10px] ${
                    mine ? "text-white/70" : "text-muted"
                  }`}
                >
                  {message.sentAt}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-end gap-2 border-t border-border bg-white px-3 py-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Escribí un mensaje..."
          aria-label="Mensaje"
          className="max-h-28 min-h-9 flex-1 resize-none rounded-xl border border-border bg-surface/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          aria-label="Enviar mensaje"
          className="flex h-9 shrink-0 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};
