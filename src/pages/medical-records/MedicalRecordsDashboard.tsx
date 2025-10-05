import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FolderOpen, Shield, AlertCircle, TrendingUp, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MedicalRecordsDashboard = () => {
  const stats = [
    {
      title: "Active Patient Records",
      value: "12,847",
      icon: FolderOpen,
      trend: "+234 this month",
      color: "text-blue-600",
    },
    {
      title: "Pending Documentation",
      value: "156",
      icon: FileText,
      trend: "28 urgent",
      color: "text-orange-600",
    },
    {
      title: "Compliance Rate",
      value: "98.5%",
      icon: Shield,
      trend: "+2.3% from last month",
      color: "text-green-600",
    },
    {
      title: "Records Due for Review",
      value: "89",
      icon: AlertCircle,
      trend: "Action required",
      color: "text-red-600",
    },
  ];

  const recentActivities = [
    {
      title: "Discharge Summary Review",
      department: "Surgery Department",
      time: "15 minutes ago",
      status: "pending",
    },
    {
      title: "Patient Record Request",
      department: "Radiology",
      time: "1 hour ago",
      status: "approved",
    },
    {
      title: "Clinical Documentation Audit",
      department: "Emergency",
      time: "2 hours ago",
      status: "completed",
    },
    {
      title: "Record Retention Request",
      department: "Registry",
      time: "3 hours ago",
      status: "processing",
    },
  ];

  const complianceChecks = [
    { item: "Patient Consent Forms", status: "complete", percentage: 100 },
    { item: "Clinical Documentation", status: "complete", percentage: 98 },
    { item: "Record Retention Schedule", status: "warning", percentage: 85 },
    { item: "Privacy Compliance", status: "complete", percentage: 100 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medical Records Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Health Information Management & Clinical Documentation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Archive className="mr-2 h-4 w-4" />
            Archive Records
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Record
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest medical records activities and requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.department}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "completed"
                        ? "default"
                        : activity.status === "approved"
                        ? "default"
                        : activity.status === "pending"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Checks</CardTitle>
            <CardDescription>Current compliance status across key areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceChecks.map((check, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{check.item}</span>
                    <span className="text-sm text-muted-foreground">{check.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        check.status === "complete"
                          ? "bg-green-600"
                          : check.status === "warning"
                          ? "bg-orange-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${check.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <FolderOpen className="h-6 w-6" />
              <span className="text-sm">Access Patient Record</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Clinical Documentation</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <Shield className="h-6 w-6" />
              <span className="text-sm">Compliance Audit</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalRecordsDashboard;
