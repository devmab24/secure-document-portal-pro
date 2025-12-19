import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FolderHeart, 
  FileText, 
  Upload,
  Activity,
  UserCog,
  Settings,
  PenTool,
  Shield,
  Send,
  Building2,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import DepartmentUnitsCard from "@/components/DepartmentUnitsCard";

const HodDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCog className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">HOD Dashboard</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Department management panel</p>
              <Badge variant="secondary">Head of Department</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Digital Signing
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Signature Feature Highlight */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-400">
            <PenTool className="h-5 w-5" />
            Digital Signature Authority
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-500">
            As an HOD, you can digitally sign documents for approval, rejection, or acknowledgment. 
            Once signed, documents are locked to ensure integrity and authenticity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-green-700 border-green-300 dark:text-green-400 dark:border-green-700">
              Remote Approval
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-300 dark:text-green-400 dark:border-green-700">
              Document Locking
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-300 dark:text-green-400 dark:border-green-700">
              Audit Trail
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-300 dark:text-green-400 dark:border-green-700">
              Legal Compliance
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Documents awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department Documents</CardTitle>
            <FolderHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">Total documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Actions this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Units Section */}
      <DepartmentUnitsCard showViewAll={true} maxUnits={3} />

      {/* HOD Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Unit Management
            </CardTitle>
            <CardDescription>
              Manage sub-units and delegate tasks to unit heads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/dashboard/hod/units">
                <Building2 className="h-4 w-4 mr-2" />
                View All Units
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/hod/staffs">
                <Users className="h-4 w-4 mr-2" />
                View Department Staff
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Digital Signing & Approvals
            </CardTitle>
            <CardDescription>
              Review and digitally sign department documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link to="/dashboard/documents">
                <PenTool className="h-4 w-4 mr-2" />
                Sign Documents
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/hod/approvals">
                <FileText className="h-4 w-4 mr-2" />
                Pending Approvals
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload & Share
            </CardTitle>
            <CardDescription>
              Upload new documents and files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/dashboard/hod/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Document Submissions
            </CardTitle>
            <CardDescription>
              Send documents to CMD for approval and track status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/dashboard/hod/submissions">
                <Send className="h-4 w-4 mr-2" />
                Submit to CMD
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/hod/documents">
                <FileText className="h-4 w-4 mr-2" />
                View Submissions
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HodDashboard;
