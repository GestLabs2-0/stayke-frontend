"use client";

import { useUser } from "@dynamic-labs-sdk/react-hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { routes } from "@/constants/routes";
import { useWalletContext } from "@/hooks/useWallet";
import type { RouteGuardProps } from "@/types/routeGuard";

/**
 * Redirects users based on their auth and registration state:
 * - mode "protected": requires a fully registered user. Unauthenticated users
 *   are sent to Home and logged-in-but-unregistered users to Register.
 * - mode "guest-only": only reachable by non-registered users; fully
 *   registered users are sent to Profile.
 *
 * Renders `null` while the auth/backend state is still resolving so it never
 * flashes protected content or a registration form at the wrong user.
 */
export function RouteGuard({ mode, children }: RouteGuardProps) {
  const { isPending, isFetched } = useUser();
  const { isAuthenticated, userBackend, isLoadingUser } = useWalletContext();
  const router = useRouter();

  const authResolved = !isPending && isFetched;
  const determined = authResolved && !isLoadingUser;

  const shouldRedirect =
    determined &&
    (mode === "protected"
      ? !isAuthenticated || !userBackend
      : isAuthenticated && userBackend);

  const target =
    mode === "protected"
      ? isAuthenticated
        ? routes.Register
        : routes.Home
      : routes.Profile.index;

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(target);
    }
  }, [shouldRedirect, target, router]);

  if (!determined || shouldRedirect) return null;

  return children;
}
