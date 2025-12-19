import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, File, Upload, Settings, Users, 
  FormInput, Inbox, Share, Building2
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
      ? "bg-primary/10 text-primary border-r-2 border-primary font-semibold w-full flex items-center gap-2 p-2 rounded-md"
      : "hover:bg-primary/5 hover:text-primary text-muted-foreground w-full flex items-center gap-2 p-2 rounded-md transition-colors";

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
                  <NavLink to="/dashboard/hod" end className={getNavClass}>
                    <LayoutDashboard className="h-5 w-5" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod/units" className={getNavClass}>
                    <Building2 className="h-5 w-5" />
                    {!collapsed && <span>Department Units</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod/inbox" className={getNavClass}>
                    <Inbox className="h-5 w-5" />
                    {!collapsed && <span>Inbox</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod/inter-department" className={getNavClass}>
                    <LayoutDashboard className="h-5 w-5" />
                    {!collapsed && <span>Communications</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod/forms" className={getNavClass}>
                    <FormInput className="h-5 w-5" />
                    {!collapsed && <span>Digital Forms</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod/submissions" className={getNavClass}>
                    <Share className="h-5 w-5" />
                    {!collapsed && <span>Send Document</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod/upload" className={getNavClass}>
                    <Upload className="h-5 w-5" />
                    {!collapsed && <span>Upload new Document</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem> 
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod/documents" className={getNavClass}>
                    <File className="h-5 w-5" />
                    {!collapsed && <span>All Documents</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/hod/staffs" className={getNavClass}>
                    <Users className="h-5 w-5" />
                    {!collapsed && <span>Dept. Staffs</span>}
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
