# Feature Guide: Relay Design System

## What it does

Replaces the default shadcn/Tailwind colour palette with a cohesive "Relay" design language:

- **Indigo accent** (`oklch(0.52 0.21 265)`) replaces the default blue primary, used for buttons, links, sidebar highlights, and focused ring states.
- **Priority badges** — `PriorityBadge` renders P1–P4 labels with severity colours (red → orange → sky → slate) so operators can triage at a glance.
- **Status pills** — `StatusPill` maps each workflow state to a semantic tone (violet=new, indigo=in-progress, amber=on-hold, emerald=resolved, slate=cancelled) instead of a generic outline badge.
- **SLA badges** — `SlaBadge` uses `--relay-good/warn/bad` tokens that adapt to light/dark mode automatically.
- Both light and dark themes ship tokens for every semantic colour.

## How it works

### Token layer (`src/app/globals.css`)

Custom CSS properties are declared inside `@layer base` on `:root` (light) and `.dark` scopes. They live outside the shadcn variable block so they don't conflict with shadcn's theming.

```
--relay-p1/p2/p3/p4          priority foreground colours
--relay-p1-soft/…-soft       priority background (tinted pill surfaces)
--relay-good/warn/bad         SLA semantic foregrounds
--relay-good-soft/…-soft      SLA semantic backgrounds
```

These are OKLCH values so they perceptually interpolate well across themes.

### Component layer

| Component | File | Technique |
|---|---|---|
| `PriorityBadge` | `src/components/priority-badge.tsx` | `style` prop with `var(--relay-p*)` |
| `StatusPill` | `src/components/status-pill.tsx` | Tailwind semantic colour classes (violet/indigo/amber/emerald/slate) |
| `SlaBadge` | `src/components/sla-badge.tsx` | `style` prop with `var(--relay-good/warn/bad)` |

`StatusPill` uses Tailwind colour classes rather than CSS variables because the tones map cleanly to Tailwind's named palette, avoiding extra token definitions.

### Wiring

All three components are wired into every list and detail page under both `(staff)` and `(user)` route groups. The `Badge` component from shadcn is kept for other uses but no longer used for ticket status/priority display.

## Tradeoffs

| Decision | Chosen | Alternative | Rationale |
|---|---|---|---|
| Token delivery | CSS custom properties in `globals.css` | Extend `tailwind.config.ts` | Config extension requires Tailwind class generation at build time; CSS vars work at runtime and adapt to dark mode without extra classes |
| StatusPill colouring | Tailwind semantic classes | CSS vars | Tailwind's named tones (violet, indigo, amber…) are semantically meaningful and cover both light/dark variants without writing custom tokens |
| PriorityBadge colouring | CSS vars via `style` | Tailwind arbitrary values | Arbitrary values (`bg-[oklch(...)]`) bypass PurgeCSS/Tailwind scanning reliably but are verbose; CSS vars are cleaner and DRY |
| Geist font | Already loaded via `next/font` | System font stack | No change needed — Geist was already in the project |

## Known limitations

- `StatusPill` covers all current status keys but new statuses added to the DB will fall back to a slate "Unknown" pill rather than surfacing a type error.
- The Tailwind colour classes used by `StatusPill` (e.g. `bg-violet-100`) are not themeable via `--relay-*` tokens — changing the design palette requires updating the component directly.
- `ChangeRequest` tickets have no `priority` or `deadline` fields in the DB, so they show neither `PriorityBadge` nor `SlaBadge` on the change list page.
- The sidebar active-item indigo colour is set via `--sidebar-primary` in `globals.css`; if shadcn updates its sidebar component the variable name may change.

## What I would do next

**Short-term**
- Add a Storybook story (or Vitest snapshot) for each badge/pill so regressions are caught automatically.
- Exhaustively test dark mode rendering — the OKLCH values look correct in theory but need visual review on actual dark backgrounds.

**Medium-term**
- Add `priority` and `deadline` to `ChangeRequest` so the change list gets full SLA and priority treatment.
- Export a `designTokens` object from a TS file so the same values are used in both CSS and any JS animation/canvas code.

**Long-term**
- Replace scattered `bg-violet-100 text-violet-700` class strings in `StatusPill` with a single `data-tone` attribute styled via CSS — cleaner separation of logic and style.
- Introduce a Figma token file synced to `globals.css` via Style Dictionary so designers and engineers share one source of truth.
