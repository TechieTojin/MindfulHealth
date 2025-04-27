import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Wallet, Shield, KeyRound, ArrowRight, Info, Coffee, Loader2, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useWeb3Auth } from "@/contexts/Web3AuthContext";

const Web3Login = () => {
  const { connectWallet, connectWithMonad, createWeb3Identity, isAuthenticated, isLoading } = useWeb3Auth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("connect");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [connectionMethod, setConnectionMethod] = useState("");
  
  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && !isLoading) {
      navigate("/connect-device");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Handle progress animation
  useEffect(() => {
    let interval;
    
    if (isConnecting && connectionStep > 0) {
      interval = setInterval(() => {
        setProgressValue(prev => {
          const newValue = prev + 1;
          if (newValue >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newValue;
        });
      }, 50);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnecting, connectionStep]);
  
  const simulateConnectionSteps = async (connectFn, methodName) => {
    setIsConnecting(true);
    setConnectionMethod(methodName);
    setConnectionStep(1);
    setProgressValue(0);
    
    // Step 1: Initializing connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setConnectionStep(2);
    setProgressValue(30);
    
    // Step 2: Connecting to blockchain
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setConnectionStep(3);
    setProgressValue(60);
    
    // Step 3: Verifying identity
    const success = await connectFn();
    
    if (success) {
      setConnectionStep(4);
      setProgressValue(100);
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate("/connect-device");
    } else {
      setConnectionStep(0);
      setIsConnecting(false);
    }
  };
  
  const handleConnectWallet = async () => {
    await simulateConnectionSteps(connectWallet, "wallet");
  };
  
  const handleConnectMonad = async () => {
    await simulateConnectionSteps(connectWithMonad, "monad");
  };
  
  const handleCreateIdentity = async () => {
    await simulateConnectionSteps(createWeb3Identity, "identity");
  };
  
  const getConnectionStepLabel = () => {
    switch (connectionStep) {
      case 1: return "Initializing connection...";
      case 2: return "Connecting to blockchain...";
      case 3: return "Verifying identity...";
      case 4: return "Connection successful!";
      default: return "";
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-health-primary/20 flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-health-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Animated background particles
  const particles = [...Array(20)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full bg-health-primary/10"
      initial={{ 
        top: `${Math.random() * 100}%`, 
        left: `${Math.random() * 100}%`,
        scale: Math.random() * 0.5 + 0.5
      }}
      animate={{ 
        top: `${Math.random() * 100}%`, 
        left: `${Math.random() * 100}%`,
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{ 
        duration: Math.random() * 10 + 10, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ 
        width: `${Math.random() * 30 + 10}px`,
        height: `${Math.random() * 30 + 10}px`,
      }}
    />
  ));
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        {particles}
      </div>
      
      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-health-primary to-health-accent rounded-full blur opacity-60 animate-pulse-subtle"></div>
              <Heart className="h-8 w-8 text-health-primary relative" />
            </div>
            <span>MindfulHealth</span>
          </Link>
        </div>
        
        <AnimatePresence mode="wait">
          {isConnecting ? (
            <motion.div
              key="connecting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 overflow-hidden backdrop-blur-sm bg-background/95">
                <div className="absolute inset-0 bg-gradient-to-br from-health-primary/5 to-health-accent/5 opacity-30"></div>
                <CardHeader className="space-y-1 relative">
                  <CardTitle className="text-2xl font-bold">Web3 Authentication</CardTitle>
                  <CardDescription>
                    {connectionMethod === "wallet" ? "Connecting your wallet" : 
                     connectionMethod === "monad" ? "Authenticating with Monad" : 
                     "Creating your Web3 identity"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative py-6">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <motion.div 
                      className={`h-20 w-20 rounded-full flex items-center justify-center relative ${
                        connectionStep === 4 ? 'bg-green-100 dark:bg-green-950/20' : 'bg-health-primary/10'
                      }`}
                      animate={{ 
                        scale: [1, 1.05, 1],
                        boxShadow: connectionStep === 4 
                          ? ['0 0 0 rgba(74, 222, 128, 0)', '0 0 30px rgba(74, 222, 128, 0.4)', '0 0 0 rgba(74, 222, 128, 0)'] 
                          : ['0 0 0 rgba(42, 157, 143, 0)', '0 0 20px rgba(42, 157, 143, 0.2)', '0 0 0 rgba(42, 157, 143, 0)']
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={connectionStep}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          {connectionStep === 4 ? (
                            <CheckCircle className="h-10 w-10 text-green-500" />
                          ) : (
                            <Loader2 className="h-10 w-10 text-health-primary animate-spin" />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                    
                    <div className="w-full space-y-3">
                      <h3 className="text-lg font-medium text-center">
                        {getConnectionStepLabel()}
                      </h3>
                      
                      <div className="w-full space-y-1">
                        <Progress 
                          value={progressValue} 
                          className="h-2 w-full rounded-full bg-muted [&>div]:bg-gradient-to-r [&>div]:from-health-primary [&>div]:to-health-accent" 
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Initializing</span>
                          <span>Connecting</span>
                          <span>Verifying</span>
                          <span>Complete</span>
                        </div>
                      </div>
                    </div>
                    
                    {connectionStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center"
                      >
                        <p className="text-sm text-muted-foreground mb-2">Redirecting to device connection...</p>
                        <div className="flex justify-center">
                          <Loader2 className="h-5 w-5 text-health-primary animate-spin" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
                
                {connectionStep < 4 && (
                  <CardFooter className="flex justify-center">
                    <Button 
                      variant="ghost" 
                      className="text-sm"
                      onClick={() => {
                        setIsConnecting(false);
                        setConnectionStep(0);
                      }}
                    >
                      Cancel
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 overflow-hidden backdrop-blur-sm bg-background/95">
                <div className="absolute inset-0 bg-gradient-to-br from-health-primary/5 to-health-accent/5 opacity-30"></div>
                <CardHeader className="space-y-1 relative">
                  <CardTitle className="text-2xl font-bold">Web3 Authentication</CardTitle>
                  <CardDescription>
                    Connect with your Web3 identity to access your health dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Tabs 
                    defaultValue="connect" 
                    className="w-full"
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="connect">Connect</TabsTrigger>
                      <TabsTrigger value="monad">Monad Auth</TabsTrigger>
                      <TabsTrigger value="create">Create ID</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="connect" className="space-y-6">
                      <motion.div 
                        className="px-4 py-6 bg-muted/30 rounded-xl relative overflow-hidden"
                        whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="z-10 relative">
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-health-primary" />
                            Connect Wallet
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Connect your existing wallet to authenticate and access your health data
                          </p>
                          
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Button
                              className="w-full rounded-lg bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90 group"
                              onClick={handleConnectWallet}
                            >
                              Connect Wallet
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </motion.div>
                        </div>
                        
                        <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-health-primary/10 to-transparent"></div>
                      </motion.div>
                      
                      <div className="text-center text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <Shield className="h-3 w-3" />
                          <span>Secure and private connection</span>
                        </div>
                        <p>Your data is controlled by you</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="monad" className="space-y-6">
                      <motion.div 
                        className="px-4 py-6 bg-muted/30 rounded-xl relative overflow-hidden"
                        whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="z-10 relative">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-health-accent flex items-center justify-center text-white text-xs font-bold">M</div>
                              Monad Authentication
                            </h3>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-[200px] text-xs">Monad provides decentralized identity management with enhanced privacy features</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4">
                            Use Monad's secure authentication to protect your health data with Web3 technology
                          </p>
                          
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Button
                              className="w-full rounded-lg bg-gradient-to-r from-health-accent to-purple-600 hover:opacity-90 text-white group"
                              onClick={handleConnectMonad}
                            >
                              Continue with Monad
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </motion.div>
                        </div>
                        
                        <div className="absolute top-0 right-0 bottom-0 w-28 bg-gradient-to-l from-health-accent/10 to-transparent"></div>
                      </motion.div>
                      
                      <div className="flex items-center text-xs text-muted-foreground gap-4 justify-center">
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          <span>Data sovereignty</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <KeyRound className="h-3 w-3" />
                          <span>Identity ownership</span>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="create" className="space-y-6">
                      <motion.div 
                        className="px-4 py-6 bg-muted/30 rounded-xl relative overflow-hidden"
                        whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="z-10 relative">
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <KeyRound className="h-5 w-5 text-health-primary" />
                            Create Web3 Identity
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            New to Web3? Create a new decentralized identity to securely store your health data
                          </p>
                          
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Button
                              className="w-full rounded-lg bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90 group"
                              onClick={handleCreateIdentity}
                            >
                              Create Web3 ID
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </motion.div>
                        </div>
                        
                        <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-health-primary/10 to-transparent"></div>
                      </motion.div>
                      
                      <div className="text-center text-xs text-muted-foreground">
                        <p className="flex items-center justify-center gap-1">
                          <Coffee className="h-3 w-3" />
                          <span>No email or password required</span>
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 relative">
                  <div className="relative flex items-center w-full">
                    <div className="flex-grow border-t border-border"></div>
                    <div className="px-3 text-xs text-muted-foreground">SECURITY & PRIVACY</div>
                    <div className="flex-grow border-t border-border"></div>
                  </div>
                  
                  <div className="grid grid-cols-3 w-full gap-4 text-xs">
                    <motion.div 
                      className="text-center"
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="h-8 w-8 rounded-full bg-health-primary/10 flex items-center justify-center mx-auto mb-1">
                        <Shield className="h-4 w-4 text-health-primary" />
                      </div>
                      <span className="text-muted-foreground">Secure</span>
                    </motion.div>
                    <motion.div 
                      className="text-center"
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="h-8 w-8 rounded-full bg-health-accent/10 flex items-center justify-center mx-auto mb-1">
                        <KeyRound className="h-4 w-4 text-health-accent" />
                      </div>
                      <span className="text-muted-foreground">Private</span>
                    </motion.div>
                    <motion.div 
                      className="text-center"
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-1">
                        <Wallet className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-muted-foreground">Owned by you</span>
                    </motion.div>
                  </div>
                  
                  <div className="text-center text-sm mt-4">
                    <Link to="/" className="text-health-primary hover:underline text-sm">
                      Back to home
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Web3Login; 