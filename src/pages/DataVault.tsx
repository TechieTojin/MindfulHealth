import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Download, 
  Database, 
  Activity, 
  Utensils, 
  MessageSquare, 
  Award, 
  ToggleLeft, 
  RefreshCw, 
  Trash2, 
  FileLock2, 
  ArrowUpRight,
  Check,
  Lock,
  Radio,
  Wifi,
  WifiOff
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import PageTitle from "@/components/layout/PageTitle";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BaseBlockchainService, WorkoutLog as BlockchainWorkoutLog, FoodEntry as BlockchainFoodEntry, AIInteraction as BlockchainAIInteraction, Reward as BlockchainReward } from '@/services/baseBlockchainService';
import { toast } from '@/components/ui/use-toast';

// Mock data structures
interface DataStat {
  category: string;
  count: number;
  size: string;
  lastUpdated: string;
  icon: React.ElementType;
  color: string;
}

interface DataPermission {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

interface WorkoutLog {
  id: string;
  date: string;
  type: string;
  duration: number;
  calories: number;
  exercises: number;
  verified: boolean;
}

interface FoodEntry {
  id: string;
  date: string;
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  verified: boolean;
}

interface AIInteraction {
  id: string;
  date: string;
  type: string;
  query: string;
  response: string;
  verified: boolean;
}

interface Reward {
  id: string;
  date: string;
  name: string;
  description: string;
  category: string;
  verified: boolean;
}

// Mock data
const dataStats: DataStat[] = [
  { 
    category: "Workout Logs", 
    count: 128, 
    size: "8.4 MB", 
    lastUpdated: "Today", 
    icon: Activity,
    color: "text-blue-500 dark:text-blue-400" 
  },
  { 
    category: "Food History", 
    count: 342, 
    size: "12.7 MB", 
    lastUpdated: "Yesterday", 
    icon: Utensils,
    color: "text-green-500 dark:text-green-400" 
  },
  { 
    category: "AI Interactions", 
    count: 89, 
    size: "4.2 MB", 
    lastUpdated: "3 days ago", 
    icon: MessageSquare,
    color: "text-violet-500 dark:text-violet-400" 
  },
  { 
    category: "Rewards & Achievements", 
    count: 26, 
    size: "2.1 MB", 
    lastUpdated: "Last week", 
    icon: Award,
    color: "text-amber-500 dark:text-amber-400" 
  }
];

const dataPermissions: DataPermission[] = [
  {
    id: "workout-sharing",
    name: "Workout Data Sharing",
    description: "Allow anonymous workout data to be used for improving recommendations",
    isEnabled: true
  },
  {
    id: "nutrition-sharing",
    name: "Nutrition Data Sharing",
    description: "Allow anonymous nutrition data to be used for meal suggestions",
    isEnabled: false
  },
  {
    id: "ai-interaction",
    name: "AI Interaction Logs",
    description: "Store conversation history with AI coach for better personalization",
    isEnabled: true
  },
  {
    id: "reward-sharing",
    name: "Achievement Sharing",
    description: "Share achievements publicly with the community",
    isEnabled: true
  }
];

// Initial mock data
const initialWorkoutLogs: WorkoutLog[] = [
  { id: "w1", date: "2023-07-10", type: "Strength Training", duration: 45, calories: 320, exercises: 8, verified: true },
  { id: "w2", date: "2023-07-08", type: "HIIT", duration: 30, calories: 380, exercises: 6, verified: true },
  { id: "w3", date: "2023-07-05", type: "Yoga", duration: 60, calories: 220, exercises: 12, verified: true },
  { id: "w4", date: "2023-07-03", type: "Running", duration: 35, calories: 410, exercises: 1, verified: true },
  { id: "w5", date: "2023-07-01", type: "Cycling", duration: 50, calories: 480, exercises: 1, verified: true }
];

const initialFoodEntries: FoodEntry[] = [
  { id: "f1", date: "2023-07-10", meal: "Breakfast", calories: 450, protein: 22, carbs: 48, fat: 18, verified: true },
  { id: "f2", date: "2023-07-10", meal: "Lunch", calories: 680, protein: 35, carbs: 65, fat: 22, verified: true },
  { id: "f3", date: "2023-07-09", meal: "Dinner", calories: 720, protein: 42, carbs: 58, fat: 26, verified: true },
  { id: "f4", date: "2023-07-09", meal: "Snack", calories: 180, protein: 8, carbs: 22, fat: 6, verified: true },
  { id: "f5", date: "2023-07-08", meal: "Breakfast", calories: 380, protein: 18, carbs: 42, fat: 14, verified: true }
];

const initialAIInteractions: AIInteraction[] = [
  { 
    id: "ai1", 
    date: "2023-07-10", 
    type: "Training", 
    query: "How can I improve my running form?", 
    response: "Focus on maintaining a slight forward lean, landing midfoot...", 
    verified: true 
  },
  { 
    id: "ai2", 
    date: "2023-07-08", 
    type: "Nutrition", 
    query: "What should I eat before a workout?", 
    response: "Consider consuming a balanced meal with carbohydrates and protein...", 
    verified: true 
  },
  { 
    id: "ai3", 
    date: "2023-07-05", 
    type: "Mental Health", 
    query: "How can I reduce stress before sleep?", 
    response: "Try implementing a wind-down routine that includes...", 
    verified: true 
  },
  { 
    id: "ai4", 
    date: "2023-07-02", 
    type: "Recovery", 
    query: "Best stretches for sore legs?", 
    response: "For sore legs, focus on static stretches holding for 30 seconds...", 
    verified: true 
  }
];

const initialRewards: Reward[] = [
  { 
    id: "r1", 
    date: "2023-07-10", 
    name: "Consistency Champion", 
    description: "Completed workouts 5 days in a row", 
    category: "Workout",
    verified: true 
  },
  { 
    id: "r2", 
    date: "2023-07-08", 
    name: "Nutrition Ninja", 
    description: "Logged all meals for 14 consecutive days", 
    category: "Nutrition",
    verified: true 
  },
  { 
    id: "r3", 
    date: "2023-07-05", 
    name: "Mindfulness Master", 
    description: "Completed 10 meditation sessions", 
    category: "Mental Health",
    verified: true 
  },
  { 
    id: "r4", 
    date: "2023-07-01", 
    name: "Early Bird", 
    description: "Completed 5 workouts before 8am", 
    category: "Workout",
    verified: true 
  }
];

// Adapter functions to convert between blockchain and component types
const adaptWorkoutLog = (log: BlockchainWorkoutLog): WorkoutLog => ({
  id: log.id,
  date: log.date.toISOString().split('T')[0],
  type: log.type,
  duration: log.duration,
  calories: log.caloriesBurned,
  exercises: log.notes ? parseInt(log.notes) || 1 : 1,
  verified: true
});

const adaptFoodEntry = (entry: BlockchainFoodEntry): FoodEntry => ({
  id: entry.id,
  date: entry.date.toISOString().split('T')[0],
  meal: entry.mealType,
  calories: entry.calories,
  protein: entry.protein,
  carbs: entry.carbs,
  fat: entry.fat,
  verified: true
});

const adaptAIInteraction = (interaction: BlockchainAIInteraction): AIInteraction => ({
  id: interaction.id,
  date: interaction.date.toISOString().split('T')[0],
  type: interaction.category,
  query: interaction.query,
  response: interaction.response,
  verified: true
});

const adaptReward = (reward: BlockchainReward): Reward => ({
  id: reward.id,
  date: reward.date.toISOString().split('T')[0],
  name: reward.type,
  description: reward.reason,
  category: 'Achievement',
  verified: true
});

const DataVault = () => {
  const [permissions, setPermissions] = useState<DataPermission[]>(dataPermissions);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(initialWorkoutLogs);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(initialFoodEntries);
  const [aiInteractions, setAiInteractions] = useState<AIInteraction[]>(initialAIInteractions);
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [newItemIndicators, setNewItemIndicators] = useState({
    workouts: false,
    food: false,
    ai: false,
    rewards: false
  });
  
  // Initialize blockchain service
  const blockchainService = new BaseBlockchainService();
  
  useEffect(() => {
    // Load data on component mount
    loadData();
    
    // Set up event listeners
    blockchainService.onWorkoutLogsUpdated((data) => {
      handleWorkoutLogsUpdate(data.map(adaptWorkoutLog));
      if (realtimeEnabled) {
        setNewItemIndicators(prev => ({ ...prev, workouts: true }));
        // Show toast notification for new data
        toast({
          title: "New Workout Data",
          description: "Real-time workout data received from blockchain",
        });
      }
    });
    
    blockchainService.onFoodHistoryUpdated((data) => {
      handleFoodHistoryUpdate(data.map(adaptFoodEntry));
      if (realtimeEnabled) {
        setNewItemIndicators(prev => ({ ...prev, food: true }));
        toast({
          title: "New Nutrition Data",
          description: "Real-time nutrition data received from blockchain",
        });
      }
    });
    
    blockchainService.onAIInteractionsUpdated((data) => {
      handleAIInteractionsUpdate(data.map(adaptAIInteraction));
      if (realtimeEnabled) {
        setNewItemIndicators(prev => ({ ...prev, ai: true }));
        toast({
          title: "New AI Interaction",
          description: "Real-time AI interaction data received from blockchain",
        });
      }
    });
    
    blockchainService.onRewardsUpdated((data) => {
      handleRewardsUpdate(data.map(adaptReward));
      if (realtimeEnabled) {
        setNewItemIndicators(prev => ({ ...prev, rewards: true }));
        toast({
          title: "New Achievement",
          description: "You've earned a new achievement!"
        });
      }
    });
    
    blockchainService.onSyncCompleted(handleSyncCompleted);
    
    // Cleanup listeners on unmount
    return () => {
      blockchainService.offWorkoutLogsUpdated((data) => handleWorkoutLogsUpdate(data.map(adaptWorkoutLog)));
      blockchainService.offFoodHistoryUpdated((data) => handleFoodHistoryUpdate(data.map(adaptFoodEntry)));
      blockchainService.offAIInteractionsUpdated((data) => handleAIInteractionsUpdate(data.map(adaptAIInteraction)));
      blockchainService.offRewardsUpdated((data) => handleRewardsUpdate(data.map(adaptReward)));
      blockchainService.offSyncCompleted(handleSyncCompleted);
      
      // Disable real-time updates if they were enabled
      if (realtimeEnabled) {
        blockchainService.stopRealtimeUpdates();
      }
    };
  }, []);
  
  // Effect to handle real-time updates toggling
  useEffect(() => {
    if (realtimeEnabled) {
      const success = blockchainService.startRealtimeUpdates();
      if (success) {
        toast({
          title: "Real-time Updates Enabled",
          description: "You will now receive real-time updates from the blockchain",
        });
      } else {
        setRealtimeEnabled(false);
        toast({
          variant: "destructive",
          title: "Failed to Enable Real-time Updates",
          description: "Please try again later",
        });
      }
    } else {
      blockchainService.stopRealtimeUpdates();
    }
  }, [realtimeEnabled]);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [workoutData, foodData, aiData, rewardData] = await Promise.all([
        blockchainService.fetchWorkoutLogs(),
        blockchainService.fetchFoodHistory(),
        blockchainService.fetchAIInteractions(),
        blockchainService.fetchRewards()
      ]);
      
      setWorkoutLogs(workoutData.map(adaptWorkoutLog));
      setFoodEntries(foodData.map(adaptFoodEntry));
      setAiInteractions(aiData.map(adaptAIInteraction));
      setRewards(rewardData.map(adaptReward));
      
      // Get last sync timestamp
      const timestamp = blockchainService.getLastSyncTimestamp('all');
      setLastSync(timestamp);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Data Load Failed",
        description: "Could not load your health data from the blockchain.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleWorkoutLogsUpdate = (data: WorkoutLog[]) => {
    setWorkoutLogs(data);
  };
  
  const handleFoodHistoryUpdate = (data: FoodEntry[]) => {
    setFoodEntries(data);
  };
  
  const handleAIInteractionsUpdate = (data: AIInteraction[]) => {
    setAiInteractions(data);
  };
  
  const handleRewardsUpdate = (data: Reward[]) => {
    setRewards(data);
  };
  
  const handleSyncCompleted = (success: boolean) => {
    setIsSyncing(false);
    if (success) {
      const timestamp = blockchainService.getLastSyncTimestamp('all');
      setLastSync(timestamp);
      toast({
        title: "Sync Complete",
        description: "Your health data has been successfully synced with the blockchain.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "There was an error syncing your health data with the blockchain.",
      });
    }
  };

  const togglePermission = (id: string) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, isEnabled: !p.isEnabled } : p
    ));
  };

  const handleDataSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Sync Started",
      description: "Syncing your health data with the blockchain..."
    });
    
    try {
      await blockchainService.syncWithBlockchain();
      // The handleSyncCompleted callback will handle the toast notifications
    } catch (error) {
      console.error("Sync error:", error);
      setIsSyncing(false);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "There was an error syncing your health data.",
      });
    }
  };
  
  const toggleRealtimeUpdates = () => {
    setRealtimeEnabled(!realtimeEnabled);
  };
  
  // Reset indicators when tab is selected
  const handleTabChange = (tab: string) => {
    if (tab === 'workouts') {
      setNewItemIndicators(prev => ({ ...prev, workouts: false }));
    } else if (tab === 'food') {
      setNewItemIndicators(prev => ({ ...prev, food: false }));
    } else if (tab === 'ai') {
      setNewItemIndicators(prev => ({ ...prev, ai: false }));
    } else if (tab === 'rewards') {
      setNewItemIndicators(prev => ({ ...prev, rewards: false }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageTitle 
          title="My Data Vault" 
          subtitle="Securely manage your health data stored on Base blockchain"
        />
        
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={realtimeEnabled ? "default" : "outline"} 
                  size="sm"
                  onClick={toggleRealtimeUpdates}
                  className={`gap-2 ${realtimeEnabled ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {realtimeEnabled ? (
                    <Wifi className="h-4 w-4" />
                  ) : (
                    <WifiOff className="h-4 w-4" />
                  )}
                  {realtimeEnabled ? "Real-time On" : "Real-time Off"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{realtimeEnabled ? "Disable" : "Enable"} real-time blockchain updates</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                  onClick={handleDataSync}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : lastSync ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {isSyncing ? "Syncing..." : "Sync Data"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Manually sync your data with the blockchain</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm"
                  className="gap-2 bg-health-primary hover:bg-health-dark"
                >
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download all your data in JSON format</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Base Blockchain Integration Card */}
      <Card className="border-border/50 bg-gradient-to-br from-[#0052FF]/5 to-[#0052FF]/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0 bg-[#0052FF] rounded-xl p-3">
              {/* Base logo (simplified) */}
              <div className="text-white font-bold text-2xl">B</div>
            </div>
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Base-Powered Data Security</h3>
                <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20">
                  Decentralized
                </Badge>
                {realtimeEnabled && (
                  <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20">
                    <Wifi className="h-3 w-3 mr-1" /> Real-time
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Your health data is securely stored on Base blockchain, giving you complete ownership and control.
                No one, not even us, can access your data without your explicit permission.
              </p>
              <div className="flex items-center gap-2 text-sm pt-2">
                <Lock className="h-4 w-4 text-[#0052FF]" />
                <span className="text-[#0052FF] font-medium">End-to-end encrypted</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  Last verified: {lastSync ? lastSync.toLocaleString() : 'Never'}
                </span>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="gap-2 border-[#0052FF]/20 text-[#0052FF] hover:bg-[#0052FF]/10 whitespace-nowrap">
              <ArrowUpRight className="h-4 w-4" />
              View on Base
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dataStats.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      <h3 className="font-medium">{stat.category}</h3>
                      {/* Add real-time indicator based on category */}
                      {realtimeEnabled && (
                        <div className="relative">
                          <Radio className="h-3 w-3 text-green-500" />
                          {index === 0 && newItemIndicators.workouts && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                          )}
                          {index === 1 && newItemIndicators.food && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                          )}
                          {index === 2 && newItemIndicators.ai && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                          )}
                          {index === 3 && newItemIndicators.rewards && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-3xl font-bold mt-2">
                      {index === 0 ? workoutLogs.length : 
                       index === 1 ? foodEntries.length : 
                       index === 2 ? aiInteractions.length : 
                       rewards.length}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {stat.size} • Updated {stat.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="workouts" className="space-y-6" onValueChange={handleTabChange}>
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full max-w-xl grid-cols-4">
            <TabsTrigger value="workouts" className="text-xs sm:text-sm relative">
              Workout Logs
              {newItemIndicators.workouts && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-health-primary rounded-full animate-pulse"></span>
              )}
            </TabsTrigger>
            <TabsTrigger value="food" className="text-xs sm:text-sm relative">
              Food History
              {newItemIndicators.food && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-health-primary rounded-full animate-pulse"></span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs sm:text-sm relative">
              AI Interactions
              {newItemIndicators.ai && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-health-primary rounded-full animate-pulse"></span>
              )}
            </TabsTrigger>
            <TabsTrigger value="rewards" className="text-xs sm:text-sm relative">
              Rewards
              {newItemIndicators.rewards && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-health-primary rounded-full animate-pulse"></span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
            <FileLock2 className="h-4 w-4" />
            Data Permissions
          </Button>
        </div>
        
        {/* Workout Logs Tab */}
        <TabsContent value="workouts" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Workout Logs
                {realtimeEnabled && (
                  <Badge variant="outline" className="ml-2 bg-green-600/10 text-green-600 border-green-600/20">
                    <Wifi className="h-3 w-3 mr-1" /> Real-time
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Your workout history securely stored on Base blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-7 font-medium text-xs p-4 bg-muted/50">
                  <div>Date</div>
                  <div>Type</div>
                  <div>Duration</div>
                  <div>Calories</div>
                  <div>Exercises</div>
                  <div className="text-center">Verified</div>
                  <div className="text-right">Actions</div>
                </div>
                <Separator />
                {workoutLogs.map((log, index) => (
                  <div key={log.id}>
                    <div className="grid grid-cols-7 text-sm p-4 items-center hover:bg-muted/40 transition-colors">
                      <div>{new Date(log.date).toLocaleDateString()}</div>
                      <div>{log.type}</div>
                      <div>{log.duration} min</div>
                      <div>{log.calories} kcal</div>
                      <div>{log.exercises}</div>
                      <div className="text-center">
                        {log.verified ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800/30">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/30">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < workoutLogs.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">View All Workout Data</Button>
              <Button variant="outline" size="sm" className="gap-2 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                <Trash2 className="h-4 w-4" />
                Delete All
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Food History Tab */}
        <TabsContent value="food" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Utensils className="h-5 w-5 text-green-500" />
                Food History
                {realtimeEnabled && (
                  <Badge variant="outline" className="ml-2 bg-green-600/10 text-green-600 border-green-600/20">
                    <Wifi className="h-3 w-3 mr-1" /> Real-time
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Your nutrition and meal data securely stored on Base blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-7 font-medium text-xs p-4 bg-muted/50">
                  <div>Date</div>
                  <div>Meal</div>
                  <div>Calories</div>
                  <div>Protein</div>
                  <div>Carbs</div>
                  <div className="text-center">Verified</div>
                  <div className="text-right">Actions</div>
                </div>
                <Separator />
                {foodEntries.map((entry, index) => (
                  <div key={entry.id}>
                    <div className="grid grid-cols-7 text-sm p-4 items-center hover:bg-muted/40 transition-colors">
                      <div>{new Date(entry.date).toLocaleDateString()}</div>
                      <div>{entry.meal}</div>
                      <div>{entry.calories} kcal</div>
                      <div>{entry.protein}g</div>
                      <div>{entry.carbs}g</div>
                      <div className="text-center">
                        {entry.verified ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800/30">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/30">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < foodEntries.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">View All Nutrition Data</Button>
              <Button variant="outline" size="sm" className="gap-2 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                <Trash2 className="h-4 w-4" />
                Delete All
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* AI Interactions Tab */}
        <TabsContent value="ai" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-violet-500" />
                AI Interactions
                {realtimeEnabled && (
                  <Badge variant="outline" className="ml-2 bg-green-600/10 text-green-600 border-green-600/20">
                    <Wifi className="h-3 w-3 mr-1" /> Real-time
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Your conversations with AI coaches securely stored on Base blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 font-medium text-xs p-4 bg-muted/50">
                  <div>Date</div>
                  <div>Type</div>
                  <div>Query</div>
                  <div className="text-center">Verified</div>
                  <div className="text-right">Actions</div>
                </div>
                <Separator />
                {aiInteractions.map((interaction, index) => (
                  <div key={interaction.id}>
                    <div className="grid grid-cols-5 text-sm p-4 items-center hover:bg-muted/40 transition-colors">
                      <div>{new Date(interaction.date).toLocaleDateString()}</div>
                      <div>{interaction.type}</div>
                      <div className="truncate max-w-[200px]">{interaction.query}</div>
                      <div className="text-center">
                        {interaction.verified ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800/30">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/30">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < aiInteractions.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">View All AI Interactions</Button>
              <Button variant="outline" size="sm" className="gap-2 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                <Trash2 className="h-4 w-4" />
                Delete All
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Rewards & Achievements
                {realtimeEnabled && (
                  <Badge variant="outline" className="ml-2 bg-green-600/10 text-green-600 border-green-600/20">
                    <Wifi className="h-3 w-3 mr-1" /> Real-time
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Your achievements and rewards securely stored on Base blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 font-medium text-xs p-4 bg-muted/50">
                  <div>Date</div>
                  <div>Achievement</div>
                  <div>Category</div>
                  <div className="text-center">Verified</div>
                  <div className="text-right">Actions</div>
                </div>
                <Separator />
                {rewards.map((reward, index) => (
                  <div key={reward.id}>
                    <div className="grid grid-cols-5 text-sm p-4 items-center hover:bg-muted/40 transition-colors">
                      <div>{new Date(reward.date).toLocaleDateString()}</div>
                      <div className="font-medium">{reward.name}</div>
                      <div>{reward.category}</div>
                      <div className="text-center">
                        {reward.verified ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800/30">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/30">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < rewards.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">View All Achievements</Button>
              <Button variant="outline" size="sm" className="gap-2 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                <Trash2 className="h-4 w-4" />
                Delete All
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Data Permissions Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-health-primary" />
            Data Permissions
          </CardTitle>
          <CardDescription>
            Control how your data is used and shared
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <h3 className="font-medium">{permission.name}</h3>
                  <p className="text-sm text-muted-foreground">{permission.description}</p>
                </div>
                <Switch
                  checked={permission.isEnabled}
                  onCheckedChange={() => togglePermission(permission.id)}
                  className="data-[state=checked]:bg-health-primary"
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Your data is always encrypted and stored securely on Base blockchain.
          </p>
          <Button variant="outline" size="sm">
            Update Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DataVault; 