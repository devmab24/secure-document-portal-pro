
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
import CmacProtectedRoute from "@/components/CmacProtectedRoute";
import HeadOfNursingProtectedRoute from "@/components/HeadOfNursingProtectedRoute";
import ChiefAccountantProtectedRoute from "@/components/ChiefAccountantProtectedRoute";
import ChiefProcurementProtectedRoute from "@/components/ChiefProcurementProtectedRoute";
import MedicalRecordsProtectedRoute from "@/components/MedicalRecordsProtectedRoute";
import HodProtectedRoute from "@/components/HodProtectedRoute";
import StaffProtectedRoute from "@/components/StaffProtectedRoute";
import RegistryProtectedRoute from "@/components/RegistryProtectedRoute";
import DirectorAdminProtectedRoute from "@/components/DirectorAdminProtectedRoute";
import HeadOfUnitProtectedRoute from "@/components/HeadOfUnitProtectedRoute";
import CmdDepartmentsList from "./components/CmdDepartmentsList";

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
const DepartmentDashboard = lazy(() =>  import("./pages/DepartmentDashboard"));

// CMD Pages
const CmdDashboard = lazy(() => import("./pages/CmdDashboard"));
const CmdDocuments = lazy(() => import("./pages/cmd/CmdDocuments"));
const CmdInbox = lazy(() => import("./pages/cmd/CmdInbox"));
const CmdUpload = lazy(() => import("./pages/cmd/CmdUpload"));

// HOD Pages
const HodDashboard = lazy(() => import("./pages/hod/HodDashboard"));
const HODInbox = lazy(() => import("./pages/hod/HODInbox"));
const HodDocumentSubmissions = lazy(() => import("./pages/hod/HodDocumentSubmissions"));
const HodDepartmentUnits = lazy(() => import("./pages/hod/HodDepartmentUnits"));

// Staff Pages
const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard"));
const StaffInbox = lazy(() => import("./pages/staff/StaffInbox"));
const StaffDocumentCommunications = lazy(() => import("./pages/staff/StaffDocumentCommunications"));

// Registry Pages
const RegistryDashboard = lazy(() => import("./pages/registry/RegistryDashboard"));

// Director of Admin Pages
const DirectorAdminDashboard = lazy(() => import("./pages/director-admin/DirectorAdminDashboard"));

// CMAC Pages
const CmacDashboard = lazy(() => import("./pages/cmac/CmacDashboard"));

// Head of Nursing Pages
const HeadOfNursingDashboard = lazy(() => import("./pages/head-of-nursing/HeadOfNursingDashboard"));

// Chief Accountant Pages
const ChiefAccountantDashboard = lazy(() => import("./pages/chief-accountant/ChiefAccountantDashboard"));

// Chief Procurement Officer Pages
const ChiefProcurementDashboard = lazy(() => import("./pages/chief-procurement/ChiefProcurementDashboard"));

// Medical Records Officer Pages
const MedicalRecordsDashboard = lazy(() => import("./pages/medical-records/MedicalRecordsDashboard"));

// Head of Unit Pages
const HeadOfUnitDashboard = lazy(() => import("./pages/head-of-unit/HeadOfUnitDashboard"));
const HeadOfUnitInbox = lazy(() => import("./pages/head-of-unit/HeadOfUnitInbox"));
const HeadOfUnitMyUnit = lazy(() => import("./pages/head-of-unit/HeadOfUnitMyUnit"));

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
const DocumentCommunication = lazy(() => import("./pages/DocumentCommunication"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
const DatabaseSeeding = lazy(() => import("./pages/DatabaseSeeding"));
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth" element={<Login />} />
                  
                  {/* Database Seeding Route for Testing */}
                  <Route path="/database-seeding" element={<DatabaseSeeding />} />

                  {/* Super Admin specific routes - All under /dashboard/super-admin */}
                  <Route path="/dashboard/super-admin" element={<SuperAdminProtectedRoute />}>
                    <Route index element={<SuperAdminDashboard />} />
                    <Route path="systems" element={<SuperAdminDashboard />} />
                    <Route path="reports" element={<SuperAdminDashboard />} />
                    <Route path="users/management" element={<UserManagement />} />
                    <Route path="users/roles" element={<UserManagement />} />
                    <Route path="audits" element={<AuditLogs />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="settings/profiles" element={<Settings />} />
                    <Route path="settings/notifications" element={<Settings />} />
                    <Route path="settings/accounts" element={<Settings />} />
                  </Route>

                  {/* Admin specific routes - All under /dashboard/admin */}
                  <Route path="/dashboard/admin" element={<AdminProtectedRoute />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="inbox" element={<Inbox />} />
                    {/* <Route path="department" element={<DepartmentDashboard />} /> */}
                    <Route path="staff-lists" element={<Users />} />
                    <Route path="uploads" element={<Upload />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="approvals" element={<DepartmentDashboard />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="settings/profiles" element={<Settings />} />
                    <Route path="settings/notifications" element={<Settings />} />
                    <Route path="settings/accounts" element={<Settings />} />
                  </Route>

                  {/* CMD specific routes - All under /dashboard/cmd */}
                  <Route path="/dashboard/cmd" element={<CmdProtectedRoute />}>
                    <Route index element={<CmdDashboard />} />
                    <Route path="departments" element={<CmdDepartmentsList />} />
                    <Route path="uploads" element={<CmdUpload />} />
                    <Route path="documents" element={<CmdDocuments />} />
                    <Route path="inbox" element={<CmdInbox />} />
                    <Route path="approvals" element={<CmdDashboard />} />
                    <Route path="audits" element={<AuditLogs />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="staff-lists" element={<Users />} />
                    <Route path="settings/profiles" element={<Settings />} />
                    <Route path="settings/notifications" element={<Settings />} />
                    <Route path="settings/accounts" element={<Settings />} />
                    <Route path=":departmentSlug" element={<CmdDepartmentsList />} />
                    <Route path="documents/sharing" element={<DocumentSharing />} />
                    <Route path="document-communication" element={<DocumentCommunication />} />

                    {/* Forms Routes */}
                    <Route path="forms" element={<FormTemplates />} />
                    <Route path="forms/create/:templateId" element={<FormCreate />} />
                    <Route path="forms/my-forms" element={<MyForms />} />
                    <Route path="forms/view/:formId" element={<MyForms />} />
                    <Route path="forms/edit/:formId" element={<FormCreate />} />
                  </Route>

                  {/* HOD Routes */}
                  <Route path="/dashboard/hod" element={<HodProtectedRoute />}>
                    <Route index element={<HodDashboard />} />
                    <Route path="units" element={<HodDepartmentUnits />} />
                    <Route path="staffs" element={<Users />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="inbox" element={<HODInbox />} />                    
                    <Route path="inter-department" element={<InterDepartmentCommunication />} />
                    <Route path="document-communication" element={<DocumentCommunication />} />
                    <Route path="submissions" element={<HodDocumentSubmissions />} />
                  
                    {/*Settings routes*/}
                    <Route path="settings" element={<Settings />} />
                    <Route path="settings/profiles" element={<Settings />} />
                    <Route path="settings/notifications" element={<Settings />} />
                    <Route path="settings/accounts" element={<Settings />} />

                    {/* Forms Routes */}
                    <Route path="forms" element={<FormTemplates />} />
                    <Route path="forms/create/:templateId" element={<FormCreate />} />
                    <Route path="forms/my-forms" element={<MyForms />} />
                    <Route path="forms/view/:formId" element={<MyForms />} />
                    <Route path="forms/edit/:formId" element={<FormCreate />} />
                  </Route>

                  {/* Staff specific routes - All under /dashboard/staff */}
                  <Route path="/dashboard/staff" element={<StaffProtectedRoute />}>
                    <Route index element={<StaffDashboard />} />
                    <Route path="uploads" element={<Upload />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="communications" element={<StaffDocumentCommunications />} />
                    <Route path="document-communication" element={<DocumentCommunication />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="settings/profiles" element={<Settings />} />
                    <Route path="settings/notifications" element={<Settings />} />
                    <Route path="settings/accounts" element={<Settings />} />
                    <Route path="inbox" element={<StaffInbox />} />
                    <Route path="approvals" element={<DepartmentDashboard />} />

                    {/* Forms Routes */}
                    <Route path="forms" element={<FormTemplates />} />
                    <Route path="forms/create/:templateId" element={<FormCreate />} />
                    <Route path="forms/my-forms" element={<MyForms />} />
                    <Route path="forms/view/:formId" element={<MyForms />} />
                    <Route path="forms/edit/:formId" element={<FormCreate />} />
                  </Route>

                  {/* Registry specific routes - All under /dashboard/registry */}
                  <Route path="/dashboard/registry" element={<RegistryProtectedRoute />}>
                    <Route index element={<RegistryDashboard />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="inbox" element={<Inbox />} />
                    <Route path="audit" element={<AuditLogs />} />
                    <Route path="document-communication" element={<DocumentCommunication />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Director of Admin specific routes - All under /dashboard/director-admin */}
                  <Route path="/dashboard/director-admin" element={<DirectorAdminProtectedRoute />}>
                    <Route index element={<DirectorAdminDashboard />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="inbox" element={<Inbox />} />
                    <Route path="audits" element={<AuditLogs />} />
                    <Route path="document-communication" element={<DocumentCommunication />} />
                    <Route path="users" element={<Users />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* CMAC specific routes - All under /dashboard/cmac */}
                  <Route path="/dashboard/cmac" element={<CmacProtectedRoute />}>
                    <Route index element={<CmacDashboard />} />
                    <Route path="clinical-oversight" element={<CmacDashboard />} />
                    <Route path="quality-control" element={<CmacDashboard />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="inbox" element={<Inbox />} />
                    <Route path="audits" element={<AuditLogs />} />
                    <Route path="document-communication" element={<DocumentCommunication />} />
                    <Route path="medical-staff" element={<Users />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Head of Nursing specific routes - All under /dashboard/head-of-nursing */}
                  <Route path="/dashboard/head-of-nursing" element={<HeadOfNursingProtectedRoute />}>
                    <Route index element={<HeadOfNursingDashboard />} />
                    <Route path="nursing-staff" element={<Users />} />
                    <Route path="duty-roster" element={<HeadOfNursingDashboard />} />
                    <Route path="training" element={<HeadOfNursingDashboard />} />
                    <Route path="infection-control" element={<HeadOfNursingDashboard />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="inbox" element={<Inbox />} />
                    <Route path="audits" element={<AuditLogs />} />
                    <Route path="document-communication" element={<DocumentCommunication />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Chief Accountant specific routes - All under /dashboard/chief-accountant */}
                  <Route path="/dashboard/chief-accountant" element={<ChiefAccountantProtectedRoute />}>
                    <Route index element={<ChiefAccountantDashboard />} />
                    <Route path="financial-reports" element={<ChiefAccountantDashboard />} />
                    <Route path="budget-planning" element={<ChiefAccountantDashboard />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="inbox" element={<Inbox />} />
                    <Route path="audits" element={<AuditLogs />} />
                    <Route path="document-communication" element={<DocumentCommunication />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Chief Procurement Officer specific routes - All under /dashboard/chief-procurement */}
                  <Route path="/dashboard/chief-procurement" element={<ChiefProcurementProtectedRoute />}>
                    <Route index element={<ChiefProcurementDashboard />} />
                    <Route path="requisitions" element={<ChiefProcurementDashboard />} />
                    <Route path="vendors" element={<ChiefProcurementDashboard />} />
                    <Route path="contracts" element={<ChiefProcurementDashboard />} />
                    <Route path="purchase-orders" element={<ChiefProcurementDashboard />} />
                    <Route path="due-process" element={<ChiefProcurementDashboard />} />
                    <Route path="reports" element={<ChiefProcurementDashboard />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="inbox" element={<Inbox />} />
                    <Route path="audits" element={<AuditLogs />} />
                    <Route path="document-communication" element={<DocumentCommunication />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Medical Records Officer specific routes - All under /dashboard/medical-records */}
                  <Route path="/dashboard/medical-records" element={<MedicalRecordsProtectedRoute />}>
                    <Route index element={<MedicalRecordsDashboard />} />
                    <Route path="patient-records" element={<MedicalRecordsDashboard />} />
                    <Route path="clinical-docs" element={<MedicalRecordsDashboard />} />
                    <Route path="compliance" element={<MedicalRecordsDashboard />} />
                    <Route path="reports" element={<MedicalRecordsDashboard />} />
                    <Route path="retention" element={<MedicalRecordsDashboard />} />
                    <Route path="departments" element={<MedicalRecordsDashboard />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="inbox" element={<Inbox />} />
                    <Route path="audits" element={<AuditLogs />} />
                    <Route path="document-communication" element={<DocumentCommunication />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Head of Unit specific routes - All under /dashboard/head-of-unit */}
                  <Route path="/dashboard/head-of-unit" element={<HeadOfUnitProtectedRoute />}>
                    <Route index element={<HeadOfUnitDashboard />} />
                    <Route path="my-unit" element={<HeadOfUnitMyUnit />} />
                    <Route path="inbox" element={<HeadOfUnitInbox />} />
                    <Route path="approvals" element={<HeadOfUnitDashboard />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="send-document" element={<DocumentCommunication />} />
                    <Route path="staff" element={<Users />} />
                    <Route path="document-communication" element={<DocumentCommunication />} />
                    <Route path="settings" element={<Settings />} />
                    
                    {/* Forms Routes */}
                    <Route path="forms" element={<FormTemplates />} />
                    <Route path="forms/create/:templateId" element={<FormCreate />} />
                    <Route path="forms/my-forms" element={<MyForms />} />
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
