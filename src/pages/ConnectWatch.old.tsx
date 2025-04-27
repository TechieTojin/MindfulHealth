import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Watch, CheckCircle, Wifi } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import PageTitle from '@/components/layout/PageTitle';

const ConnectWatch = () => {
  console.log("ConnectWatch component rendered");
  
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  // 0 = Initial state
  // 1 = Scanning (3 seconds)
  // 2 = Found device, connecting (15 seconds)
  // 3 = Connected (6 seconds before redirect)
  
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    console.log("ConnectWatch effect running, current step:", step);
    let timer;
    
    if (step === 1) {
      // Scanning animation - 3 seconds
      setProgress(0);
      timer = setTimeout(() => {
        console.log("Moving to step 2: Device found");
        setStep(2);
      }, 3000);
    } 
    else if (step === 2) {
      // Found & connecting animation - 15 seconds
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          const newValue = prev + (100 / 150); // 100% in 15 seconds (with 100ms interval)
          return newValue >= 100 ? 100 : newValue;
        });
      }, 100);
      
      timer = setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        console.log("Moving to step 3: Connected");
        setStep(3);
      }, 15000);
    }
    else if (step === 3) {
      // Connected state - redirect after 6 seconds
      timer = setTimeout(() => {
        console.log("Navigating to dashboard");
        navigate('/dashboard');
      }, 6000);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [step, navigate]);
  
  const handleConnectClick = () => {
    console.log("Connect button clicked, starting process");
    setStep(1);
  };
  
  return (
    <div className="container py-8 max-w-md mx-auto">
      <div className="text-xs bg-yellow-100 dark:bg-yellow-900/20 p-2 mb-2 rounded text-yellow-800 dark:text-yellow-200">
        Debug: Current step: {step} | Progress: {progress.toFixed(1)}%
      </div>
      
      <PageTitle 
        title="Connect Your Watch" 
        subtitle="Connect your fitness watch to track your workouts and health metrics" 
      />
      
      <Card className="border border-border/40 shadow-lg overflow-hidden mt-8">
        <CardContent className="p-8 flex flex-col items-center text-center">
          {/* Top Icon */}
          <div className="mb-6 rounded-full bg-muted p-4">
            {step === 3 ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : (
              <Watch className={`h-12 w-12 ${step > 0 ? 'text-health-primary' : 'text-muted-foreground'}`} />
            )}
          </div>
          
          {/* Initial State */}
          {step === 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Ready to sync your fitness data?</h3>
              <p className="text-sm text-muted-foreground">
                Connect your fitness watch to enable real-time tracking, workout analysis, and personalized recommendations.
              </p>
              <Button 
                onClick={handleConnectClick} 
                size="lg" 
                className="mt-4 w-full bg-health-primary hover:bg-health-primary/90"
              >
                Connect My Watch
              </Button>
            </div>
          )}
          
          {/* Scanning */}
          {step === 1 && (
            <div className="space-y-6 w-full">
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.9, 1, 0.9]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="relative"
                >
                  <Wifi className="h-8 w-8 text-health-primary" />
                  <motion.div 
                    className="absolute inset-0 rounded-full border-4 border-health-primary/30"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.8, 0, 0.8]
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                  />
                </motion.div>
              </div>
              <h3 className="text-lg font-medium">Scanning for devices...</h3>
              <Progress value={50} className="h-2 w-full" />
              <p className="text-sm text-muted-foreground">
                Please make sure your watch is turned on and within range
              </p>
            </div>
          )}
          
          {/* Found & Connecting */}
          {step === 2 && (
            <div className="space-y-6 w-full">
              <h3 className="text-lg font-medium">Device Found!</h3>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center">
                  <Watch className="h-5 w-5 mr-3 text-health-primary" />
                  <span className="font-medium">Tojin's Watch</span>
                </div>
                <div className="text-xs bg-health-primary/10 text-health-primary px-2 py-1 rounded-full">
                  Connecting...
                </div>
              </motion.div>
              <Progress value={progress} className="h-2 w-full" />
              <p className="text-sm text-muted-foreground">
                Establishing connection with your device
              </p>
            </div>
          )}
          
          {/* Connected */}
          {step === 3 && (
            <div className="space-y-6 w-full">
              <h3 className="text-xl font-medium text-green-500">Watch Connected ✅</h3>
              <motion.div 
                className="flex items-center justify-between p-3 border border-green-500/30 bg-green-50 dark:bg-green-900/20 rounded-lg"
                animate={{ 
                  boxShadow: ['0 0 0 0 rgba(0,0,0,0)', '0 0 0 4px rgba(42, 157, 143, 0.2)', '0 0 0 0 rgba(0,0,0,0)']
                }}
                transition={{ duration: 2, repeat: 2 }}
              >
                <div className="flex items-center">
                  <Watch className="h-5 w-5 mr-3 text-green-500" />
                  <span className="font-medium">Tojin's Watch</span>
                </div>
                <div className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                  Active
                </div>
              </motion.div>
              <p className="text-sm text-muted-foreground">
                Your watch is now connected and syncing data
              </p>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">Redirecting to dashboard in a few seconds...</p>
                <Loader2 className="h-6 w-6 animate-spin text-health-primary mx-auto mt-2" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectWatch; 