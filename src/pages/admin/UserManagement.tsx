import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserPlus, Search, Shield, MoreHorizontal, Loader2,
  UserCheck, UserX, ShieldPlus, ShieldMinus,
} from "lucide-react";

const ALL_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.BOARD_MEMBER, UserRole.AUDITOR,
  UserRole.CMD, UserRole.CMAC, UserRole.DIRECTOR_ADMIN,
  UserRole.HEAD_OF_NURSING, UserRole.CHIEF_ACCOUNTANT,
  UserRole.CHIEF_PROCUREMENT_OFFICER, UserRole.MEDICAL_RECORDS_OFFICER,
  UserRole.REGISTRY, UserRole.HOD, UserRole.HEAD_OF_UNIT, UserRole.STAFF,
];

interface ManagedUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  department: string | null;
  role: string | null;
  is_active: boolean;
  roles: string[];
}

const roleBadgeClass = (role: string) => {
  switch (role) {
    case "SUPER_ADMIN": return "bg-destructive/15 text-destructive";
    case "ADMIN": return "bg-primary/15 text-primary";
    case "CMD":
    case "CMAC": return "bg-orange-500/15 text-orange-600 dark:text-orange-400";
    case "HOD":
    case "HEAD_OF_UNIT": return "bg-blue-500/15 text-blue-600 dark:text-blue-400";
    case "STAFF": return "bg-muted text-muted-foreground";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const UserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [assignUser, setAssignUser] = useState<ManagedUser | null>(null);
  const [pendingRole, setPendingRole] = useState<string>("");

  const canAccess =
    user?.role === UserRole.SUPER_ADMIN ||
    user?.role === UserRole.ADMIN;

  const invoke = async (action: string, payload: Record<string, any> = {}) => {
    const { data, error } = await supabase.functions.invoke("admin-manage-users", {
      body: { action, ...payload },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: () => invoke("list", { search }),
    enabled: canAccess,
  });

  const users: ManagedUser[] = data?.users ?? [];
  const callerIsSuperAdmin: boolean = data?.callerIsSuperAdmin ?? false;

  const assignableRoles = ALL_ROLES.filter(
    (r) => callerIsSuperAdmin || r !== UserRole.SUPER_ADMIN
  );

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-users"] });

  const mutate = (action: string, success: string) =>
    useMutation({
      mutationFn: (payload: Record<string, any>) => invoke(action, payload),
      onSuccess: () => { toast({ title: success }); refresh(); },
      onError: (e: any) => toast({ title: "Action failed", description: e.message, variant: "destructive" }),
    });

  const createM = mutate("create_user", "User created");
  const assignM = mutate("assign_role", "Role assigned");
  const revokeM = mutate("revoke_role", "Role revoked");
  const toggleM = useMutation({
    mutationFn: (u: ManagedUser) =>
      invoke(u.is_active ? "deactivate" : "activate", { user_id: u.id }),
    onSuccess: () => { toast({ title: "User updated" }); refresh(); },
    onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  if (!canAccess) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Only Admins can access user management.</p>
        </div>
      </div>
    );
  }

  const initials = (f?: string | null, l?: string | null) =>
    `${(f?.[0] ?? "").toUpperCase()}${(l?.[0] ?? "").toUpperCase()}` || "?";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users & Roles</h1>
            <p className="text-muted-foreground">
              Create users and assign roles
              {!callerIsSuperAdmin && " (Super Admin role is restricted)"}
            </p>
          </div>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="h-4 w-4 mr-2" />Add New User</Button>
          </DialogTrigger>
          <CreateUserDialog
            assignableRoles={assignableRoles}
            onSubmit={(payload) => createM.mutate(payload, { onSuccess: () => setCreateOpen(false) })}
            loading={createM.isPending}
          />
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Users ({users.length})</CardTitle>
              <CardDescription>Live data from authentication & role tables</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, department, role..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="h-5 w-5 animate-spin inline" />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{initials(u.first_name, u.last_name)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{u.first_name} {u.last_name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{u.email}</TableCell>
                    <TableCell className="text-sm">{u.department ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length === 0 ? (
                          <span className="text-xs text-muted-foreground">No roles</span>
                        ) : u.roles.map((r) => (
                          <Badge key={r} variant="secondary" className={roleBadgeClass(r)}>
                            {r.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.is_active ? "default" : "secondary"}>
                        {u.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Manage</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => { setAssignUser(u); setPendingRole(""); }}
                          >
                            <ShieldPlus className="h-4 w-4 mr-2" />Assign role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Revoke role
                          </DropdownMenuLabel>
                          {u.roles.filter((r) => callerIsSuperAdmin || r !== "SUPER_ADMIN").map((r) => (
                            <DropdownMenuItem
                              key={r}
                              onClick={() => revokeM.mutate({ user_id: u.id, role: r })}
                            >
                              <ShieldMinus className="h-4 w-4 mr-2" />{r.replace(/_/g, " ")}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleM.mutate(u)}>
                            {u.is_active ? (
                              <><UserX className="h-4 w-4 mr-2" />Deactivate</>
                            ) : (
                              <><UserCheck className="h-4 w-4 mr-2" />Activate</>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Assign role dialog */}
      <Dialog open={!!assignUser} onOpenChange={(o) => !o && setAssignUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign role</DialogTitle>
            <DialogDescription>
              {assignUser ? `${assignUser.first_name} ${assignUser.last_name} (${assignUser.email})` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={pendingRole} onValueChange={setPendingRole}>
              <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
              <SelectContent>
                {assignableRoles
                  .filter((r) => !assignUser?.roles.includes(r))
                  .map((r) => <SelectItem key={r} value={r}>{r.replace(/_/g, " ")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignUser(null)}>Cancel</Button>
            <Button
              disabled={!pendingRole || assignM.isPending}
              onClick={() => assignUser && assignM.mutate(
                { user_id: assignUser.id, role: pendingRole },
                { onSuccess: () => setAssignUser(null) }
              )}
            >
              {assignM.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CreateUserDialogProps {
  assignableRoles: UserRole[];
  onSubmit: (payload: any) => void;
  loading: boolean;
}

const CreateUserDialog = ({ assignableRoles, onSubmit, loading }: CreateUserDialogProps) => {
  const [form, setForm] = useState({
    email: "", password: "password123",
    first_name: "", last_name: "",
    department: "Administration", role: "STAFF",
  });
  const update = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create new user</DialogTitle>
        <DialogDescription>The user can sign in with the password you set here.</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>First name</Label>
          <Input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Last name</Label>
          <Input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label>Initial password</Label>
          <Input value={form.password} onChange={(e) => update("password", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Department</Label>
          <Input value={form.department} onChange={(e) => update("department", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <Select value={form.role} onValueChange={(v) => update("role", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {assignableRoles.map((r) => (
                <SelectItem key={r} value={r}>{r.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={loading || !form.email || !form.password || !form.first_name || !form.last_name}
          onClick={() => onSubmit(form)}
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Create user
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default UserManagement;
