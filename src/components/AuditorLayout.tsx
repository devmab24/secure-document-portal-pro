import { SidebarProvider } from "@/components/ui/sidebar";
import AuditorSidebar from "./AuditorSidebar";
import AppHeader from "./AppHeader";

interface AuditorLayoutProps {
  children: React.ReactNode;
}

const AuditorLayout = ({ children }: AuditorLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AuditorSidebar />
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

export default AuditorLayout;
