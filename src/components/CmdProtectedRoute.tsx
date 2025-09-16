
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import CmdLayout from "./CmdLayout";

const CmdProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  console.log("CmdProtectedRoute rendering: isLoading=", isLoading, "user=", user?.email || "none", "role=", user?.role);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("No user found in context. Redirecting to login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has CMD or SUPER_ADMIN role
  if (user.role !== UserRole.CMD && user.role !== UserRole.SUPER_ADMIN) {
    console.log("Access denied. User role:", user.role);
    return <Navigate to="/" replace />;
  }

  // If authenticated and has proper role, render the protected route inside the CMD layout
  // console.log("CMD access granted for", user.email, "with role", user.role);
  console.log("Access granted");
  return (
    <CmdLayout>
      <Outlet />
    </CmdLayout>
  );
};

export default CmdProtectedRoute;
