import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/hooks/useDashboard";
import { useDocuments } from "@/hooks/useDocuments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Department, DocumentStatus, UserRole } from "@/lib/types";
import { FolderHeart, FileCheck, FileX, Upload, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RecentDocumentsTable from "@/components/RecentDocumentsTable";
import DepartmentCharts from "@/components/DepartmentCharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { convertMockDocumentToDocument } from "@/lib/utils/documentConverter";
import { RoleSwitcher } from "@/components/RoleSwitcher";

const CmdDashboard = () => {
  const { departmentSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats, loading, loadStats, selectDepartment } = useDashboard();
  const { documents: rawDocuments, loadDocuments } = useDocuments();
  
  // Convert MockDocument[] to Document[]
  const documents = rawDocuments.map(convertMockDocumentToDocument);
  
  // Check if user has CMD access
  useEffect(() => {
    if (user && user.role !== UserRole.CMD && user.role !== UserRole.ADMIN) {
      // Redirect non-CMD users to their regular dashboard
      navigate("/");
    }
  }, [user, navigate]);
  
  // Load data based on selected department
  useEffect(() => {
    if (user) {
      // If department slug is provided, select that department
      if (departmentSlug) {
        const departmentName = departmentSlug
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
          
        // Convert to department enum
        const departmentValues = Object.values(Department);
        const selectedDept = departmentValues.find(dept => 
          dept.toLowerCase() === departmentName.toLowerCase() ||
          dept.replace(/\s+/g, '-').toLowerCase() === departmentSlug
        );
        
        if (selectedDept) {
          selectDepartment(selectedDept);
          loadDocuments({ department: selectedDept });
        }
      } else {
        // Load all departments data for CMD overview
        selectDepartment(null);
        loadStats();
        loadDocuments({});
      }
    }
  }, [user, departmentSlug, loadStats, loadDocuments, selectDepartment]);
  
  if (!user || (user.role !== UserRole.CMD && user.role !== UserRole.ADMIN)) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6 flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-16 w-16 text-destructive opacity-80 mb-4" />
          <h2 className="text-xl font-semibold text-center">Access Denied</h2>
          <p className="mt-2 text-muted-foreground text-center">
            This dashboard is restricted to Chief Medical Director access only.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }
  
  // Calculate metrics from Redux state
  const totalDocuments = stats?.totalDocuments || 0;
  const pendingApprovals = (stats?.byStatus[DocumentStatus.SUBMITTED] || 0) + 
                          (stats?.byStatus[DocumentStatus.UNDER_REVIEW] || 0);
  const approved = stats?.byStatus[DocumentStatus.APPROVED] || 0;
  const rejected = stats?.byStatus[DocumentStatus.REJECTED] || 0;
  
  // Get the departments data
  const departmentsData = stats?.byDepartment 
    ? Object.entries(stats.byDepartment)
        .sort(([, countA], [, countB]) => countB - countA)
    : [];
  
  // Documents that need CMD approval
  const documentsNeedingCmdApproval = documents.filter(
    doc => doc.currentApprover === user.id
  );
  
  // Recent documents across all departments or selected department
  const recentDocuments = [...documents]
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    .slice(0, 10);

  // Handle department selection change
  const handleDepartmentChange = (value: string) => {
    if (value === "all") {
      navigate("/dashboard/cmd");
    } else {
      navigate(`/dashboard/cmd/${value}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">CMD Dashboard</h1>
        
        {/* Department selector */}
        <Select 
          onValueChange={handleDepartmentChange}
          defaultValue={departmentSlug || "all"}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {Object.values(Department).map((dept) => (
              <SelectItem 
                key={dept} 
                value={dept.toLowerCase().replace(/\s+/g, '-')}
              >
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FolderHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {departmentSlug ? "Department documents" : "Across all departments"}
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
      
      {/* Charts section */}
      <DepartmentCharts />
      
      {/* Departments Overview - Only shown when viewing all departments */}
      {!departmentSlug && (
        <Card>
          <CardHeader>
            <CardTitle>Department Document Distribution</CardTitle>
            <CardDescription>
              Breakdown of documents across hospital departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentsData.map(([dept, count]) => {
                // Calculate percentage
                const percentage = totalDocuments > 0 ? Math.round((count / totalDocuments) * 100) : 0;
                
                return (
                  <div 
                    key={dept} 
                    className="space-y-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md"
                    onClick={() => navigate(`/dashboard/cmd/${dept.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{dept}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">{count} documents</div>
                        <Badge variant="outline">{percentage}%</Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Tabbed Recent/Approvals */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Documents</TabsTrigger>
          <TabsTrigger value="approval">
            Needs Your Approval {documentsNeedingCmdApproval.length > 0 && (
              <Badge className="ml-2 bg-hospital-600" variant="secondary">{documentsNeedingCmdApproval.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>
                {departmentSlug ? "Recent Department Documents" : "Recent Documents Across All Departments"}
              </CardTitle>
              <CardDescription>
                The most recently modified documents
              </CardDescription>
            </CardHeader>
            <RecentDocumentsTable 
              documents={recentDocuments} 
              onRowClick={(id) => navigate(`/documents/${id}`)} 
            />
          </Card>
        </TabsContent>
        <TabsContent value="approval">
          <Card>
            <CardHeader>
              <CardTitle>Documents Awaiting Your Approval</CardTitle>
              <CardDescription>
                Documents that require the CMD's review and approval
              </CardDescription>
            </CardHeader>
            {documentsNeedingCmdApproval.length > 0 ? (
              <RecentDocumentsTable 
                documents={documentsNeedingCmdApproval} 
                onRowClick={(id) => navigate(`/documents/${id}`)}
              />
            ) : (
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileCheck className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
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
      <RoleSwitcher />
    </div>
  );
};

export default CmdDashboard;
