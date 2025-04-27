import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { NutritionProgress } from '@/components/ui/nutrition-progress';
import { cn } from '@/lib/utils';

interface ProgressDashboardProps {
  className?: string;
}

export function ProgressDashboard({ className }: ProgressDashboardProps) {
  // Sample data for the progress bars
  const nutritionData = {
    calories: { current: 1500, max: 2000, unit: 'kcal' },
    protein: { current: 80, max: 120, unit: 'g' },
    carbs: { current: 150, max: 250, unit: 'g' },
    fat: { current: 45, max: 60, unit: 'g' },
  };

  const exerciseData = {
    steps: { current: 7500, max: 10000, label: 'Steps', color: 'bg-blue-500' },
    heartRate: { current: 65, max: 100, label: 'Heart Rate', color: 'bg-red-500' },
    workouts: { current: 3, max: 5, label: 'Weekly Workouts', color: 'bg-purple-500' },
    sleep: { current: 7, max: 8, label: 'Sleep (hours)', color: 'bg-indigo-500' },
  };

  const goalData = {
    weight: { current: 70, max: 100, label: 'Weight Goal', color: 'bg-green-500' },
    meditation: { current: 4, max: 7, label: 'Meditation Days', color: 'bg-amber-500' },
    water: { current: 6, max: 8, label: 'Water (liters)', color: 'bg-cyan-500' },
    activity: { current: 45, max: 60, label: 'Activity (min/day)', color: 'bg-emerald-500' },
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Nutrition Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Progress</CardTitle>
          <CardDescription>Standardized nutrition progress bars</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NutritionProgress
            label="Calories"
            current={nutritionData.calories.current}
            max={nutritionData.calories.max}
            unit={nutritionData.calories.unit}
            type="calories"
            showPercentage
          />
          
          <NutritionProgress
            label="Protein"
            current={nutritionData.protein.current}
            max={nutritionData.protein.max}
            unit={nutritionData.protein.unit}
            type="protein"
            showPercentage
          />
          
          <NutritionProgress
            label="Carbohydrates"
            current={nutritionData.carbs.current}
            max={nutritionData.carbs.max}
            unit={nutritionData.carbs.unit}
            type="carbs"
            showPercentage
          />
          
          <NutritionProgress
            label="Fat"
            current={nutritionData.fat.current}
            max={nutritionData.fat.max}
            unit={nutritionData.fat.unit}
            type="fat"
            showPercentage
          />
        </CardContent>
      </Card>

      {/* Exercise Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Exercise Progress</CardTitle>
          <CardDescription>Exercise and activity tracking progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(exerciseData).map(([key, data]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{data.label}</span>
                <span className="text-sm text-muted-foreground">
                  {data.current} / {data.max}
                </span>
              </div>
              <Progress 
                value={(data.current / data.max) * 100} 
                className={cn(`h-2 bg-muted [&>div]:${data.color}`)} 
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Goal Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Progress</CardTitle>
          <CardDescription>General health and wellness goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(goalData).map(([key, data]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{data.label}</span>
                <span className="text-sm text-muted-foreground">
                  {data.current} / {data.max}
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn("h-full", data.color)}
                  style={{ width: `${(data.current / data.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
} 