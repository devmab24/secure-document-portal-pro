
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Search, Menu, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AppHeader = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    await logout();
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();
  };

  return (
    <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documents..."
            className="pl-10 w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-hospital-100 text-hospital-700">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role} - {user?.department}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
