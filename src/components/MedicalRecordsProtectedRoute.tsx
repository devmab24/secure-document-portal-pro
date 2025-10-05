import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";

const MedicalRecordsProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== UserRole.MEDICAL_RECORDS_OFFICER) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default MedicalRecordsProtectedRoute;
