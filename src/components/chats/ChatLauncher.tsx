"use client";

import { useEffect } from "react";

import { useChat } from "@/context/ChatContext";
import { useWalletContext } from "@/hooks/useWallet";
import { MessageIcon, XIcon } from "@/icons";
import { ChatDetail } from "./ChatDetail";
import { ChatList } from "./ChatList";

export const ChatLauncher = () => {
  const { isAuthenticated } = useWalletContext();
  const {
    isOpen,
    selected,
    conversations,
    loading,
    error,
    openChat,
    selectConversation,
    sendMessage,
    closeChat,
  } = useChat();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeChat]);

  if (!isAuthenticated) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      {isOpen && (
        <section
          aria-label="Chats"
          className="flex h-130 w-[calc(100vw-2rem)] max-w-95 flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-lg sm:h-135"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-montserrat text-base font-semibold text-neutral-text">
              Chats
            </h3>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Cerrar chats"
              className="flex size-8 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface hover:text-primary"
            >
              <XIcon className="size-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1">
            {selected ? (
              <ChatDetail
                conversation={selected}
                onBack={() => selectConversation(null)}
                onSend={sendMessage}
              />
            ) : loading ? (
              <div
                aria-live="polite"
                className="flex h-full items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className="size-6 animate-spin rounded-full border-2 border-surface border-t-primary"
                />
                <span className="sr-only">Cargando chats…</span>
              </div>
            ) : error ? (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-secondary">
                {error}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-secondary">
                Sin conversaciones
              </div>
            ) : (
              <ChatList
                conversations={conversations}
                onSelect={selectConversation}
              />
            )}
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => (isOpen ? closeChat() : openChat())}
        aria-label={isOpen ? "Cerrar chats" : "Abrir chats"}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:bg-primary-hover hover:shadow-xl"
      >
        {isOpen ? (
          <XIcon className="size-5" />
        ) : (
          <span className="[&_svg]:size-6">
            <MessageIcon />
          </span>
        )}
      </button>
    </div>
  );
};
