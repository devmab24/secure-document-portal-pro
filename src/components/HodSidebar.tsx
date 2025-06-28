
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, File, Upload, Settings, Users, 
  FileText, FolderHeart
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

const HodSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-primary font-medium w-full flex items-center gap-2 p-2 rounded-md"
      : "hover:bg-sidebar-accent/50 w-full flex items-center gap-2 p-2 rounded-md transition-colors";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} pt-12 border-r border-border transition-all duration-300 ease-in-out`}
      collapsible="icon"
    >
      <SidebarContent className="p-3">
        {/* HOD Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            HOD Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod" className={getNavClass}>
                    <LayoutDashboard className="h-5 w-5" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod/uploads" className={getNavClass}>
                    <Upload className="h-5 w-5" />
                    {!collapsed && <span>Uploads</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem> 
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod/documents" className={getNavClass}>
                    <File className="h-5 w-5" />
                    {!collapsed && <span>Documents</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod/staff" className={getNavClass}>
                    <Users className="h-5 w-5" />
                    {!collapsed && <span>Staff</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod/settings" className={getNavClass}>
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

export default HodSidebar;


 {/* <SidebarMenuItem>
  <SidebarMenuButton asChild>
    <NavLink to="/dashboard/hod/department" className={getNavClass}>
      <FolderHeart className="h-5 w-5" />
      {!collapsed && <span>Department</span>}
    </NavLink>
  </SidebarMenuButton>
</SidebarMenuItem> */}

{/* <SidebarMenuItem>
  <SidebarMenuButton asChild>
    <NavLink to="/dashboard/hod/approvals" className={getNavClass}>
      <FileText className="h-5 w-5" />
      {!collapsed && <span>Approvals</span>}
    </NavLink>
  </SidebarMenuButton>
</SidebarMenuItem> */}