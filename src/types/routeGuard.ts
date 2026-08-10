import type { ReactNode } from "react";

/**
 * Access policy for a guarded route.
 * - "protected": only fully registered users may stay; unauthenticated users
 *   go to Home and logged-in-but-unregistered users go to Register.
 * - "guest-only": only non-registered users may stay; fully registered users
 *   go to Profile.
 */
export type RouteGuardMode = "protected" | "guest-only";

export type RouteGuardProps = {
  mode: RouteGuardMode;
  children: ReactNode;
};
