import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeeklyActivityChartProps {
  className?: string;
}

const data = [
  { name: 'Mon', activity: 40 },
  { name: 'Tue', activity: 30 },
  { name: 'Wed', activity: 45 },
  { name: 'Thu', activity: 25 },
  { name: 'Fri', activity: 55 },
  { name: 'Sat', activity: 20 },
  { name: 'Sun', activity: 35 },
];

export function WeeklyActivityChart({ className }: WeeklyActivityChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`} 
              />
              <Tooltip 
                cursor={false}
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  boxShadow: 'var(--shadow-md)',
                }}
                formatter={(value) => [`${value} min`, 'Activity']}
              />
              <Bar 
                dataKey="activity" 
                fill="hsl(var(--health-primary))" 
                radius={[4, 4, 0, 0]} 
                className="hover:fill-health-accent/80 transition-colors" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 