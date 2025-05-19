
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Department, DocumentStatus, UserRole } from "@/lib/types";
import { mockDocuments } from "@/lib/mock";
import { Archive, File, FileCheck, FileX, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import RecentDocumentsTable from "@/components/RecentDocumentsTable";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  // Filter documents based on user role and department
  const userDocuments = mockDocuments.filter(doc => {
    if (user.role === UserRole.CMD || user.role === UserRole.ADMIN) {
      // CMD and Admin can see all documents
      return true;
    } else if (user.role === UserRole.HOD) {
      // HOD can see documents from their department and documents assigned to them
      return (
        doc.department === user.department ||
        doc.assignedTo?.includes(user.id) ||
        doc.uploadedBy === user.id
      );
    } else {
      // Staff can only see documents they uploaded, documents from their department that were approved,
      // or documents specifically assigned to them
      return (
        doc.uploadedBy === user.id ||
        (doc.department === user.department && doc.status === DocumentStatus.APPROVED) ||
        doc.assignedTo?.includes(user.id)
      );
    }
  });
  
  // Calculate metrics
  const totalDocuments = userDocuments.length;
  const pendingApprovals = userDocuments.filter(
    doc => doc.status === DocumentStatus.SUBMITTED || doc.status === DocumentStatus.UNDER_REVIEW
  ).length;
  const approved = userDocuments.filter(doc => doc.status === DocumentStatus.APPROVED).length;
  const rejected = userDocuments.filter(doc => doc.status === DocumentStatus.REJECTED).length;
  
  // Get documents by department
  const departmentCounts = Object.values(Department).reduce((acc, dept) => {
    acc[dept] = userDocuments.filter(doc => doc.department === dept).length;
    return acc;
  }, {} as Record<Department, number>);
  
  // Get the top 5 departments
  const topDepartments = Object.entries(departmentCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);
  
  // Recent documents - last 5
  const recentDocuments = [...userDocuments]
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    .slice(0, 5);
  
  // Documents waiting for user's approval
  const documentsNeedingMyApproval = userDocuments.filter(
    doc => doc.currentApprover === user.id
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-hospital-600 to-hospital-700">
        <CardContent className="p-6 text-white">
          <h2 className="text-2xl font-semibold">Welcome back, {user.firstName} 👋</h2>
          <p className="mt-2 text-hospital-100">
            {user.role === UserRole.CMD && "You have access to all documents and approvals."}
            {user.role === UserRole.HOD && `You have HOD access to ${user.department} department documents.`}
            {user.role === UserRole.STAFF && `You can view and upload documents for the ${user.department} department.`}
          </p>
          {pendingApprovals > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                {pendingApprovals} {pendingApprovals === 1 ? 'document' : 'documents'} pending approval
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Accessible documents
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
      
      {/* Top Departments */}
      <Card>
        <CardHeader>
          <CardTitle>Documents by Department</CardTitle>
          <CardDescription>
            Distribution of documents across hospital departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topDepartments.map(([dept, count]) => {
              // Calculate percentage
              const percentage = Math.round((count / totalDocuments) * 100);
              
              return (
                <div key={dept} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{dept}</div>
                    <div className="text-sm text-muted-foreground">{count} documents</div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Tabbed Recent/My Activity */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Documents</TabsTrigger>
          <TabsTrigger value="approval">
            Needs Your Approval {documentsNeedingMyApproval.length > 0 && (
              <Badge className="ml-2 bg-hospital-600" variant="secondary">{documentsNeedingMyApproval.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recently Updated Documents</CardTitle>
              <CardDescription>
                The most recently modified documents you have access to
              </CardDescription>
            </CardHeader>
            <RecentDocumentsTable documents={recentDocuments} onRowClick={(id) => navigate(`/documents/${id}`)} />
          </Card>
        </TabsContent>
        <TabsContent value="approval">
          <Card>
            <CardHeader>
              <CardTitle>Documents Awaiting Your Approval</CardTitle>
              <CardDescription>
                Documents that require your review and approval
              </CardDescription>
            </CardHeader>
            {documentsNeedingMyApproval.length > 0 ? (
              <RecentDocumentsTable 
                documents={documentsNeedingMyApproval} 
                onRowClick={(id) => navigate(`/documents/${id}`)}
              />
            ) : (
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Archive className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                  <h3 className="text-lg font-medium">No documents need your approval</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    When documents are assigned to you for approval, they will appear here.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
