
import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <AppHeader />
      <div className="flex flex-1 w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
