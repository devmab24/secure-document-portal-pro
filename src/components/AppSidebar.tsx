
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { 
  File, Upload, LayoutDashboard, Settings, Users, 
  FileText, Home, FolderHeart, Activity, FileSearch, 
  UserRound, Stethoscope
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
import { UserRole } from "@/lib/types";

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);
  
  // Custom class for active navigation link
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-primary font-medium w-full flex items-center gap-2 p-2 rounded-md"
      : "hover:bg-sidebar-accent/50 w-full flex items-center gap-2 p-2 rounded-md transition-colors";

  // Department-specific icon based on user's department
  const getDepartmentIcon = () => {
    if (!user) return <FolderHeart className="h-5 w-5" />;
    
    switch (user.department) {
      case "Radiology": return <Activity className="h-5 w-5" />;
      case "Dental": return <FolderHeart className="h-5 w-5" />;
      case "Eye Clinic": return <FileSearch className="h-5 w-5" />;
      case "Antenatal": return <UserRound className="h-5 w-5" />;
      case "Accident & Emergency": return <Activity className="h-5 w-5" />;
      case "Physiotherapy": return <Stethoscope className="h-5 w-5" />;
      default: return <FolderHeart className="h-5 w-5" />;
    }
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r border-border transition-all duration-300 ease-in-out`}
      collapsible="icon"
    >
      <SidebarContent className="p-3">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard" className={getNavClass}>
                    <LayoutDashboard className="h-5 w-5" />
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

              {/* Department Section - Visible to all users */}
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to={`/department/${user.department.toLowerCase().replace(/\s+/g, '-')}`} className={getNavClass}>
                      {getDepartmentIcon()}
                      {!collapsed && <span>{user.department}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section - Only visible to CMD and Admin */}
        {user && (user.role === UserRole.CMD || user.role === UserRole.ADMIN) && (
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/users" className={getNavClass}>
                      <Users className="h-5 w-5" />
                      {!collapsed && <span>Users</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/audit" className={getNavClass}>
                      <FileText className="h-5 w-5" />
                      {!collapsed && <span>Audit Logs</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* HOD Section - Only visible to HODs */}
        {user && user.role === UserRole.HOD && (
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

export default AppSidebar;
