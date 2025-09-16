
import React from 'react';
import AppHeader from './AppHeader';
import { useAuth } from '@/contexts/AuthContext';
// import { RoleSwitcher } from './RoleSwitcher';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background">
          <AppHeader />
          <main>{children}</main>
          {/* <RoleSwitcher /> */}
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default AppLayout;
