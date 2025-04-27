import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Award, 
  Medal, 
  Star, 
  Target, 
  Zap, 
  Dumbbell, 
  HeartPulse 
} from 'lucide-react';

interface BadgeProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  level?: number;
  isNew?: boolean;
}

interface UserBadgesProps {
  badges?: BadgeProps[];
  className?: string;
}

const defaultBadges: BadgeProps[] = [
  {
    icon: <Award className="h-full w-full" />,
    label: "Weight Goal",
    color: "bg-gradient-to-br from-amber-400 to-amber-600",
    level: 2,
  },
  {
    icon: <Medal className="h-full w-full" />,
    label: "Step Master",
    color: "bg-gradient-to-br from-sky-400 to-blue-600",
    level: 3,
    isNew: true,
  },
  {
    icon: <Star className="h-full w-full" />,
    label: "Nutritionist",
    color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    level: 1,
  },
  {
    icon: <Target className="h-full w-full" />,
    label: "Goal Crusher",
    color: "bg-gradient-to-br from-red-400 to-rose-600",
    level: 2,
  },
  {
    icon: <Zap className="h-full w-full" />,
    label: "Cardio King",
    color: "bg-gradient-to-br from-purple-400 to-purple-600",
    level: 1,
  },
  {
    icon: <Dumbbell className="h-full w-full" />,
    label: "Strength",
    color: "bg-gradient-to-br from-orange-400 to-orange-600",
    level: 4,
  },
  {
    icon: <HeartPulse className="h-full w-full" />,
    label: "Health Score",
    color: "bg-gradient-to-br from-pink-400 to-pink-600",
    level: 3,
  },
];

export function UserBadges({ badges = defaultBadges, className }: UserBadgesProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      
      <div className="overflow-x-auto flex space-x-4 pb-2 scrollbar-hide">
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center shrink-0">
            <div className={cn(
              "relative w-14 h-14 rounded-full flex items-center justify-center text-white p-3 shadow-lg",
              badge.color
            )}>
              {badge.icon}
              {badge.isNew && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-health-accent rounded-full border-2 border-background" />
              )}
            </div>
            
            <span className="text-xs font-medium mt-2 text-center">{badge.label}</span>
            
            {badge.level && (
              <div className="flex mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-1.5 h-1.5 rounded-full mx-0.5",
                      i < badge.level! ? "bg-health-accent" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 