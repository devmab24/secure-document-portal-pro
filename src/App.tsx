import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import CmdProtectedRoute from "@/components/CmdProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
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

function App() {
  console.log("App rendering");
  
  return (
    <ReduxProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Main dashboard route */}
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<Dashboard />} />
              </Route>
              
              {/* CMD specific nested routes - All under /dashboard/cmd */}
              <Route path="/dashboard/cmd" element={<CmdProtectedRoute />}>
                <Route index element={<CmdDashboard />} />
                <Route path="upload" element={<CmdUpload />} />
                <Route path="documents" element={<CmdDocuments />} />
                <Route path=":departmentSlug" element={<CmdDashboard />} />
              </Route>
              
              {/* Admin specific routes - All under /dashboard/admin */}
              <Route path="/dashboard/admin" element={<AdminProtectedRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="documents" element={<Documents />} />
                <Route path="upload" element={<Upload />} />
                <Route path="users/manage" element={<UserManagement />} />
                <Route path="users/roles" element={<UserManagement />} />
                <Route path="reports" element={<AdminDashboard />} />
                <Route path="system" element={<AdminDashboard />} />
                <Route path="department/:departmentSlug" element={<DepartmentDashboard />} />
              </Route>
              
              {/* Regular document routes */}
              <Route path="/documents" element={<ProtectedRoute />}>
                <Route index element={<Documents />} />
              </Route>
              <Route path="/documents/:id" element={<ProtectedRoute />}>
                <Route index element={<DocumentView />} />
              </Route>
              
              {/* Department routes (for HODs and Staff) */}
              <Route path="/department/:departmentSlug" element={<ProtectedRoute />}>
                <Route index element={<DepartmentDashboard />} />
              </Route>
              <Route path="/department/approvals" element={<ProtectedRoute />}>
                <Route index element={<DepartmentDashboard />} />
              </Route>
              <Route path="/department/staff" element={<ProtectedRoute />}>
                <Route index element={<Users />} />
              </Route>
              
              {/* Other routes */}
              <Route path="/upload" element={<ProtectedRoute />}>
                <Route index element={<Upload />} />
              </Route>
              <Route path="/users" element={<ProtectedRoute />}>
                <Route index element={<Users />} />
              </Route>
              <Route path="/settings" element={<ProtectedRoute />}>
                <Route index element={<Settings />} />
              </Route>
              <Route path="/audit" element={<ProtectedRoute />}>
                <Route index element={<AuditLogs />} />
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
