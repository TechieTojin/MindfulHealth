import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '../components/ui/badge';
import { Droplets, Plus, Minus, Bell, BellOff, TrendingUp, Calendar, Droplet } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

// Mock hydration data
const generateDailyIntake = (targetML = 2500) => {
  const now = new Date();
  const currentHour = now.getHours();
  let total = 0;
  
  const entries = [];
  
  // Generate more realistic intake throughout the day
  for (let i = 6; i <= Math.min(currentHour, 22); i++) {
    // Higher probability of drinking at certain hours
    const isPeakHour = [8, 12, 15, 18, 20].includes(i);
    const probability = isPeakHour ? 0.9 : 0.5;
    
    if (Math.random() < probability) {
      const amount = Math.floor(Math.random() * 300) + 150;
      total += amount;
      
      entries.push({
        id: `intake-${i}`,
        time: `${i}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        amount,
        timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), i, Math.floor(Math.random() * 60)).toISOString()
      });
    }
  }
  
  return {
    total,
    target: targetML,
    percentage: Math.min(Math.round((total / targetML) * 100), 100),
    entries
  };
};

// Generate weekly history
const generateWeeklyHistory = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(now, i);
    const isToday = isSameDay(date, now);
    
    // More randomized pattern but weighted toward weekdays having more intake
    const weekday = date.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    
    let target = 2500;
    let amount;
    
    if (isToday) {
      // Use current day's actual amount
      amount = currentData.total;
    } else {
      // Generate a more realistic pattern
      const baseAmount = isWeekend ? 1800 : 2200;
      const variance = Math.floor(Math.random() * 800) - 400; // -400 to +400
      amount = Math.max(800, Math.min(3000, baseAmount + variance));
    }
    
    data.push({
      date: format(date, 'EEE'),
      amount,
      target,
      percentage: Math.round((amount / target) * 100)
    });
  }
  
  return data;
};

// Initial data
const currentData = generateDailyIntake();
const weeklyData = generateWeeklyHistory();

// Streak calculation
const calculateStreak = () => {
  // Mock streak data - in a real app this would be calculated from history
  return Math.floor(Math.random() * 10) + 1;
};

const HydrationTracker = () => {
  const [hydrationData, setHydrationData] = useState(currentData);
  const [weekHistory, setWeekHistory] = useState(weeklyData);
  const [customAmount, setCustomAmount] = useState(250);
  const [waterGoal, setWaterGoal] = useState(2500);
  const [remindersActive, setRemindersActive] = useState(true);
  const [reminderInterval, setReminderInterval] = useState(60); // minutes
  const [streak, setStreak] = useState(calculateStreak());
  const [nextReminder, setNextReminder] = useState(new Date(Date.now() + 60 * 60 * 1000));
  
  // Simulate data updates
  useEffect(() => {
    // Update timer for next reminder
    const reminderTimer = setInterval(() => {
      if (remindersActive) {
        const now = new Date();
        if (now >= nextReminder) {
          // In a real app, this would trigger a notification
          console.log("Hydration reminder triggered!");
          setNextReminder(new Date(Date.now() + reminderInterval * 60 * 1000));
        }
      }
    }, 10000);
    
    return () => clearInterval(reminderTimer);
  }, [remindersActive, reminderInterval, nextReminder]);
  
  const addWater = (amount) => {
    const newTotal = hydrationData.total + amount;
    const newPercentage = Math.min(Math.round((newTotal / waterGoal) * 100), 100);
    
    const newEntry = {
      id: `intake-${Date.now()}`,
      time: format(new Date(), 'HH:mm'),
      amount,
      timestamp: new Date().toISOString()
    };
    
    setHydrationData({
      ...hydrationData,
      total: newTotal,
      percentage: newPercentage,
      entries: [...hydrationData.entries, newEntry]
    });
    
    // Update today's data in weekly view
    setWeekHistory(prev => {
      const updated = [...prev];
      updated[updated.length - 1].amount = newTotal;
      updated[updated.length - 1].percentage = newPercentage;
      return updated;
    });
  };
  
  const toggleReminders = () => {
    setRemindersActive(!remindersActive);
    if (!remindersActive) {
      setNextReminder(new Date(Date.now() + reminderInterval * 60 * 1000));
    }
  };
  
  const updateReminderInterval = (minutes) => {
    setReminderInterval(minutes);
    if (remindersActive) {
      setNextReminder(new Date(Date.now() + minutes * 60 * 1000));
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Hydration Tracker</h1>
          <p className="text-muted-foreground">
            Track your daily water intake and stay hydrated
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={remindersActive ? "default" : "outline"} 
            className="flex items-center cursor-pointer" 
            onClick={toggleReminders}>
            {remindersActive ? <Bell className="mr-1 h-3 w-3" /> : <BellOff className="mr-1 h-3 w-3" />}
            {remindersActive ? 'Reminders On' : 'Reminders Off'}
          </Badge>
          {streak > 0 && (
            <Badge variant="secondary" className="flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              {streak} day streak
            </Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Today's Hydration</CardTitle>
              <CardDescription>
                {format(new Date(), 'EEEE, MMMM do, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{hydrationData.percentage}%</div>
                      <div className="text-sm text-muted-foreground">
                        {hydrationData.total} / {waterGoal} ml
                      </div>
                    </div>
                  </div>
                  {/* Water fill animation */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${hydrationData.percentage * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <div className="w-full max-w-md mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Daily Goal</span>
                    <span className="text-sm font-medium">{waterGoal} ml</span>
                  </div>
                  <Slider
                    value={[waterGoal]}
                    min={1000}
                    max={4000}
                    step={100}
                    onValueChange={([value]) => setWaterGoal(value)}
                    className="mb-6"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <Button size="lg" variant="outline" className="flex items-center" onClick={() => addWater(150)}>
                  <Droplets className="h-4 w-4 mr-1 text-blue-500" /> 150ml
                </Button>
                <Button size="lg" variant="outline" className="flex items-center" onClick={() => addWater(250)}>
                  <Droplets className="h-4 w-4 mr-1 text-blue-500" /> 250ml
                </Button>
                <Button size="lg" variant="outline" className="flex items-center" onClick={() => addWater(500)}>
                  <Droplets className="h-4 w-4 mr-1 text-blue-500" /> 500ml
                </Button>
                
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" onClick={() => setCustomAmount(Math.max(50, customAmount - 50))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center">{customAmount} ml</span>
                  <Button variant="ghost" size="icon" onClick={() => setCustomAmount(customAmount + 50)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="default" className="ml-2 mr-2" onClick={() => addWater(customAmount)}>
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Reminder Settings</CardTitle>
              <CardDescription>
                Customize your hydration reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reminder Status</span>
                    <Button 
                      variant={remindersActive ? "default" : "outline"} 
                      size="sm" 
                      onClick={toggleReminders}
                      className="flex items-center"
                    >
                      {remindersActive ? <Bell className="h-4 w-4 mr-1" /> : <BellOff className="h-4 w-4 mr-1" />}
                      {remindersActive ? 'Active' : 'Inactive'}
                    </Button>
                  </div>
                  
                  {remindersActive && (
                    <>
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Remind me every</span>
                          <span className="text-sm font-medium">{reminderInterval} minutes</span>
                        </div>
                        <Slider
                          value={[reminderInterval]}
                          min={30}
                          max={120}
                          step={15}
                          onValueChange={([value]) => updateReminderInterval(value)}
                        />
                      </div>
                      
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 flex items-start mt-4">
                        <Bell className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Next reminder</p>
                          <p className="text-xs text-muted-foreground">
                            {format(nextReminder, 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-6">
        <Tabs defaultValue="history">
          <TabsList className="mb-4">
            <TabsTrigger value="history">Weekly History</TabsTrigger>
            <TabsTrigger value="entries">Today's Entries</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Hydration History</CardTitle>
                <CardDescription>Your hydration progress over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === 'amount') return [`${value} ml`, 'Intake'];
                          if (name === 'target') return [`${value} ml`, 'Target'];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="amount" name="Intake" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="entries">
            <Card>
              <CardHeader>
                <CardTitle>Today's Hydration Entries</CardTitle>
                <CardDescription>All water intake logged today</CardDescription>
              </CardHeader>
              <CardContent>
                {hydrationData.entries.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <div className="flex justify-center mb-2">
                      <Droplets className="h-10 w-10 text-blue-300" />
                    </div>
                    <p>No entries yet today</p>
                    <p className="text-sm">Add your first water intake to get started</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {hydrationData.entries.map((entry, index) => (
                      <div key={entry.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="mr-4 p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <Droplets className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{entry.amount} ml</p>
                            <p className="text-sm text-muted-foreground">{entry.time}</p>
                          </div>
                          <div className="mt-0.5 h-1 bg-blue-100 dark:bg-blue-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${Math.min(100, (entry.amount / 500) * 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Hydration Insights</CardTitle>
                <CardDescription>Analysis of your hydration habits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                    <h3 className="font-semibold flex items-center text-green-700 dark:text-green-300">
                      <Droplet className="h-4 w-4 mr-2" /> Hydration Level
                    </h3>
                    <p className="mt-1 text-sm">
                      {hydrationData.percentage >= 90 ? 'Excellent! You\'re well-hydrated today.' :
                       hydrationData.percentage >= 70 ? 'Good progress! Keep drinking water regularly.' :
                       hydrationData.percentage >= 50 ? 'You\'re halfway to your goal. Keep it up!' :
                       'You need more water today. Try to drink regularly.'}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" /> Weekly Trend
                    </h3>
                    <p className="mt-1 text-sm">
                      {Math.random() > 0.5 ? 
                        'You\'re drinking more water compared to last week. Great job!' : 
                        'Your water intake is slightly lower than last week. Try to drink more regularly.'}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-2" /> Best Hydration Day
                    </h3>
                    <p className="mt-1 text-sm">
                      Your best hydration day this week was {
                        weekHistory.sort((a, b) => b.percentage - a.percentage)[0].date
                      } with {
                        weekHistory.sort((a, b) => b.percentage - a.percentage)[0].percentage
                      }% of your target.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Detailed Report</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HydrationTracker; 