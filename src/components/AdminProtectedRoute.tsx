
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import AdminLayout from "./AdminLayout";

const AdminProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  console.log("AdminProtectedRoute rendering: isLoading=", isLoading, "user=", user?.email || "none", "role=", user?.role);

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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has ADMIN or SUPER_ADMIN role
  if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
    console.log("Access denied: User", user.email, "with role", user.role, "cannot access Admin routes");
    return <Navigate to="/" replace />;
  }

  // If authenticated and has proper role, render the protected route inside the admin layout
  console.log("Admin access granted for", user.email, "with role", user.role);
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminProtectedRoute;
