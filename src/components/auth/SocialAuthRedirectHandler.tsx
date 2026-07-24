"use client";

import { clearSocialRedirectParams } from "@dynamic-labs-sdk/client";
import {
  useCompleteSocialRedirect,
  useDetectSocialRedirectUrl,
} from "@dynamic-labs-sdk/react-hooks";
import { useEffect, useState } from "react";

export default function SocialAuthRedirectHandler() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const url = mounted
    ? new URL(window.location.href)
    : new URL("http://localhost:3000");

  const { data: isReturningFromProvider, isLoading } =
    useDetectSocialRedirectUrl({ url });

  const { mutate: completeRedirect, isPending: isCompleting } =
    useCompleteSocialRedirect();

  useEffect(() => {
    if (isReturningFromProvider && !isLoading && !isCompleting) {
      completeRedirect(
        { url: new URL(window.location.href) },
        {
          onSettled: () => {
            clearSocialRedirectParams();
          },
        },
      );
    }
  }, [isReturningFromProvider, isLoading, isCompleting, completeRedirect]);

  return null;
}
