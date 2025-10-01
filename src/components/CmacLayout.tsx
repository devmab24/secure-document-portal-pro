import { SidebarProvider } from "@/components/ui/sidebar";
import CmacSidebar from "./CmacSidebar";
import AppHeader from "./AppHeader";

interface CmacLayoutProps {
  children: React.ReactNode;
}

const CmacLayout = ({ children }: CmacLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CmacSidebar />
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

export default CmacLayout;
