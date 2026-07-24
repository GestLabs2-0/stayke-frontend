"use client";

import SocialAuthRedirectHandler from "./SocialAuthRedirectHandler";

export default function AuthClientLayer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SocialAuthRedirectHandler />
      {children}
    </>
  );
}
