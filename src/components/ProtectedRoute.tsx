
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import AppLayout from "./AppLayout";
import DepartmentLayout from "./DepartmentLayout";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute rendering: isLoading=", isLoading, "user=", user?.email || "none");

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

  // If authenticated, render the protected route inside the appropriate layout
  console.log("User authenticated as", user.email, "rendering protected content");
  
  // Use department-specific layout for HODs and Staff
  if (user.role === UserRole.HOD || user.role === UserRole.STAFF) {
    return (
      <DepartmentLayout>
        <Outlet />
      </DepartmentLayout>
    );
  }

  // Use default AppLayout for other users
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default ProtectedRoute;
