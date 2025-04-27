import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

type NutrientType = 'calories' | 'protein' | 'carbs' | 'fat' | 'default';

interface NutritionProgressProps {
  label: string;
  current: number;
  max: number;
  unit?: string;
  type?: NutrientType;
  showPercentage?: boolean;
  className?: string;
}

const getNutrientColor = (type: NutrientType) => {
  switch (type) {
    case 'calories':
      return 'bg-muted [&>div]:bg-rose-500';
    case 'protein':
      return 'bg-muted [&>div]:bg-blue-500';
    case 'carbs':
      return 'bg-muted [&>div]:bg-amber-500';
    case 'fat':
      return 'bg-muted [&>div]:bg-green-500';
    default:
      return 'bg-muted [&>div]:bg-health-primary';
  }
};

export function NutritionProgress({
  label,
  current,
  max,
  unit = '',
  type = 'default',
  showPercentage = false,
  className,
}: NutritionProgressProps) {
  const percentage = Math.min(100, Math.round((current / max) * 100));
  const colorClass = getNutrientColor(type);
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {current} / {max} {unit}
          {showPercentage && ` (${percentage}%)`}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={cn("h-2", colorClass)} 
      />
    </div>
  );
} 