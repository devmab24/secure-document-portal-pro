
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Protected Route Components
import ProtectedRoute from "@/components/ProtectedRoute";
import SuperAdminProtectedRoute from "@/components/SuperAdminProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import CmdProtectedRoute from "@/components/CmdProtectedRoute";
import HodProtectedRoute from "@/components/HodProtectedRoute";
import StaffProtectedRoute from "@/components/StaffProtectedRoute";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Super Admin Pages
const SuperAdminDashboard = lazy(() => import("./pages/super-admin/SuperAdminDashboard"));

// Admin Pages  
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));

// CMD Pages
const CmdDashboard = lazy(() => import("./pages/CmdDashboard"));
const CmdDocuments = lazy(() => import("./pages/cmd/CmdDocuments"));
const CmdInbox = lazy(() => import("./pages/cmd/CmdInbox"));
const CmdUpload = lazy(() => import("./pages/cmd/CmdUpload"));

// HOD Pages
const HodDashboard = lazy(() => import("./pages/hod/HodDashboard"));
const HODInbox = lazy(() => import("./pages/hod/HODInbox"));
const HodDocumentSubmissions = lazy(() => import("./pages/hod/HodDocumentSubmissions"));

// Staff Pages
const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard"));
const StaffInbox = lazy(() => import("./pages/staff/StaffInbox"));
const StaffDocumentCommunications = lazy(() => import("./pages/staff/StaffDocumentCommunications"));

// Shared Pages
const Documents = lazy(() => import("./pages/Documents"));
const Upload = lazy(() => import("./pages/Upload"));
const FormTemplates = lazy(() => import("./pages/FormTemplates"));
const MyForms = lazy(() => import("./pages/MyForms"));
const FormCreate = lazy(() => import("./pages/FormCreate"));
const Inbox = lazy(() => import("./pages/Inbox"));
const Settings = lazy(() => import("./pages/Settings"));
const Users = lazy(() => import("./pages/Users"));
const DocumentSharing = lazy(() => import("./pages/DocumentSharing"));
const DocumentView = lazy(() => import("./pages/DocumentView"));
const InterDepartmentCommunication = lazy(() => import("./pages/InterDepartmentCommunication"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
// const CoreTesting = lazy(() => import("./pages/CoreTesting"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ReduxProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={
                <div className="flex items-center justify-center h-screen">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              }>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  {/* <Route path="/auth" element={<Login />} /> */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/forms" element={<FormTemplates />} />
                    <Route path="/my-forms" element={<MyForms />} />
                    <Route path="/forms/create" element={<FormCreate />} />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/sharing" element={<DocumentSharing />} />
                    <Route path="/inter-department" element={<InterDepartmentCommunication />} />
                    <Route path="/documents/:id" element={<DocumentView />} /> 
                    <Route path="/audit" element={<AuditLogs />} />
                    {/* <Route path="/core-testing" element={<CoreTesting />} /> */}
                  </Route>

                  {/* Super Admin Routes */}
                  <Route path="/dashboard/super-admin" element={<SuperAdminProtectedRoute />}>
                    <Route index element={<SuperAdminDashboard />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/dashboard/admin" element={<AdminProtectedRoute />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                  </Route>

                  {/* CMD Routes */}
                  <Route path="/dashboard/cmd" element={<CmdProtectedRoute />}>
                    <Route index element={<CmdDashboard />} />
                    <Route path="documents" element={<CmdDocuments />} />
                    <Route path="inbox" element={<CmdInbox />} />
                    <Route path="upload" element={<CmdUpload />} />
                  </Route>

                  {/* HOD Routes */}
                  <Route path="/dashboard/hod" element={<HodProtectedRoute />}>
                    <Route index element={<HodDashboard />} />
                    <Route path="staffs" element={<Users />} />
                    <Route path="forms" element={<FormTemplates />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="inbox" element={<HODInbox />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="inter-department" element={<InterDepartmentCommunication />} />
                    <Route path="submissions" element={<HodDocumentSubmissions />} />
                  </Route>

                  {/* Staff Routes */}
                  <Route path="/dashboard/staff" element={<StaffProtectedRoute />}>
                    <Route index element={<StaffDashboard />} />
                    <Route path="inbox" element={<StaffInbox />} />
                    <Route path="communications" element={<StaffDocumentCommunications />} />
                    <Route path="forms" element={<FormTemplates />} />
                    <Route path="uploads" element={<Upload />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ReduxProvider>
    </ThemeProvider>
    <Toaster />
  </QueryClientProvider>
);

export default App;
