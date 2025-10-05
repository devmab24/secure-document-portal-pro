import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Inbox,
  Users,
  Shield,
  BarChart3,
  Archive,
  Settings,
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
} from "@/components/ui/sidebar";

const MedicalRecordsSidebar = () => {
  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/dashboard/medical-records",
    },
    {
      title: "Patient Records",
      icon: FolderOpen,
      url: "/dashboard/medical-records/patient-records",
    },
    {
      title: "Clinical Documents",
      icon: FileText,
      url: "/dashboard/medical-records/clinical-docs",
    },
    {
      title: "Inbox",
      icon: Inbox,
      url: "/dashboard/medical-records/inbox",
    },
    {
      title: "Compliance",
      icon: Shield,
      url: "/dashboard/medical-records/compliance",
    },
    {
      title: "Statistics & Reports",
      icon: BarChart3,
      url: "/dashboard/medical-records/reports",
    },
    {
      title: "Records Retention",
      icon: Archive,
      url: "/dashboard/medical-records/retention",
    },
    {
      title: "Departments",
      icon: Users,
      url: "/dashboard/medical-records/departments",
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/settings",
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Medical Records</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
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

export default MedicalRecordsSidebar;
