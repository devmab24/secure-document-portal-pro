# Admin & Role Management — Implementation Plan

## 1. Confirm sidebars / navigation (no code changes needed)
Audit confirmed every role has a dedicated sidebar + layout already wired in `App.tsx`:
SuperAdmin, Admin, CMD, CMAC, DirectorAdmin, HOD, HeadOfUnit, HeadOfNursing, ChiefAccountant, ChiefProcurement, MedicalRecords, Registry, Staff, Department. No changes required — they all render via their `*ProtectedRoute` + `*Layout` + `*Sidebar` trio.

## 2. Seed the real Super Admin
- New edge function `bootstrap-superadmin` (public, idempotent): if no `SUPER_ADMIN` exists in `user_roles`, it creates the auth user `superadmin@fmcjalingo.test` (password `password123`) via service-role Admin API, inserts the profile row, and assigns the `SUPER_ADMIN` role. After one successful run it refuses further calls.
- A one-time `Seed Super Admin` button on the existing `DatabaseSeeding` page triggers the function so you can run it from the UI.

## 3. Database migration — let Admins manage roles (except SUPER_ADMIN)
Update `user_roles` policies:
- Keep current SUPER_ADMIN full-control policies.
- Add an INSERT policy allowing `ADMIN` to insert any role EXCEPT `SUPER_ADMIN`.
- Add a DELETE policy allowing `ADMIN` to delete any role EXCEPT `SUPER_ADMIN`.
- Add an UPDATE policy with the same restriction.
- Add an `is_super_admin(uuid)` helper for clarity.

No changes to `users` table policies — admins already have read access; writes are done by the edge function via service role.

## 4. Edge function `admin-manage-users`
Single function with actions, validates caller's JWT and confirms caller is `is_admin()` server-side:
- `list` — returns merged users + roles (paginated, searchable).
- `create_user` — creates auth user (email/password/first_name/last_name/department) + assigns initial role. Admins blocked from creating SUPER_ADMIN.
- `assign_role` / `revoke_role` — same SUPER_ADMIN restriction for non-super-admin callers.
- `update_profile` — first_name, last_name, department, is_active.
- `delete_user` — soft delete (set `is_active = false`); SUPER_ADMIN can hard-delete via auth.admin.

All mutating actions write to `audit_logs` with action `user.role.assigned`, `user.created`, etc.

## 5. Replace the mock UserManagement page
Rewrite `src/pages/admin/UserManagement.tsx` to use real data:
- Calls `admin-manage-users:list` (TanStack Query).
- Search + role filter + pagination.
- "Add New User" dialog → calls `create_user`.
- Row actions: Edit profile, Assign/Revoke roles (multi-select with available roles, SUPER_ADMIN hidden unless caller is SUPER_ADMIN), Activate/Deactivate, Delete.
- Role badges keyed off real data.
- Permission gate: visible to `SUPER_ADMIN`, `ADMIN`, `CMD`.

## 6. Wire route into Admin sidebar
Add `Users & Roles` entry to `AdminSidebar.tsx` and an `/dashboard/admin/users` route in `App.tsx` rendering the new `UserManagement` page (the same page also stays under `/dashboard/super-admin/users/management`).

## Technical details
- `bootstrap-superadmin` uses `SUPABASE_SERVICE_ROLE_KEY` (already configured).
- `admin-manage-users` derives the caller from the `Authorization: Bearer <jwt>` header using a user-scoped client, then performs privileged work with a service-role client.
- Role enum values: `SUPER_ADMIN, ADMIN, CMD, CMAC, DIRECTOR_ADMIN, HEAD_OF_NURSING, CHIEF_ACCOUNTANT, CHIEF_PROCUREMENT_OFFICER, MEDICAL_RECORDS_OFFICER, REGISTRY, HOD, HEAD_OF_UNIT, STAFF`.
- All UI uses semantic Tailwind tokens; no raw colors.

## Out of scope
- Email invitation flow (users get the seeded password and change it later).
- Bulk import.
- Per-department admin scoping (Admin can manage all users globally for now).
