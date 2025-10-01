import { SidebarProvider } from "@/components/ui/sidebar";
import HeadOfNursingSidebar from "./HeadOfNursingSidebar";
import AppHeader from "./AppHeader";

interface HeadOfNursingLayoutProps {
  children: React.ReactNode;
}

const HeadOfNursingLayout = ({ children }: HeadOfNursingLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <HeadOfNursingSidebar />
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

export default HeadOfNursingLayout;
