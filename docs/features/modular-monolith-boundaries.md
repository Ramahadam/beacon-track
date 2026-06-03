# Modular Monolith Boundaries

## What It Does

The project now has a first modular-monolith boundary for ticketing growth. Routes stay in `src/app`, domain code starts moving into `src/modules`, and cross-cutting code has a home in `src/shared`.

The first implemented slice proves the pattern with incidents:

- Incident server actions live in `src/modules/incidents/server/actions.ts`.
- Incident queries live in `src/modules/incidents/server/queries.ts`.
- Incident-specific form and delete components live in `src/modules/incidents/components`.
- Shared ticket/case helpers start moving into `src/modules/cases`.

## How It Works

Next.js route files remain the composition layer. They handle route params, auth context, and rendering. Business modules own domain behavior and reusable domain UI.

Current boundary rules:

- `src/app` may import from `src/modules` and `src/shared`.
- `src/modules` may import from `src/shared`.
- `src/modules` must not import from `src/app`.
- `src/shared` must not import from business modules.

Server Actions are allowed outside `src/app` when exported from files marked with `'use server'`. Client components import those action files directly from their owning module.

## Tradeoffs

| Decision | Chosen | Alternative | Rationale |
| --- | --- | --- | --- |
| Architecture | Modular monolith | Microservices | Keeps one deployable app while establishing enterprise-scale boundaries. |
| First slice | Incidents | All ticket types at once | Proves the pattern with a reviewable vertical slice before repeating it. |
| Shared case helpers | Move ticket helper source to `modules/cases` with a compatibility re-export | Rewrite all ticket imports immediately | Reduces migration risk while establishing the new source of truth. |
| Actions outside routes | Module-owned action files | Route-group action files | Stops reusable components from depending on URL/layout structure. |

## Known Limitations

- Service request and change request queries still live in staff route folders.
- Service request and change request UI still live in the flat `src/components` directory.
- Import boundary rules are documented but not yet enforced by ESLint.
- `src/shared` is only scaffolded; generic UI has not moved yet.

## What I Would Do Next

Short term:

- Migrate service request queries and components into `src/modules/service-requests`.
- Migrate change request queries and components into `src/modules/change-requests`.

Medium term:

- Move generic layout components into `src/shared/layout`.
- Move generic reusable UI wrappers into `src/shared/ui` only when they are truly domain-agnostic.

Long term:

- Add lint rules that prevent `src/modules` from importing `src/app`.
- Add public module entrypoints where cross-module imports become common.
