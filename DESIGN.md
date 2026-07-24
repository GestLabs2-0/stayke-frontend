---
name: Stayke
description: A decentralized short-term rental platform built on Solana
colors:
  primary: "#3b007f"
  primary-hover: "#5307ad"
  purple-deep: "#3b027d"
  secondary: "#434654"
  muted: "#a0a5b5"
  border: "#c3c6d6"
  surface: "#ebe7e7"
  neutral-bg: "#ffffff"
  neutral-text: "#171717"
typography:
  display:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "0.01em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "26px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  input-email:
    backgroundColor: "#EFF3F6"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  card-property:
    backgroundColor: "{colors.neutral-bg}"
    rounded: "{rounded.lg}"
  card-testimonial:
    backgroundColor: "{colors.purple-deep}"
    rounded: "{rounded.lg}"
    textColor: "{colors.neutral-bg}"
  navbar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
---

# Design System: Stayke

## 1. Overview

**Creative North Star: "Tu reputación siempre será tuya"**

Stayke's visual system bridges two worlds that rarely meet: the warmth of LATAM hospitality and the cold mathematical guarantees of Solana. The interface never leads with the blockchain — it leads with the feeling of a booking that's safe, a host who's verified, and a reputation that follows you everywhere.

The system is **restrained by default** — purple is the single accent, used sparingly on navigation, primary actions, and trust markers. White space, clear typography, and calm confidence carry the rest. The interface feels like a travel platform built by people who understand both the destination and the technology beneath it.

This system explicitly rejects: crypto-dapp aesthetics (dark mode gradients, glassmorphism, gas meters, wallet-first UI), the SaaS hero-metric template, and Airbnb visual cloning. It is its own thing — warm, trustworthy, ahead of its time.

**Key Characteristics:**
- One family typography system (Montserrat for display, Geist for utility)
- Purple as a trust signal, not decoration
- Shadows used deliberately for hierarchy, not ambient depth
- Mobile-first breakpoints across every component
- Warm neutrals with a slight violet undertone in surfaces

## 2. Colors: The Trust Palette

The palette is restrained by design: one saturated purple accent does the work of brand recognition, trust signaling, and wayfinding, while warm neutrals keep the interface calm and approachable.

### Primary
- **Deep Violet** (`#3b007f`): The brand anchor. Used for navbar, primary buttons, link text, active indicators, rating badges, and trust markers. Not decorative — every purple element carries a functional meaning.
- **Deep Violet Hover** (`#5307ad`): The hover state for all purple-backed interactive elements. Noticeably lighter but still grounded.
- **Purple Deep** (`#3b027d`): Nearly identical to primary in hex but used as a surface fill for testimonial cards and trust-heavy containers. Slightly warmer than straight primary.

### Neutral
- **Pure White** (`#ffffff`): Page background, card backgrounds, form containers. The dominant surface color.
- **Near Black** (`#171717`): Primary body text. High contrast against white.
- **Slate Ink** (`#434654`): Secondary text, filter labels, navigation subtler elements. The second voice.
- **Mist Gray** (`#a0a5b5`): Muted/deactivated text, placeholder copy. At the edge of readability — use sparingly.
- **Silver Violet** (`#c3c6d6`): Borders, dividers, horizontal rules. A slightly cool gray that picks up the violet brand.
- **Warm Stone** (`#ebe7e7`): Surface fills, card alt backgrounds, banner container fills. The warmest neutral — a faint violet warmth.
- **Off White** (`#f7f7f7`): Footer background, secondary surface. Clean but distinct from page white.

### Named Rules
**The One Voice Rule.** Deep Violet appears on ≤15% of any given screen. Its rarity is the point — when a user sees purple, they know it means something: actionable, verified, branded. Purple is never decorative.

**The Trust Signal Rule.** Every use of purple must carry a functional meaning: navigation indicates location, buttons indicate primary action, badges indicate verification. If a purple element doesn't communicate something, it doesn't belong.

## 3. Typography

**Display Font:** Montserrat (with sans-serif fallback)
**Body Font:** Geist (with sans-serif fallback)
**Label/Mono Font:** Plus Jakarta Sans (with sans-serif fallback) / Geist Mono (code only)

**Character:** The pairing is a quiet assertion of confidence. Montserrat carries the voice — geometric, authoritative, and slightly European. Geist handles everything else with clean utility. Plus Jakarta Sans steps in for labels, buttons, and data-dense contexts where a tighter, more modern sans is needed. The three families share a similar x-height and upright posture, so the mixing feels intentional rather than chaotic.

### Hierarchy
- **Display** (700, `clamp(1.875rem, 4vw, 3rem) / 1.2`): Hero headlines. The only fluid scale point. Reserved for the top statement on the page. `text-wrap: balance`.
- **Headline** (700, `clamp(1.75rem, 3vw, 2.5rem) / 1.2`): Section titles. Montserrat bold, always. Not fluid beyond hero — product headings don't shrink per viewport. `text-wrap: balance`.
- **Title** (600, `1.25rem / 1.3`): Card titles, property names, subheadings. Smaller but still commanding.
- **Body** (400, `1rem / 1.6`): All running text, descriptions, testimonials, FAQ answers. Capped at 65–75ch on prose blocks. Geist for maximum readability at small sizes.
- **Label** (600, `0.875rem`, `0.01em` letter-spacing): Buttons, inputs, filter categories, navigation items, data labels. Plus Jakarta Sans for its compact, confident posture.

### Named Rules
**The One Family Rule.** Montserrat is the voice, Geist is the utility. If a heading isn't important enough for Montserrat, it's not a heading. Titles can be Geist semibold. Only display and headline levels use Montserrat.

**The Tight Scale Rule.** The step between levels is approximately 1.25—no exaggerated contrast between body and display. Product UIs don't need dramatic typographic jumps.

## 4. Elevation

The system uses a **layered** elevation model — shadows are intentional hierarchy signals, not ambient depth. A surface earns a shadow when it needs to separate from the content beneath it: the fixed navbar, the interactive search bar, a floating modal, a dropdown menu. Resting surfaces (cards, sections) are flat.

### Shadow Vocabulary
- **Search Lift** (`0 10px 15px -3px rgba(0,0,0,0.1)` equivalent via `shadow-lg`): The interactive search bar at the hero. The most prominent shadow on the page because it's the primary action surface.
- **Card Float** (`0 4px 4px 0 rgba(0,0,0,0.12)`): Authentication cards, wallet selection modals. Enough lift to feel interactive.
- **Button Hover** (`0 4px 6px -1px rgba(0,0,0,0.1)`): Subtle elevation on hover for clickable elements. A 2px translateY accompanies the shadow.
- **Dropdown** (`0 10px 15px -3px rgba(0,0,0,0.1)`): Desktop dropdown menus. The highest practical shadow before modal territory.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as response to interaction (hover, focus, open) or to separate the navigation/search layer from content. A card does not have a shadow at rest.

## 5. Components

### Buttons
- **Shape:** Generously rounded — primary buttons use `rounded-full` (9999px), secondary and tertiary use `rounded-lg` (12px). Full-round communicates approachability; no sharp corners on actions.
- **Primary:** Deep Violet (`#3b007f`) background, white text, Plus Jakarta Sans 600 at 14px, full rounded, 12px 24px padding. Hover: Deep Violet Hover (`#5307ad`). Transition: background 200ms ease.
- **Secondary:** Outlined — 1px Silver Violet (`#c3c6d6`) border, transparent background, Slate Ink (`#434654`) text. Hover: light background fill.
- **Ghost:** No border, Deep Violet text, transparent background. Hover: subtle background tint.
- **Heart/Favorite:** Icon-only, transparent white background at 90% opacity, full rounded. Active state: filled red heart.

### Inputs / Fields
- **Style:** Rounded (`8px`), Light Silver Violet border, white background. The email input in the register flow uses a distinctive `#EFF3F6` warm-gray fill with no border, creating a softer entry point.
- **Focus:** A slight glow or border color shift to Deep Violet. Transitions on focus are fast (150ms) — the user is in flow.
- **Error:** Red border (at MVP, a standard error treatment). Placeholder text in Mist Gray (`#a0a5b5`).
- **Search Bar:** A special composite — multiple fields joined in a single `rounded-full` container with dividing borders, white background, `shadow-lg` elevation. The search bar is the most visually prominent interactive element on the landing page.

### Cards / Containers
- **Corner Style:** `rounded-2xl` (16px) is the default radius for all card-like containers. Softer than industry standard (8px) — this is an intentional warmth signal.
- **Background:** White for property cards and content cards. Purple Deep (`#3b027d`) for testimonial cards.
- **Shadow Strategy:** None at rest (see Flat-By-Default Rule). Interactive cards earn a hover shadow.
- **Border:** None on cards. Silver Violet borders appear only on structural dividers (filter bar bottom border, footer separator).
- **Internal Padding:** 16px (md) as baseline. Adjust per density need.

### Navigation
- **Style:** Fixed top, full-width, Deep Violet background. White navigation text at 14px Montserrat semibold.
- **Desktop:** Logo left, links center, actions right (host CTA, globe icon, user menu). Links are white, `hover:opacity-80`. The user menu button has a white pill border with a purple menu icon.
- **Mobile:** Centered logo, user and menu icon on sides. A dropdown panel slides down for navigation links.
- **Active State:** Current page link uses the same white color — no underline or highlight. The purple background itself signals "you're in Stayke."

### Footer
- `#F7F7F7` background, clean divider line in Silver Violet. Logo in Deep Violet. Links in gray, hover to Near Black. Three-column layout for link groups, legal bar at bottom.

### Accordion (FAQ)
- Rows with a question label, a chevron icon, and an expandable answer panel. The open/close transition is 200ms ease-out. No borders between items unless visually separated.

### Chips (Filter Bar)
- **Style:** Horizontal scrollable row of category buttons. Each chip has an icon + label, transparent background when unselected, outlined by Silver Violet border only on the filter button itself (not the chips).
- **State:** Active state highlighted by a bottom border on the parent container.

### Property Card
- Two variants: a vertical card (Escapadas Cerca) with a large image (`aspect-ratio: 737/398`, `rounded-2xl`) and a smaller horizontal card (Popular Stays slider) with `aspect-4/3` images and `rounded-xl` (12px). Both follow the same info layout: title, location, price.

## 6. Do's and Don'ts

### Do:
- **Do** use Deep Violet (`#3b007f`) as a trust and navigation signal — navbar, primary buttons, rating badges, verified markers.
- **Do** lead with white space and typography. The brand voice is confident and calm, not busy.
- **Do** keep the search bar elevated — it's the primary action surface on the landing page.
- **Do** use Montserrat bold for display/headline text and Geist for body. The pairing is intentional.
- **Do** apply `rounded-2xl` to card surfaces — the generous radius is a warmth signal.
- **Do** design mobile-first. Every component must work on a phone before being adapted to desktop.
- **Do** use shadows for hierarchy: the search bar floats, cards do not.
- **Do** make the blockchain invisible. A non-crypto user should never see "wallet," "transaction," or "Solana" in the primary flow.

### Don't:
- **Don't** use gradient text (`background-clip: text` with gradient). Use a single solid color.
- **Don't** use glassmorphism as decoration. Blurs and glass cards are rare and purposeful or absent.
- **Don't** use the hero-metric template (big number, small label, gradient accent).
- **Don't** put tiny uppercase tracked eyebrows above every section — tell, don't scaffold.
- **Don't** use side-stripe borders (`border-left`/`border-right` > 1px as colored accent on cards).
- **Don't** use display fonts (Montserrat) in UI labels, buttons, or data.
- **Don't** decorate with purple — every purple element carries a functional meaning.
- **Don't** show crypto, wallet connections, or blockchain terminology on the landing page or primary flow.
- **Don't** clone Airbnb's visual identity. Stayke is warmer, more human, LATAM-rooted.
- **Don't** use identical card grids with icon + heading + text repeated endlessly.
- **Don't** reinvent standard affordances. Custom scrollbars, weird form controls, non-standard modals are forbidden.
