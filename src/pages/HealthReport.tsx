import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { NutritionProgress } from '@/components/ui/nutrition-progress';
import { Progress } from '@/components/ui/progress';
import PageTitle from '@/components/layout/PageTitle';
import HealthChart from '@/components/dashboard/HealthChart';
import { WeeklyActivityChart } from '@/components/dashboard/WeeklyActivityChart';
import { 
  Calendar, 
  Download, 
  Activity, 
  Dumbbell, 
  Utensils, 
  Droplets, 
  Moon, 
  Brain,
  LineChart,
  RefreshCw,
  Trophy,
  Info,
  CalendarCheck,
  TrendingUp,
  Medal,
  Clock,
  BadgeCheck
} from 'lucide-react';
import { ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, addDays, addMonths, subMonths } from 'date-fns';

// Sample data - would be replaced with API calls to your backend with Base storage
const weeklyWorkouts = [
  { name: 'Mon', count: 1, duration: 45, calories: 320 },
  { name: 'Tue', count: 0, duration: 0, calories: 0 },
  { name: 'Wed', count: 1, duration: 30, calories: 210 },
  { name: 'Thu', count: 1, duration: 60, calories: 450 },
  { name: 'Fri', count: 0, duration: 0, calories: 0 },
  { name: 'Sat', count: 1, duration: 75, calories: 540 },
  { name: 'Sun', count: 0, duration: 0, calories: 0 },
];

const sleepData = [
  { name: 'Mon', value: 7.5 },
  { name: 'Tue', value: 6.8 },
  { name: 'Wed', value: 7.2 },
  { name: 'Thu', value: 8.0 },
  { name: 'Fri', value: 6.5 },
  { name: 'Sat', value: 8.5 },
  { name: 'Sun', value: 7.8 },
];

const hydrationData = [
  { name: 'Mon', value: 1.8 },
  { name: 'Tue', value: 2.2 },
  { name: 'Wed', value: 2.5 },
  { name: 'Thu', value: 3.0 },
  { name: 'Fri', value: 2.7 },
  { name: 'Sat', value: 2.0 },
  { name: 'Sun', value: 1.5 },
];

const nutrientData = {
  weekly: {
    calories: { current: 13500, max: 14000, unit: 'kcal' },
    protein: { current: 525, max: 490, unit: 'g' },
    carbs: { current: 1200, max: 1750, unit: 'g' },
    fat: { current: 280, max: 420, unit: 'g' },
  },
  monthly: {
    calories: { current: 58500, max: 60000, unit: 'kcal' },
    protein: { current: 2220, max: 2100, unit: 'g' },
    carbs: { current: 5300, max: 7500, unit: 'g' },
    fat: { current: 1150, max: 1800, unit: 'g' },
  }
};

const healingSleepProgress = 76;
const recoveryProgress = 82;
const stressScore = 25;
const hydrationGoalProgress = 85;

// Sample AI insights - would be replaced with Groq API calls
const aiInsights = [
  {
    category: 'workout',
    insight: 'You were most active on Thursdays this month. Consider adding an additional workout on Mondays to balance your week.',
    recommendation: 'Try adding a 20-minute HIIT session on Monday mornings.',
    priority: 'medium'
  },
  {
    category: 'nutrition',
    insight: 'Your protein intake is consistently above target, but your carbohydrate intake is below recommended levels.',
    recommendation: 'Consider adding more whole grains and fruits to your diet, particularly on workout days.',
    priority: 'high'
  },
  {
    category: 'sleep',
    insight: 'Your sleep quality improves when you go to bed before 10:30pm. Last week, you averaged 11:15pm.',
    recommendation: 'Set a bedtime reminder at 10:00pm to establish a more consistent sleep schedule.',
    priority: 'medium'
  },
  {
    category: 'hydration',
    insight: 'Hydration levels drop significantly on weekends, falling 30% below weekday averages.',
    recommendation: 'Set weekend hydration reminders and prepare a water bottle the night before.',
    priority: 'high'
  }
];

const streaks = {
  workout: 3,
  meditation: 7,
  hydration: 12,
  sleep: 5
};

// Simulate API call to generate insights (this would be a Groq LLM call in production)
const generateInsights = async (data) => {
  console.log('Generating insights with Groq API - mock implementation');
  // This would be a real API call in production
  return aiInsights;
};

// Simulate API call to store data (this would use Base blockchain in production)
const storeReportData = async (report) => {
  console.log('Storing report data in Base blockchain - mock implementation');
  // This would be a real storage call in production
  return { success: true, hash: '0x1234567890abcdef' };
};

const HealthReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insights, setInsights] = useState(aiInsights);
  const [reportDate, setReportDate] = useState(new Date());
  
  // Format date range based on active tab
  const getDateRange = () => {
    if (activeTab === 'weekly') {
      const start = startOfWeek(reportDate);
      const end = endOfWeek(reportDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else {
      return format(reportDate, 'MMMM yyyy');
    }
  };
  
  // Simulate fetching insights from Groq API
  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      try {
        // This would call the Groq API in production
        const data = await generateInsights({
          period: activeTab,
          date: reportDate,
          workouts: weeklyWorkouts,
          sleep: sleepData,
          hydration: hydrationData,
          nutrition: nutrientData[activeTab]
        });
        setInsights(data);
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoadingInsights(false);
      }
    };
    
    fetchInsights();
  }, [activeTab, reportDate]);
  
  // Handle export report action
  const handleExportReport = async () => {
    try {
      // Pack report data
      const reportData = {
        date: new Date().toISOString(),
        period: activeTab,
        workouts: weeklyWorkouts,
        sleep: sleepData,
        hydration: hydrationData,
        nutrition: nutrientData[activeTab],
        insights
      };
      
      // Store in Base blockchain (mock)
      const result = await storeReportData(reportData);
      if (result.success) {
        // In a real app, generate a PDF or downloadable report
        alert('Report exported successfully! Transaction hash: ' + result.hash);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    }
  };
  
  // Navigation handlers for date ranges
  const handlePreviousPeriod = () => {
    if (activeTab === 'weekly') {
      setReportDate(prev => subDays(prev, 7));
    } else {
      setReportDate(prev => subMonths(prev, 1));
    }
  };
  
  const handleNextPeriod = () => {
    if (activeTab === 'weekly') {
      setReportDate(prev => addDays(prev, 7));
    } else {
      setReportDate(prev => addMonths(prev, 1));
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageTitle 
          title="Health Report" 
          subtitle="Your comprehensive health insights and analysis" 
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleExportReport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="default" size="sm" className="gap-1 bg-health-primary hover:bg-health-primary/90">
            <RefreshCw className="h-4 w-4" />
            Update Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="weekly" onClick={() => setActiveTab('weekly')}>Weekly Report</TabsTrigger>
          <TabsTrigger value="monthly" onClick={() => setActiveTab('monthly')}>Monthly Report</TabsTrigger>
        </TabsList>
        
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousPeriod}>Previous</Button>
            <span className="text-sm font-medium">{getDateRange()}</span>
            <Button variant="outline" size="sm" onClick={handleNextPeriod}>Next</Button>
          </div>
        </div>
        
        {/* Weekly Report Content */}
        <TabsContent value="weekly" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard 
              title="Workouts" 
              icon={<Dumbbell className="h-5 w-5 text-blue-500" />}
              value={weeklyWorkouts.filter(d => d.count > 0).length}
              unit="workouts"
              subValue={`${weeklyWorkouts.reduce((acc, curr) => acc + curr.duration, 0)} minutes`}
              trend={{ 
                value: '+1', 
                direction: 'up',
                label: 'vs last week'
              }}
              color="blue"
            />
            
            <SummaryCard 
              title="Sleep" 
              icon={<Moon className="h-5 w-5 text-indigo-500" />}
              value={(sleepData.reduce((acc, curr) => acc + curr.value, 0) / 7).toFixed(1)}
              unit="hours avg"
              subValue={`${healingSleepProgress}% healing sleep`}
              trend={{ 
                value: '+0.3', 
                direction: 'up',
                label: 'vs last week'
              }}
              color="indigo"
            />
            
            <SummaryCard 
              title="Hydration" 
              icon={<Droplets className="h-5 w-5 text-cyan-500" />}
              value={(hydrationData.reduce((acc, curr) => acc + curr.value, 0)).toFixed(1)}
              unit="liters"
              subValue={`${hydrationGoalProgress}% of goal`}
              trend={{ 
                value: '-0.5', 
                direction: 'down',
                label: 'vs last week'
              }}
              color="cyan"
            />
            
            <SummaryCard 
              title="Recovery" 
              icon={<Activity className="h-5 w-5 text-emerald-500" />}
              value={recoveryProgress}
              unit="%"
              subValue={`${100-stressScore}% stress-free`}
              trend={{ 
                value: '+5', 
                direction: 'up',
                label: 'vs last week'
              }}
              color="emerald"
            />
          </div>
          
          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Weekly Workout Activity</CardTitle>
                <CardDescription>Duration and calories burned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyWorkouts}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="duration" name="Minutes" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="calories" name="Calories" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sleep Patterns</CardTitle>
                <CardDescription>Hours of sleep per night</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RLineChart data={sleepData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[5, 10]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#6366f1" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      {/* Recommended sleep range */}
                      <Line 
                        dataKey={() => 7} 
                        stroke="#a5b4fc" 
                        strokeDasharray="3 3" 
                        strokeWidth={1}
                        dot={false}
                      />
                      <Line 
                        dataKey={() => 9} 
                        stroke="#a5b4fc" 
                        strokeDasharray="3 3" 
                        strokeWidth={1}
                        dot={false}
                      />
                    </RLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">Recommended range: 7-9 hours</div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Streaks & Nutrition */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Streaks Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Activity Streaks
                </CardTitle>
                <CardDescription>Your current streaks and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <StreakCard
                    title="Workout"
                    icon={<Dumbbell className="h-5 w-5" />}
                    days={streaks.workout}
                    color="blue"
                  />
                  <StreakCard
                    title="Meditation"
                    icon={<Brain className="h-5 w-5" />}
                    days={streaks.meditation}
                    color="purple"
                  />
                  <StreakCard
                    title="Hydration"
                    icon={<Droplets className="h-5 w-5" />}
                    days={streaks.hydration}
                    color="cyan"
                  />
                  <StreakCard
                    title="Sleep"
                    icon={<Moon className="h-5 w-5" />}
                    days={streaks.sleep}
                    color="indigo"
                  />
                </div>
                <Alert className="bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  <Trophy className="h-4 w-4" />
                  <AlertTitle>Achievement Unlocked!</AlertTitle>
                  <AlertDescription>
                    7 day meditation streak - keep it going for additional rewards!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            
            {/* Nutrition Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-green-500" />
                  Nutrition Summary
                </CardTitle>
                <CardDescription>Weekly nutrition breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NutritionProgress
                  label="Calories"
                  current={nutrientData.weekly.calories.current}
                  max={nutrientData.weekly.calories.max}
                  unit={nutrientData.weekly.calories.unit}
                  type="calories"
                  showPercentage
                />
                
                <NutritionProgress
                  label="Protein"
                  current={nutrientData.weekly.protein.current}
                  max={nutrientData.weekly.protein.max}
                  unit={nutrientData.weekly.protein.unit}
                  type="protein"
                  showPercentage
                />
                
                <NutritionProgress
                  label="Carbohydrates"
                  current={nutrientData.weekly.carbs.current}
                  max={nutrientData.weekly.carbs.max}
                  unit={nutrientData.weekly.carbs.unit}
                  type="carbs"
                  showPercentage
                />
                
                <NutritionProgress
                  label="Fat"
                  current={nutrientData.weekly.fat.current}
                  max={nutrientData.weekly.fat.max}
                  unit={nutrientData.weekly.fat.unit}
                  type="fat"
                  showPercentage
                />
                
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <BadgeCheck className="h-4 w-4" />
                    <span>Protein goal exceeded</span>
                  </div>
                  <div className="text-sm text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    <span>Low on carbs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                AI Coach Insights
              </CardTitle>
              <CardDescription>
                Personalized insights and recommendations from your AI coach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <InsightCard key={index} insight={insight} />
                ))}
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground border-t pt-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Insights generated using Groq API based on your health data
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Monthly Report Content */}
        <TabsContent value="monthly" className="space-y-6">
          {/* Monthly content would mirror weekly with different data */}
          <Card className="p-8 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Monthly Report View</h3>
              <p className="text-muted-foreground max-w-md">
                Monthly report shows aggregated data from all weeks in {format(reportDate, 'MMMM yyyy')}.
                It includes long-term trends and comprehensive insights from your AI coach.
              </p>
            </div>
          </Card>
          
          <div className="text-sm text-center text-muted-foreground">
            The complete monthly report is available in the same format as the weekly report,
            with data aggregated over the entire month.
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

// Helper components
interface SummaryCardProps {
  title: string;
  icon: React.ReactNode;
  value: number | string;
  unit: string;
  subValue: string;
  trend: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  color: 'blue' | 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, icon, value, unit, subValue, trend, color 
}) => {
  const getColorClass = () => {
    switch(color) {
      case 'blue': return 'text-blue-500 bg-blue-500/10';
      case 'indigo': return 'text-indigo-500 bg-indigo-500/10';
      case 'cyan': return 'text-cyan-500 bg-cyan-500/10';
      case 'emerald': return 'text-emerald-500 bg-emerald-500/10';
      case 'amber': return 'text-amber-500 bg-amber-500/10';
      case 'rose': return 'text-rose-500 bg-rose-500/10';
      case 'purple': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-health-primary bg-health-primary/10';
    }
  };
  
  const getTrendColor = () => {
    if (trend.direction === 'up') return 'text-emerald-500';
    if (trend.direction === 'down') return 'text-rose-500';
    return 'text-amber-500';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={cn("p-2 rounded-full", getColorClass())}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-end">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground ml-1">{unit}</div>
          </div>
          <div className="text-sm text-muted-foreground">{subValue}</div>
          <div className={cn("text-xs flex items-center gap-1 mt-2", getTrendColor())}>
            {trend.direction === 'up' && <TrendingUp className="h-3 w-3" />}
            {trend.direction === 'down' && <TrendingUp className="h-3 w-3 transform rotate-180" />}
            <span>{trend.value}</span>
            <span className="text-muted-foreground">{trend.label}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StreakCardProps {
  title: string;
  icon: React.ReactNode;
  days: number;
  color: string;
}

const StreakCard: React.FC<StreakCardProps> = ({ title, icon, days, color }) => {
  const getColor = () => {
    switch (color) {
      case 'blue': return 'from-blue-500/20 to-blue-500/5 text-blue-500';
      case 'purple': return 'from-purple-500/20 to-purple-500/5 text-purple-500';
      case 'cyan': return 'from-cyan-500/20 to-cyan-500/5 text-cyan-500';
      case 'indigo': return 'from-indigo-500/20 to-indigo-500/5 text-indigo-500';
      default: return 'from-health-primary/20 to-health-primary/5 text-health-primary';
    }
  };
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br",
      getColor()
    )}>
      <div className="mb-2">{icon}</div>
      <div className="text-2xl font-bold">{days}</div>
      <div className="text-xs">{title} days</div>
    </div>
  );
};

interface InsightCardProps {
  insight: {
    category: string;
    insight: string;
    recommendation: string;
    priority: 'low' | 'medium' | 'high';
  };
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getCategoryIcon = () => {
    switch (insight.category) {
      case 'workout': return <Dumbbell className="h-5 w-5 text-blue-500" />;
      case 'nutrition': return <Utensils className="h-5 w-5 text-green-500" />;
      case 'sleep': return <Moon className="h-5 w-5 text-indigo-500" />;
      case 'hydration': return <Droplets className="h-5 w-5 text-cyan-500" />;
      case 'mental': return <Brain className="h-5 w-5 text-purple-500" />;
      default: return <Activity className="h-5 w-5 text-health-primary" />;
    }
  };
  
  const getPriorityBadge = () => {
    switch (insight.priority) {
      case 'high': return <Badge className="bg-rose-500">High Priority</Badge>;
      case 'medium': return <Badge className="bg-amber-500">Medium Priority</Badge>;
      case 'low': return <Badge className="bg-blue-500">Low Priority</Badge>;
      default: return null;
    }
  };
  
  return (
    <div className="p-4 border rounded-lg bg-card/50">
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-2">
          {getCategoryIcon()}
          <h3 className="font-medium capitalize">{insight.category} Insight</h3>
        </div>
        {getPriorityBadge()}
      </div>
      <p className="text-sm mb-2">{insight.insight}</p>
      <div className="bg-muted p-3 rounded-md text-sm">
        <div className="font-medium mb-1">Recommendation:</div>
        {insight.recommendation}
      </div>
    </div>
  );
};

export default HealthReport; 