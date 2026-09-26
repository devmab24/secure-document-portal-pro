import { NavLink } from "react-router-dom";
import { LayoutDashboard, ScrollText, FileSearch, ShieldAlert, FileText, Settings } from "lucide-react";
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

const AuditorSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary border-r-2 border-primary font-semibold w-full flex items-center gap-2 p-2 rounded-md"
      : "hover:bg-primary/5 hover:text-primary text-muted-foreground w-full flex items-center gap-2 p-2 rounded-md transition-colors";

  const items = [
    { to: "/dashboard/auditor", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/dashboard/auditor/audit-logs", icon: ScrollText, label: "Audit Logs" },
    { to: "/dashboard/auditor/access-logs", icon: FileSearch, label: "Access Logs" },
    { to: "/dashboard/auditor/security-alerts", icon: ShieldAlert, label: "Security Alerts" },
    { to: "/dashboard/auditor/documents", icon: FileText, label: "Documents (Read-Only)" },
    { to: "/dashboard/auditor/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} pt-12 border-r border-border transition-all duration-300 ease-in-out`}
      collapsible="icon"
    >
      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Internal Audit
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => (
                <SidebarMenuItem key={it.to}>
                  <SidebarMenuButton asChild>
                    <NavLink to={it.to} end={it.end} className={getNavClass}>
                      <it.icon className="h-5 w-5" />
                      {!collapsed && <span>{it.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AuditorSidebar;
