import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowRight, Shield, KeyRound, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import PageTitle from "@/components/layout/PageTitle";

const Web3Auth = () => {
  const navigate = useNavigate();
  
  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }
  };
  
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  return (
    <div className="container max-w-6xl py-8">
      <PageTitle 
        title="Web3 Authentication" 
        subtitle="Secure your health data with decentralized identity" 
      />
      
      <div className="mt-8 mb-12">
        <div className="bg-health-primary/10 dark:bg-health-primary/5 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
          <div className="max-w-2xl relative z-10">
            <h2 className="text-2xl font-bold mb-2">Take control of your health data</h2>
            <p className="text-muted-foreground">
              With Web3 authentication, your health information is secured using blockchain technology, 
              giving you complete ownership and control over your personal health records.
            </p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-6 w-6 rounded-full bg-health-primary/20 flex items-center justify-center">
                  <Shield className="h-3 w-3 text-health-primary" />
                </div>
                <span>Encrypted & Secure</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="h-6 w-6 rounded-full bg-health-primary/20 flex items-center justify-center">
                  <KeyRound className="h-3 w-3 text-health-primary" />
                </div>
                <span>Decentralized Storage</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="h-6 w-6 rounded-full bg-health-primary/20 flex items-center justify-center">
                  <Wallet className="h-3 w-3 text-health-primary" />
                </div>
                <span>Full Data Ownership</span>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-gradient-to-br from-health-primary/30 to-health-accent/20 blur-2xl"></div>
        </div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div variants={cardVariants} whileHover="hover">
          <Card className="h-full border-border/50 overflow-hidden backdrop-blur-sm bg-background/95">
            <div className="absolute inset-0 bg-gradient-to-br from-health-primary/5 to-health-accent/5 opacity-30"></div>
            <CardHeader className="space-y-1 relative">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Wallet className="h-5 w-5 text-health-primary" />
                Sign In
              </CardTitle>
              <CardDescription>
                Connect with your existing Web3 identity to access your health dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-muted-foreground mb-6">
                Already have a Web3 identity? Sign in securely using your wallet or Monad authentication.
                Your data remains encrypted and under your control.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm border-l-2 border-health-primary pl-3 py-1">
                  <span>Secure connection with blockchain verification</span>
                </div>
                <div className="flex items-center gap-2 text-sm border-l-2 border-health-primary pl-3 py-1">
                  <span>Instant access to your health data</span>
                </div>
                <div className="flex items-center gap-2 text-sm border-l-2 border-health-primary pl-3 py-1">
                  <span>No email or password required</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full rounded-lg bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90 group"
                onClick={() => navigate("/web3-login")}
              >
                Connect & Sign In
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div variants={cardVariants} whileHover="hover">
          <Card className="h-full border-border/50 overflow-hidden backdrop-blur-sm bg-background/95">
            <div className="absolute inset-0 bg-gradient-to-br from-health-accent/5 to-purple-500/5 opacity-30"></div>
            <CardHeader className="space-y-1 relative">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-health-accent" />
                Create Identity
              </CardTitle>
              <CardDescription>
                New to Web3? Set up your decentralized identity for enhanced health privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-muted-foreground mb-6">
                Create a Web3 identity to securely manage your health data. This establishes your 
                unique identity on the blockchain, ensuring your information can only be accessed
                with your permission.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm border-l-2 border-health-accent pl-3 py-1">
                  <span>One-time setup for permanent data security</span>
                </div>
                <div className="flex items-center gap-2 text-sm border-l-2 border-health-accent pl-3 py-1">
                  <span>Self-sovereign identity creation</span>
                </div>
                <div className="flex items-center gap-2 text-sm border-l-2 border-health-accent pl-3 py-1">
                  <span>Full control over health data sharing</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full rounded-lg bg-gradient-to-r from-health-accent to-purple-600 hover:opacity-90 text-white group"
                onClick={() => navigate("/web3-register")}
              >
                Create Web3 Identity
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
      
      <div className="mt-12 text-center">
        <h3 className="text-lg font-medium mb-4">How Web3 Authentication Works</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-muted/30 rounded-xl p-5 relative overflow-hidden">
            <div className="h-10 w-10 rounded-full bg-health-primary/20 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-health-primary">1</span>
            </div>
            <h4 className="font-medium mb-1">Connect Wallet</h4>
            <p className="text-sm text-muted-foreground">Link your Web3 wallet to establish a secure connection</p>
          </div>
          
          <div className="bg-muted/30 rounded-xl p-5 relative overflow-hidden">
            <div className="h-10 w-10 rounded-full bg-health-primary/20 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-health-primary">2</span>
            </div>
            <h4 className="font-medium mb-1">Verify Identity</h4>
            <p className="text-sm text-muted-foreground">Confirm your identity through blockchain verification</p>
          </div>
          
          <div className="bg-muted/30 rounded-xl p-5 relative overflow-hidden">
            <div className="h-10 w-10 rounded-full bg-health-primary/20 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-health-primary">3</span>
            </div>
            <h4 className="font-medium mb-1">Secure Access</h4>
            <p className="text-sm text-muted-foreground">Access your encrypted health data from anywhere, securely</p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 mb-6 text-center">
        <Link to="/" className="text-health-primary hover:underline text-sm">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Web3Auth; 