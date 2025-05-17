
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={
                <SidebarProvider collapsedWidth={60}>
                  <Dashboard />
                </SidebarProvider>
              } />
              <Route path="/documents" element={
                <SidebarProvider collapsedWidth={60}>
                  <Documents />
                </SidebarProvider>
              } />
              <Route path="/documents/:id" element={
                <SidebarProvider collapsedWidth={60}>
                  <DocumentView />
                </SidebarProvider>
              } />
              <Route path="/upload" element={
                <SidebarProvider collapsedWidth={60}>
                  <Upload />
                </SidebarProvider>
              } />
              <Route path="/settings" element={
                <SidebarProvider collapsedWidth={60}>
                  <Settings />
                </SidebarProvider>
              } />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
