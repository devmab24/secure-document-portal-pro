
import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import { Department, DocumentStatus, UserRole } from "@/lib/types";
import { mockDocuments } from "@/lib/mock";
import { useAuth } from "@/contexts/AuthContext";

const DepartmentCharts = () => {
  const { user } = useAuth();
  const isCmd = user?.role === UserRole.CMD;
  const isHod = user?.role === UserRole.HOD;

  // Only show charts for CMD or HOD
  if (!isCmd && !isHod) {
    return null;
  }

  // Prepare department data for CMD view (all departments)
  // Or HOD view (only their department)
  const departmentsToShow = isCmd 
    ? Object.values(Department) 
    : user?.department ? [user.department] : [];

  // Calculate data for status distribution chart (by department)
  const statusDistribution = useMemo(() => {
    const data = departmentsToShow.map(dept => {
      const deptDocs = mockDocuments.filter(doc => doc.department === dept);
      const draft = deptDocs.filter(doc => doc.status === DocumentStatus.DRAFT).length;
      const submitted = deptDocs.filter(doc => doc.status === DocumentStatus.SUBMITTED).length;
      const underReview = deptDocs.filter(doc => doc.status === DocumentStatus.UNDER_REVIEW).length;
      const approved = deptDocs.filter(doc => doc.status === DocumentStatus.APPROVED).length;
      const rejected = deptDocs.filter(doc => doc.status === DocumentStatus.REJECTED).length;
      
      return {
        department: dept,
        Draft: draft,
        Submitted: submitted,
        "Under Review": underReview,
        Approved: approved,
        Rejected: rejected,
        total: deptDocs.length
      };
    });
    
    return data;
  }, [departmentsToShow]);

  // Data for department document count pie chart
  const departmentDistribution = useMemo(() => {
    return departmentsToShow.map(dept => {
      const count = mockDocuments.filter(doc => doc.department === dept).length;
      return {
        name: dept,
        value: count
      };
    }).filter(item => item.value > 0);
  }, [departmentsToShow]);

  // Generate colors for each department
  const COLORS = ['#9b87f5', '#7E69AB', '#1EAEDB', '#F2FCE2', '#ea384c', '#8E9196'];

  const formatDepartmentName = (name: string) => {
    if (name.length > 10) {
      return name.slice(0, 10) + '...';
    }
    return name;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight mb-4">Department Analytics</h2>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Document Status by Department */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Document Status Distribution</CardTitle>
            <CardDescription>
              Status of documents across {isCmd ? "all departments" : "your department"}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              config={{
                Draft: { color: "#8E9196" },
                Submitted: { color: "#9b87f5" },
                "Under Review": { color: "#1EAEDB" },
                Approved: { color: "#F2FCE2" },
                Rejected: { color: "#ea384c" },
              }}
            >
              <BarChart
                data={statusDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <XAxis 
                  dataKey="department" 
                  angle={-45} 
                  textAnchor="end"
                  tickFormatter={formatDepartmentName}
                  height={70}
                />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="Draft" stackId="a" fill="#8E9196" />
                <Bar dataKey="Submitted" stackId="a" fill="#9b87f5" />
                <Bar dataKey="Under Review" stackId="a" fill="#1EAEDB" />
                <Bar dataKey="Approved" stackId="a" fill="#F2FCE2" />
                <Bar dataKey="Rejected" stackId="a" fill="#ea384c" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Department Distribution Pie Chart - Only show for CMD */}
        {isCmd && (
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Document Distribution</CardTitle>
              <CardDescription>
                Distribution of documents across departments
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer config={{}}>
                <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <Pie
                    data={departmentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DepartmentCharts;
