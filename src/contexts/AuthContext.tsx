
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/utils/toast";

type User = {
  id: string;
  universityId: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (universityId: string, password: string) => Promise<boolean>;
  register: (name: string, universityId: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("klh_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("klh_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (universityId: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Validation
      if (universityId.length !== 10) {
        toast.error("University ID must be 10 digits");
        return false;
      }
      
      // In a real app, this would be an API call to authenticate the user
      // For demo purposes, checking admin credentials (0000000000) or using demo credentials
      const isAdmin = universityId === "0000000000";
      const demoUser = universityId === "9876543210";
      
      // If not admin or demo user and no valid credentials, reject login
      if (!isAdmin && !demoUser && password !== "password") {
        toast.error("Invalid credentials");
        return false;
      }
      
      const newUser = {
        id: `user_${Date.now()}`,
        universityId,
        name: isAdmin ? "Admin User" : "Student User",
        email: `${universityId}@klh.edu.in`,
        role: isAdmin ? "admin" as const : "user" as const,
      };
      
      setUser(newUser);
      localStorage.setItem("klh_user", JSON.stringify(newUser));
      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    universityId: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Validate university ID
      if (universityId.length !== 10 || !/^\d+$/.test(universityId)) {
        toast.error("University ID must be 10 digits");
        return false;
      }

      // Validate email domain
      if (!email.endsWith("@klh.edu.in")) {
        toast.error("Must use a university email (@klh.edu.in)");
        return false;
      }

      // In a real app, this would be an API call to register the user
      const newUser = {
        id: `user_${Date.now()}`,
        universityId,
        name,
        email,
        role: "user" as const,
      };

      setUser(newUser);
      localStorage.setItem("klh_user", JSON.stringify(newUser));
      toast.success("Registration successful!");
      return true;
    } catch (error) {
      console.error("Registration failed", error);
      toast.error("Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("klh_user");
    setUser(null);
    toast.info("You have been logged out");
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isLoading, 
        login, 
        register, 
        logout, 
        isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
