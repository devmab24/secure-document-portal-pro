import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, File, Upload, Settings, Users, 
  FileText, FolderHeart, FormInput, Share,
  Activity, FileSearch, UserRound, Stethoscope, TestTube
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
import { Department } from "@/lib/types"; 
import { clsx } from "clsx";


const CmdSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
        ? "bg-sidebar-accent text-primary border-r-2 border-primary font-medium w-full flex items-center gap-2 p-2 rounded-md"
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
     
  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} pt-12 border-r border-border transition-all duration-300 ease-in-out`}
      collapsible="icon"
    >
      <SidebarContent className="p-3"> 
        {/* CMD Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            CMD Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/cmd" className={getNavClass}>
                    <LayoutDashboard className="h-5 w-5" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/cmd/core-testing" className={getNavClass}>
                    <TestTube className="h-5 w-5" />
                    {!collapsed && <span>Core Testing</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/cmd/forms" className={getNavClass}>
                    <FormInput className="h-5 w-5" />
                    {!collapsed && <span>Digital Forms</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/cmd/documents" className={getNavClass}>
                    <File className="h-5 w-5" />
                    {!collapsed && <span>Documents View</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/cmd/inbox" className={getNavClass}>
                    <FileText className="h-5 w-5" />
                    {!collapsed && <span>My Inbox</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/cmd/documents/sharing" className={getNavClass}>
                    <Share className="h-5 w-5" />
                    {!collapsed && <span>Send Document</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/cmd/uploads" className={getNavClass}>
                    <Upload className="h-5 w-5" />
                    {!collapsed && <span>Upload Document</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/cmd/staff-lists" className={getNavClass}>
                    <Users className="h-5 w-5" />
                    {!collapsed && <span>All Staffs</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

         {/* All Departments - CMD can access all */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            All Departments
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.values(Department).map((department) => (
                <SidebarMenuItem key={department}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={`/dashboard/cmd/${getDepartmentSlug(department)}`} 
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

         {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/cmd/settings" className={getNavClass}>
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

export default CmdSidebar;
