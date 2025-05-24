
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, File, Upload, Settings, Users, 
  FileText, Activity, FolderHeart, FileSearch, UserRound, Stethoscope
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Department, UserRole } from "@/lib/types";

const DepartmentSpecificSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-primary font-medium w-full flex items-center gap-2 p-2 rounded-md"
      : "hover:bg-sidebar-accent/50 w-full flex items-center gap-2 p-2 rounded-md transition-colors";

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

  const formatDepartmentName = (department: Department) => {
    return department
      .replace(/_/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  };

  const getDepartmentSlug = (department: Department) => {
    return department.toLowerCase().replace(/_/g, '-');
  };

  if (!user || !user.department) {
    return null;
  }

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r border-border transition-all duration-300 ease-in-out`}
      collapsible="icon"
    >
      <SidebarContent className="p-3">
        {/* Department Dashboard */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            {formatDepartmentName(user.department)}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to={`/department/${getDepartmentSlug(user.department)}`} className={getNavClass}>
                    {getDepartmentIcon(user.department)}
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/documents" className={getNavClass}>
                    <File className="h-5 w-5" />
                    {!collapsed && <span>Documents</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/upload" className={getNavClass}>
                    <Upload className="h-5 w-5" />
                    {!collapsed && <span>Upload</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* HOD Specific Features */}
        {user.role === UserRole.HOD && (
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
              Department Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/department/approvals" className={getNavClass}>
                      <FileText className="h-5 w-5" />
                      {!collapsed && <span>Pending Approvals</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/department/staff" className={getNavClass}>
                      <Users className="h-5 w-5" />
                      {!collapsed && <span>Department Staff</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={getNavClass}>
                    <Settings className="h-5 w-5" />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DepartmentSpecificSidebar;
