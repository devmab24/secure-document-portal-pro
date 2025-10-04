import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, FileText, Package, AlertCircle, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ChiefProcurementDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chief Procurement Officer Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage hospital-wide procurement, vendor relationships, and compliance for FMC Jalingo
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requisitions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              From 8 departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              12 expiring this quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              8 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦38.2M</div>
            <p className="text-xs text-muted-foreground">
              85% of monthly budget
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Requisitions</CardTitle>
            <CardDescription>Requests from departments requiring action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Medical Supplies - Radiology</p>
                  <p className="text-sm text-muted-foreground">DR-2024-0156 • ₦2.8M</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                Budget Approval Pending
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Surgical Equipment - Theatre</p>
                  <p className="text-sm text-muted-foreground">DR-2024-0148 • ₦5.2M</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                Vendor Selection
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">IT Equipment - IT Department</p>
                  <p className="text-sm text-muted-foreground">DR-2024-0143 • ₦3.5M</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Approved
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Pharmaceuticals - Pharmacy</p>
                  <p className="text-sm text-muted-foreground">DR-2024-0139 • ₦8.9M</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                Urgent
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval Workflows</CardTitle>
            <CardDescription>Items requiring senior management approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Annual Procurement Plan 2025</p>
                  <p className="text-sm text-muted-foreground">Awaiting CMD Approval</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Contract Award - Lab Equipment</p>
                  <p className="text-sm text-muted-foreground">₦15M • Due Process Required</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                With Finance
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Budget Variance Report Q4</p>
                  <p className="text-sm text-muted-foreground">For Chief Accountant Review</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                Draft
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Purchase Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Department Purchase Activity</CardTitle>
          <CardDescription>Current month procurement by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { dept: "Pharmacy", requests: 18, value: "₦8.5M", status: "85% processed" },
              { dept: "Radiology", requests: 12, value: "₦6.2M", status: "90% processed" },
              { dept: "A&E", requests: 9, value: "₦4.8M", status: "75% processed" },
              { dept: "IT", requests: 7, value: "₦3.5M", status: "100% processed" },
              { dept: "Laboratory", requests: 15, value: "₦7.2M", status: "60% processed" },
              { dept: "Antenatal", requests: 5, value: "₦2.1M", status: "80% processed" },
            ].map((item) => (
              <div key={item.dept} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className="font-medium min-w-[120px]">{item.dept}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.requests} requests • {item.value}
                  </div>
                </div>
                <div className="text-sm font-medium text-primary">{item.status}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Compliance & Due Process */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Compliance Status</CardTitle>
            <CardDescription>Vendor registration and documentation status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Fully Compliant</span>
              </div>
              <span className="text-sm font-bold">142 vendors</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Pending Documents</span>
              </div>
              <span className="text-sm font-bold">8 vendors</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Expiring Certificates</span>
              </div>
              <span className="text-sm font-bold">6 vendors</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Due Process Tracking</CardTitle>
            <CardDescription>Compliance with procurement regulations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Certificates Issued</span>
              </div>
              <span className="text-sm font-bold">23 this month</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Awaiting Approval</span>
              </div>
              <span className="text-sm font-bold">5 requests</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Compliance Rate</span>
              </div>
              <span className="text-sm font-bold">98.5%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChiefProcurementDashboard;
