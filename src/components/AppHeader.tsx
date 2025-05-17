
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "@/lib/mock-data";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'U';

  const handleSwitchUser = (userId: string) => {
    // Find the user from mock data
    const selectedUser = mockUsers.find(u => u.id === userId);
    if (selectedUser) {
      // Store the user in localStorage to simulate login
      localStorage.setItem('hospital-portal-user', JSON.stringify(selectedUser));
      // Reload the page to apply the new user context
      window.location.reload();
      toast({
        title: "User switched",
        description: `Switched to ${selectedUser.firstName} ${selectedUser.lastName}`,
      });
    }
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-white">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4" />
        <h1 className="text-xl font-semibold text-primary">
          Secure Document Portal
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Switcher Button */}
        <Button 
          variant="outline" 
          onClick={() => setShowUserSwitcher(!showUserSwitcher)}
          size="sm"
        >
          Switch User
        </Button>

        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout} 
          className="flex items-center"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Logout
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.firstName} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user?.role} - {user?.department}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* User Switcher Panel */}
      {showUserSwitcher && (
        <div className="absolute top-16 right-4 bg-white border border-border rounded-md shadow-lg p-4 z-50">
          <h3 className="text-sm font-medium mb-2">Switch to User:</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {mockUsers.map((mockUser) => (
              <div 
                key={mockUser.id}
                className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-muted ${
                  user?.id === mockUser.id ? "bg-muted" : ""
                }`}
                onClick={() => handleSwitchUser(mockUser.id)}
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={mockUser.avatarUrl} />
                  <AvatarFallback>{`${mockUser.firstName[0]}${mockUser.lastName[0]}`}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{mockUser.firstName} {mockUser.lastName}</p>
                  <p className="text-xs text-muted-foreground">{mockUser.role} - {mockUser.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
