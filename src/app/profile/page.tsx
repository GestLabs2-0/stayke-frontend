"use client";

import { useState } from "react";
import {
  Wallet,
  Mail,
  Phone,
  Loader2,
  UserRound,
  ChartColumn,
} from "lucide-react";
import Link from "next/link";
import DidItVerificationSection from "@/src/components/profile/DiditVerificationSection";
import { useUserContext } from "@/src/components/contexts/UserContext";
import { ProfileHeader } from "@/src/components/profile/ProfileHeader";
import { ProfileReputation } from "@/src/components/profile/ProfileReputation";
import { ProfileReviews } from "@/src/components/profile/ProfileReviews";

const mockProperties = [
  {
    id: "1",
    title: "Modern Apartment",
    location: "Medellín, Colombia",
    price: 120,
  },
  {
    id: "2",
    title: "Beach House",
    location: "Cartagena, Colombia",
    price: 300,
  },
];

const reviews = [
  {
    id: "1",
    author: "Carlos",
    rating: 5,
    comment: "Excelente host, todo perfecto.",
    date: "Apr 2026",
  },
  {
    id: "2",
    author: "Ana",
    rating: 4,
    comment: "Muy buena experiencia.",
    date: "Mar 2026",
  },
];

export interface MockReviews {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

// ─── Profile Page ──────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { backendUser: user } = useUserContext();

  const [loadingProps] = useState(false);

  if (!user) {
    // TODO: create mini interface to redirect user to finish all its profile
    // router.push(ROUTES.HOME);
    return <div></div>;
  }

  // TODO: implement reviews in backend and fetch them instead of using mock data

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 pt-24 pb-16 max-w-2xl">
        {/* ── Header ── */}

        <ProfileHeader user={user} />

        <ProfileReputation reviews={reviews} />
        <DidItVerificationSection />

        <div className="rounded-2xl border border-border bg-card p-5 mb-6">
          <h2 className="font-display text-sm font-bold mb-4">Personal Info</h2>

          <div className="flex flex-col gap-3">
            {[
              { icon: Mail, label: "Email", value: user.email },
              { icon: Phone, label: "Phone", value: user.phone },
              { icon: Wallet, label: "Wallet", value: user.wallet },
              {
                icon: UserRound,
                label: "User profile address",
                value: user.userProfileAddr,
              },
              {
                icon: ChartColumn,
                label: "Reputation profile address",
                value: user.reputationProfileAddr,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
              My Properties
            </h2>
            <Link
              href="/listPropertys"
              className="text-xs text-primary hover:underline"
            >
              Create new →
            </Link>
          </div>

          {loadingProps ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : mockProperties.length === 0 ? (
            <p className="text-sm text-muted-foreground italic text-center py-4">
              You haven&apos;t listed any properties yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {mockProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 hover:border-primary/30 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {prop.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {prop.location}
                    </p>
                  </div>
                  <span className="font-display text-sm font-bold text-gradient shrink-0">
                    ${prop.price}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings  */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
              Active Listing
            </h2>
            <Link
              href="/bookings"
              className="text-xs text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {[
              {
                title: "Oceanfront Villa",
                location: "Bali, Indonesia",
                dates: "Apr 10–17",
                price: 595,
              },
              {
                title: "Alpine Retreat",
                location: "Zermatt, Switzerland",
                dates: "May 3–6",
                price: 360,
              },
            ].map((b) => (
              <div
                key={b.title}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 hover:border-primary/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {b.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {b.location} · {b.dates}
                  </p>
                </div>
                <span className="font-display text-sm font-bold text-gradient shrink-0">
                  ${b.price}
                </span>
              </div>
            ))}
          </div>
        </div>
        <ProfileReviews reviews={reviews} />
      </div>
    </div>
  );
}
