import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '../components/ui/badge';
import { Moon, Sun, Zap, Clock, Calendar, BedDouble, Activity, Heart, Lightbulb } from 'lucide-react';
import { format, subDays } from 'date-fns';

// Mock sleep data generator
const generateDailySleepData = () => {
  const now = new Date();
  const quality = Math.floor(Math.random() * 30) + 70; // 70-100
  const duration = Math.round((Math.random() * 3 + 6) * 10) / 10; // 6-9 hours
  
  // Generate sleep stages
  const remPercentage = Math.floor(Math.random() * 10) + 20; // 20-30%
  const deepPercentage = Math.floor(Math.random() * 15) + 15; // 15-30%
  const lightPercentage = 100 - remPercentage - deepPercentage;
  
  // Convert to minutes
  const totalMinutes = duration * 60;
  const remMinutes = Math.round(totalMinutes * (remPercentage / 100));
  const deepMinutes = Math.round(totalMinutes * (deepPercentage / 100));
  const lightMinutes = Math.round(totalMinutes * (lightPercentage / 100));
  
  // Generate sleep and wake times
  const wakeTime = new Date(now);
  wakeTime.setHours(7);
  wakeTime.setMinutes(Math.floor(Math.random() * 60));
  
  const bedTime = new Date(wakeTime);
  bedTime.setDate(bedTime.getDate() - 1);
  bedTime.setHours(23);
  bedTime.setMinutes(Math.floor(Math.random() * 60));
  
  // Interruptions
  const interruptions = Math.floor(Math.random() * 3);
  
  return {
    date: format(now, 'yyyy-MM-dd'),
    quality,
    duration,
    stages: [
      { name: 'Deep', value: deepMinutes, percentage: deepPercentage },
      { name: 'REM', value: remMinutes, percentage: remPercentage },
      { name: 'Light', value: lightMinutes, percentage: lightPercentage }
    ],
    bedTime,
    wakeTime,
    interruptions,
    heartRate: {
      avg: Math.floor(Math.random() * 10) + 55,
      min: Math.floor(Math.random() * 5) + 50,
      max: Math.floor(Math.random() * 10) + 65
    },
    respirationRate: Math.floor(Math.random() * 3) + 12
  };
};

// Generate weekly sleep data
const generateWeeklySleepData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(now, i);
    const duration = Math.round((Math.random() * 3 + 5.5) * 10) / 10; // 5.5-8.5 hours
    const quality = Math.floor(Math.random() * 30) + 70; // 70-100
    
    data.push({
      date: format(date, 'EEE'),
      fullDate: format(date, 'yyyy-MM-dd'),
      duration,
      quality,
      deep: Math.round(duration * (Math.floor(Math.random() * 15) + 15) / 100 * 10) / 10,
      rem: Math.round(duration * (Math.floor(Math.random() * 10) + 20) / 100 * 10) / 10,
      light: Math.round(duration * (Math.floor(Math.random() * 10) + 50) / 100 * 10) / 10
    });
  }
  
  return data;
};

// Initial data
const todaySleepData = generateDailySleepData();
const weeklySleepData = generateWeeklySleepData();

// Sleep tips
const sleepTips = [
  {
    id: 1,
    title: 'Consistent Sleep Schedule',
    description: 'Go to bed and wake up at the same time every day, even on weekends.',
    impact: 'high'
  },
  {
    id: 2,
    title: 'Avoid Screens Before Bed',
    description: 'The blue light from screens can suppress melatonin production. Avoid screens 1 hour before bedtime.',
    impact: 'high'
  },
  {
    id: 3,
    title: 'Create a Restful Environment',
    description: 'Keep your bedroom cool, dark, and quiet for optimal sleep conditions.',
    impact: 'medium'
  },
  {
    id: 4,
    title: 'Limit Caffeine Intake',
    description: 'Avoid consuming caffeine 6 hours before bedtime.',
    impact: 'high'
  },
  {
    id: 5,
    title: 'Exercise Regularly',
    description: 'Regular physical activity can help you fall asleep faster and enjoy deeper sleep.',
    impact: 'medium'
  }
];

const COLORS = ['#3b82f6', '#8b5cf6', '#a3e635'];

const SleepAnalysis = () => {
  const [sleepData, setSleepData] = useState(todaySleepData);
  const [weeklyData, setWeeklyData] = useState(weeklySleepData);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [sleepScore, setSleepScore] = useState(Math.floor(Math.random() * 20) + 80);
  const [personalizedTips, setPersonalizedTips] = useState(() => {
    // Randomly select 3 tips for initial display
    const shuffled = [...sleepTips].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  });
  
  // Update sleep data randomly to simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newSleepData = generateDailySleepData();
        setSleepData(newSleepData);
        setSleepScore(Math.floor(Math.random() * 20) + 80);
        
        // Update weekly data occasionally too
        if (Math.random() > 0.8) {
          setWeeklyData(generateWeeklySleepData());
        }
        
        // Update personalized tips occasionally
        if (Math.random() > 0.8) {
          const shuffled = [...sleepTips].sort(() => 0.5 - Math.random());
          setPersonalizedTips(shuffled.slice(0, 3));
        }
      }
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Get quality label based on sleep quality score
  const getQualityLabel = (quality) => {
    if (quality >= 90) return { label: 'Excellent', color: 'bg-green-500' };
    if (quality >= 80) return { label: 'Good', color: 'bg-green-400' };
    if (quality >= 70) return { label: 'Fair', color: 'bg-yellow-400' };
    return { label: 'Poor', color: 'bg-red-400' };
  };
  
  const qualityInfo = getQualityLabel(sleepData.quality);
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sleep Analysis</h1>
          <p className="text-muted-foreground">
            Track and analyze your sleep patterns for better rest
          </p>
        </div>
        <div>
          <Badge variant="outline" className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            {format(new Date(sleepData.date), 'MMMM d, yyyy')}
          </Badge>
        </div>
      </div>
      
      {/* Sleep overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Sleep Score</CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{sleepScore}</span>
                <span className="text-sm ml-1">/ 100</span>
              </div>
              <Moon className="h-6 w-6 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={sleepScore} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Your sleep quality is {qualityInfo.label.toLowerCase()} compared to your baseline
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Duration</CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{sleepData.duration}</span>
                <span className="text-sm ml-1">hours</span>
              </div>
              <Clock className="h-6 w-6 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs mt-2">
              <div className="flex items-center">
                <BedDouble className="h-3 w-3 mr-1" />
                {format(sleepData.bedTime, 'h:mm a')}
              </div>
              <div className="h-px bg-gray-200 flex-1 mx-2"></div>
              <div className="flex items-center">
                <Sun className="h-3 w-3 mr-1" />
                {format(sleepData.wakeTime, 'h:mm a')}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Sleep Quality</CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{sleepData.quality}</span>
                <span className="text-sm ml-1">/ 100</span>
              </div>
              <Zap className="h-6 w-6 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <Badge className={qualityInfo.color}>{qualityInfo.label}</Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {sleepData.interruptions} interruption{sleepData.interruptions !== 1 ? 's' : ''} detected
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Heart Rate</CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{sleepData.heartRate.avg}</span>
                <span className="text-sm ml-1">bpm</span>
              </div>
              <Heart className="h-6 w-6 text-pink-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-muted-foreground">Min: {sleepData.heartRate.min} bpm</span>
              <span className="text-muted-foreground">Max: {sleepData.heartRate.max} bpm</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed sleep data */}
      <Tabs defaultValue="stages" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="stages">Sleep Stages</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
          <TabsTrigger value="tips">Sleep Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stages">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Stages Distribution</CardTitle>
              <CardDescription>Breakdown of your sleep stages from last night</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sleepData.stages}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {sleepData.stages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string) => [`${Math.floor(value / 60)}h ${value % 60}m`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 space-y-4 mt-4 md:mt-0 md:ml-6">
                <div>
                  <h3 className="font-medium flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    Deep Sleep ({sleepData.stages[0].percentage}%)
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.floor(sleepData.stages[0].value / 60)}h {sleepData.stages[0].value % 60}m • Body recovery, immune system boost
                  </p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    REM Sleep ({sleepData.stages[1].percentage}%)
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.floor(sleepData.stages[1].value / 60)}h {sleepData.stages[1].value % 60}m • Brain activity, dreams, memory consolidation
                  </p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center">
                    <div className="w-3 h-3 rounded-full bg-lime-500 mr-2"></div>
                    Light Sleep ({sleepData.stages[2].percentage}%)
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.floor(sleepData.stages[2].value / 60)}h {sleepData.stages[2].value % 60}m • Transition stage, easier to wake up
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sleep Pattern</CardTitle>
              <CardDescription>Your sleep duration and quality over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#a855f7" />
                    <Tooltip formatter={(value: number, name: any) => {
                      if (name === 'quality') return [`${value}%`, 'Sleep Quality'];
                      return [`${value}h`, name.toString().charAt(0).toUpperCase() + name.toString().slice(1) + ' Sleep'];
                    }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="duration" name="Total Sleep" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="deep" name="Deep" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="rem" name="REM" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="quality" name="Quality" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Sleep Tips</CardTitle>
              <CardDescription>Recommendations to improve your sleep quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalizedTips.map(tip => (
                  <div key={tip.id} className="p-4 border rounded-lg">
                    <div className="flex items-start">
                      <div className="mr-3 p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <Lightbulb className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {tip.title}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {tip.impact === 'high' ? 'High impact' : 'Medium impact'}
                          </Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Sleep Tips
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Sleep pattern visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Sleep Pattern Visualization</CardTitle>
          <CardDescription>Your sleep pattern with wake times highlighted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { time: '9PM', value: 0 },
                  { time: '10PM', value: 0 },
                  { time: '11PM', value: 1 },
                  { time: '12AM', value: 2 },
                  { time: '1AM', value: 2 },
                  { time: '2AM', value: 3 },
                  { time: '3AM', value: 2 },
                  { time: '4AM', value: 3 },
                  { time: '5AM', value: 1 },
                  { time: '6AM', value: 2 },
                  { time: '7AM', value: 0 },
                ]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 3]} hide />
                <Tooltip formatter={(value: number) => {
                  const labels = ['Awake', 'Light Sleep', 'Deep Sleep', 'REM Sleep'];
                  return [labels[value as number], 'State'];
                }} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  fill="url(#sleepGradient)" 
                />
                <defs>
                  <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-4 space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-200 mr-1"></div>
              <span>Awake</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-300 mr-1"></div>
              <span>Light</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span>Deep</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
              <span>REM</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepAnalysis; 