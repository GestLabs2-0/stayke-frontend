"use client";

import { ChatLauncher } from "@/components/chats/ChatLauncher";
import { ChatProvider } from "@/context/ChatContext";
import SocialAuthRedirectHandler from "./SocialAuthRedirectHandler";

export default function AuthClientLayer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      <SocialAuthRedirectHandler />
      <ChatLauncher />
      {children}
    </ChatProvider>
  );
}
