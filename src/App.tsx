
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Upload from "./pages/Upload";
import DocumentView from "./pages/DocumentView";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import AuditLogs from "./pages/AuditLogs";
import DepartmentDashboard from "./pages/DepartmentDashboard";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create the App component with proper provider nesting
const App = () => {
  console.log("App rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes - wrapped in ProtectedRoute for auth check */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/documents/:id" element={<DocumentView />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/users" element={<Users />} />
                <Route path="/audit" element={<AuditLogs />} />
                <Route path="/department/:departmentSlug" element={<DepartmentDashboard />} />
                <Route path="/department/approvals" element={<DepartmentDashboard />} />
                <Route path="/department/staff" element={<DepartmentDashboard />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
