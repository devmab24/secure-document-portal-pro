
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, File, Upload, Settings, Shield, 
  UserCog, Users, FileText, Activity, Database
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

const SuperAdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary border-r-2 border-primary font-semibold w-full flex items-center gap-2 p-2 rounded-md"
      : "hover:bg-primary/5 hover:text-primary text-muted-foreground w-full flex items-center gap-2 p-2 rounded-md transition-colors";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} pt-12 border-r border-border transition-all duration-300 ease-in-out`}
      collapsible="icon"
    >
      <SidebarContent className="p-3 pt-6">
        {/* Super Admin Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Super Admin Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/super-admin" className={getNavClass}>
                    <Shield className="h-5 w-5" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/super-admin/systems" className={getNavClass}>
                    <Database className="h-5 w-5" />
                    {!collapsed && <span>Systems</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/super-admin/reports" className={getNavClass}>
                    <FileText className="h-5 w-5" />
                    {!collapsed && <span>Reports</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Management */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            User Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/super-admin/users/management" className={getNavClass}>
                    {/* <UserCog className="h-5 w-5" /> */}
                    <Users className="h-5 w-5" />
                    {!collapsed && <span>All Users</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/super-admin/users/roles" className={getNavClass}>
                    <Users className="h-5 w-5" />
                    {!collapsed && <span>Role Management</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Management */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/super-admin/audits" className={getNavClass}>
                    <Activity className="h-5 w-5" />
                    {!collapsed && <span>Audits</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/super-admin/settings" className={getNavClass}>
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

export default SuperAdminSidebar;
