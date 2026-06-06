import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPERADMIN_EMAIL = "superadmin@fmcjalingo.test";
const SUPERADMIN_PASSWORD = "password123";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Idempotency: refuse if any SUPER_ADMIN already exists
    const { count, error: countErr } = await admin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "SUPER_ADMIN");
    if (countErr) throw countErr;

    if ((count ?? 0) > 0) {
      return new Response(
        JSON.stringify({
          ok: false,
          alreadySeeded: true,
          message: "A Super Admin already exists. Bootstrap is locked.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find or create the auth user
    let userId: string | null = null;
    const { data: existing } = await admin.auth.admin.listUsers();
    const found = existing?.users?.find((u) => u.email?.toLowerCase() === SUPERADMIN_EMAIL);
    if (found) {
      userId = found.id;
    } else {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: SUPERADMIN_EMAIL,
        password: SUPERADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          first_name: "Super",
          last_name: "Admin",
          role: "SUPER_ADMIN",
          department: "Administration",
        },
      });
      if (createErr) throw createErr;
      userId = created.user!.id;
    }

    // Upsert profile
    await admin.from("users").upsert(
      {
        id: userId,
        email: SUPERADMIN_EMAIL,
        first_name: "Super",
        last_name: "Admin",
        role: "SUPER_ADMIN",
        department: "Administration",
        is_active: true,
      },
      { onConflict: "id" }
    );

    // Assign SUPER_ADMIN
    await admin
      .from("user_roles")
      .upsert({ user_id: userId, role: "SUPER_ADMIN" }, { onConflict: "user_id,role" });

    return new Response(
      JSON.stringify({
        ok: true,
        email: SUPERADMIN_EMAIL,
        password: SUPERADMIN_PASSWORD,
        userId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("bootstrap-superadmin error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
