
import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col">
        <AppHeader />
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
