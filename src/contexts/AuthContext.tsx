import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on app load
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated") === "true";
      const userData = localStorage.getItem("user");
      
      if (authStatus && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser({
            name: parsedUser.name,
            email: parsedUser.email
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to parse user data", error);
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("user");
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const storedUser = localStorage.getItem("user");
          
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            
            if (userData.email === email && userData.password === password) {
              // Set auth state
              localStorage.setItem("isAuthenticated", "true");
              
              setUser({
                name: userData.name,
                email: userData.email
              });
              
              setIsAuthenticated(true);
              setIsLoading(false);
              resolve(true);
              return;
            }
          }
          
          setIsLoading(false);
          resolve(false);
        }, 1000);
      });
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const userData = {
            name,
            email,
            password // In a real app, never store plain text passwords
          };
          
          localStorage.setItem("user", JSON.stringify(userData));
          setIsLoading(false);
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 