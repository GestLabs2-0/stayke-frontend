# Stayke

## Register

product

## Platform

web

## Users

**Primary audience** — Travelers in LATAM looking to book short-term rentals. They are non-crypto users who value safety, trust, and a smooth booking experience. Many come from markets underserved by global platforms due to banking friction — Stayke bypasses that with Solana-based payments without the user ever touching crypto.

**Secondary audience** — Hosts who list properties on Stayke. They want reliable guests, guaranteed payments, and a platform where their reputation is portable. They are equally non-crypto; the blockchain is invisible to them.

**Host/guest split** — The same user may be both over time. The design treats booking and hosting as two modes of the same account, not separate identities.

## Product Purpose

Stayke is a decentralized short-term rental platform built on Solana. It solves the trust problem at the heart of every hosting marketplace using blockchain primitives — escrow, on-chain reputation, and user-owned identity.

The core argument: reputation, identity, and financial guarantees belong to the user, not to the platform. If Stayke shuts down tomorrow, the user's history exists on-chain and any other platform can read it.

Success looks like: a traveler books a stay in Medellín with the same ease as Airbnb, without knowing or caring that their payment cleared through a Solana escrow contract, and walks away with an on-chain reputation they own.

## Positioning

*Your reputation belongs to you, not the platform.* Stayke is a decentralized rental marketplace where identity, trust, and guarantees live on-chain — even if you never see the blockchain.

## Brand Personality

**Three words:** trustworthy, warm, ahead-of-its-time.

The brand carries the confidence of a system built on mathematical guarantees, not corporate promises. But it never leads with that — it leads with the warmth of discovering a great place to stay. The technology is infrastructure, not marketing. The feeling should be: "this is how booking should always have worked."

**Emotional goal:** calm confidence. The user should feel that their booking is safe, their money is protected, and their reputation follows them — without ever worrying about how.

## Anti-references

Stayke must explicitly NOT look like:

- A typical crypto dapp — no wallet-first UI, no gas meters, no "connect wallet" buttons on the landing page, no intimidating blockchain terminology on the surface. The word "blockchain" should not appear in the primary user flow.
- A generic Web3 dashboard with gradient backgrounds, glassmorphism cards, and dark-mode-by-default.
- A clone of Airbnb. We share a category but not a visual identity — Stayke is warmer, more human, LATAM-rooted.
- The "hero-metric" SaaS template (big number, small label, gradient accent).

The crypto onboarding should follow the Nivel 0 → 1 → 2 progression from the product spec: the user never sees a wallet or signs a transaction until they're ready.

## Design Principles

1. **Trust through transparency** — The interface should make blockchain guarantees feel tangible without explaining the blockchain. An escrow badge, a reputation score, a "verified" marker — these carry meaning the user can feel.

2. **Gradual onboarding** — Never show crypto until the user is ready. Nivel 0: register with email, everything works. Nivel 1: "your reputation lives on Solana, it's yours forever." Nivel 2: export your key, connect your own wallet. The UI grows with the user.

3. **User sovereignty as a visual cue** — The profile page is the most important page. It should feel like *their* space, not the platform's. Reputation, history, deposit balance — these are displayed as assets the user owns, not stats the platform tracks.

4. **Mobile-first for LATAM** — LATAM users disproportionately access the web through mobile devices. Every flow — search, book, pay, review — must be fully functional and delightful on a phone before it's adapted to desktop.

5. **Calm technology** — The complex machinery (Solana, escrow, dispute resolution, lending pools) should be invisible. The interface is calm, warm, and straightforward. Complexity is surfaced only when the user needs it — a dispute, a withdrawal, a yield option.

## Accessibility & Inclusion

- WCAG 2.1 AA target. Body text contrast ≥ 4.5:1.
- Neutral Spanish-language first (UI, copy, error messages). English as secondary.
- Designed for users with varying levels of technical literacy — from first-time internet users in LATAM to crypto-native travelers.
- Reduced motion support on all animations.
- Color is not the sole carrier of meaning (reputation changes, booking states, dispute status).
