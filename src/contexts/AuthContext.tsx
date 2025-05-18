
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Department } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Create context with a meaningful default value for better error messages
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth state from localStorage
  useEffect(() => {
    console.log("AuthProvider initializing...");
    // Check for saved user in localStorage
    const storedUser = localStorage.getItem('hospital-portal-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Found stored user:", parsedUser.email);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('hospital-portal-user');
      }
    } else {
      console.log("No stored user found");
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call to backend auth
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // Debug logs to see if user was found
      console.log("Login attempt for:", email);
      console.log("User found:", foundUser);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('hospital-portal-user', JSON.stringify(foundUser));
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.firstName}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hospital-portal-user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const contextValue = {
    user,
    login,
    logout,
    isLoading
  };

  console.log("AuthProvider rendering, isLoading:", isLoading, "user:", user?.email || "none");

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
