
import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AppHeader from "./AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col">
        <AppHeader />
        <div className="flex flex-1 w-full">
          <AdminSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
