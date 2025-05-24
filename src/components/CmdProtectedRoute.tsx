
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import AppLayout from "./AppLayout";

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
    console.log("User not authenticated, redirecting to login from", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has CMD or ADMIN role
  if (user.role !== UserRole.CMD && user.role !== UserRole.ADMIN) {
    console.log("Access denied: User", user.email, "with role", user.role, "cannot access CMD routes");
    return <Navigate to="/" replace />;
  }

  // If authenticated and has proper role, render the protected route inside the app layout
  console.log("CMD access granted for", user.email, "with role", user.role);
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default CmdProtectedRoute;
