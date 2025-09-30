import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "./AppHeader";
import DepartmentSpecificSidebar from "./DepartmentSpecificSidebar";

const DirectorAdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col">
        <AppHeader />
        <div className="flex flex-1 w-full">
          <DepartmentSpecificSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DirectorAdminLayout;
