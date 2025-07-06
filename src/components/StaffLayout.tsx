
import React from 'react';
import AppHeader from './AppHeader';
import StaffSidebar from './StaffSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

interface StaffLayoutProps {
  children: React.ReactNode;
}

const StaffLayout = ({ children }: StaffLayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background flex">
          <StaffSidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default StaffLayout;
