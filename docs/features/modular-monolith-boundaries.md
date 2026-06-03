# Modular Monolith Boundaries

## What It Does

The project now has a first modular-monolith boundary for ticketing growth. Routes stay in `src/app`, domain code starts moving into `src/modules`, and cross-cutting code has a home in `src/shared`.

The first implemented slice proves the pattern with incidents:

- Incident server actions live in `src/modules/incidents/server/actions.ts`.
- Incident queries live in `src/modules/incidents/server/queries.ts`.
- Incident-specific form and delete components live in `src/modules/incidents/components`.
- Shared ticket/case helpers start moving into `src/modules/cases`.

The second cleanup slice applies the same component ownership rule to feature UI:

- Service request forms and delete UI live in `src/modules/service-requests/components`.
- Change request forms and delete UI live in `src/modules/change-requests/components`.
- User, profile, and delete-user UI live in `src/modules/users/components`.
- Login UI lives in `src/modules/auth/components`.

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
- Generic UI, app shell layout, shared case primitives, and reporting controls still live in the flat `src/components` directory.
- Import boundary rules are documented but not yet enforced by ESLint.
- `src/shared` is only scaffolded; generic UI has not moved yet.

## Complete Source Organization Review

The next problem to solve is not only `src/app`; it is the root-level `src/lib` and `src/components` buckets. They currently mix unrelated responsibilities, which makes future enterprise features harder to place consistently.

### Current Friction

- `src/components` still mixes generic UI kit files, app shell layout, shared ticket/case UI, and reporting/export controls.
- `src/lib` mixes database setup, auth guards, permission rules, domain constants, validation schemas, presentation builders, ticket helpers, upload clients, and generic utilities.
- Some route files still import Prisma directly for small supporting queries such as engineer lists, profile data, staff layout counts, and dashboard aggregation.
- Service request and change request queries still live under staff route folders while user-facing routes import them.
- `src/components/priority-badge.tsx`, `src/components/sla-badge.tsx`, and `src/components/status-pill.tsx` appear unreferenced after the app moved to `ticket-primitives`; audit before deleting.

### Target Source Map

Use this as the long-term folder target:

```text
src/
  app/
    # Next.js route files only: params, auth, composition, metadata, route handlers

  modules/
    auth/
      components/
      server/
      validation/

    cases/
      components/
        badges.tsx
        create-ticket-layout.tsx
        detail-page.tsx
        queue-list.tsx
      presentation/
        activity.ts
        my-tickets.ts
        ticket.ts
      server/
        form-data.ts
        ticket-helpers.ts
      validation/
        tickets.ts

    incidents/
      components/
      server/
        actions.ts
        queries.ts

    service-requests/
      components/
      server/
        actions.ts
        queries.ts

    change-requests/
      components/
      server/
        actions.ts
        queries.ts
      validation/

    users/
      components/
      presentation/
      server/
        actions.ts
        profile-actions.ts
        queries.ts
      validation/

    dashboard/
      components/
      presentation/
      server/
        queries.ts

    files/
      client/
      server/

    reporting/
      components/
      export/

  shared/
    ui/
    layout/
    providers/
    auth/
    db/
    config/
    utils/

  lib/
    # Temporary compatibility re-exports only; no new code should be added here.
```

### Current File Migration Map

| Current location | Target location | Notes |
| --- | --- | --- |
| `src/components/ui/*` | `src/shared/ui/*` | Generic design-system primitives. Move with compatibility re-exports or an import codemod. |
| `src/components/providers/*` | `src/shared/providers/*` | Cross-app providers. |
| `app-sidebar`, `nav-main`, `nav-user`, `site-header`, `theme-toggle` | `src/shared/layout/*` | App shell, not domain code. |
| `ticket-primitives`, `detail-page-primitives`, `queue-list-primitives`, `create-ticket-layout`, `new-ticket-modal` | `src/modules/cases/components/*` | Shared ticket/case UI. |
| `operations-primitives` | `src/modules/dashboard/components/*` | Dashboard-specific UI. |
| Service request forms/delete button | `src/modules/service-requests/components/*` | Pair with service request queries. |
| Change request forms/delete button | `src/modules/change-requests/components/*` | Pair with change request queries. |
| User create/edit/delete/profile forms | `src/modules/users/components/*` | User/profile domain UI. |
| `login-form` | `src/modules/auth/components/*` | Authentication UI. |
| `excel-export-button` and Excel export helper | `src/modules/reporting/*` | Reporting/export capability. |
| `auth-helpers`, `permissions` | `src/shared/auth/*` | Cross-module auth guards and role predicates. |
| `prisma` | `src/shared/db/prisma.ts` | Database adapter. |
| `env` | `src/shared/config/env.ts` | Runtime configuration. |
| `utils` | `src/shared/utils/*` | Keep generic helpers only. |
| `constants` | Split by domain | Ticket constants to `cases`, change constants to `change-requests`, role constants to auth/users. |
| `validation/*` | Owning module `validation/*` | Auth, users, cases, and change requests should own schemas. |
| `queue-list-params`, `ticket-activity`, `ticket-presentation`, `create-ticket-routes`, `sla` | `src/modules/cases/*` | Case/ticket behavior and presentation. |
| `dashboard-presentation` | `src/modules/dashboard/presentation/*` | Dashboard-specific view model logic. |
| `my-tickets-presentation` | `src/modules/cases/presentation/my-tickets.ts` | Customer-facing case list presentation. |
| `users-list-params` | `src/modules/users/presentation/list-params.ts` | User list presentation/query params. |
| `upload-client` | `src/modules/files/client/upload-client.ts` | File upload capability. |
| `helpers` | Split by domain | Ticket deadline/notes to cases; export to reporting; file name helpers to files. |

### Recommended Migration Order

1. Move service request queries and components into `src/modules/service-requests`.
2. Move change request queries and components into `src/modules/change-requests`.
3. Move user queries and user/profile components into `src/modules/users`.
4. Move shared case UI and case presentation helpers into `src/modules/cases`.
5. Split `src/lib/helpers.ts` and `src/lib/constants.ts` by domain.
6. Move generic UI/app shell/providers from `src/components` into `src/shared`.
7. Add lint/import rules that make `src/lib` compatibility-only and prevent `src/modules` from importing `src/app`.
8. Audit and remove unreferenced badge/pill files after confirming no dynamic imports or external references.

## What I Would Do Next

Short term:

- Migrate service request queries into `src/modules/service-requests/server`.
- Migrate change request queries into `src/modules/change-requests/server`.
- Move user queries into `src/modules/users/server`.

Medium term:

- Move generic layout components into `src/shared/layout`.
- Move generic reusable UI wrappers into `src/shared/ui` only when they are truly domain-agnostic.
- Move shared ticket/case primitives and presentation files into `src/modules/cases`.

Long term:

- Add lint rules that prevent `src/modules` from importing `src/app`.
- Add public module entrypoints where cross-module imports become common.
