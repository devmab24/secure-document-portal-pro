import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, File, Upload, Settings, 
  Inbox, Share, ClipboardList, ShoppingCart, FileText,
  Users, Package, TrendingUp, FileCheck
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

const ChiefProcurementSidebar = () => {
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
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Chief Procurement Officer
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement" className={getNavClass}>
                    <LayoutDashboard className="h-5 w-5" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement/requisitions" className={getNavClass}>
                    <ShoppingCart className="h-5 w-5" />
                    {!collapsed && <span>Purchase Requisitions</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement/vendors" className={getNavClass}>
                    <Users className="h-5 w-5" />
                    {!collapsed && <span>Vendor Management</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement/contracts" className={getNavClass}>
                    <FileText className="h-5 w-5" />
                    {!collapsed && <span>Contracts</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement/purchase-orders" className={getNavClass}>
                    <Package className="h-5 w-5" />
                    {!collapsed && <span>Purchase Orders</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement/due-process" className={getNavClass}>
                    <FileCheck className="h-5 w-5" />
                    {!collapsed && <span>Due Process</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement/reports" className={getNavClass}>
                    <TrendingUp className="h-5 w-5" />
                    {!collapsed && <span>Reports</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement/inbox" className={getNavClass}>
                    <Inbox className="h-5 w-5" />
                    {!collapsed && <span>Inbox</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement/documents" className={getNavClass}>
                    <File className="h-5 w-5" />
                    {!collapsed && <span>All Documents</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement/document-communication" className={getNavClass}>
                    <Share className="h-5 w-5" />
                    {!collapsed && <span>Send Document</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement/upload" className={getNavClass}>
                    <Upload className="h-5 w-5" />
                    {!collapsed && <span>Upload Document</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement/audits" className={getNavClass}>
                    <ClipboardList className="h-5 w-5" />
                    {!collapsed && <span>Audit Logs</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/chief-procurement/settings" className={getNavClass}>
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

export default ChiefProcurementSidebar;
