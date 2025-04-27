import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FitnessGoal } from './FitnessGoalProgress';
import { Calendar } from 'lucide-react';

interface UpdateGoalDialogProps {
  goal: FitnessGoal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (goalId: string, newValue: number) => void;
}

export function UpdateGoalDialog({ goal, open, onOpenChange, onUpdate }: UpdateGoalDialogProps) {
  const [newValue, setNewValue] = useState<number>(goal.current);
  
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  const handleUpdate = () => {
    onUpdate(goal.id, newValue);
    onOpenChange(false);
  };
  
  const getColorClass = (category: string) => {
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
  
  const colorClass = getColorClass(goal.category);
  const progress = calculateProgress(newValue, goal.target);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Progress: {goal.name}</DialogTitle>
          <DialogDescription>
            Update your current progress for this fitness goal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">Goal Details</p>
              <p className="text-sm text-muted-foreground">Target: {goal.target} {goal.unit}</p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Target date: {goal.targetDate.toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="current-value">Current Value</Label>
              <span className="text-sm text-muted-foreground">Previous: {goal.current} {goal.unit}</span>
            </div>
            <div className="flex gap-2">
              <Input
                id="current-value"
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(Number(e.target.value))}
                min={0}
                max={goal.target * 1.5} // Allow exceeding target by up to 50%
                step={goal.unit === 'min' ? 1 : 5} // Smaller steps for time measurements
              />
              <span className="flex items-center text-muted-foreground">{goal.unit}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Progress</Label>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={colorClass}
                style={{ width: `${progress}%`, height: '100%' }}
              />
            </div>
          </div>
          
          {progress >= 100 && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-md p-3 text-sm text-green-800 dark:text-green-300">
              Congratulations! You've reached your target goal.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUpdate}>Update Progress</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 