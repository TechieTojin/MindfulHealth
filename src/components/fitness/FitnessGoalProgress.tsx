import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FitnessGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'endurance';
  startDate: Date;
  targetDate: Date;
  progress: number;
}

interface FitnessGoalProgressProps {
  goal: FitnessGoal;
  showControls?: boolean;
  onUpdate?: (goalId: string) => void;
  onViewHistory?: (goalId: string) => void;
  className?: string;
}

export function FitnessGoalProgress({
  goal,
  showControls = true,
  onUpdate,
  onViewHistory,
  className
}: FitnessGoalProgressProps) {
  const getGoalColorClass = (category: string) => {
    switch (category) {
      case 'strength':
        return 'bg-blue-500';
      case 'cardio':
        return 'bg-red-500';
      case 'flexibility':
        return 'bg-purple-500';
      case 'endurance':
        return 'bg-amber-500';
      default:
        return 'bg-health-primary';
    }
  };
  
  const calculateRemainingDays = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  const colorClass = getGoalColorClass(goal.category);
  const badgeClass = colorClass.replace('bg-', 'bg-opacity-10 text-');
  const remainingDays = calculateRemainingDays(goal.targetDate);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{goal.name}</CardTitle>
          <div className={cn("px-2 py-1 text-xs font-medium rounded-full", badgeClass)}>
            {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
          </div>
        </div>
        <CardDescription>
          Target: {goal.target} {goal.unit} by {goal.targetDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Current: {goal.current} {goal.unit}</span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {remainingDays} days remaining
            </span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={cn("h-full", colorClass)}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>
      </CardContent>
      {showControls && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdate && onUpdate(goal.id)}
          >
            Update Progress
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground"
            onClick={() => onViewHistory && onViewHistory(goal.id)}
          >
            History
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 