import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Shield, 
  Database, 
  Settings, 
  Activity,
  UserCog,
  Lock,
  Eye,
  Building2,
  FolderTree,
  LayoutGrid,
  List,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { Link } from "react-router-dom";
import { ADMIN_UNITS, getTotalSubUnitsCount } from "@/lib/admin-units";
import AdminUnitCard from "@/components/AdminUnitCard";
import { useState } from "react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const totalSubUnits = getTotalSubUnitsCount();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Administrative Department</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Department units and workflow management</p>
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
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ADMIN_UNITS.length}</div>
            <p className="text-xs text-muted-foreground">Administrative units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sub-Units</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubUnits}</div>
            <p className="text-xs text-muted-foreground">Across all units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Department personnel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="units" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="units" className="gap-2">
              <FolderTree className="h-4 w-4" />
              Department Units
            </TabsTrigger>
            <TabsTrigger value="actions" className="gap-2">
              <Settings className="h-4 w-4" />
              Quick Actions
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Units Tab */}
        <TabsContent value="units" className="space-y-4">
          <div
            className={
              viewMode === "grid"
                ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {ADMIN_UNITS.map((unit) => (
              <AdminUnitCard
                key={unit.id}
                unit={unit}
                isCompact={viewMode === "grid"}
              />
            ))}
          </div>
        </TabsContent>

        {/* Quick Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* User Management - Super Admin Only */}
            {isSuperAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage user accounts and roles
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
                    Monitor system performance and activity
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

            {/* Document Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Document Management
                </CardTitle>
                <CardDescription>
                  Manage department documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/admin/documents">
                    <Database className="h-4 w-4 mr-2" />
                    View Documents
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/admin/uploads">
                    <Database className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
                <CardDescription>
                  Configure preferences
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
        </TabsContent>
      </Tabs>

      {/* Role-specific Notice */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">
                Administrative Department Structure
              </h3>
              <p className="text-sm text-muted-foreground">
                This dashboard displays all {ADMIN_UNITS.length} units and {totalSubUnits} sub-units 
                under the Administrative Department. Each unit supports role-based access control, 
                document routing, and approval workflows.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
