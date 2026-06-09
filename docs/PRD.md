# FMC Jalingo Document Management System — Product Requirements Document

**Version:** 2.1 (Governance Hardened)
**Last updated:** 2026-06-09
**Owner:** FMC Jalingo IT / Digital Transformation

---

## 1. Purpose

Provide a secure, hierarchical, fully auditable Document Management System (DMS) for Federal Medical Centre, Jalingo that mirrors the real institutional command structure, enforces separation of duties, and is ready to share an identity core with future internal applications (starting with a Digital Library).

## 2. Scope (this release)

In scope:
- Role-based access control aligned with FMC Jalingo's actual hierarchy
- Super Admin bootstrap + Admin-managed user lifecycle (create / assign role / revoke / activate / deactivate)
- Document routing across CMD → Registry → HOD → Unit Head → Staff
- Audit logging of every privileged action
- In-app security notifications for abnormal activity and storage denials
- Acting / delegated role support with auto-expiry
- New oversight roles: Board Member, Auditor

Out of scope (this release):
- Email invitations, SSO, bulk user import
- Per-department admin scoping (Admin currently manages globally)
- Digital Library feature set (identity core is being prepared for it; UI ships separately)

## 3. Roles & Hierarchy

The system recognises 15 roles, grouped by purpose.

### 3.1 System / Governance (separation of duties)
| Role | Purpose | Can manage users? |
| --- | --- | --- |
| `SUPER_ADMIN` | Owns the platform; only role that can manage other Super Admins or hard-delete users | Yes (all roles) |
| `ADMIN` | Day-to-day IT administrator | Yes, **except** `SUPER_ADMIN` |
| `BOARD_MEMBER` | Board of Management oversight; view-only on board-restricted documents | No |
| `AUDITOR` | Internal auditor; read-only access to audit logs across the system | No |

### 3.2 Executive
| Role | Purpose |
| --- | --- |
| `CMD` | Chief Medical Director (institutional CEO). **No longer treated as a system admin** — separation of duties. |
| `CMAC` | Chairman, Medical Advisory Council |

### 3.3 Directorate Heads
`DIRECTOR_ADMIN`, `HEAD_OF_NURSING`, `CHIEF_ACCOUNTANT`, `CHIEF_PROCUREMENT_OFFICER`, `MEDICAL_RECORDS_OFFICER`.

### 3.4 Operational
`REGISTRY`, `HOD`, `HEAD_OF_UNIT`, `STAFF`.

### 3.5 Acting / Delegated roles
Any role assignment may be flagged `is_acting = true` with an `acting_until` timestamp. Helper functions (`is_admin`, `is_board_member`, `is_auditor`, etc.) automatically ignore expired acting roles, so deputies lose access at the configured time without manual revocation.

## 4. Who is the Super Admin?

There is exactly one bootstrapped Super Admin: **`superadmin@fmcjalingo.test`** (provisioned via the `bootstrap-superadmin` edge function from the Database Seeding page; idempotent). The Super Admin is the only account that can:
- Grant or revoke the `SUPER_ADMIN` role
- Hard-delete a user from Supabase Auth

All other governance privileges (Board, Auditor, Executive) must be granted explicitly by an Admin or Super Admin.

## 5. User Management (Admin UI)

Route: `/dashboard/admin/users` — accessible to `SUPER_ADMIN` and `ADMIN` only.

Capabilities:
- List all users with live data, search across name/email/department/role
- Create user (email + initial password + profile + initial role)
- Assign any role (Super Admin role hidden unless caller is Super Admin)
- Revoke a role
- Activate / deactivate
- Hard-delete (Super Admin only)
- Every mutating action writes to `audit_logs`

All privileged operations run through the `admin-manage-users` edge function, which re-validates the caller's JWT and roles server-side before using a service-role client.

## 6. Governance Changes vs Previous Release (v2.0 → v2.1)

| Area | Before | Now |
| --- | --- | --- |
| `is_admin(uuid)` | Returned true for `SUPER_ADMIN`, `ADMIN`, **`CMD`** | Returns true for `SUPER_ADMIN`, `ADMIN` only |
| User Management UI access | Super Admin, Admin, **CMD** | Super Admin, Admin |
| Role list | 13 roles | 15 roles (+ `BOARD_MEMBER`, `AUDITOR`) |
| Delegation | None | `is_acting` + `acting_until` on every role assignment, honoured by helper functions |
| Audit log visibility | Admins only | Admins **and** Auditors (read-only) |

Rationale: CMD is the hospital's Chief Executive, not its IT administrator. Conflating the two roles violated separation of duties — anyone compromising CMD's account would gain full platform control. Governance and operations are now distinct.

## 7. Security Model

- **Authentication:** Supabase Auth (email/password); JWT validated in every edge function.
- **Authorisation:** Roles stored in `public.user_roles` (never on profile/users table). All RLS policies go through `SECURITY DEFINER` helpers — no recursion, no client-trust.
- **Audit:** `public.audit_logs` written via `log_audit_event()` and from edge functions for every privileged action (user.created, user.role.assigned, user.role.revoked, user.activated, user.deactivated, user.deleted).
- **Security notifications:** `abnormal.activity` and `storage.denied` audit events fan out to all admins via `public.notifications`, throttled by `security_alert_config` thresholds.
- **Storage:** `documents` bucket private (50 MB limit); access controlled by `can_access_attachment()`. `avatars` bucket public.

## 8. Identity Core for Future Apps (Digital Library prep)

Design intent: DMS and the upcoming Digital Library share the **same Supabase project**, the **same** `auth.users`, `users`, `user_roles`, `departments`, `department_units`, `audit_logs`, and `notifications`. App-specific tables will live in their own schemas (`dms.*`, `library.*`) and an `source_app` column will tag audit + notification rows (`'dms' | 'library'`). RLS reuses the existing helpers (`has_role`, `is_admin`, `is_hod`, `is_auditor`). This keeps one user, one password, one audit trail, one departmental tree across both products.

A central `identity` project + JWT validation is documented as a fallback (Option B) for the case where a third app is added later.

## 9. Database Surface (key objects affected this release)

- `public.app_role` enum — added `BOARD_MEMBER`, `AUDITOR`
- `public.user_roles` — added `is_acting boolean`, `acting_until timestamptz`
- `public.is_admin(uuid)` — narrowed to `SUPER_ADMIN`, `ADMIN`; honours `acting_until`
- `public.is_super_admin(uuid)` — existing
- `public.is_board_member(uuid)` — new
- `public.is_auditor(uuid)` — new
- `public.audit_logs` — new policy "Auditors can view all audit logs"

## 10. Acceptance Criteria

1. A user holding only `CMD` cannot reach `/dashboard/admin/users`, and cannot insert, update, or delete rows in `public.user_roles`.
2. `superadmin@fmcjalingo.test` can be (re-)provisioned from the Database Seeding page with no errors and ends up with the `SUPER_ADMIN` role.
3. An Admin can create a user and assign every role except `SUPER_ADMIN`; attempts to assign `SUPER_ADMIN` are rejected by both UI and edge function.
4. A user with `AUDITOR` can read `public.audit_logs` but cannot mutate any user, role, or document.
5. A role row with `acting_until` in the past is ignored by `is_admin`, `is_board_member`, and `is_auditor`.
6. Every `create_user` / `assign_role` / `revoke_role` / `activate` / `deactivate` / `delete_user` action produces an `audit_logs` row attributed to the calling user.

## 11. Open Items / Next Iterations

- Directorate table to formally group HODs under their directorate head.
- UI affordances for setting `is_acting` / `acting_until` from the User Management screen.
- `source_app` column on `audit_logs` and `notifications` once Digital Library work begins.
- Auditor read-only dashboard surfacing `audit_logs` with filters and export.
