import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '../components/ui/badge';
import { Heart, Activity, Droplets, Wind, Watch, LayoutDashboard, RefreshCw, Clock, CalendarClock, AlertTriangle } from 'lucide-react';

// Mock real-time data simulation
const generateVitalData = () => {
  return {
    heartRate: Math.floor(Math.random() * 25) + 65, // 65-90 bpm
    spO2: Math.floor(Math.random() * 5) + 95, // 95-100%
    steps: Math.floor(Math.random() * 500) + (Math.floor(Date.now() / 3600000) % 24) * 500, // Increase throughout day
    calories: Math.floor(Math.random() * 100) + (Math.floor(Date.now() / 3600000) % 24) * 100, // Increases with steps
    bloodPressure: {
      systolic: Math.floor(Math.random() * 20) + 110, // 110-130
      diastolic: Math.floor(Math.random() * 15) + 70, // 70-85
    },
    respirationRate: Math.floor(Math.random() * 5) + 14, // 14-19 breaths per minute
    temperature: (Math.random() * 0.8 + 36.5).toFixed(1), // 36.5-37.3°C
    timestamp: new Date().toISOString(),
  };
};

// Sample historical data
const generateHistoricalData = (hours = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourOfDay = time.getHours();
    
    // Create more realistic patterns
    let heartRate = Math.floor(Math.random() * 15) + 65;
    // Heart rate higher during active hours (8am-8pm)
    if (hourOfDay >= 8 && hourOfDay <= 20) {
      heartRate += 10;
    }
    
    let steps = 0;
    // More steps during active hours with a peak at lunch and after work
    if (hourOfDay >= 6 && hourOfDay <= 22) {
      steps = Math.floor(Math.random() * 1000) + 200;
      if (hourOfDay === 12 || hourOfDay === 17) {
        steps += 1500;
      }
    }
    
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      heartRate,
      spO2: Math.floor(Math.random() * 3) + 96,
      steps,
      calories: Math.floor(steps * 0.05),
      systolic: Math.floor(Math.random() * 20) + 110,
      diastolic: Math.floor(Math.random() * 15) + 70,
      respirationRate: Math.floor(Math.random() * 5) + 14,
    });
  }
  
  return data;
};

// Health Zone calculation
const getHeartRateZone = (hr: number, age: number = 35) => {
  const maxHr = 220 - age;
  
  if (hr < maxHr * 0.5) return { zone: 'Rest', color: 'bg-blue-400' };
  if (hr < maxHr * 0.6) return { zone: 'Very Light', color: 'bg-green-400' };
  if (hr < maxHr * 0.7) return { zone: 'Light', color: 'bg-green-500' };
  if (hr < maxHr * 0.8) return { zone: 'Moderate', color: 'bg-yellow-400' };
  if (hr < maxHr * 0.9) return { zone: 'Hard', color: 'bg-orange-500' };
  return { zone: 'Maximum', color: 'bg-red-500' };
};

// Alert threshold checking
const checkAlerts = (vitals: any) => {
  const alerts = [];
  
  if (vitals.heartRate > 100) alerts.push({ 
    type: 'High Heart Rate', 
    message: 'Your heart rate is elevated',
    severity: 'warning'
  });
  
  if (vitals.heartRate < 55) alerts.push({ 
    type: 'Low Heart Rate', 
    message: 'Your heart rate is below normal range',
    severity: 'warning'
  });
  
  if (vitals.spO2 < 95) alerts.push({ 
    type: 'Low Blood Oxygen', 
    message: 'Your blood oxygen level is below optimal range',
    severity: 'warning'
  });
  
  if (vitals.bloodPressure.systolic > 140 || vitals.bloodPressure.diastolic > 90) alerts.push({ 
    type: 'High Blood Pressure', 
    message: 'Your blood pressure is elevated',
    severity: 'warning'
  });
  
  return alerts;
};

const LiveStatsDashboard = () => {
  const [currentVitals, setCurrentVitals] = useState(generateVitalData());
  const [historicalData, setHistoricalData] = useState(generateHistoricalData());
  const [alerts, setAlerts] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 'watch-01', name: 'Smart Watch', status: 'connected', battery: 78, lastSync: new Date() },
    { id: 'scale-01', name: 'Smart Scale', status: 'connected', battery: 92, lastSync: new Date() },
    { id: 'band-01', name: 'Fitness Band', status: 'connected', battery: 45, lastSync: new Date() }
  ]);
  
  const hrZone = getHeartRateZone(currentVitals.heartRate);
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newVitals = generateVitalData();
      setCurrentVitals(newVitals);
      setLastUpdated(new Date());
      
      // Check for alerts
      const newAlerts = checkAlerts(newVitals);
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 5));
      }
      
      // Update historical data every 5 updates
      if (Math.random() > 0.8) {
        setHistoricalData(prev => {
          const newData = [...prev.slice(1), {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            heartRate: newVitals.heartRate,
            spO2: newVitals.spO2,
            steps: newVitals.steps,
            calories: newVitals.calories,
            systolic: newVitals.bloodPressure.systolic,
            diastolic: newVitals.bloodPressure.diastolic,
            respirationRate: newVitals.respirationRate,
          }];
          return newData;
        });
      }
      
      // Simulate device updates
      if (Math.random() > 0.9) {
        setConnectedDevices(prev => {
          return prev.map(device => ({
            ...device,
            battery: Math.max(device.battery - Math.floor(Math.random() * 2), 0),
            lastSync: new Date()
          }));
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const refreshData = () => {
    const newVitals = generateVitalData();
    setCurrentVitals(newVitals);
    setLastUpdated(new Date());
    setAlerts(checkAlerts(newVitals));
  };
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Live Stats Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of your vital health metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          <Button size="sm" variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>
      
      {/* Real-time vitals cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Heart Rate</CardTitle>
            <div className="flex items-end justify-between">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{currentVitals.heartRate}</span>
                <span className="text-sm ml-1">bpm</span>
              </div>
              <Heart className="h-6 w-6 text-red-500 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <Badge className={hrZone.color}>{hrZone.zone}</Badge>
              <Progress 
                value={((currentVitals.heartRate - 50) / 130) * 100} 
                className="h-2 mt-2" 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Blood Oxygen</CardTitle>
            <div className="flex items-end justify-between">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{currentVitals.spO2}</span>
                <span className="text-sm ml-1">%</span>
              </div>
              <Droplets className="h-6 w-6 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <Badge className={currentVitals.spO2 >= 95 ? 'bg-green-500' : 'bg-yellow-500'}>
                {currentVitals.spO2 >= 95 ? 'Normal' : 'Low'}
              </Badge>
              <Progress 
                value={((currentVitals.spO2 - 90) / 10) * 100} 
                className="h-2 mt-2" 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Steps</CardTitle>
            <div className="flex items-end justify-between">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{currentVitals.steps.toLocaleString()}</span>
                <span className="text-sm ml-1">steps</span>
              </div>
              <Activity className="h-6 w-6 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <Badge className={
                currentVitals.steps > 7500 ? 'bg-green-500' : 
                currentVitals.steps > 5000 ? 'bg-yellow-500' : 'bg-orange-500'
              }>
                {currentVitals.steps > 7500 ? 'Active' : 
                 currentVitals.steps > 5000 ? 'Moderate' : 'Light'}
              </Badge>
              <Progress 
                value={(currentVitals.steps / 10000) * 100} 
                className="h-2 mt-2" 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Blood Pressure</CardTitle>
            <div className="flex items-end justify-between">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  {currentVitals.bloodPressure.systolic}/{currentVitals.bloodPressure.diastolic}
                </span>
                <span className="text-sm ml-1">mmHg</span>
              </div>
              <Activity className="h-6 w-6 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <Badge className={
                currentVitals.bloodPressure.systolic <= 120 && currentVitals.bloodPressure.diastolic <= 80 ? 'bg-green-500' : 
                currentVitals.bloodPressure.systolic <= 140 && currentVitals.bloodPressure.diastolic <= 90 ? 'bg-yellow-500' : 'bg-red-500'
              }>
                {currentVitals.bloodPressure.systolic <= 120 && currentVitals.bloodPressure.diastolic <= 80 ? 'Normal' : 
                 currentVitals.bloodPressure.systolic <= 140 && currentVitals.bloodPressure.diastolic <= 90 ? 'Elevated' : 'High'}
              </Badge>
              <div className="flex gap-2 mt-2">
                <Progress 
                  value={((currentVitals.bloodPressure.systolic - 90) / 80) * 100} 
                  className="h-2 flex-1" 
                />
                <Progress 
                  value={((currentVitals.bloodPressure.diastolic - 60) / 50) * 100} 
                  className="h-2 flex-1 bg-purple-200" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Secondary vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Respiration Rate</CardTitle>
              <Wind className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold">{currentVitals.respirationRate}</span>
              <span className="text-sm ml-1 text-muted-foreground">breaths/min</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Body Temperature</CardTitle>
              <Activity className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold">{currentVitals.temperature}</span>
              <span className="text-sm ml-1 text-muted-foreground">°C</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
              <Activity className="h-4 w-4 text-red-400" />
            </div>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold">{currentVitals.calories}</span>
              <span className="text-sm ml-1 text-muted-foreground">kcal</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
              <Watch className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold">{Math.floor(currentVitals.steps / 100)}</span>
              <span className="text-sm ml-1 text-muted-foreground">min</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Graphs and detailed data */}
      <Tabs defaultValue="heart" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="heart">Heart Rate</TabsTrigger>
          <TabsTrigger value="oxygen">Blood Oxygen</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="bp">Blood Pressure</TabsTrigger>
        </TabsList>
        
        <TabsContent value="heart">
          <Card>
            <CardHeader>
              <CardTitle>Heart Rate Trends</CardTitle>
              <CardDescription>24-hour heart rate pattern</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[50, 120]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="heartRate" stroke="#ef4444" fill="#fee2e2" activeDot={{ r: 8 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="oxygen">
          <Card>
            <CardHeader>
              <CardTitle>Blood Oxygen Levels</CardTitle>
              <CardDescription>24-hour SpO2 measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="spO2" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity</CardTitle>
              <CardDescription>Steps and calories burned throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" orientation="left" stroke="#22c55e" />
                    <YAxis yAxisId="right" orientation="right" stroke="#f97316" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="steps" name="Steps" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="calories" name="Calories" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bp">
          <Card>
            <CardHeader>
              <CardTitle>Blood Pressure Trends</CardTitle>
              <CardDescription>Systolic and diastolic readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[60, 160]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="systolic" stroke="#8b5cf6" strokeWidth={2} name="Systolic" />
                    <Line type="monotone" dataKey="diastolic" stroke="#a855f7" strokeWidth={2} name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Connected devices and alerts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connected Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectedDevices.map(device => (
                  <div key={device.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${device.status === 'connected' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-xs text-muted-foreground">Last synced: {device.lastSync.toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="text-xs text-muted-foreground mb-1">Battery</div>
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                device.battery > 50 ? 'bg-green-500' : 
                                device.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${device.battery}%` }}
                            ></div>
                          </div>
                          <span className="text-xs ml-2">{device.battery}%</span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        Settings
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Health Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <div className="flex justify-center mb-2">
                    <Activity className="h-10 w-10 text-green-500" />
                  </div>
                  <p>No health alerts at this time</p>
                  <p className="text-sm">All vitals are within normal ranges</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div key={index} className="flex p-3 bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-800 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{alert.type}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveStatsDashboard; 