import { SidebarProvider } from "@/components/ui/sidebar";
import ChiefAccountantSidebar from "./ChiefAccountantSidebar";
import AppHeader from "./AppHeader";

interface ChiefAccountantLayoutProps {
  children: React.ReactNode;
}

const ChiefAccountantLayout = ({ children }: ChiefAccountantLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ChiefAccountantSidebar />
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

export default ChiefAccountantLayout;
