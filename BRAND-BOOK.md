# Lynq Brand Book

> Design system and brand guidelines for the Lynq employer dashboard.

---

## Brand Identity

| | |
|---|---|
| **Name** | Lynq |
| **Product** | Employer Dashboard |
| **Tagline** | Manage jobs, candidates, campaigns, and analytics — all in one place. |
| **URL** | app.lynq.jobs |
| **Email** | hello@lynq.jobs |
| **Location** | Las Vegas, NV |
| **Founded** | 2026 |

---

## Logo

The Lynq logo is a **lightning bolt icon** inside a rounded square, paired with the **"Lynq" wordmark**. The letter "q" carries a subtle underline in the brand accent color.

### Icon

- **Shape:** Lightning bolt (`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2">`)
- **Style:** Stroke-based, `stroke-width: 2.5`, `stroke-linecap: round`, `stroke-linejoin: round`
- **Background:** Lynq accent color, rounded square (`border-radius: 10px`)
- **Icon color:** White (`#ffffff`) on accent background

### Icon Sizes

| Context | Size | Border Radius |
|---------|------|---------------|
| Sidebar header | 36×36px | 10px |
| Favicon / small | 20×20px | 6px |
| Footer / compact | 28×28px | 8px |

### Wordmark

- **Font:** Inter, 700 weight
- **"q" underline:** 2px height, accent color, 2px below baseline
- **Light mode:** Dark text (`#0f172a`) with cyan underline
- **Dark mode:** Light text (`#f9fafb`) with cyan underline

### Clear Space

Maintain minimum clear space equal to the icon height on all sides of the full logo mark.

### Usage Rules

- Never stretch or distort the icon
- Never change the lightning bolt color (always white on accent)
- Never place on busy backgrounds without sufficient contrast
- Always use the rounded square background — never the bolt alone

---

## Color System

All colors are defined as CSS custom properties in `src/app/globals.css` and mapped to Tailwind utilities in `tailwind.config.ts`.

### Lynq Accent (Brand Color)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--lynq-accent` | `rgb(0, 229, 255)` | `rgb(45, 212, 255)` | CTAs, active states, brand highlights |
| `--lynq-accent-foreground` | `#0f172a` | `#0b1220` | Text on accent backgrounds |
| `--lynq-accent-hover` | `#00cce5` | `#1ac0e8` | Hover state for accent elements |
| `--lynq-accent-muted` | `rgba(0, 229, 255, 0.1)` | `rgba(45, 212, 255, 0.1)` | Subtle accent backgrounds |

> Use `bg-lynq-accent`, `text-lynq-accent`, `bg-lynq-accent-muted` in Tailwind. The accent brightens slightly in dark mode for legibility.

### Core Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | `#f8fafc` | `#111827` | Page background |
| `--foreground` | `#0f172a` | `#f9fafb` | Primary text |
| `--card` | `#ffffff` | `#1f2937` | Card surfaces |
| `--card-foreground` | `#0f172a` | `#f9fafb` | Text on cards |
| `--primary` | `#0f172a` | `#f9fafb` | Primary buttons, headings |
| `--primary-foreground` | `#ffffff` | `#111827` | Text on primary |
| `--secondary` | `#f1f5f9` | `#1f2937` | Secondary surfaces |
| `--secondary-foreground` | `#0f172a` | `#f9fafb` | Text on secondary |
| `--muted` | `#f1f5f9` | `#1f2937` | Muted backgrounds |
| `--muted-foreground` | `#64748b` | `#94a3b8` | Secondary text, placeholders |

### Frame (Sidebar & Navigation Chrome)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--frame` | `#ffffff` | `#0b1220` | Sidebar/nav background |
| `--frame-foreground` | `#0f172a` | `#f9fafb` | Sidebar text |
| `--frame-muted` | `#64748b` | `#94a3b8` | Inactive nav items |
| `--frame-border` | `#e2e8f0` | `#1e293b` | Sidebar borders |
| `--frame-hover` | `rgba(15, 23, 42, 0.04)` | `rgba(255, 255, 255, 0.06)` | Nav item hover |
| `--frame-active` | `rgba(15, 23, 42, 0.06)` | `rgba(255, 255, 255, 0.1)` | Nav item active |

### Borders & Inputs

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--border` | `#e2e8f0` | `#2d3748` | Default borders |
| `--input` | `#e2e8f0` | `#2d3748` | Input borders |
| `--input-background` | `#f8fafc` | `#1f2937` | Input fills |
| `--switch-background` | `#cbd5e1` | `#4a5568` | Toggle off state |
| `--ring` | `#00e5ff` | `#2dd4ff` | Focus rings |
| `--selected-row-bg` | `#f1f5f9` | `#1e293b` | Table row selection |

### Status Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--success` | `#14b8a6` | `#2dd4bf` | Success states, positive metrics |
| `--warning` | `#f59e0b` | `#fbbf24` | Warnings, caution states |
| `--danger` | `#ef4444` | `#f87171` | Errors, destructive actions |
| `--info` | `#3b82f6` | `#60a5fa` | Informational highlights |
| `--destructive` | `#ef4444` | `#f87171` | Destructive button backgrounds |
| `--destructive-foreground` | `#ffffff` | `#450a0a` | Text on destructive |

### Chart / Data Visualization

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--chart-1` | `#3b82f6` | `#60a5fa` | Blue — primary data |
| `--chart-2` | `#14b8a6` | `#2dd4bf` | Teal — secondary data |
| `--chart-3` | `#f59e0b` | `#fbbf24` | Amber — tertiary data |
| `--chart-4` | `#8b5cf6` | `#a78bfa` | Purple — quaternary data |
| `--chart-5` | `#ef4444` | `#f87171` | Red — quinary data |

### Color Usage Rules

- **Always use semantic tokens** (`bg-primary`, `text-muted-foreground`, `bg-card`) — never raw Tailwind colors like `bg-blue-500`
- Use `lynq-accent` for CTAs and brand highlights, `lynq-accent-muted` for subtle backgrounds
- Use `frame-*` tokens for sidebar and navigation chrome
- Use status tokens (`success`, `warning`, `danger`, `info`) instead of raw color values
- Never use `dark:` overrides manually — the CSS variables handle dark mode automatically
- All color definitions live in `src/app/globals.css` — edit there, never create new CSS files

---

## Typography

### Font

**Inter** — loaded via `next/font/google` with the CSS variable `--font-inter`.

```tsx
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
```

Applied to `<body>` as `font-sans antialiased`.

### Type Scale

| Level | Tailwind Classes | Rendered |
|-------|-----------------|----------|
| **H1** | `text-2xl font-semibold tracking-tight` | 24px, 600 weight, tight tracking |
| **H2** | `text-xl font-semibold` | 20px, 600 weight |
| **H3** | `text-lg font-semibold` | 18px, 600 weight |
| **Body** | Default (14px base) | 14px, 400 weight |
| **Small / Caption** | `text-xs` or `text-sm` | 12px or 14px |
| **Button** | `text-sm font-medium` | 14px, 500 weight |
| **Badge** | `text-xs font-medium` | 12px, 500 weight |

### Typography Rules

- Use the Inter font exclusively — no secondary fonts in the product
- Headings use `font-semibold` (600), not bold (700)
- Body text uses default weight (400)
- Apply `tracking-tight` only to H1
- Use `text-muted-foreground` for secondary/descriptive text
- Use `text-foreground` for primary text — never hardcode colors

---

## Spacing & Layout

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-lg` | `0.625rem` (10px) | Cards, dialogs, large containers |
| `rounded-md` | `calc(0.625rem - 2px)` (8px) | Buttons, inputs, badges |
| `rounded-sm` | `calc(0.625rem - 4px)` (6px) | Small elements, tags |

> The base radius `--radius: 0.625rem` is intentionally softer than the default shadcn 0.5rem.

### Shadow

| Token | Light | Dark |
|-------|-------|------|
| `shadow-soft` | `0 1px 3px rgba(15,23,42,0.04), 0 6px 16px rgba(15,23,42,0.06)` | `0 4px 12px rgba(0,0,0,0.3)` |

Use `shadow-soft` for cards and elevated surfaces. Avoid stacking multiple shadow levels.

### Layout Patterns

- Use `gap-*` instead of `space-x-*` / `space-y-*`
- Use `size-*` when width equals height (e.g., icon containers)
- Dashboard uses a sidebar + main content layout via `DashboardLayout`
- Sidebar collapses on mobile to a hamburger menu

---

## Components

All UI primitives are **shadcn/ui** components living in `src/components/ui/`. Built on Radix UI + Tailwind + `class-variance-authority`.

### Available Primitives

`alert-dialog` · `avatar` · `badge` · `button` · `card` · `empty-state` · `input` · `label` · `motion` · `separator` · `skeleton` · `slider` · `switch` · `textarea`

### Button Variants

| Variant | Classes | Usage |
|---------|---------|-------|
| `default` | `bg-primary text-primary-foreground` | Primary actions |
| `secondary` | `bg-secondary text-secondary-foreground` | Secondary actions |
| `outline` | `border border-input bg-background` | Tertiary actions |
| `ghost` | Transparent, hover reveals background | Nav items, toolbar actions |
| `destructive` | `bg-destructive text-destructive-foreground` | Delete, remove actions |
| `link` | Underlined text | Inline links |

### Button Sizes

| Size | Classes | Usage |
|------|---------|-------|
| `default` | `h-10 px-4 py-2` | Standard buttons |
| `sm` | `h-9 px-3` | Compact / toolbar buttons |
| `lg` | `h-11 px-8` | Hero CTAs, prominent actions |
| `icon` | `h-10 w-10` | Icon-only buttons |

### Badge Variants

| Variant | Style | Usage |
|---------|-------|-------|
| `default` | Filled primary | Counts, primary labels |
| `secondary` | Filled secondary | Tags, categories |
| `destructive` | Filled destructive | Errors, alerts |
| `outline` | Border only | Subtle labels, metadata |

### Component Rules

- Before creating any UI component, check if shadcn/ui has it: `npx shadcn@latest search`
- Before using a component, fetch its docs: `npx shadcn@latest docs <component>`
- Use `cn()` from `@/lib/utils` for conditional class merging
- Never manually override `dark:` — semantic tokens handle it
- Icons use Lucide React exclusively, rendered at `size-4` inside buttons

---

## Iconography

### Icon Set

**Lucide React** — consistent stroke-based icons.

### Style

- Stroke width: 2px (default)
- Caps: Round
- Joins: Round
- Default size: `size-4` (16px) inside buttons, `size-5` (20px) standalone

### Dashboard Navigation Icons

| Icon | Page |
|------|------|
| `LayoutDashboard` | Overview |
| `FileText` | Jobs |
| `Users` | Candidates |
| `Rocket` | Sponsored Campaigns |
| `BarChart3` | Analytics |
| `TrendingUp` | Market Insights |
| `CreditCard` | Billing |
| `Settings` | Settings |
| `Zap` | Logo mark |

### Icon Rules

- Always use Lucide — never mix icon libraries
- Apply `[&_svg]:size-4 [&_svg]:shrink-0` in button containers (already in button base)
- Use `text-muted-foreground` for inactive icons, `text-foreground` for active
- Use `text-lynq-accent` for brand-highlighted icons

---

## Dark Mode

Dark mode is the **default** in the dashboard, managed by `next-themes` with class-based toggling.

### Implementation

```tsx
// tailwind.config.ts
darkMode: ["class"]

// Theme toggle in dashboard header uses useTheme() from next-themes
// Renders Sun/Moon icons to switch
```

### Key Adjustments in Dark Mode

- Accent brightens: `rgb(0, 229, 255)` → `rgb(45, 212, 255)`
- Backgrounds deepen: `#f8fafc` → `#111827`
- Cards shift: `#ffffff` → `#1f2937`
- Borders darken: `#e2e8f0` → `#2d3748`
- Muted text lightens: `#64748b` → `#94a3b8`
- Status colors shift to lighter variants for contrast
- Shadow increases opacity for visibility on dark surfaces

### Dark Mode Rules

- Never use manual `dark:` overrides — all colors flow through CSS variables
- Test all new components in both modes before shipping
- Ensure sufficient contrast (WCAG AA minimum) in both modes

---

## Animation

### Shimmer (Loading States)

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
/* Duration: 1.8s ease-in-out infinite */
```

Used by skeleton components for loading placeholders.

### Framer Motion

The project includes a `motion.tsx` wrapper component for Framer Motion animations. Use for:
- Page transitions
- Card entrance animations
- List item stagger effects

### Motion Principles

- Keep durations short: 150-300ms for micro-interactions
- Use `ease` or `ease-out` easing
- Animate opacity + transform together for entrances
- Never animate layout-triggering properties (width, height) when possible
- Respect `prefers-reduced-motion`

---

## File Structure

```
src/app/globals.css          # All CSS variables (light + dark)
tailwind.config.ts           # Tailwind theme extensions
src/app/layout.tsx           # Root layout, Inter font, AppProviders
src/components/ui/           # shadcn/ui primitives
src/components/layout/       # DashboardLayout (sidebar + header)
src/components/auth/         # AuthGuard
src/components/providers/    # AppProviders (QueryClient + Auth + Theme)
src/lib/utils.ts             # cn() helper
```

---

## Quick Reference

| Property | Value |
|----------|-------|
| Font | Inter |
| Accent | `rgb(0, 229, 255)` / `rgb(45, 212, 255)` dark |
| Background | `#f8fafc` / `#111827` dark |
| Card | `#ffffff` / `#1f2937` dark |
| Border | `#e2e8f0` / `#2d3748` dark |
| Radius | `0.625rem` (10px) |
| Shadow | `shadow-soft` |
| Icons | Lucide React, 2px stroke |
| Dark mode | Class-based, default on |
| UI library | shadcn/ui (Radix + CVA) |
| Animations | Framer Motion + CSS shimmer |
