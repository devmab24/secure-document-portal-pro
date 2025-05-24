
import { ReactNode } from "react";
import DepartmentSpecificSidebar from "./DepartmentSpecificSidebar";
import AppHeader from "./AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

const DepartmentLayout = ({ children }: { children: ReactNode }) => {
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

export default DepartmentLayout;
