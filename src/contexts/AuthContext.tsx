
import React, { createContext, useContext, useEffect } from "react";
import { User } from "@/lib/types";
import { mockUsers } from "@/lib/mock-data";
import { useAppDispatch, useAppSelector } from "@/store";
import { setUser, logout as logoutAction, setLoading } from "@/store/slices/authSlice";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector(state => state.auth);

  console.log("AuthProvider rendering, isLoading:", loading, "user:", user ? `${user.firstName} ${user.lastName}` : "none");

  useEffect(() => {
    console.log("AuthProvider initializing...");
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log("Found stored user:", userData.email);
        dispatch(setUser(userData));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem('user');
        dispatch(setLoading(false));
      }
    } else {
      console.log("No stored user found");
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login attempt for:", email);
    
    // Simple authentication check
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === "password") {
      console.log("Login successful for:", foundUser.email);
      localStorage.setItem('user', JSON.stringify(foundUser));
      dispatch(setUser(foundUser));
      return true;
    }
    
    console.log("Login failed for:", email);
    return false;
  };

  const logout = () => {
    console.log("Logging out user");
    localStorage.removeItem('user');
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading: loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
