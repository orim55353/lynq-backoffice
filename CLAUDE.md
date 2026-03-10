# Lynq Backoffice

Employer dashboard for managing jobs, candidates, applications, campaigns, billing, analytics, and market insights.

## Stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript 5 (strict)
- **Styling:** Tailwind CSS v3 (`tailwind.config.ts`), CSS variables in `src/app/globals.css`
- **UI:** shadcn/ui (Radix primitives) + Framer Motion + Lucide icons
- **Backend:** Firebase (Auth, Firestore, Storage, Functions, Analytics)
- **Data fetching:** TanStack Query v5 wrapping Firestore subscriptions
- **Theme:** Dark mode default via next-themes, Lynq cyan accent (`--lynq-accent`)
- **Package manager:** npm

## Project Structure

```
src/
  app/
    (auth)/          # Login/auth pages
    (dashboard)/     # Authenticated pages: analytics, billing, candidates, jobs,
                     #   market-insights, settings, sponsored
    globals.css      # All CSS variables (light + dark themes)
    layout.tsx       # Root layout with AppProviders + Inter font
  components/
    auth/            # AuthGuard
    layout/          # DashboardLayout
    providers/       # AppProviders (QueryClient + Auth + Theme)
    skeletons/       # Loading skeletons
    ui/              # shadcn/ui primitives (button, card, input, badge, etc.)
  lib/
    auth-context.tsx # useAuth() hook — exposes user, profile, orgId, loading, signOut
    firebase/        # config, admin, auth, firestore, types
    hooks/           # Data hooks (use-jobs, use-candidates, use-applications, etc.)
```

## Design System & Theming

**shadcn/ui leads all theming and component decisions.** Follow the shadcn skill rules strictly.

- Use **semantic color tokens** (`bg-primary`, `text-muted-foreground`, `bg-card`) — never raw Tailwind colors like `bg-blue-500`
- Lynq brand accent: `lynq-accent` for CTAs and highlights, `lynq-accent-muted` for subtle backgrounds
- Frame colors (`frame`, `frame-foreground`, `frame-border`, etc.) for sidebar/navigation chrome
- Status colors: `success`, `warning`, `danger`, `info` — use these instead of raw color values
- Chart palette: `chart-1` through `chart-5`
- All color definitions live in `src/app/globals.css` — edit there, never create new CSS files
- Border radius: `--radius: 0.625rem`
- Shadow: `shadow-soft` for cards and elevated surfaces
- Use `gap-*` instead of `space-x-*`/`space-y-*`
- Use `size-*` when width equals height
- Use `cn()` from `@/lib/utils` for conditional classes

## Routing & Auth

- Route groups: `(dashboard)` requires auth, `(auth)` is public
- `AuthGuard` wraps dashboard layout — redirects to `/login` if unauthenticated
- `useAuth()` provides `user`, `profile`, `orgId`, `loading`, `signOut`
- All data hooks gate on `orgId` from `useAuth()`

## Data Fetching Pattern

- Hooks live in `src/lib/hooks/` — one file per domain (use-jobs, use-candidates, etc.)
- `useFirestoreCollection` / `useFirestoreDocument` bridge Firestore → React Query
- Transform utilities in `src/lib/hooks/transforms.ts`
- Display types in `src/lib/hooks/types.ts`
- Firestore types in `src/lib/firebase/types.ts`

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run seed` — seed Firestore with test data

## Plugin & Skill Usage

### shadcn/ui Skill (ALWAYS use for UI work)

- Before creating any UI component, run `npx shadcn@latest search` to check if it exists
- Before using a component, run `npx shadcn@latest docs <component>` and fetch the URLs
- Installed UI primitives are in `src/components/ui/` — check before adding duplicates
- Follow all shadcn critical rules: forms use FieldGroup+Field, icons use `data-icon`, etc.
- Use `cn()` for conditional classes, semantic colors only, no manual `dark:` overrides

### frontend-design Skill (USE for all design decisions)

- Use `/frontend-design` for creating new pages, layouts, and complex UI compositions
- Handles visual hierarchy, spacing systems, responsive breakpoints, and interaction patterns
- Ensures distinctive, production-grade interfaces — not generic templates

### product-management Plugin (USE for all product decisions)

- `/gaps` — run gap analysis to find missing features
- `/prd` — generate PRDs and create GitHub Issues for new features
- `/analyze` — scan codebase for product inventory
- `/landscape` — research competitor landscape
- `/file` — batch create GitHub Issues for approved gaps
- `/sync` — sync local cache with GitHub Issues
- Use before starting any new feature to validate product direction

## Code Conventions

- **Immutability:** Always create new objects, never mutate existing ones
- **File size:** 200-400 lines typical, 800 max — extract if larger
- **Functions:** Under 50 lines each
- **Imports:** Use `@/` alias for all project imports
- **Components:** `"use client"` directive required for any component using hooks, state, or event handlers
- **Error handling:** Handle explicitly at every level, user-friendly messages in UI, detailed logs server-side
- **No hardcoded values:** Use CSS variables, constants, or config

## Git

Commit format: `<type>: <description>` (feat, fix, refactor, docs, test, chore, perf, ci)
