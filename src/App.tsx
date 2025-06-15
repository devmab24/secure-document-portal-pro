
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import CmdProtectedRoute from "@/components/CmdProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import SuperAdminProtectedRoute from "@/components/SuperAdminProtectedRoute";
import HodProtectedRoute from "@/components/HodProtectedRoute";
import StaffProtectedRoute from "@/components/StaffProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Documents from "@/pages/Documents";
import DocumentView from "@/pages/DocumentView";
import DepartmentDashboard from "@/pages/DepartmentDashboard";
import Upload from "@/pages/Upload";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";
import AuditLogs from "@/pages/AuditLogs";
import NotFound from "@/pages/NotFound";
import CmdDashboard from "@/pages/CmdDashboard";
import CmdUpload from "@/pages/cmd/CmdUpload";
import CmdDocuments from "@/pages/cmd/CmdDocuments";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import HodDashboard from "@/pages/hod/HodDashboard";
import SuperAdminDashboard from "@/pages/super-admin/SuperAdminDashboard";
import StaffDashboard from "@/pages/staff/StaffDashboard";

function App() {
  console.log("App rendering");
  
  return (
    <ReduxProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Main dashboard route - redirects to role-specific dashboard */}
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<Dashboard />} />
              </Route>
              
              {/* CMD specific routes - All under /dashboard/cmd */}
              <Route path="/dashboard/cmd" element={<CmdProtectedRoute />}>
                <Route index element={<CmdDashboard />} />
                <Route path="departments" element={<CmdDashboard />} />
                <Route path="uploads" element={<CmdUpload />} />
                <Route path="documents" element={<CmdDocuments />} />
                <Route path="approvals" element={<CmdDashboard />} />
                <Route path="audits" element={<AuditLogs />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/profiles" element={<Settings />} />
                <Route path="settings/notifications" element={<Settings />} />
                <Route path="settings/accounts" element={<Settings />} />
                <Route path=":departmentSlug" element={<CmdDashboard />} />
              </Route>
              
              {/* HOD specific routes - All under /dashboard/hod */}
              <Route path="/dashboard/hod" element={<HodProtectedRoute />}>
                <Route index element={<HodDashboard />} />
                <Route path="department" element={<DepartmentDashboard />} />
                <Route path="uploads" element={<Upload />} />
                <Route path="documents" element={<Documents />} />
                <Route path="approvals" element={<DepartmentDashboard />} />
                <Route path="staff" element={<Users />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/profiles" element={<Settings />} />
                <Route path="settings/notifications" element={<Settings />} />
                <Route path="settings/accounts" element={<Settings />} />
              </Route>
              
              {/* Admin specific routes - All under /dashboard/admin */}
              <Route path="/dashboard/admin" element={<AdminProtectedRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="department" element={<DepartmentDashboard />} />
                <Route path="uploads" element={<Upload />} />
                <Route path="documents" element={<Documents />} />
                <Route path="approvals" element={<DepartmentDashboard />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/profiles" element={<Settings />} />
                <Route path="settings/notifications" element={<Settings />} />
                <Route path="settings/accounts" element={<Settings />} />
              </Route>
              
              {/* Super Admin specific routes - All under /dashboard/super-admin */}
              <Route path="/dashboard/super-admin" element={<SuperAdminProtectedRoute />}>
                <Route index element={<SuperAdminDashboard />} />
                <Route path="documents" element={<Documents />} />
                <Route path="systems" element={<SuperAdminDashboard />} />
                <Route path="uploads" element={<Upload />} />
                <Route path="reports" element={<SuperAdminDashboard />} />
                <Route path="users/management" element={<UserManagement />} />
                <Route path="users/roles" element={<UserManagement />} />
                <Route path="audits" element={<AuditLogs />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/profiles" element={<Settings />} />
                <Route path="settings/notifications" element={<Settings />} />
                <Route path="settings/accounts" element={<Settings />} />
              </Route>
              
              {/* Staff specific routes - All under /dashboard/staff */}
              <Route path="/dashboard/staff" element={<StaffProtectedRoute />}>
                <Route index element={<StaffDashboard />} />
                <Route path="department" element={<DepartmentDashboard />} />
                <Route path="uploads" element={<Upload />} />
                <Route path="documents" element={<Documents />} />
                <Route path="approvals" element={<DepartmentDashboard />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/profiles" element={<Settings />} />
                <Route path="settings/notifications" element={<Settings />} />
                <Route path="settings/accounts" element={<Settings />} />
              </Route>
              
              {/* Document view routes */}
              <Route path="/documents/:id" element={<ProtectedRoute />}>
                <Route index element={<DocumentView />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
