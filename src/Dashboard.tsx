
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";

// Main dashboard route - Redirects to specific role-dashboard when visited on succesful Login
const RedirectDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case UserRole.CMD:
          navigate("/dashboard/cmd", { replace: true });
          break;
        case UserRole.HOD:
          navigate("/dashboard/hod", { replace: true });
          break;
        case UserRole.ADMIN:
          navigate("/dashboard/admin", { replace: true });
          break;
        case UserRole.SUPER_ADMIN:
          navigate("/dashboard/super-admin", { replace: true });
          break;
        case UserRole.STAFF:
          navigate("/dashboard/staff", { replace: true });
          break;
        default:
          // Stay on current page if role is not recognized
          break;
      }
    }
  }, [user, navigate]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg">Redirecting to your dashboard...</div>
    </div>
  );
};

export default RedirectDashboard;
