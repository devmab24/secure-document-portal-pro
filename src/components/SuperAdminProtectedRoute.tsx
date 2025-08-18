
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import SuperAdminLayout from "./SuperAdminLayout";

const SuperAdminProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  console.log("SuperAdminProtectedRoute rendering: isLoading=", isLoading, "user=", user?.email || "none", "role=", user?.role);

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
    console.log("User not authenticated, redirecting to login from", location.pathname);
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has SUPER_ADMIN role
  if (user.role !== UserRole.SUPER_ADMIN) {
    console.log("Access denied: User", user.email, "with role", user.role, "cannot access Super Admin routes");
    return <Navigate to="/" replace />;
  }

  // If authenticated and has proper role, render the protected route inside the super admin layout
  console.log("Super Admin access granted for", user.email, "with role", user.role);
  return (
    <SuperAdminLayout>
      <Outlet />
    </SuperAdminLayout>
  );
};

export default SuperAdminProtectedRoute;
