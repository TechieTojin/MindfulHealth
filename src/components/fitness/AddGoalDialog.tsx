import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FitnessGoal } from './FitnessGoalProgress';
import { Calendar, Dumbbell, Heart, Activity, MoveVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGoal: (goal: Omit<FitnessGoal, 'id'>) => void;
}

export function AddGoalDialog({ open, onOpenChange, onAddGoal }: AddGoalDialogProps) {
  const [name, setName] = useState('');
  const [current, setCurrent] = useState<number>(0);
  const [target, setTarget] = useState<number>(0);
  const [unit, setUnit] = useState('lbs');
  const [category, setCategory] = useState<FitnessGoal['category']>('strength');
  const [targetDate, setTargetDate] = useState<string>(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 90 days from now
  );
  
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
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
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength':
        return <Dumbbell className="h-4 w-4" />;
      case 'cardio':
        return <Heart className="h-4 w-4" />;
      case 'flexibility':
        return <MoveVertical className="h-4 w-4" />;
      case 'endurance':
        return <Activity className="h-4 w-4" />;
      default:
        return <Dumbbell className="h-4 w-4" />;
    }
  };
  
  const progress = calculateProgress(current, target);
  const colorClass = getColorClass(category);
  const badgeClass = colorClass.replace('bg-', 'bg-opacity-10 text-');
  
  const handleSubmit = () => {
    // Validate form fields
    if (!name || !target || !unit) {
      return;
    }
    
    const newGoal: Omit<FitnessGoal, 'id'> = {
      name,
      current,
      target,
      unit,
      category,
      startDate: new Date(),
      targetDate: new Date(targetDate),
      progress: calculateProgress(current, target),
    };
    
    onAddGoal(newGoal);
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setName('');
    setCurrent(0);
    setTarget(0);
    setUnit('lbs');
    setCategory('strength');
    setTargetDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Fitness Goal</DialogTitle>
          <DialogDescription>
            Create a new fitness goal to track your progress over time.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal Name</Label>
            <Input
              id="goal-name"
              placeholder="e.g., Bench Press, 5K Run Time"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal-current">Current Value</Label>
              <Input
                id="goal-current"
                type="number"
                placeholder="0"
                value={current}
                onChange={(e) => setCurrent(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-target">Target Value</Label>
              <Input
                id="goal-target"
                type="number"
                placeholder="0"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal-unit">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger id="goal-unit">
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="min">Minutes (min)</SelectItem>
                  <SelectItem value="miles">Miles</SelectItem>
                  <SelectItem value="km">Kilometers (km)</SelectItem>
                  <SelectItem value="reps">Repetitions</SelectItem>
                  <SelectItem value="%">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as FitnessGoal['category'])}>
                <SelectTrigger id="goal-category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength" className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-blue-500" />
                    <span>Strength</span>
                  </SelectItem>
                  <SelectItem value="cardio" className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Cardio</span>
                  </SelectItem>
                  <SelectItem value="flexibility" className="flex items-center gap-2">
                    <MoveVertical className="h-4 w-4 text-purple-500" />
                    <span>Flexibility</span>
                  </SelectItem>
                  <SelectItem value="endurance" className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-amber-500" />
                    <span>Endurance</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal-target-date">Target Date</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="goal-target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
          
          <div className="pt-4">
            <h4 className="text-sm font-medium mb-2">Preview</h4>
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="font-medium">{name || 'Goal Name'}</span>
                  <div className="text-xs text-muted-foreground">
                    {current} / {target} {unit}
                  </div>
                </div>
                {category && (
                  <div className={cn("px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1", badgeClass)}>
                    {getCategoryIcon(category)}
                    <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  </div>
                )}
              </div>
              
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn("h-full", colorClass)}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!name || !target || !unit}
          >
            Add Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 