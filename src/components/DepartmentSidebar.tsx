
import { NavLink } from "react-router-dom";
import { Department, UserRole } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  FolderHeart, Activity, FileSearch, 
  UserRound, Stethoscope
} from "lucide-react";
import { useLocation } from "react-router-dom";

const DepartmentSidebar = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  // If user is not CMD or ADMIN, only show their department
  const departmentsToShow = user?.role === UserRole.CMD || user?.role === UserRole.ADMIN 
    ? Object.values(Department) 
    : user?.department ? [user.department] : [];

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);
  
  // Custom class for active navigation link
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-primary font-medium w-full flex items-center gap-2 p-2 rounded-md"
      : "hover:bg-sidebar-accent/50 w-full flex items-center gap-2 p-2 rounded-md transition-colors";

  // Department-specific icon based on department name
  const getDepartmentIcon = (department: Department) => {
    switch (department) {
      case Department.RADIOLOGY: return <Activity className="h-5 w-5" />;
      case Department.DENTAL: return <FolderHeart className="h-5 w-5" />;
      case Department.EYE_CLINIC: return <FileSearch className="h-5 w-5" />;
      case Department.ANTENATAL: return <UserRound className="h-5 w-5" />;
      case Department.A_AND_E: return <Activity className="h-5 w-5" />;
      case Department.PHYSIOTHERAPY: return <Stethoscope className="h-5 w-5" />;
      default: return <FolderHeart className="h-5 w-5" />;
    }
  };

  // Department name formatter (convert enum to display name)
  const formatDepartmentName = (department: Department) => {
    return department
      .replace(/_/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  };

  // Create URL-friendly slug from department name
  const getDepartmentSlug = (department: Department) => {
    return department.toLowerCase().replace(/_/g, '-');
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
        Departments
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {departmentsToShow.map((department) => (
            <SidebarMenuItem key={department}>
              <SidebarMenuButton asChild>
                <NavLink 
                  to={`/department/${getDepartmentSlug(department)}`} 
                  className={getNavClass}
                >
                  {getDepartmentIcon(department)}
                  {!collapsed && <span>{formatDepartmentName(department)}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default DepartmentSidebar;
