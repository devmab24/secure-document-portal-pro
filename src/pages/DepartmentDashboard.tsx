
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockDocuments } from "@/lib/mock";
import { Department, DocumentStatus, UserRole } from "@/lib/types";
import { Activity, Backpack, FileCheck, FileX, Upload } from "lucide-react";
import { useMemo } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import DepartmentCharts from "@/components/DepartmentCharts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DepartmentDashboard = () => {
  const { departmentSlug } = useParams<{ departmentSlug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Convert slug back to department name
  const departmentName = departmentSlug ? 
    departmentSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';
  
  // Find matching department from enum
  const getDepartmentFromName = (name: string): Department | undefined => {
    const departmentValues = Object.values(Department);
    return departmentValues.find(dept => 
      dept.toLowerCase() === name.toLowerCase() || 
      dept.replace(/\s+/g, '-').toLowerCase() === departmentSlug
    );
  };
  
  const currentDepartment = getDepartmentFromName(departmentName);
  
  // Check access permissions
  const hasAccess = useMemo(() => {
    if (!user || !currentDepartment) return false;
    
    if (user.role === UserRole.CMD || user.role === UserRole.ADMIN) {
      return true; // Full access
    } else if (user.department === currentDepartment) {
      return true; // Access to own department
    }
    return false;
  }, [user, currentDepartment]);
  
  // Get department documents
  const departmentDocuments = useMemo(() => {
    if (!currentDepartment) return [];
    
    return mockDocuments.filter(doc => {
      if (doc.department !== currentDepartment) return false;
      
      // Filter based on role
      if (user?.role === UserRole.CMD || user?.role === UserRole.ADMIN || user?.role === UserRole.HOD) {
        return true; // Full access to department documents
      } else if (user?.role === UserRole.STAFF) {
        // Staff can only see approved documents or ones they uploaded
        return doc.status === DocumentStatus.APPROVED || doc.uploadedBy === user.id;
      }
      return false;
    });
  }, [currentDepartment, user]);
  
  // Calculate department stats
  const totalDocuments = departmentDocuments.length;
  const pendingApprovals = departmentDocuments.filter(
    doc => doc.status === DocumentStatus.SUBMITTED || doc.status === DocumentStatus.UNDER_REVIEW
  ).length;
  const approved = departmentDocuments.filter(doc => doc.status === DocumentStatus.APPROVED).length;
  const rejected = departmentDocuments.filter(doc => doc.status === DocumentStatus.REJECTED).length;
  
  // Recent documents - latest 5
  const recentDocuments = [...departmentDocuments]
    .sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
    .slice(0, 5);
  
  // Documents awaiting HOD approval
  const documentsAwaitingHodApproval = departmentDocuments.filter(
    doc => user && doc.currentApprover === user.id
  );
    
  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{currentDepartment || "Department"}</h1>
        </div>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center h-64">
            <FileX className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
            <h2 className="text-xl font-semibold text-center">Access Denied</h2>
            <p className="mt-2 text-muted-foreground text-center">
              You do not have permission to access this department's dashboard.
            </p>
             <Button asChild variant="outline" className="w-full bg-color-blue">
                <Link to="/dashboard/staff">
                  <Backpack className="h-4 w-4 mr-2" />
                  Go Back
                </Link>
              </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Check if user is CMD or HOD for showing charts
  const showCharts = user?.role === UserRole.CMD || user?.role === UserRole.HOD;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{currentDepartment} Dashboard</h1>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Department documents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingApprovals === 1 ? 'Document' : 'Documents'} awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approved}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Finalized documents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <FileX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejected}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Documents needing revision
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts section - Only shown for CMD or HOD */}
      {showCharts && <DepartmentCharts />}
      
      {/* Department content tabs */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Documents</TabsTrigger>
          
          {/* Conditional tab for HOD */}
          {user && (user.role === UserRole.HOD || user.role === UserRole.CMD) && (
            <TabsTrigger value="approvals">
              Pending Approvals {documentsAwaitingHodApproval.length > 0 && (
                <Badge className="ml-2 bg-hospital-600" variant="secondary">{documentsAwaitingHodApproval.length}</Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>
        
        {/* Recent documents tab */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Department Documents</CardTitle>
              <CardDescription>
                The most recently updated {currentDepartment} documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Modified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDocuments.length > 0 ? (
                    recentDocuments.map((doc) => (
                      <TableRow 
                        key={doc.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/documents/${doc.id}`)}
                      >
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>
                          <Badge variant={doc.status === DocumentStatus.APPROVED ? "outline" : 
                                        doc.status === DocumentStatus.REJECTED ? "destructive" : "default"}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(doc.modifiedAt, "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No recent documents found for this department.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Conditional HOD approval tab */}
        {user && (user.role === UserRole.HOD || user.role === UserRole.CMD) && (
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Documents Awaiting Your Approval</CardTitle>
                <CardDescription>
                  {currentDepartment} documents that require your review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Submitted On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentsAwaitingHodApproval.length > 0 ? (
                      documentsAwaitingHodApproval.map((doc) => (
                        <TableRow 
                          key={doc.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => navigate(`/documents/${doc.id}`)}
                        >
                          <TableCell className="font-medium">{doc.name}</TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>
                            {mockDocuments.find(d => d.id === doc.id)?.uploadedBy || "Unknown"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(doc.uploadedAt, "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No documents are currently awaiting your approval.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DepartmentDashboard;
