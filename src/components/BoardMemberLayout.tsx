import { SidebarProvider } from "@/components/ui/sidebar";
import BoardMemberSidebar from "./BoardMemberSidebar";
import AppHeader from "./AppHeader";

interface BoardMemberLayoutProps {
  children: React.ReactNode;
}

const BoardMemberLayout = ({ children }: BoardMemberLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <BoardMemberSidebar />
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

export default BoardMemberLayout;
