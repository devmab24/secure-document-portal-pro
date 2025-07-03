
import React from 'react';
import AppHeader from './AppHeader';
import { useAuth } from '@/contexts/AuthContext';
import { RoleSwitcher } from './RoleSwitcher';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>{children}</main>
      <RoleSwitcher />
    </div>
  );
};

export default AppLayout;
