---
target: profile page
total_score: 14
p0_count: 0
p1_count: 2
p2_count: 3
p3_count: 1
timestamp: 2026-07-25T04-49-24Z
slug: src-app-profile-page-tsx
---
# Impeccable Critique: Profile Page

**Method: dual-agent (A: explore · B: detector CLI)**

---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | Zero loading/transition states. No feedback on mode switch. Settings nav is a dead end. |
| 2 | Match System / Real World | 2 | "Hostings" is an anglicism. "Tesorería" is opaque for non-crypto users. GuestView empty state uses host perspective. |
| 3 | User Control and Freedom | 1 | No browser back/forward. Settings is dead. Logout has no confirmation. No undo for mode switch. |
| 4 | Consistency and Standards | 2 | Broken heading hierarchy (h2→h3→h2→h2 on host, h4→h4 on guest). Page bg `#f4e6ea` not in design system. |
| 5 | Error Prevention | 1 | No logout confirmation. EmptyState CTA is a no-op (`onAction={() => {}}`). Accidental mode switch with no guard. |
| 6 | Recognition Rather Than Recall | 2 | Sidebar shows active item. Avatar visible in both sidebar and header. BUT Settings that doesn't exist undermines nav trust. |
| 7 | Flexibility and Efficiency of Use | 1 | No keyboard shortcuts, no search/filter, no bulk ops. Linear list for everything. Sidebar collapse is the only power feature. |
| 8 | Aesthetic and Minimalist Design | 3 | Purple restraint done right. Flat cards per rule. Clean vertical rhythm. BUT `bg-[#f4e6ea]` pink clashes with purple palette. TreasuryCard tracked uppercase eyebrow is borderline AI-slop. |
| 9 | Error Recovery | 1 | No error states exist. No retry, no offline indicators. Empty states describe happy path only. |
| 10 | Help and Documentation | 0 | Zero help — no help icon, FAQ, tour, tooltip, or docs link anywhere. |
| **Total** | | **14/40** | **Poor — major UX overhaul required** |

---

## Anti-Patterns Verdict

**LLM Assessment**: Mildly suspicious, not egregious. One clear violation of an absolute ban (TreasuryCard tracked uppercase "TESORERÍA" eyebrow). No gradient text, no glassmorphism, no side-stripe borders, no numbered markers, no hero-metric template. The overall structure is competent, restrained, and shows design system awareness. A human likely authored this with some AI guidance — the heading hierarchy inconsistency and dead Settings nav are the strongest "not fully reviewed by a senior designer" signals.

**Deterministic Scan**: 4 advisory findings — all `design-system-font-size`:
- `HostView.tsx:21` — 11px badge ("active.length/3") off the type ramp
- `HostView.tsx:96` — 10px status pill ("Publicada"/"Borrador") off the type ramp
- `GuestView.tsx:26` — 11px "Próximo" badge off the type ramp
- `VerifiedBadge.tsx:7` — 10px text off the type ramp

All advisory, no high-severity issues. The detector confirmed what the LLM review spotted: micro-type sizing that sits outside the documented type hierarchy.

**Browser visualization**: No browser automation available — CLI scan only. No user-visible overlay was created.

---

## Overall Impression

The profile page has a solid structural foundation — the card system, sidebar pattern, responsive behavior, and accessibility scaffolding are all in the right place. It respects the design system's flat-by-default and purple-restraint rules. But it's **structurally incomplete**: two nav items lead nowhere, the verification banner is orphaned, heading hierarchy is broken, and zero attention has been paid to error/loading/feedback states. It reads like a components-first assembly that never got the holistic UX pass. A determined senior designer could fix the top issues in a focused session.

---

## What's Working

1. **Consistent card system and flat discipline**: `card-white` / `card-surface` used consistently. No shadows anywhere. Purple genuinely restrained — only on CTAs, active nav, verified badge, and toggle. The design system's visual identity is respected.

2. **Solid responsive architecture**: Sidebar collapses gracefully (w-64 / w-16). Mobile overlay drawer with backdrop blur, aria-hidden, transitions. Hamburger button mobile-only (`md:hidden`). Production-ready responsive behavior.

3. **Accessibility foundations**: Mode switch uses `role="switch"` with `aria-checked`. Mobile drawer uses `aria-hidden`. Buttons have aria-labels. Sidebar nav is semantic `<nav>`. The building blocks are correct even if hierarchy is broken.

---

## Priority Issues

### [P1] Dead Settings and logout pathways
- **What**: Clicking "Configuración" changes `activeItem` to "settings" but renders nothing. Logout silently returns early.
- **Why**: Destroys user trust. The nav lies about available functionality.
- **Fix**: Render content for `activeItem === "settings"` or remove the entry. Add logout confirmation dialog.
- **Suggested command**: `/impeccable harden profile`

### [P1] Broken heading hierarchy (WCAG 1.3.1)
- **What**: `SectionCard` defaults to `h2`. `HostView` forces `h3` for hostings but leaves properties at default `h2`. `GuestView` uses `h4` for everything.
- **Why**: WCAG failure. Screen reader users lose navigation context.
- **Fix**: Establish a single heading level strategy. Normalize all `SectionCard` uses.
- **Suggested command**: `/impeccable polish profile`

### [P2] Dead EmptyState CTA
- **What**: `onAction={() => {}}` — "Publicar propiedad" does nothing on click.
- **Why**: Primary action suggested by empty state is non-functional. Hard UX failure.
- **Fix**: Wire to actual navigation (`router.push("/properties/new")`) or don't render the button.
- **Suggested command**: `/impeccable harden profile`

### [P2] GuestView empty state uses host perspective
- **What**: "Cuando un huésped reserve, aparecerá acá." — written as if the user is a host, but they're in guest mode.
- **Why**: Breaks mental model of the mode switch. Confusing copy.
- **Fix**: Change to "Cuando reserves una propiedad, aparecerá acá."
- **Suggested command**: `/impeccable clarify profile`

### [P2] Invisible TreasuryCard context
- **What**: $1,250.00 with no explanation. "Tesorería" is formal and opaque for non-crypto users.
- **Why**: For non-crypto LATAM travelers, on-chain balances create anxiety, not confidence.
- **Fix**: Add subtitle ("Saldo disponible para reservas"). Consider renaming to "Tu saldo" for guests.
- **Suggested command**: `/impeccable clarify profile`

### [P3] VerificationBanner never rendered
- **What**: Component exists but is never imported or used in the profile page.
- **Why**: Verification is the highest trust moment on a decentralized platform. Not showing it is a missed trust-building opportunity.
- **Fix**: Render conditionally when `!profile.isVerified` below ProfileHeader.
- **Suggested command**: `/impeccable polish profile`

---

## Persona Red Flags

### Alex (Power User)
- **No efficiency features**: No search, filter, sort, or bulk operations. A host with 20+ properties must scroll a flat list. Sidebar collapse is the only power affordance.
- **No dashboard summary**: No totals for earnings, bookings, or occupancy rate. Alex wants at-a-glance, not a scroll-through.
- **Mode switch loses context**: Switch host ↔ guest and scroll position resets. No split view.

### Jordan (First-Timer)
- **"Tesorería" is intimidating**: No tooltip or explanation for the balance. Jordan doesn't know what a "treasury" is.
- **Settings goes nowhere**: Jordan clicks "Configuración", sees same content. Thinks the site is broken.
- **Empty states are passive**: "No tenés hostings activos" states absence but doesn't guide action. And the suggested action button does nothing.
- **Verification never shown**: Jordan can't complete verification because the banner never renders.

### Sam (Accessibility-Dependent)
- **WCAG failure on heading hierarchy**: Direct violation of 1.3.1.
- **No `prefers-reduced-motion`**: Sidebar `duration-300` and mobile drawer `transition-transform duration-300` have no reduced-motion fallback.
- **Color-only indicators**: Active mode in SidebarModeFooter communicated through background color only (`bg-[#3b007f]/10` vs `bg-white`).
- **Focus indicators browser-default**: No custom `focus-visible` styles beyond the toggle switch.

---

## Minor Observations

- Page background `bg-[#f4e6ea]` is not in the design system token set — use `bg-surface` or add token.
- `next/image` uses `unoptimized` everywhere — no WebP, lazy loading, or responsive sizes. Production fix needed.
- SidebarModeFooter mode indicator dot + label directly below ModeSwitch that already shows the info — visual redundancy.
- TreasuryCard shows identically in host and guest modes — strictly-guest users seeing "Tesorería" may be confusing.
- Conditional rendering inconsistency: "Hostings anteriores" section hides when empty, but "Propiedades" always renders even empty.
- Date strings like "15 jun" hardcoded — use `Intl.DateTimeFormat` with `es-CO` in production.
- Font sizes at 10px and 11px outside the DESIGN.md type ramp in 4 locations (confirmed by detector).

---

## Questions to Consider

1. **Should the profile page use URL-based routing instead of state-only?** Without browser history integration, back/forward navigation is lost. If this dashboard grows (settings, notifications, payment history), URL routes prevent dead-end patterns.

2. **Is "Tesorería" the right label for non-crypto users?** The brand promises "blockchain is invisible." "Tu saldo" or "Disponible" would be warmer. If "Tesorería" must stay for legal reasons, it needs a tooltip or subtitle.

3. **Where should the verification banner live?** `VerificationBanner` exists but is orphaned. Should it appear between ProfileHeader and TreasuryCard, or conditionally replace the VerifiedBadge for unverified users?

4. **Does every section need to be visible at all times?** Progressive disclosure is a failure point. Consider collapsing past items under "Ver anteriores (N)" buttons, or moving TreasuryCard lower in visual hierarchy.

5. **Should empty states use different emotional tones for host vs. guest?** Guest: aspirational ("Empezá a explorar propiedades"). Host: actionable ("Publicá tu primer alojamiento"). Currently both use the same passive Inbox icon and tone.
