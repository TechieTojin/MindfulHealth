import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TriangleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalProgressCardProps {
  title: string;
  value: number;
  target: number;
  unit: string;
  change?: number;
  className?: string;
}

export function GoalProgressCard({ 
  title, 
  value, 
  target, 
  unit, 
  change,
  className 
}: GoalProgressCardProps) {
  const progress = Math.min(Math.round((value / target) * 100), 100);
  const isPositive = change && change > 0;

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold">
            {value.toLocaleString()} <span className="text-sm text-muted-foreground">/ {target.toLocaleString()} {unit}</span>
          </div>
          {typeof change !== 'undefined' && (
            <div className={cn(
              "flex items-center text-xs font-medium",
              isPositive ? "text-emerald-500" : "text-rose-500"
            )}>
              <TriangleIcon 
                className={cn(
                  "mr-1 h-3 w-3", 
                  isPositive ? "" : "rotate-180"
                )} 
              />
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <Progress 
          value={progress} 
          className="h-2 mt-3 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-health-primary [&>div]:to-health-accent" 
        />
      </CardContent>
    </Card>
  );
} 