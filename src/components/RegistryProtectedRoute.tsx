import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import RegistryLayout from "./RegistryLayout";

const RegistryProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== UserRole.REGISTRY && user.role !== UserRole.SUPER_ADMIN) {
    return <Navigate to="/" replace />;
  }

  return (
    <RegistryLayout>
      <Outlet />
    </RegistryLayout>
  );
};

export default RegistryProtectedRoute;
