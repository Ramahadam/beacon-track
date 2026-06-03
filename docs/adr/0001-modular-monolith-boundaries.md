# ADR 0001: Modular Monolith Boundaries

## Status

Accepted

## Context

Beacon Track is growing from a small ticketing app into a broader operations platform. The previous structure colocated shared server actions and queries inside route groups, while domain components lived in a flat `src/components` directory. That made route groups double as shared libraries and forced user-facing routes to depend on staff route internals.

## Decision

Use a modular monolith structure:

```text
src/
  app/        # Next.js routes and route composition only
  modules/    # bounded business modules
  shared/     # generic UI and cross-cutting infrastructure
```

Dependency rules:

- `src/app` may import from `src/modules` and `src/shared`.
- `src/modules` may import from `src/shared`.
- `src/modules` must not import from `src/app`.
- Cross-module imports should prefer public module entrypoints or clearly named server/component paths.
- `src/shared` must not depend on business modules.

The first migration slice proves the pattern with incidents while preserving behavior. Shared ticket/case helpers move under `modules/cases`, and incident server queries/actions/components move under `modules/incidents`.

## Consequences

- Routes stay thin and focused on auth, route params, and composition.
- Domain behavior can grow without tying itself to URL structure.
- Shared case behavior can support incidents, service requests, and change requests without duplicating enterprise ticketing logic.
- Follow-up slices should migrate service requests and change requests after the incident pattern is verified.
