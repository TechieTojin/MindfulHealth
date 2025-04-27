import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Flame, Footprints, Heart, Award, Crown } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
  isNew?: boolean;
}

interface AchievementGridProps {
  achievements: Achievement[];
  className?: string;
}

const defaultAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Fitness Starter',
    description: 'Completed your first workout session',
    date: '2023-11-10',
    icon: <Trophy className="h-6 w-6 text-amber-500" />,
    isNew: true,
  },
  {
    id: '2',
    title: 'Streak Master',
    description: 'Maintained a 7-day workout streak',
    date: '2023-11-05',
    icon: <Flame className="h-6 w-6 text-orange-500" />,
  },
  {
    id: '3',
    title: 'Step Champion',
    description: 'Walked over 10,000 steps in a day',
    date: '2023-10-28',
    icon: <Footprints className="h-6 w-6 text-blue-500" />,
  },
  {
    id: '4',
    title: 'Heart Health',
    description: 'Maintained a healthy heart rate during exercise',
    date: '2023-10-20',
    icon: <Heart className="h-6 w-6 text-rose-500" />,
  },
  {
    id: '5',
    title: 'Nutritional Balance',
    description: 'Achieved perfect macro balance for a week',
    date: '2023-10-15',
    icon: <Award className="h-6 w-6 text-emerald-500" />,
  },
  {
    id: '6',
    title: 'Consistency King',
    description: 'Completed all planned workouts for a month',
    date: '2023-10-01',
    icon: <Crown className="h-6 w-6 text-purple-500" />,
  },
];

export function AchievementGrid({ achievements = defaultAchievements, className }: AchievementGridProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", className)}>
      {achievements.map((achievement) => (
        <Card key={achievement.id} className="overflow-hidden bg-gradient-to-b from-muted/30 to-muted/10 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-full bg-background/80 backdrop-blur-sm">
                {achievement.icon}
              </div>
              {achievement.isNew && (
                <Badge variant="default" className="bg-health-accent">New</Badge>
              )}
            </div>
            <h3 className="font-medium text-base mt-3">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
            <p className="text-xs text-muted-foreground mt-3">
              Earned on {new Date(achievement.date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 