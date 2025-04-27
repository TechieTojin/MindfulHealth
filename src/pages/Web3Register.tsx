import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Wallet, Shield, KeyRound, ArrowRight, Info, Check, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWeb3Auth } from "@/contexts/Web3AuthContext";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const Web3Register = () => {
  const { createWeb3Identity, isLoading: authLoading } = useWeb3Auth();
  const navigate = useNavigate();
  const [isCreatingID, setIsCreatingID] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [registrationSteps, setRegistrationSteps] = useState<{
    step: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    completed: boolean;
  }[]>([
    {
      step: 1,
      title: "Generate Wallet",
      description: "Creating your secure digital wallet",
      icon: <Wallet className="h-5 w-5" />,
      completed: false
    },
    {
      step: 2,
      title: "Establish Identity",
      description: "Registering on the blockchain",
      icon: <KeyRound className="h-5 w-5" />,
      completed: false
    },
    {
      step: 3,
      title: "Finalize Setup",
      description: "Completing your profile setup",
      icon: <CheckCircle className="h-5 w-5" />,
      completed: false
    }
  ]);
  
  useEffect(() => {
    if (step === 2) {
      simulateRegistrationSteps();
    }
  }, [step]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step > 1 && step < 5 && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
    }
    
    return () => clearInterval(interval);
  }, [step, progress]);
  
  const simulateRegistrationSteps = async () => {
    // Step 1: Generate Wallet
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRegistrationSteps(prev => 
      prev.map(s => s.step === 1 ? { ...s, completed: true } : s)
    );
    
    // Step 2: Establish Identity
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRegistrationSteps(prev => 
      prev.map(s => s.step === 2 ? { ...s, completed: true } : s)
    );
    
    // Step 3: Finalize Setup
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRegistrationSteps(prev => 
      prev.map(s => s.step === 3 ? { ...s, completed: true } : s)
    );
    
    setStep(4);
    setTimeout(() => navigate("/connect-device"), 2000);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName) {
      setError("Please enter a display name");
      return;
    }
    
    setError("");
    setIsCreatingID(true);
    setProgress(0);
    setStep(2);
    
    try {
      // Call createWeb3Identity and await the result
      const success = await createWeb3Identity();
      
      if (!success) {
        // Handle failure case
        setError("Failed to create Web3 identity. Please try again.");
        setStep(1);
      }
    } catch (error) {
      console.error("Error creating Web3 identity:", error);
      setError("An unexpected error occurred. Please try again.");
      setStep(1);
    } finally {
      setIsCreatingID(false);
    }
  };
  
  if (authLoading) {
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
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-float rounded-full bg-gradient-to-r from-health-primary/10 to-health-accent/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 20 + 15}s`,
              opacity: 0.3
            }}
          ></div>
        ))}
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
        
        <Card className="border-border/50 overflow-hidden backdrop-blur-sm bg-background/95">
          <div className="absolute inset-0 bg-gradient-to-br from-health-primary/5 to-health-accent/5 opacity-30"></div>
          <CardHeader className="space-y-1 relative">
            <CardTitle className="text-2xl font-bold">Create Web3 Identity</CardTitle>
            <CardDescription>
              Set up your decentralized identity for secure health data management
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="How you want to be known"
                        className="border-border/50"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        This will be your public identity name
                      </p>
                    </div>
                    
                    <div className="px-4 py-4 bg-muted/30 rounded-xl space-y-3">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4 text-health-primary" />
                        Your Web3 Identity Benefits
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-500" />
                          </div>
                          <span>Full ownership of your health data</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-500" />
                          </div>
                          <span>Secure, privacy-first authentication</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-500" />
                          </div>
                          <span>Single identity across health services</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full rounded-lg bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90 group"
                      disabled={isCreatingID}
                    >
                      Create Web3 Identity
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </form>
                </motion.div>
              )}
              
              {step > 1 && step < 5 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6"
                >
                  <div className="space-y-6">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold mb-1">Setting Up Your Identity</h3>
                      <p className="text-sm text-muted-foreground">Creating your secure Web3 identity...</p>
                    </div>
                    
                    <div className="mb-6">
                      <div className="mb-2 flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="space-y-4">
                      {registrationSteps.map((regStep, index) => (
                        <div 
                          key={regStep.step}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            regStep.completed 
                              ? "border-green-500/30 bg-green-500/5" 
                              : index === registrationSteps.findIndex(s => !s.completed) 
                                ? "border-health-primary/30 bg-health-primary/5 animate-pulse" 
                                : "border-border/50 bg-transparent"
                          }`}
                        >
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            regStep.completed 
                              ? "bg-green-500/20 text-green-500" 
                              : index === registrationSteps.findIndex(s => !s.completed)
                                ? "bg-health-primary/20 text-health-primary"
                                : "bg-muted/30 text-muted-foreground"
                          }`}>
                            {regStep.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : index === registrationSteps.findIndex(s => !s.completed) ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              regStep.icon
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {regStep.title}
                              {regStep.completed && <span className="ml-2 text-green-500 text-xs">✓ Complete</span>}
                            </div>
                            <div className="text-xs text-muted-foreground">{regStep.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center"
                >
                  <div className="flex flex-col items-center">
                    <motion.div 
                      className="relative mb-6"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10 }}
                    >
                      <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center relative z-10">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-md opacity-30"></div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-xl font-semibold mb-2">Identity Created!</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-4">
                        Your Web3 identity has been successfully created. Your health data is now secure and under your control.
                      </p>
                      <div className="flex justify-center">
                        <div className="inline-block px-3 py-1 bg-green-500/10 text-green-500 text-xs rounded-full font-medium">
                          Redirecting to dashboard...
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 relative">
            {step === 1 && (
              <>
                <div className="relative flex items-center w-full">
                  <div className="flex-grow border-t border-border"></div>
                  <div className="px-3 text-xs text-muted-foreground">OR</div>
                  <div className="flex-grow border-t border-border"></div>
                </div>
                
                <div className="w-full">
                  <Link to="/web3-login">
                    <Button 
                      variant="outline" 
                      className="w-full border-border/50 hover:bg-background/80 hover:text-health-primary"
                    >
                      Already have a Web3 identity? Sign in
                    </Button>
                  </Link>
                </div>
              </>
            )}
            
            <div className="text-center text-xs text-muted-foreground mt-4">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Shield className="h-3 w-3" />
                <span>Secure and private by design</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center gap-1 cursor-help">
                      <Info className="h-3 w-3" />
                      <span className="underline decoration-dotted">How is my data protected?</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[250px] p-3">
                    <p className="text-xs">Your health data is stored in a decentralized format, encrypted with your personal keys. Only you can grant or revoke access to your information.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Web3Register; 