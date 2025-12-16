import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, Department } from "@/lib/types";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: Department;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, userData: { firstName: string; lastName: string; role: UserRole; department: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("AuthProvider rendering, isLoading:", isLoading, "user:", user?.email || "none");

  const normalizeRole = (rawRole: unknown): UserRole => {
    const role = String(rawRole ?? "").trim();

    // Handle legacy/alternate role names coming from old seed data or manual inserts
    switch (role) {
      case UserRole.CMD:
        return UserRole.CMD;
      case UserRole.CMAC:
      case "CMAC_OFFICER":
        return UserRole.CMAC;
      case UserRole.HEAD_OF_NURSING:
      case "HEAD_NURSING":
      case "HEAD_OF_NURSING_OFFICER":
        return UserRole.HEAD_OF_NURSING;
      case UserRole.REGISTRY:
      case "REGISTRY_OFFICER":
        return UserRole.REGISTRY;
      case UserRole.DIRECTOR_ADMIN:
      case "DIRECTORADMIN":
      case "DIRECTOR_ADMIN_OFFICER":
        return UserRole.DIRECTOR_ADMIN;
      case UserRole.CHIEF_ACCOUNTANT:
      case "CA":
        return UserRole.CHIEF_ACCOUNTANT;
      case UserRole.CHIEF_PROCUREMENT_OFFICER:
      case "CHIEF_PROCUREMENT":
      case "CPO":
        return UserRole.CHIEF_PROCUREMENT_OFFICER;
      case UserRole.MEDICAL_RECORDS_OFFICER:
      case "MEDICAL_RECORDS":
      case "MEDRECORDS":
        return UserRole.MEDICAL_RECORDS_OFFICER;
      case UserRole.HOD:
        return UserRole.HOD;
      case UserRole.STAFF:
        return UserRole.STAFF;
      case UserRole.ADMIN:
        return UserRole.ADMIN;
      case UserRole.SUPER_ADMIN:
        return UserRole.SUPER_ADMIN;
      default:
        return UserRole.STAFF;
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      // Try database first
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      if (profile) {
        return {
          id: profile.id,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          role: normalizeRole(profile.role),
          department: profile.department as Department,
          avatarUrl: undefined,
        };
      }

      // Fallback to auth.user().user_metadata
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata;
        return {
          id: user.id,
          email: user.email!,
          firstName: meta.first_name || "",
          lastName: meta.last_name || "",
          role: normalizeRole(meta.role),
          department: ((meta.department as Department) || "") as Department,
        };
      }
    } catch (error) {
      console.error("Error in profile fetch:", error);
    }
    return null;
  };

  useEffect(() => {
    console.log("AuthProvider initializing...");

    // IMPORTANT: onAuthStateChange callback must stay synchronous to avoid deadlocks.
    // If we need extra Supabase calls, defer them with setTimeout.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setSession(session);

      if (session?.user) {
        // Prevent protected routes from redirecting while we fetch profile
        setIsLoading(true);

        setTimeout(() => {
          fetchUserProfile(session.user.id)
            .then((userProfile) => {
              console.log("Setting user profile:", userProfile);
              setUser(userProfile);
            })
            .catch((error) => {
              console.error("Error setting user profile:", error);
              setUser(null);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }, 0);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }

        console.log("Initial session check:", session?.user?.email || "none");

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          setUser(userProfile);
          setSession(session);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log("Login attempt for:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log("Login failed:", error.message);
        return { success: false, error: error.message };
      }

      console.log("Login successful for:", data.user?.email);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    userData: { firstName: string; lastName: string; role: UserRole; department: string }
  ): Promise<{ success: boolean; error?: string }> => {
    console.log("Signup attempt for:", email);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
            department: userData.department
          }
        }
      });

      if (error) {
        console.log("Signup failed:", error.message);
        return { success: false, error: error.message };
      }

      console.log("Signup successful for:", data.user?.email);
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const logout = async (): Promise<void> => {
    console.log("Logging out user");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      signup,
      logout,
      isLoading
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

