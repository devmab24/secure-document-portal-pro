import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, FileText, Inbox, ClipboardList, Settings } from "lucide-react";
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

const BoardMemberSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary border-r-2 border-primary font-semibold w-full flex items-center gap-2 p-2 rounded-md"
      : "hover:bg-primary/5 hover:text-primary text-muted-foreground w-full flex items-center gap-2 p-2 rounded-md transition-colors";

  const items = [
    { to: "/dashboard/board-member", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/dashboard/board-member/restricted", icon: ShieldCheck, label: "Board-Restricted" },
    { to: "/dashboard/board-member/approvals", icon: ClipboardList, label: "Approvals" },
    { to: "/dashboard/board-member/documents", icon: FileText, label: "All Documents" },
    { to: "/dashboard/board-member/inbox", icon: Inbox, label: "Inbox" },
    { to: "/dashboard/board-member/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} pt-12 border-r border-border transition-all duration-300 ease-in-out`}
      collapsible="icon"
    >
      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Board of Management
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

export default BoardMemberSidebar;
