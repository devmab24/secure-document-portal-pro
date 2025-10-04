import { SidebarProvider } from "@/components/ui/sidebar";
import ChiefProcurementSidebar from "./ChiefProcurementSidebar";
import AppHeader from "./AppHeader";

interface ChiefProcurementLayoutProps {
  children: React.ReactNode;
}

const ChiefProcurementLayout = ({ children }: ChiefProcurementLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ChiefProcurementSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChiefProcurementLayout;
