import React, { useState } from 'react';
import { NutritionProgress } from '@/components/ui/nutrition-progress';
import { ProgressDashboard } from '@/components/dashboard/ProgressDashboard';
import PageTitle from '@/components/layout/PageTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Dumbbell, Heart, Brain, CalendarDays, ArrowUpRight, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FitnessGoalProgress, FitnessGoal } from '@/components/fitness/FitnessGoalProgress';
import { UpdateGoalDialog } from '@/components/fitness/UpdateGoalDialog';
import { toast } from '@/components/ui/use-toast';

// Animation variants
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

const FitnessProgress = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([
    {
      id: '1',
      name: 'Bench Press',
      current: 180,
      target: 225,
      unit: 'lbs',
      category: 'strength',
      startDate: new Date(2023, 5, 15),
      targetDate: new Date(2023, 11, 31),
      progress: 80,
    },
    {
      id: '2',
      name: '5K Run Time',
      current: 28,
      target: 22,
      unit: 'min',
      category: 'cardio',
      startDate: new Date(2023, 6, 1),
      targetDate: new Date(2023, 12, 15),
      progress: 60,
    },
    {
      id: '3',
      name: 'Full Split',
      current: 70,
      target: 100,
      unit: '%',
      category: 'flexibility',
      startDate: new Date(2023, 7, 10),
      targetDate: new Date(2024, 1, 10),
      progress: 70,
    },
    {
      id: '4',
      name: 'Pull-ups',
      current: 8,
      target: 15,
      unit: 'reps',
      category: 'strength',
      startDate: new Date(2023, 6, 1),
      targetDate: new Date(2023, 11, 30),
      progress: 53,
    },
  ]);
  
  // Sample weekly activities
  const weeklyActivities = [
    { day: 'Mon', minutes: 45, type: 'Strength' },
    { day: 'Tue', minutes: 30, type: 'Cardio' },
    { day: 'Wed', minutes: 60, type: 'Strength' },
    { day: 'Thu', minutes: 0, type: 'Rest' },
    { day: 'Fri', minutes: 45, type: 'Cardio' },
    { day: 'Sat', minutes: 90, type: 'Mixed' },
    { day: 'Sun', minutes: 0, type: 'Rest' },
  ];
  
  const getActivityColorClass = (type: string) => {
    switch (type) {
      case 'Strength':
        return 'bg-blue-500';
      case 'Cardio':
        return 'bg-red-500';
      case 'Mixed':
        return 'bg-purple-500';
      default:
        return 'bg-gray-300';
    }
  };
  
  const handleUpdateGoal = (goalId: string) => {
    const goal = fitnessGoals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
      setIsUpdateDialogOpen(true);
    }
  };
  
  const handleSaveGoalUpdate = (goalId: string, newValue: number) => {
    setFitnessGoals(prevGoals => {
      return prevGoals.map(goal => {
        if (goal.id === goalId) {
          const newProgress = Math.min(Math.round((newValue / goal.target) * 100), 100);
          return {
            ...goal,
            current: newValue,
            progress: newProgress
          };
        }
        return goal;
      });
    });
    
    toast({
      title: "Progress Updated",
      description: `Your progress has been updated successfully.`,
    });
  };
  
  const handleViewHistory = (goalId: string) => {
    toast({
      title: "View History",
      description: `Viewing history for goal ID: ${goalId}`,
    });
    // In a real app, this would navigate to a history view or open a dialog
  };
  
  const handleAddNewGoal = () => {
    toast({
      title: "Add New Goal",
      description: "Creating a new fitness goal",
    });
    // In a real app, this would open a dialog to create a new goal
  };
  
  return (
    <div className="space-y-6">
      <PageTitle 
        title="Fitness Progress" 
        subtitle="Track your fitness goals, nutrition, and health metrics"
      />
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Fitness Goals</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Weekly Activity Chart */}
            <motion.div variants={itemVariants}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-health-primary" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>
                    Your workout activity for the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 h-40">
                    {weeklyActivities.map((activity, i) => (
                      <div key={i} className="flex flex-col h-full justify-end text-center">
                        <div className="relative flex-1 flex items-end">
                          <div 
                            className={cn(
                              "w-full rounded-t-md relative", 
                              getActivityColorClass(activity.type)
                            )}
                            style={{ height: `${(activity.minutes / 90) * 100}%` }}
                          >
                            {activity.minutes > 0 && (
                              <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                                {activity.minutes}m
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="mt-2 text-xs">{activity.day}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* High-Level Metrics */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Workouts</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">16</span>
                      <span className="text-sm text-muted-foreground ml-2">/ 20 goal</span>
                    </div>
                    <Progress value={80} className="h-1 mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Weekly Active Minutes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">270</span>
                      <span className="text-sm text-muted-foreground ml-2">/ 300 goal</span>
                    </div>
                    <Progress value={90} className="h-1 mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avg. Heart Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">72</span>
                      <span className="text-sm text-muted-foreground ml-2">bpm (resting)</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-muted-foreground">Healthy range</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Recovery Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">85</span>
                      <span className="text-sm text-muted-foreground ml-2">/ 100</span>
                    </div>
                    <Progress value={85} className="h-1 mt-2 bg-muted [&>div]:bg-emerald-500" />
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            
            {/* Featured Progress */}
            <motion.div variants={itemVariants}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Featured Progress</CardTitle>
                  <CardDescription>Your most active fitness goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fitnessGoals.slice(0, 2).map((goal) => (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <span className="font-medium">{goal.name}</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <CalendarDays className="h-3 w-3" />
                              <span>{goal.targetDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {goal.current} / {goal.target} {goal.unit}
                          </span>
                        </div>
                        <Progress 
                          value={goal.progress} 
                          className={cn("h-2", `bg-muted [&>div]:${getActivityColorClass(goal.category.charAt(0).toUpperCase() + goal.category.slice(1))}`)} 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => setActiveTab('goals')}
                  >
                    View All Goals
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Nutrition Summary */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Summary</CardTitle>
                  <CardDescription>Today's nutrition intake</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <NutritionProgress
                      label="Calories"
                      current={1650}
                      max={2000}
                      unit="kcal"
                      type="calories"
                      showPercentage
                    />
                    
                    <NutritionProgress
                      label="Protein"
                      current={95}
                      max={120}
                      unit="g"
                      type="protein"
                      showPercentage
                    />
                    
                    <NutritionProgress
                      label="Carbs"
                      current={180}
                      max={250}
                      unit="g"
                      type="carbs"
                      showPercentage
                    />
                    
                    <NutritionProgress
                      label="Fat"
                      current={48}
                      max={60}
                      unit="g"
                      type="fat"
                      showPercentage
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => setActiveTab('nutrition')}
                  >
                    View Detailed Nutrition
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="goals" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fitnessGoals.map((goal) => (
              <FitnessGoalProgress
                key={goal.id}
                goal={goal}
                onUpdate={handleUpdateGoal}
                onViewHistory={handleViewHistory}
              />
            ))}
            
            <Card className="flex flex-col items-center justify-center p-6 border-dashed">
              <Button 
                variant="outline" 
                className="w-full h-full py-8"
                onClick={handleAddNewGoal}
              >
                <div className="flex flex-col items-center gap-2">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                  <span>Add New Fitness Goal</span>
                </div>
              </Button>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="nutrition" className="mt-6">
          <ProgressDashboard />
        </TabsContent>
      </Tabs>
      
      {selectedGoal && (
        <UpdateGoalDialog
          goal={selectedGoal}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          onUpdate={handleSaveGoalUpdate}
        />
      )}
    </div>
  );
};

export default FitnessProgress; 