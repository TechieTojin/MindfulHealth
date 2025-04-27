import { Activity, Brain, Heart, Dumbbell, Sun, ArrowUpRight, Sparkles, Calendar, Flame, Droplets, TrendingUp, Apple, Video, Mic, MessageSquare, Clock, Zap, Medal, ChevronRight, PieChart, Shield, BarChart3, Check, Utensils, Baby } from "lucide-react";
import HealthMetricCard from "@/components/dashboard/HealthMetricCard";
import HealthChart from "@/components/dashboard/HealthChart";
import AIRecommendation from "@/components/dashboard/AIRecommendation";
import MultimodalInput from "@/components/dashboard/MultimodalInput";
import UserProfile from "@/components/dashboard/UserProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Animation variants for staggered elements
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

// Sample sleep data
const sleepData = [
  { name: "Mon", value: 7.2, efficiency: 89 },
  { name: "Tue", value: 6.8, efficiency: 84 },
  { name: "Wed", value: 7.5, efficiency: 92 },
  { name: "Thu", value: 8.1, efficiency: 95 },
  { name: "Fri", value: 7.3, efficiency: 87 },
  { name: "Sat", value: 8.4, efficiency: 94 },
  { name: "Sun", value: 7.9, efficiency: 91 },
];

// Sample heart rate data
const heartRateData = [
  { name: "Mon", value: 68, recovery: 96 },
  { name: "Tue", value: 72, recovery: 92 },
  { name: "Wed", value: 75, recovery: 89 },
  { name: "Thu", value: 69, recovery: 94 },
  { name: "Fri", value: 70, recovery: 93 },
  { name: "Sat", value: 65, recovery: 97 },
  { name: "Sun", value: 67, recovery: 95 },
];

// AI insights with more detailed content and links
const aiInsights = [
  {
    id: 1,
    title: "Sleep quality improvement",
    description: "Your sleep pattern shows improved quality over the last week. Your deep sleep has increased by 14%.",
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    link: "/sleep-insights",
    action: "View sleep details"
  },
  {
    id: 2,
    title: "Meditation recommendation",
    description: "Adding 10 min of meditation could reduce your daily stress peaks. Try our guided sessions.",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    link: "/mental-wellness",
    action: "Start meditation"
  },
  {
    id: 3,
    title: "Workout intensity",
    description: "Your workout consistency is excellent. Increasing intensity by 10% could improve your performance.",
    icon: Dumbbell,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    link: "/workouts",
    action: "Adjust workout plan"
  },
  {
    id: 4,
    title: "Hydration alert",
    description: "Hydration levels are below optimal. Aim for 3L daily for better recovery and performance.",
    icon: Droplets,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    link: "/hydration-tracker",
    action: "Set hydration reminders"
  },
];

// Quick access items with proper links
const quickAccessItems = [
  {
    title: "Meal Planner",
    description: "Plan meals, track nutrition, and discover healthy recipes tailored to your goals.",
    icon: Apple,
    color: "text-health-primary",
    bgColor: "bg-health-primary/10",
    link: "/meal",
    isNew: true
  },
  {
    title: "Workouts",
    description: "Access your workout routines, track progress, and join live training sessions.",
    icon: Dumbbell,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    link: "/workouts"
  },
  {
    title: "AI Voice Assistant",
    description: "Ask health questions, get coaching, and log activities using voice commands.",
    icon: Mic,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    link: "/ai-voice-assistant",
    isNew: true
  },
  {
    title: "Live Training",
    description: "Join live workout sessions with trainers and other members in real-time.",
    icon: Video,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    link: "/live-workout",
    isNew: true
  },
  {
    title: "Analytics",
    description: "View detailed insights and trends about your health and fitness progress.",
    icon: BarChart3,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    link: "/analytics"
  },
  {
    title: "Health Calendar",
    description: "Schedule workouts, meals, and appointments in your personalized calendar.",
    icon: Calendar,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    link: "/calendar"
  },
  {
    title: "Food Scanner",
    description: "Scan food items to instantly get nutritional information and suggestions.",
    icon: Utensils,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    link: "/food-scanner",
    isNew: true
  },
  {
    title: "Health Data Vault",
    description: "Securely store and manage your health data with blockchain protection.",
    icon: Shield,
    color: "text-cyan-600",
    bgColor: "bg-cyan-600/10",
    link: "/data-vault",
    isNew: true
  },
];

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    // Simulate loading
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => {
      clearInterval(timer);
      clearTimeout(loadTimer);
    };
  }, []);
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Get date in nice format
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top Section with User Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-health-primary/10 text-health-primary text-sm font-medium mb-2">
            <Sun className="h-4 w-4 mr-1" /> {getGreeting()}, Tojin
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Your Health Dashboard</h2>
          <p className="text-muted-foreground mt-1">{formattedDate} • Welcome to your personalized health hub</p>
        </div>
        <div className="flex space-x-3">
          <Button asChild variant="outline" className="rounded-lg border-health-primary/50 text-health-primary hover:bg-health-primary/10">
            <Link to="/analytics">
              <PieChart className="mr-1.5 h-4 w-4" /> View Analytics
            </Link>
          </Button>
          <Button asChild className="rounded-lg bg-gradient-to-r from-health-primary to-health-accent text-white hover:opacity-90 transition-all">
            <Link to="/calendar">
              <Calendar className="mr-1.5 h-4 w-4" /> Schedule Workout
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Health overview card */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-none shadow-md bg-card">
            <CardHeader className="bg-gradient-to-r from-health-primary/10 to-health-accent/10 px-6 py-5 border-b">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-health-primary" />
                Health Overview
              </CardTitle>
              <CardDescription>Your key health metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-4">
                {healthMetrics.map((metric, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "p-6 group transition-all hover:bg-muted/30 relative",
                      index < healthMetrics.length - 1 && "border-b md:border-b-0",
                      index < healthMetrics.length - 1 && index % 2 === 0 && "md:border-r",
                      (index === 0 || index === 1) && "lg:border-b",
                      index % 4 !== 3 && "lg:border-r"
                    )}
                  >
                    <Link to={metric.link} className="absolute inset-0 z-10" />
                    <div className="flex justify-between mb-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-health-primary/20 to-health-accent/20 flex items-center justify-center">
                        <metric.icon className="h-5 w-5 text-health-primary" />
                      </div>
                      <div className={cn(
                        "flex items-center text-xs font-medium",
                        metric.trend === "up" && "text-green-500",
                        metric.trend === "down" && "text-blue-500",
                        metric.trend === "neutral" && "text-yellow-500"
                      )}>
                        {metric.trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                        {metric.trend === "down" && <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />}
                        {metric.trendValue}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">{metric.value}</h3>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <div className="mt-3">
                      <div className={cn(
                        "relative h-1.5 w-full overflow-hidden rounded-full bg-muted"
                      )}>
                        <div 
                          className={cn(
                            "absolute h-full",
                            metric.trend === "up" && "bg-green-500",
                            metric.trend === "down" && "bg-blue-500",
                            metric.trend === "neutral" && "bg-yellow-500"
                          )} 
                          style={{ width: `${metric.progressValue}%` }}
        />
      </div>
                    </div>
                    <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Charts Section */}
        <motion.div variants={itemVariants} className="grid gap-8 md:grid-cols-2">
          <Link to="/sleep-insights" className="block hover:opacity-95 transition-opacity">
        <HealthChart 
          title="Sleep Duration (hours)" 
          data={sleepData} 
          dataKey="value" 
          color="#2A9D8F"
        />
          </Link>
          <Link to="/heart-rate" className="block hover:opacity-95 transition-opacity">
        <HealthChart 
          title="Heart Rate (bpm)" 
          data={heartRateData} 
          dataKey="value" 
          color="#7209B7"
        />
          </Link>
        </motion.div>
        
        {/* Three Column Section */}
        <motion.div variants={itemVariants} className="grid gap-8 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden h-full border-none shadow-md">
              <div className="relative h-32 bg-gradient-to-r from-health-primary to-health-accent">
                <div className="absolute inset-0 bg-[url('/mesh-pattern.png')] opacity-20 mix-blend-overlay"></div>
              </div>
              <CardContent className="relative -mt-16 px-6">
                <div className="flex justify-center">
                  <div className="h-28 w-28 rounded-full border-4 border-card bg-card p-1">
                    <Avatar className="h-full w-full">
                      <AvatarImage 
                        src="https://t4.ftcdn.net/jpg/00/87/28/19/360_F_87281963_29bnkFXa6RQnJYWeRfrSpieagNxw1Rru.jpg" 
                        alt="Tojin Varkey Simson"
                      />
                      <AvatarFallback>TVS</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold">Tojin Varkey Simson</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Badge variant="outline" className="bg-health-primary/10 text-health-primary border-health-primary/20">
                      Premium
                    </Badge>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      Level 8
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">Today's Goal</span>
                      <span className="font-medium">75% complete</span>
                    </div>
                    <Progress value={75} className="h-2 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-health-primary [&>div]:to-health-accent" />
                  </div>
                  
                  <div className="flex justify-between py-4 border-t border-b">
                    <div className="text-center">
                      <div className="text-xl font-semibold">7</div>
                      <div className="text-xs text-muted-foreground mt-1">Days Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold">12k</div>
                      <div className="text-xs text-muted-foreground mt-1">Steps Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold">3/5</div>
                      <div className="text-xs text-muted-foreground mt-1">Workouts</div>
                    </div>
                  </div>
                  
                  <Link to="/profile-settings">
                    <Button variant="outline" className="w-full rounded-lg border-health-primary/50 text-health-primary hover:bg-health-primary/10">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
      </div>
      
          {/* AI Insights Card */}
        <div className="md:col-span-1">
            <Card className="h-full border-none shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-health-primary/10 to-health-accent/10 px-6 py-5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-health-primary" />
                  AI Health Insights
                </CardTitle>
                <CardDescription>Personalized recommendations for you</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <li key={index} className="relative">
                      <div className="flex items-start gap-3 pb-4 group transition-all hover:bg-muted/20 px-3 py-2 rounded-lg -mx-3">
                        <div className={cn("h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5", insight.bgColor)}>
                          <insight.icon className={cn("h-4 w-4", insight.color)} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{insight.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                          <Link to={insight.link}>
                            <Button variant="link" className="h-6 px-0 text-xs font-medium text-health-primary hover:text-health-dark">
                              {insight.action} <ArrowUpRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                      {index < aiInsights.length - 1 && <div className="border-t border-border/30 mx-2" />}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="px-6 py-4 border-t bg-muted/20">
                <Button asChild variant="secondary" className="w-full rounded-lg hover:bg-health-primary/10">
                  <Link to="/ai-coach-chat">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat with AI Coach
                  </Link>
                </Button>
              </CardFooter>
            </Card>
        </div>
          
          {/* Today's Focus */}
        <div className="md:col-span-1">
            <Card className="h-full border-none shadow-md">
              <CardHeader className="bg-gradient-to-r from-health-primary/10 to-health-accent/10 px-6 py-5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-health-primary" />
                  Today's Focus
                </CardTitle>
                <CardDescription>Key areas to prioritize today</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {todaysFocus.map((focus, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center",
                        focus.bgColor
                      )}>
                        <focus.icon className={cn("h-6 w-6", focus.iconColor)} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{focus.title}</h4>
                          <span className="text-sm text-muted-foreground">{focus.value}</span>
                        </div>
                        <div className="relative h-1.5 w-full mt-2 overflow-hidden rounded-full bg-muted">
                          <div 
                            className={focus.progressColor} 
                            style={{ 
                              width: `${focus.progress}%`, 
                              height: '100%',
                              position: 'absolute'
                            }} 
          />
        </div>
        </div>
      </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 border-t bg-muted/20">
                <Button asChild className="w-full rounded-lg bg-gradient-to-r from-health-primary to-health-accent text-white hover:opacity-90 transition-all">
                  <Link to="/daily-schedule">
                    <Check className="mr-2 h-4 w-4" />
                    Start Next Activity
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
        
        {/* Quick Access Section */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Quick Access</h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/customize">
                Customize
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {quickAccessItems.map((item, i) => (
              <Card key={i} className="group hover:shadow-md transition-all border-border/40 overflow-hidden">
                <Link to={item.link} className="block h-full">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", item.bgColor)}>
                        <item.icon className={cn("h-5 w-5", item.color)} />
                      </div>
                      {item.isNew && (
                        <Badge variant="outline" className="text-[10px] bg-health-accent/10 text-health-accent border-health-accent/20">
                          New
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base mt-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="line-clamp-2 text-xs">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="flex items-center text-sm text-health-primary font-medium">
                      Open
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-health-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </CardFooter>
                </Link>
              </Card>
            ))}
    </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced health metrics with links
const healthMetrics = [
  {
    title: "Resting Heart Rate",
    value: "68 bpm",
    icon: Heart,
    trend: "down",
    trendValue: "3 bpm",
    progressValue: 68,
    link: "/heart-rate"
  },
  {
    title: "Sleep Quality",
    value: "7.5 hrs",
    icon: Activity,
    trend: "up",
    trendValue: "0.5 hrs",
    progressValue: 75,
    link: "/sleep-insights"
  },
  {
    title: "Stress Level",
    value: "Medium",
    icon: Brain,
    trend: "neutral",
    trendValue: "No change",
    progressValue: 50,
    link: "/mental-wellness"
  },
  {
    title: "Workout Streak",
    value: "7 days",
    icon: Dumbbell,
    trend: "up",
    trendValue: "2 days",
    progressValue: 83,
    link: "/workouts"
  }
];

// Enhanced today's focus items
const todaysFocus = [
  {
    title: "Hydration",
    value: "1.2 / 3.0 L",
    icon: Droplets,
    progress: 40,
    bgColor: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-500",
    progressColor: "bg-blue-500"
  },
  {
    title: "Activity",
    value: "5.4k / 10k steps",
    icon: Flame,
    progress: 54,
    bgColor: "bg-orange-50 dark:bg-orange-950",
    iconColor: "text-orange-500",
    progressColor: "bg-orange-500"
  },
  {
    title: "Meditation",
    value: "0 / 10 min",
    icon: Brain,
    progress: 0,
    bgColor: "bg-purple-50 dark:bg-purple-950",
    iconColor: "text-purple-500",
    progressColor: "bg-purple-500"
  }
];

export default Dashboard;
