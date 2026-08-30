# Backend layer (`src/backend`)

All data access lives here. UI components, pages, hooks and Redux slices must
never talk to Supabase directly — they import a module service from this folder.

```
src/backend/
  client.ts                 # the only place that touches the Supabase client
  index.ts                  # public barrel: `import { StorageService } from "@/backend"`
  modules/
    audit/                  # audit logging, storage-access + abnormal-activity events
    documents/              # document sharing + document communication
    forms/                  # form templates & submissions
    messaging/              # inter-department messaging
    mock/                   # mock data service (legacy/demo data)
    mock-api/               # legacy mock REST API (JSON fixtures)
    notifications/          # in-app notifications
    storage/                # Supabase Storage uploads + attachment helpers
    users/                  # user / role administration (edge function)
```

## Module convention (for all new features)

Each new feature gets its own folder under `modules/<feature>/`:

| File | Purpose |
| --- | --- |
| `<feature>.types.ts` | DTOs and domain types for the module |
| `<feature>.service.ts` | Data access: queries, mutations, edge-function calls |
| `index.ts` | Public surface of the module (re-exports only what callers need) |

Rules:

1. Only `client.ts` imports `@/integrations/supabase/client`.
2. Services return plain domain objects — no React, no toasts, no navigation.
3. Errors are thrown (or returned as typed results); the UI decides how to show them.
4. Cross-module calls use the `@/backend/modules/...` alias, never relative paths.
5. Register the module in `src/backend/index.ts`.
