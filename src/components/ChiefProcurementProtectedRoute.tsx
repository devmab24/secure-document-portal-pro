import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import ChiefProcurementLayout from "./ChiefProcurementLayout";

const ChiefProcurementProtectedRoute = () => {
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

  if (user.role !== UserRole.CHIEF_PROCUREMENT_OFFICER && user.role !== UserRole.SUPER_ADMIN) {
    return <Navigate to="/" replace />;
  }

  return (
    <ChiefProcurementLayout>
      <Outlet />
    </ChiefProcurementLayout>
  );
};

export default ChiefProcurementProtectedRoute;
