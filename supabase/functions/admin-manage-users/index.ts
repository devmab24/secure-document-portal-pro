import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

type Action =
  | "list"
  | "create_user"
  | "assign_role"
  | "revoke_role"
  | "update_profile"
  | "deactivate"
  | "activate"
  | "delete_user";

const ALL_ROLES = [
  "SUPER_ADMIN", "ADMIN", "BOARD_MEMBER", "AUDITOR",
  "CMD", "CMAC", "DIRECTOR_ADMIN",
  "HEAD_OF_NURSING", "CHIEF_ACCOUNTANT", "CHIEF_PROCUREMENT_OFFICER",
  "MEDICAL_RECORDS_OFFICER", "REGISTRY", "HOD", "HEAD_OF_UNIT", "STAFF",
] as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) return json({ error: "Unauthorized" }, 401);
    const callerId = claims.claims.sub as string;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Caller roles
    const { data: callerRoles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId);
    const roleSet = new Set((callerRoles ?? []).map((r) => r.role));
    const isSuperAdmin = roleSet.has("SUPER_ADMIN");
    const isAdmin =
      isSuperAdmin || roleSet.has("ADMIN") || roleSet.has("CMD");
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const action = body.action as Action;

    const assertCanTouchRole = (role: string) => {
      if (!ALL_ROLES.includes(role as any)) throw new Error("Invalid role");
      if (role === "SUPER_ADMIN" && !isSuperAdmin) {
        throw new Error("Only a Super Admin can manage the Super Admin role");
      }
    };

    const audit = async (act: string, target_id: string | null, metadata: any) => {
      await admin.from("audit_logs").insert({
        user_id: callerId, action: act, target_type: "user", target_id, metadata,
      });
    };

    if (action === "list") {
      const search = (body.search ?? "").toString().trim().toLowerCase();
      const { data: users, error: uErr } = await admin
        .from("users")
        .select("id, email, first_name, last_name, department, role, is_active, created_at")
        .order("created_at", { ascending: false });
      if (uErr) throw uErr;
      const { data: roles } = await admin.from("user_roles").select("user_id, role");
      const rolesByUser = new Map<string, string[]>();
      (roles ?? []).forEach((r) => {
        const arr = rolesByUser.get(r.user_id) ?? [];
        arr.push(r.role);
        rolesByUser.set(r.user_id, arr);
      });
      let merged = (users ?? []).map((u) => ({ ...u, roles: rolesByUser.get(u.id) ?? [] }));
      if (search) {
        merged = merged.filter((u) =>
          [u.email, u.first_name, u.last_name, u.department, ...(u.roles ?? [])]
            .filter(Boolean)
            .some((v: string) => v.toLowerCase().includes(search))
        );
      }
      return json({ users: merged, callerIsSuperAdmin: isSuperAdmin });
    }

    if (action === "create_user") {
      const { email, password, first_name, last_name, department, role } = body;
      if (!email || !password || !first_name || !last_name || !role) {
        return json({ error: "Missing required fields" }, 400);
      }
      assertCanTouchRole(role);

      const { data: created, error: cErr } = await admin.auth.admin.createUser({
        email, password, email_confirm: true,
        user_metadata: { first_name, last_name, department: department ?? "Administration", role },
      });
      if (cErr) throw cErr;
      const newId = created.user!.id;

      await admin.from("users").upsert({
        id: newId, email, first_name, last_name,
        department: department ?? "Administration", role, is_active: true,
      }, { onConflict: "id" });

      await admin.from("user_roles").upsert(
        { user_id: newId, role }, { onConflict: "user_id,role" }
      );

      await audit("user.created", newId, { email, role, department });
      return json({ ok: true, user_id: newId });
    }

    if (action === "assign_role") {
      const { user_id, role } = body;
      if (!user_id || !role) return json({ error: "Missing user_id or role" }, 400);
      assertCanTouchRole(role);
      const { error } = await admin
        .from("user_roles")
        .upsert({ user_id, role }, { onConflict: "user_id,role" });
      if (error) throw error;
      await audit("user.role.assigned", user_id, { role });
      return json({ ok: true });
    }

    if (action === "revoke_role") {
      const { user_id, role } = body;
      if (!user_id || !role) return json({ error: "Missing user_id or role" }, 400);
      assertCanTouchRole(role);
      const { error } = await admin
        .from("user_roles")
        .delete()
        .eq("user_id", user_id)
        .eq("role", role);
      if (error) throw error;
      await audit("user.role.revoked", user_id, { role });
      return json({ ok: true });
    }

    if (action === "update_profile") {
      const { user_id, first_name, last_name, department } = body;
      if (!user_id) return json({ error: "Missing user_id" }, 400);
      const update: any = {};
      if (first_name !== undefined) update.first_name = first_name;
      if (last_name !== undefined) update.last_name = last_name;
      if (department !== undefined) update.department = department;
      const { error } = await admin.from("users").update(update).eq("id", user_id);
      if (error) throw error;
      await audit("user.profile.updated", user_id, update);
      return json({ ok: true });
    }

    if (action === "deactivate" || action === "activate") {
      const { user_id } = body;
      if (!user_id) return json({ error: "Missing user_id" }, 400);
      const is_active = action === "activate";
      const { error } = await admin.from("users").update({ is_active }).eq("id", user_id);
      if (error) throw error;
      await audit(is_active ? "user.activated" : "user.deactivated", user_id, {});
      return json({ ok: true });
    }

    if (action === "delete_user") {
      if (!isSuperAdmin) return json({ error: "Only Super Admin can delete users" }, 403);
      const { user_id } = body;
      if (!user_id) return json({ error: "Missing user_id" }, 400);
      await admin.from("user_roles").delete().eq("user_id", user_id);
      await admin.from("users").update({ is_active: false }).eq("id", user_id);
      await admin.auth.admin.deleteUser(user_id);
      await audit("user.deleted", user_id, {});
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e: any) {
    console.error("admin-manage-users error", e);
    return json({ error: String(e?.message ?? e) }, 500);
  }
});
