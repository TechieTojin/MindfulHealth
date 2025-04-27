import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Watch, CheckCircle, Smartphone, Scan, Wifi, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import PageTitle from '@/components/layout/PageTitle';

const ConnectDevice = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  // 0 = Initial state
  // 1 = Scanning (3 seconds)
  // 2 = Found devices, connecting (15 seconds)
  // 3 = Connected (6 seconds before redirect)
  
  const [progress, setProgress] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  
  const devices = [
    { id: '1', name: "Tojin's Watch", type: 'watch', batteryLevel: 86 },
    { id: '2', name: "Jaiby's A56", type: 'smartphone', batteryLevel: 72 },
    { id: '3', name: "Tojin's S25", type: 'smartphone', batteryLevel: 95 }
  ];
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    if (step === 1) {
      // Scanning animation - 3 seconds
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newValue = prev + (100 / 30); // 100% in 3 seconds (with 100ms interval)
          return newValue >= 100 ? 100 : newValue;
        });
      }, 100);
      
      timer = setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setStep(2);
      }, 3000);
    } 
    else if (step === 2) {
      // Wait for device selection
      if (selectedDevice) {
        // Found & connecting animation - 15 seconds
        setProgress(0);
        progressInterval = setInterval(() => {
          setProgress(prev => {
            const newValue = prev + (100 / 150); // 100% in 15 seconds (with 100ms interval)
            return newValue >= 100 ? 100 : newValue;
          });
        }, 100);
        
        timer = setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setStep(3);
        }, 15000);
      }
    }
    else if (step === 3) {
      // Connected state - redirect after 6 seconds
      timer = setTimeout(() => {
        navigate('/dashboard');
      }, 6000);
    }
    
    return () => {
      clearTimeout(timer);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [step, navigate, selectedDevice]);
  
  const handleConnectClick = () => {
    setStep(1);
  };
  
  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevice(deviceId);
    // Automatically start connecting after device selection
    setProgress(0);
    setStep(2);
  };
  
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'watch':
        return <Watch className="h-5 w-5 mr-3 text-health-primary" />;
      case 'smartphone':
        return <Smartphone className="h-5 w-5 mr-3 text-health-primary" />;
      default:
        return <Smartphone className="h-5 w-5 mr-3 text-health-primary" />;
    }
  };
  
  const renderDeviceList = () => {
    return devices.map(device => (
      <motion.div 
        key={device.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * Number(device.id) }}
        onClick={() => handleSelectDevice(device.id)}
        className={`flex items-center justify-between p-4 border rounded-xl mb-3 cursor-pointer hover:bg-muted/50 transition-colors ${selectedDevice === device.id ? 'border-health-primary bg-health-primary/5' : ''}`}
        whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${selectedDevice === device.id ? 'bg-health-primary/10' : 'bg-muted'}`}>
            {getDeviceIcon(device.type)}
          </div>
          <div className="ml-2">
            <span className="font-medium block">{device.name}</span>
            <span className="text-xs text-muted-foreground">Battery: {device.batteryLevel}%</span>
          </div>
        </div>
        <div className="flex items-center">
          {selectedDevice === device.id ? (
            <div className="text-xs bg-health-primary/20 text-health-primary px-2 py-1 rounded-full animate-pulse">
              Connecting...
            </div>
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </motion.div>
    ));
  };
  
  const getSelectedDeviceName = () => {
    const device = devices.find(d => d.id === selectedDevice);
    return device ? device.name : "";
  };
  
  // Background particles
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
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        {particles}
      </div>
      
      <div className="w-full max-w-lg z-10">
        <PageTitle 
          title="Connect Your Device" 
          subtitle="Connect your fitness device to track your health metrics" 
        />
        
        <div className="w-full mt-8">
          <div className="relative mb-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-health-primary to-health-accent"
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <div className={`text-xs font-medium ${step >= 0 ? 'text-health-primary' : 'text-muted-foreground'}`}>Start</div>
              <div className={`text-xs font-medium ${step >= 1 ? 'text-health-primary' : 'text-muted-foreground'}`}>Scanning</div>
              <div className={`text-xs font-medium ${step >= 2 ? 'text-health-primary' : 'text-muted-foreground'}`}>Connecting</div>
              <div className={`text-xs font-medium ${step >= 3 ? 'text-health-primary' : 'text-muted-foreground'}`}>Complete</div>
            </div>
          </div>
          
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm shadow-lg overflow-hidden rounded-xl perspective-1000">
            <CardContent className="p-8 flex flex-col items-center text-center">
              {/* Top Icon */}
              <motion.div 
                className={`mb-6 rounded-full p-6 ${step === 3 ? 'bg-green-50 dark:bg-green-950/30' : 'bg-muted/70'}`}
                animate={{ 
                  scale: step === 0 ? [1, 1.05, 1] : 1,
                  boxShadow: step === 3 ? ['0 0 0 rgba(74, 222, 128, 0)', '0 0 20px rgba(74, 222, 128, 0.4)', '0 0 0 rgba(74, 222, 128, 0)'] : 'none'
                }}
                transition={{ 
                  repeat: step === 0 || step === 3 ? Infinity : 0, 
                  duration: step === 0 ? 2 : 1.5 
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step === 3 ? (
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    ) : step === 1 ? (
                      <Scan className="h-12 w-12 text-health-primary" />
                    ) : (
                      <Smartphone className={`h-12 w-12 ${step > 0 ? 'text-health-primary' : 'text-muted-foreground'}`} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              
              <AnimatePresence mode="wait">
                {/* Initial State */}
                {step === 0 && (
                  <motion.div 
                    className="space-y-6"
                    key="initial"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl font-medium">Ready to sync your fitness data?</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your fitness device to enable real-time tracking, health analysis, and personalized recommendations.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button 
                        onClick={handleConnectClick} 
                        size="lg" 
                        className="mt-4 w-full bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90 text-white rounded-xl"
                      >
                        Connect Your Device
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
                
                {/* Scanning */}
                {step === 1 && (
                  <motion.div 
                    className="space-y-6 w-full"
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-center">
                      <motion.div
                        className="relative"
                      >
                        <Wifi className="h-10 w-10 text-health-primary" />
                        {[...Array(3)].map((_, i) => (
                          <motion.div 
                            key={i}
                            className="absolute inset-0 rounded-full border-4 border-health-primary/30"
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{
                              scale: [1, 2, 1],
                              opacity: [0.8, 0, 0.8]
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 2, 
                              ease: "easeOut",
                              delay: i * 0.4
                            }}
                          />
                        ))}
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-medium">Scanning for devices...</h3>
                    <Progress 
                      value={progress} 
                      className="h-2 w-full rounded-full bg-muted [&>div]:bg-gradient-to-r [&>div]:from-health-primary [&>div]:to-health-accent" 
                    />
                    <p className="text-sm text-muted-foreground">
                      Please make sure your device is turned on and within range
                    </p>
                  </motion.div>
                )}
                
                {/* Found Devices */}
                {step === 2 && !selectedDevice && (
                  <motion.div 
                    className="space-y-6 w-full"
                    key="devices"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-medium">Devices Found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select your device to connect
                    </p>
                    {renderDeviceList()}
                  </motion.div>
                )}
                
                {/* Connecting to Selected Device */}
                {step === 2 && selectedDevice && (
                  <motion.div 
                    className="space-y-6 w-full"
                    key="connecting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-medium">Connecting to Device</h3>
                    <motion.div 
                      className="flex items-center justify-between p-4 border border-health-primary/30 bg-health-primary/5 rounded-xl"
                      animate={{ 
                        boxShadow: ['0 0 0 0 rgba(42, 157, 143, 0)', '0 0 8px rgba(42, 157, 143, 0.3)', '0 0 0 0 rgba(42, 157, 143, 0)']
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-health-primary/10">
                          {getDeviceIcon(devices.find(d => d.id === selectedDevice)?.type || 'smartphone')}
                        </div>
                        <div className="ml-2">
                          <span className="font-medium block">{getSelectedDeviceName()}</span>
                          <span className="text-xs text-muted-foreground">
                            Battery: {devices.find(d => d.id === selectedDevice)?.batteryLevel || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="text-xs bg-health-primary/20 text-health-primary px-3 py-1.5 rounded-full animate-pulse">
                        Connecting...
                      </div>
                    </motion.div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Establishing connection</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress 
                        value={progress} 
                        className="h-2 w-full rounded-full bg-muted [&>div]:bg-gradient-to-r [&>div]:from-health-primary [&>div]:to-health-accent" 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Please keep your device nearby while we establish a secure connection
                    </p>
                  </motion.div>
                )}
                
                {/* Connected */}
                {step === 3 && (
                  <motion.div 
                    className="space-y-6 w-full"
                    key="connected"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="flex flex-col items-center"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      <motion.div 
                        className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 mb-4"
                        animate={{ 
                          boxShadow: ['0 0 0 rgba(74, 222, 128, 0)', '0 0 15px rgba(74, 222, 128, 0.4)', '0 0 0 rgba(74, 222, 128, 0)']
                        }}
                        transition={{ duration: 2, repeat: 3 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Connection Successful</span>
                      </motion.div>
                      <h3 className="text-2xl font-bold text-green-600 dark:text-green-500">
                        {getSelectedDeviceName()} Connected
                      </h3>
                    </motion.div>
                    <motion.div 
                      className="flex items-center justify-between p-4 border border-green-500/30 bg-green-50 dark:bg-green-900/20 rounded-xl"
                      animate={{ 
                        y: [0, -5, 0],
                        boxShadow: ['0 4px 12px rgba(74, 222, 128, 0.1)', '0 8px 20px rgba(74, 222, 128, 0.2)', '0 4px 12px rgba(74, 222, 128, 0.1)']
                      }}
                      transition={{ duration: 2, repeat: 2 }}
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-green-500/10">
                          {getDeviceIcon(devices.find(d => d.id === selectedDevice)?.type || 'smartphone')}
                        </div>
                        <div className="ml-2">
                          <span className="font-medium block">{getSelectedDeviceName()}</span>
                          <span className="text-xs text-muted-foreground">
                            Battery: {devices.find(d => d.id === selectedDevice)?.batteryLevel || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full">
                        Active
                      </div>
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                      Your device is now connected and syncing data with Mindful Health Hub
                    </p>
                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">Redirecting to dashboard in a few seconds...</p>
                      <Loader2 className="h-6 w-6 animate-spin text-health-primary mx-auto mt-2" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
          
          {/* Features promo */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: "🏃‍♂️", title: "Activity Tracking", description: "Real-time stats" },
              { icon: "💓", title: "Heart Monitor", description: "24/7 monitoring" },
              { icon: "🔔", title: "Notifications", description: "Stay updated" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="p-4 border rounded-xl bg-card/70 backdrop-blur-sm text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h4 className="text-sm font-medium">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectDevice; 