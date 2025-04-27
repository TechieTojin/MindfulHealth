import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// These interfaces would be replaced with actual Monad Web3 types in production
interface Web3Account {
  address: string;
  ens?: string;
  avatar?: string;
  chainId: string;
}

interface Web3User {
  id: string;
  name?: string;
  profileImage?: string;
  account: Web3Account;
  did?: string;
}

interface Web3AuthContextType {
  user: Web3User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<boolean>;
  connectWithMonad: () => Promise<boolean>;
  createWeb3Identity: () => Promise<boolean>;
  disconnect: () => void;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

// Mock Web3 wallet connection - would be replaced with actual Monad SDK in production
const mockConnectWallet = async (): Promise<Web3Account | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate connection success
      resolve({
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        ens: "healthuser.eth",
        chainId: "0x1"
      });
    }, 1000);
  });
};

// Mock Monad authentication - would be replaced with actual Monad SDK
const mockAuthWithMonad = async (account: Web3Account): Promise<Web3User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "user-id-123",
        name: "Health Enthusiast",
        profileImage: "https://t4.ftcdn.net/jpg/00/87/28/19/360_F_87281963_29bnkFXa6RQnJYWeRfrSpieagNxw1Rru.jpg",
        account,
        did: "did:monad:123456789"
      });
    }, 1000);
  });
};

export const Web3AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Web3User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const storedUser = localStorage.getItem("web3user");
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to parse user data", error);
          localStorage.removeItem("web3user");
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Connect wallet function
  const connectWallet = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Connect wallet
      const account = await mockConnectWallet();
      
      if (!account) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Connection failed",
          description: "Failed to connect to wallet. Please try again.",
        });
        return false;
      }
      
      // Get user from Monad using connected wallet
      const web3User = await mockAuthWithMonad(account);
      
      if (web3User) {
        localStorage.setItem("web3user", JSON.stringify(web3User));
        setUser(web3User);
        setIsAuthenticated(true);
        toast({
          title: "Connected",
          description: "Successfully connected your wallet",
        });
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Wallet connection error:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "An error occurred during wallet connection.",
      });
      return false;
    }
  };

  // Connect with Monad directly
  const connectWithMonad = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock account from Monad
      const account = {
        address: "0x3ee6Bdb2e8CD019957AB37851301Ee970c1D1cbf",
        chainId: "0x1"
      };
      
      // Get user from Monad
      const web3User = await mockAuthWithMonad(account);
      
      if (web3User) {
        localStorage.setItem("web3user", JSON.stringify(web3User));
        setUser(web3User);
        setIsAuthenticated(true);
        toast({
          title: "Connected with Monad",
          description: "Successfully authenticated with Monad",
        });
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Monad connection error:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "An error occurred during Monad authentication.",
      });
      return false;
    }
  };

  // Create a new Web3 identity
  const createWeb3Identity = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock creating a new identity
      const account = {
        address: "0x4d8a15212209D59d63B3979B71457d5f6C4e41E0",
        chainId: "0x1"
      };
      
      // Create user with new identity
      const web3User = {
        id: "new-user-id-456",
        name: "New Health User",
        account,
        did: "did:monad:new-user-789"
      };
      
      localStorage.setItem("web3user", JSON.stringify(web3User));
      setUser(web3User);
      setIsAuthenticated(true);
      toast({
        title: "Identity Created",
        description: "Successfully created your Web3 identity",
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Identity creation error:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: "An error occurred while creating your Web3 identity.",
      });
      return false;
    }
  };

  // Disconnect function
  const disconnect = () => {
    localStorage.removeItem("web3user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
    toast({
      title: "Disconnected",
      description: "You've been successfully logged out.",
    });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    connectWallet,
    connectWithMonad,
    createWeb3Identity,
    disconnect
  };

  return <Web3AuthContext.Provider value={value}>{children}</Web3AuthContext.Provider>;
};

export const useWeb3Auth = (): Web3AuthContextType => {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
}; 