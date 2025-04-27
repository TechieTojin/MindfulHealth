import React from "react";
import { 
  Award, 
  Trophy, 
  Medal, 
  Sparkles, 
  Clock, 
  Dumbbell, 
  Heart, 
  Brain, 
  Flame, 
  Target, 
  Calendar, 
  Zap,
  ArrowUpRight 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import PageTitle from "@/components/layout/PageTitle";

// Mock data for achievements
const achievementCategories = [
  { id: "all", name: "All Achievements" },
  { id: "workout", name: "Workout" },
  { id: "nutrition", name: "Nutrition" },
  { id: "mental", name: "Mental Health" },
  { id: "consistency", name: "Consistency" }
];

const achievements = [
  {
    id: 1,
    title: "Workout Warrior",
    description: "Complete 10 workouts",
    icon: Dumbbell,
    progress: 80,
    total: 10,
    current: 8,
    category: "workout",
    date: "Unlocked May 12, 2023",
    color: "from-orange-500 to-red-500",
    backgroundColor: "bg-orange-100 dark:bg-orange-900/20",
    iconColor: "text-orange-500 dark:text-orange-400",
    iconBackgroundColor: "bg-orange-100 dark:bg-orange-900/20"
  },
  {
    id: 2,
    title: "Mindfulness Master",
    description: "Complete 15 meditation sessions",
    icon: Brain,
    progress: 100,
    total: 15,
    current: 15,
    category: "mental",
    date: "Unlocked June 3, 2023",
    color: "from-purple-500 to-indigo-500",
    backgroundColor: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-500 dark:text-purple-400",
    iconBackgroundColor: "bg-purple-100 dark:bg-purple-900/20"
  },
  {
    id: 3,
    title: "Nutrition Ninja",
    description: "Log 20 healthy meals",
    icon: Flame,
    progress: 65,
    total: 20,
    current: 13,
    category: "nutrition",
    date: "In Progress",
    color: "from-green-500 to-emerald-500",
    backgroundColor: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-500 dark:text-green-400",
    iconBackgroundColor: "bg-green-100 dark:bg-green-900/20"
  },
  {
    id: 4,
    title: "Streak Seeker",
    description: "Maintain a 7-day streak",
    icon: Zap,
    progress: 100,
    total: 7,
    current: 7,
    category: "consistency",
    date: "Unlocked April 28, 2023",
    color: "from-blue-500 to-cyan-500",
    backgroundColor: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-500 dark:text-blue-400",
    iconBackgroundColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    id: 5,
    title: "Heart Rate Hero",
    description: "Reach target heart rate in 5 workouts",
    icon: Heart,
    progress: 40,
    total: 5,
    current: 2,
    category: "workout",
    date: "In Progress",
    color: "from-red-500 to-pink-500",
    backgroundColor: "bg-red-100 dark:bg-red-900/20",
    iconColor: "text-red-500 dark:text-red-400",
    iconBackgroundColor: "bg-red-100 dark:bg-red-900/20"
  },
  {
    id: 6,
    title: "Early Bird",
    description: "Complete 3 workouts before 8am",
    icon: Clock,
    progress: 33,
    total: 3,
    current: 1,
    category: "consistency",
    date: "In Progress",
    color: "from-amber-500 to-yellow-500",
    backgroundColor: "bg-amber-100 dark:bg-amber-900/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    iconBackgroundColor: "bg-amber-100 dark:bg-amber-900/20"
  },
  {
    id: 7,
    title: "Goal Getter",
    description: "Achieve 5 personal goals",
    icon: Target,
    progress: 100,
    total: 5,
    current: 5,
    category: "mental",
    date: "Unlocked May 20, 2023",
    color: "from-teal-500 to-green-500",
    backgroundColor: "bg-teal-100 dark:bg-teal-900/20",
    iconColor: "text-teal-500 dark:text-teal-400",
    iconBackgroundColor: "bg-teal-100 dark:bg-teal-900/20"
  },
  {
    id: 8,
    title: "Meal Prep Pro",
    description: "Create 3 weekly meal plans",
    icon: Calendar,
    progress: 67,
    total: 3,
    current: 2,
    category: "nutrition",
    date: "In Progress",
    color: "from-lime-500 to-emerald-500",
    backgroundColor: "bg-lime-100 dark:bg-lime-900/20",
    iconColor: "text-lime-500 dark:text-lime-400",
    iconBackgroundColor: "bg-lime-100 dark:bg-lime-900/20"
  }
];

// Badges data
const badges = [
  {
    id: 1,
    name: "Gold Achiever",
    icon: Trophy,
    description: "Earned for exceptional dedication and consistency",
    rarity: "Legendary",
    date: "Jun 2023",
    color: "from-yellow-400 to-amber-600",
    rarityColor: "text-yellow-500 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20"
  },
  {
    id: 2,
    name: "Silver Supporter",
    icon: Medal,
    description: "Awarded for ongoing commitment to health goals",
    rarity: "Rare",
    date: "May 2023",
    color: "from-gray-400 to-slate-500",
    rarityColor: "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/20"
  },
  {
    id: 3,
    name: "Wellness Warrior",
    icon: Award,
    description: "Recognized for balanced approach to mind and body health",
    rarity: "Epic",
    date: "Apr 2023",
    color: "from-indigo-500 to-blue-600",
    rarityColor: "text-indigo-500 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20"
  },
  {
    id: 4,
    name: "Mindful Master",
    icon: Sparkles,
    description: "Excellence in maintaining regular meditation practice",
    rarity: "Uncommon",
    date: "Mar 2023",
    color: "from-purple-500 to-violet-600",
    rarityColor: "text-purple-500 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20"
  }
];

// Achievements overview stats
const statsData = [
  { label: "Achievements Unlocked", value: "14", icon: Award, color: "bg-indigo-500" },
  { label: "Completion Rate", value: "68%", icon: Target, color: "bg-green-500" },
  { label: "Badges Earned", value: "4", icon: Medal, color: "bg-amber-500" },
  { label: "Current Streak", value: "7 days", icon: Zap, color: "bg-blue-500" }
];

const Achievements = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-8">
      <PageTitle 
        title="Achievements & Badges" 
        subtitle="Track your progress and unlock rewards as you reach health milestones"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h4 className="text-2xl font-bold">{stat.value}</h4>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content tabs */}
      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="achievements" className="text-base">Achievements</TabsTrigger>
          <TabsTrigger value="badges" className="text-base">Badges & Rewards</TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {achievementCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  selectedCategory === category.id ? "bg-health-primary hover:bg-health-dark" : "",
                  "rounded-full px-4"
                )}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Achievements grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className={`h-12 w-12 rounded-full ${achievement.iconBackgroundColor} flex items-center justify-center`}>
                        <achievement.icon className={`h-6 w-6 ${achievement.iconColor}`} />
                      </div>
                      <Badge variant="outline" className={cn(
                        "px-2.5 py-0.5",
                        achievement.progress === 100 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800/30"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
                      )}>
                        {achievement.progress === 100 ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{achievement.current}/{achievement.total}</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`absolute h-full bg-gradient-to-r ${achievement.color}`}
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      {achievement.date}
                    </p>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="py-5 px-6 border-b bg-muted/40">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Your Collection
                  </CardTitle>
                  <CardDescription>Badges and rewards you've earned on your health journey</CardDescription>
                </div>
                <Button className="bg-health-primary hover:bg-health-dark md:self-end">
                  View All Possible Rewards
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {badges.map((badge, index) => (
                  <Card key={badge.id} className="relative overflow-hidden border-border/50 hover:shadow-md transition-shadow">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r opacity-90 dark:opacity-80" 
                      style={{ backgroundImage: `linear-gradient(to right, ${badge.color.split(' ')[1]}, ${badge.color.split(' ')[3]})` }}>
                    </div>
                    <CardContent className="pt-6 pb-4 px-6 relative z-10 flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-background border-4 border-background shadow-lg flex items-center justify-center mb-4 mt-4">
                        <badge.icon className="h-10 w-10 text-transparent bg-clip-text bg-gradient-to-br stroke-2 dark:stroke-[1.5]" 
                          style={{ backgroundImage: `linear-gradient(to bottom right, ${badge.color.split(' ')[1]}, ${badge.color.split(' ')[3]})` }} />
                      </div>
                      <h3 className="font-semibold text-center">{badge.name}</h3>
                      <Badge className={`mt-2 ${badge.rarityColor}`}>
                        {badge.rarity}
                      </Badge>
                      <p className="text-center text-sm text-muted-foreground mt-3 line-clamp-3">
                        {badge.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Earned {badge.date}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievement milestones */}
          <Card className="border-none shadow-sm">
            <CardHeader className="py-5 px-6 border-b bg-muted/40">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5 text-health-primary" />
                Upcoming Milestones
              </CardTitle>
              <CardDescription>Keep going to unlock these rewards</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {achievements.filter(a => a.progress < 100).slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                    <div className={`h-12 w-12 rounded-full ${achievement.iconBackgroundColor} flex-shrink-0 flex items-center justify-center`}>
                      <achievement.icon className={`h-6 w-6 ${achievement.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                        <h3 className="font-medium">{achievement.title}</h3>
                        <Badge variant="outline" className="w-fit">
                          {achievement.current}/{achievement.total} completed
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full mt-4">
                  View All Upcoming Achievements
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Achievements; 