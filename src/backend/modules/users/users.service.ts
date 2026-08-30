import { supabase } from "@/backend/client";

export type AdminManagedUser = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  department: string | null;
  role: string | null;
  is_active: boolean | null;
  created_at: string | null;
  roles: string[];
};

type AdminAction =
  | { action: "list"; search?: string }
  | {
      action: "create_user";
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      department?: string;
      role: string;
    }
  | { action: "assign_role"; user_id: string; role: string }
  | { action: "revoke_role"; user_id: string; role: string }
  | {
      action: "update_profile";
      user_id: string;
      first_name?: string;
      last_name?: string;
      department?: string;
    }
  | { action: "deactivate"; user_id: string }
  | { action: "activate"; user_id: string }
  | { action: "delete_user"; user_id: string };

/**
 * Users / roles administration. All calls go through the `admin-manage-users`
 * edge function, which re-validates the caller's admin privileges server-side.
 */
export const UsersService = {
  async invoke<T = unknown>(payload: AdminAction): Promise<T> {
    const { data, error } = await supabase.functions.invoke("admin-manage-users", {
      body: payload,
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data as T;
  },

  list(search?: string) {
    return UsersService.invoke<{ users: AdminManagedUser[]; callerIsSuperAdmin: boolean }>({
      action: "list",
      search,
    });
  },

  createUser(input: Extract<AdminAction, { action: "create_user" }>) {
    return UsersService.invoke(input);
  },

  assignRole(user_id: string, role: string) {
    return UsersService.invoke({ action: "assign_role", user_id, role });
  },

  revokeRole(user_id: string, role: string) {
    return UsersService.invoke({ action: "revoke_role", user_id, role });
  },

  updateProfile(input: Extract<AdminAction, { action: "update_profile" }>) {
    return UsersService.invoke(input);
  },

  setActive(user_id: string, active: boolean) {
    return UsersService.invoke({ action: active ? "activate" : "deactivate", user_id });
  },

  deleteUser(user_id: string) {
    return UsersService.invoke({ action: "delete_user", user_id });
  },
};
