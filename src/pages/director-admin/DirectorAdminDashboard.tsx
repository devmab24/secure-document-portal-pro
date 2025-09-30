import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DirectorAdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { title: "Board Documents", value: "56", icon: Shield, color: "text-purple-600" },
    { title: "Policy Documents", value: "89", icon: FileText, color: "text-blue-600" },
    { title: "Pending Approvals", value: "12", icon: Users, color: "text-yellow-600" },
    { title: "Compliance Reports", value: "24", icon: TrendingUp, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Director of Administration Dashboard</h1>
        <p className="text-muted-foreground">High-level administrative oversight and board management</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="board" className="space-y-4">
        <TabsList>
          <TabsTrigger value="board">Board Management</TabsTrigger>
          <TabsTrigger value="policies">Policy Documents</TabsTrigger>
          <TabsTrigger value="departments">Department Oversight</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Board of Management</CardTitle>
              <CardDescription>Confidential board correspondence and strategic planning documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Button onClick={() => navigate("/dashboard/director-admin/board/new")} className="w-full">
                  New Board Document
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/director-admin/board/minutes")} className="w-full">
                  Meeting Minutes
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/director-admin/board/strategic")} className="w-full">
                  Strategic Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Administrative Policies</CardTitle>
              <CardDescription>Policy creation, version tracking, and approval management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button onClick={() => navigate("/dashboard/director-admin/policies/new")}>
                  Create New Policy
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/director-admin/policies/review")}>
                  Review Draft Policies
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Non-Clinical Department Management</CardTitle>
              <CardDescription>HR, procurement, logistics, and administrative operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" onClick={() => navigate("/dashboard/director-admin/departments/hr")}>
                  Human Resources
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/director-admin/departments/procurement")}>
                  Procurement
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/director-admin/departments/logistics")}>
                  Logistics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance</CardTitle>
              <CardDescription>Legal, audit, and compliance documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button onClick={() => navigate("/dashboard/director-admin/compliance/audits")}>
                  Audit Reports
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/director-admin/compliance/regulatory")}>
                  Regulatory Filings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DirectorAdminDashboard;
