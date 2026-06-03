# Modules

Business modules own domain-specific UI, server actions, queries, validation, and rules.

Keep route files in `src/app` thin. Routes may import modules, but modules must not import from `src/app`.
