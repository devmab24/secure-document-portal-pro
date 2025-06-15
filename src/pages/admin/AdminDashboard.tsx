
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Shield, 
  Database, 
  Settings, 
  Activity,
  UserCog,
  Lock,
  Eye,
  FolderHeart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Administrative control panel</p>
              <Badge variant={isSuperAdmin ? "destructive" : "secondary"}>
                {isSuperAdmin ? "Super Admin" : "Admin"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Management - Super Admin Only */}
        {isSuperAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Create, update, and manage user accounts and roles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/dashboard/super-admin/users/management">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard/super-admin/users/roles">
                  <Lock className="h-4 w-4 mr-2" />
                  Role Management
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* System Monitoring - Super Admin Only */}
        {isSuperAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Monitoring
              </CardTitle>
              <CardDescription>
                Monitor system performance and user activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard/super-admin/audits">
                  <Eye className="h-4 w-4 mr-2" />
                  View Audit Logs
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard/super-admin/reports">
                  <Database className="h-4 w-4 mr-2" />
                  System Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* System Configuration - Super Admin Only */}
        {isSuperAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard/admin/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  General Settings
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard/super-admin/systems">
                  <Shield className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions - Super Admin Only */}
        {isSuperAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard/super-admin/users/management">
                  <Users className="h-4 w-4 mr-2" />
                  View All Users
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard/admin/documents">
                  <Database className="h-4 w-4 mr-2" />
                  Document Management
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Admin-specific actions for regular Admin users */}
        {!isSuperAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Administrative Actions</CardTitle>
              <CardDescription>
                Administrative department management tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard/admin/documents">
                  <Database className="h-4 w-4 mr-2" />
                  Document Management
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard/admin/department">
                  <FolderHeart className="h-4 w-4 mr-2" />
                  Administrative Unit
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Settings - Available to all Admin users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>
              Configure your account and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/admin/settings">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Role-specific Notice */}
      <Card className={isSuperAdmin ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50"}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Shield className={`h-5 w-5 ${isSuperAdmin ? "text-red-600" : "text-blue-600"}`} />
            <div>
              <h3 className={`font-semibold ${isSuperAdmin ? "text-red-900" : "text-blue-900"}`}>
                {isSuperAdmin ? "Super Administrator Access" : "Administrator Access"}
              </h3>
              <p className={`text-sm ${isSuperAdmin ? "text-red-700" : "text-blue-700"}`}>
                {isSuperAdmin 
                  ? "You have full administrative privileges including user management and system configuration."
                  : "You have administrative access to the administrative department. Contact a Super Admin for system-wide changes."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
