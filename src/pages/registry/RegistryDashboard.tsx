import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, Archive, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const RegistryDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { title: "Active Patient Records", value: "1,234", icon: FileText, color: "text-blue-600" },
    { title: "Pending Registrations", value: "45", icon: Users, color: "text-yellow-600" },
    { title: "Archived Records", value: "8,567", icon: Archive, color: "text-green-600" },
    { title: "Pending Disposal", value: "23", icon: AlertCircle, color: "text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Registry Dashboard</h1>
        <p className="text-muted-foreground">Patient records management and administrative correspondence</p>
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

      <Tabs defaultValue="patient-records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patient-records">Patient Records</TabsTrigger>
          <TabsTrigger value="correspondence">Correspondence</TabsTrigger>
          <TabsTrigger value="archival">Archival & Disposal</TabsTrigger>
          <TabsTrigger value="audit-trail">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="patient-records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Records Management</CardTitle>
              <CardDescription>Manage patient health records, discharge summaries, and referral letters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Button onClick={() => navigate("/dashboard/registry/records/new")} className="w-full">
                  New Patient Record
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/registry/records/search")} className="w-full">
                  Search Records
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/registry/records/discharge")} className="w-full">
                  Discharge Summaries
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correspondence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Correspondence</CardTitle>
              <CardDescription>Track mail, parcels, and documents for the hospital</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/dashboard/registry/correspondence/new")}>
                Log New Correspondence
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archival" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Archival & Disposal Management</CardTitle>
              <CardDescription>Manage retention schedules and disposal authorizations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" onClick={() => navigate("/dashboard/registry/archival/pending")}>
                  View Pending Archival
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/registry/archival/disposal")}>
                  Disposal Requests
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-trail" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Audit Trail</CardTitle>
              <CardDescription>Track file movement and access logs</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/dashboard/registry/audit")}>
                View Audit Logs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegistryDashboard;
