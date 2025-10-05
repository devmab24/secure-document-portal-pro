import { SidebarProvider } from "@/components/ui/sidebar";
import MedicalRecordsSidebar from "./MedicalRecordsSidebar";
import AppHeader from "./AppHeader";

interface MedicalRecordsLayoutProps {
  children: React.ReactNode;
}

const MedicalRecordsLayout = ({ children }: MedicalRecordsLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MedicalRecordsSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MedicalRecordsLayout;
