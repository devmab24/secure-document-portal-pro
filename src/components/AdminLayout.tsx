
import React from 'react';
import AppHeader from './AppHeader';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { RoleSwitcher } from './RoleSwitcher';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-6">{children}</main>
          </div>
          <RoleSwitcher />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default AdminLayout;
