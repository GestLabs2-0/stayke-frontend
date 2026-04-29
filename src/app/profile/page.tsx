"use client";

import { useState } from "react";
import {
  User,
  Star,
  Wallet,
  CalendarCheck,
  LogOut,
  Mail,
  Shield,
  Phone,
  MessageSquare,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { ReviewCard } from "@/src/components/Reviews";
import { usePrivy } from "@privy-io/react-auth";
import DidItVerificationSection from "@/src/components/profile/DiditVerificationSection";
import { useUserContext } from "@/src/components/contexts/UserContext";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constant";

const mockUser = {
  firstName: "Jose",
  lastName: "Dev",
  email: "jose@email.com",
  phone: "+57 300 123 4567",
  wallet: "9xQeWvG816bUx9EPjH...",
  image: "",
  isHost: true,
  reputation: 4.7,
  pdaKey: "MockPDA123456789",
  reviews: [
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
  ],
};

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

// ─── Profile Page ──────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { backendUser: user } = useUserContext();
  const router = useRouter();

  const { logout } = usePrivy();

  const [loadingProps] = useState(false);

  if (!user) {
    router.push(ROUTES.REGISTER);
  }

  // TODO: implement reviews in backend and fetch them instead of using mock data

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
  const avgRating = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : 4.7;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 pt-24 pb-16 max-w-2xl">
        {/* ── Header ── */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6">
          <div className="relative h-24 gradient-solana opacity-60" />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              {/* Avatar */}
              <div className="h-20 w-20 z-10 rounded-full border-4 border-card gradient-solana flex items-center justify-center shadow-glow">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.firstName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-9 w-9 text-primary-foreground" />
                )}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => logout()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Disconnect
                </button>
              </div>
            </div>

            <h1 className="font-display text-2xl font-bold text-foreground">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">
              {user.wallet}
            </p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-border bg-card px-4 py-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="h-3.5 w-3.5 text-primary fill-primary" />
              <p className="text-xs text-muted-foreground uppercase">
                Reputation
              </p>
            </div>
            <span className="font-display text-xl font-bold text-gradient">
              {avgRating.toFixed(1)}
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-4">
            <CalendarCheck className="h-4 w-4 mb-2" />
            <span className="font-display text-xl font-bold text-gradient">
              2
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-4">
            <Wallet className="h-4 w-4 mb-2" />
            <span className="font-display text-xl font-bold text-gradient">
              3.24 SOL
            </span>
          </div>
        </div>

        <DidItVerificationSection />

        <div className="rounded-2xl border border-border bg-card p-5 mb-6">
          <h2 className="font-display text-sm font-bold mb-4">Personal Info</h2>

          <div className="flex flex-col gap-3">
            {[
              { icon: Mail, label: "Email", value: user.email },
              { icon: Phone, label: "Phone", value: user.phone },
              { icon: Wallet, label: "Wallet", value: user.wallet },
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

        {/* ── Reviews ── */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
              Reviews
            </h2>
            <span className="ml-auto text-xs text-muted-foreground">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
