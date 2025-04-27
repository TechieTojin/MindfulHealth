
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Dumbbell, Flame, Play, Plus } from "lucide-react";

const workouts = [
  {
    id: 1,
    title: "Full Body HIIT",
    description: "High-intensity interval training to boost metabolism and burn fat",
    duration: 30,
    calories: 350,
    level: "Intermediate",
    category: "strength",
    image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Morning Yoga Flow",
    description: "Gentle yoga sequence to improve flexibility and start your day right",
    duration: 20,
    calories: 150,
    level: "Beginner",
    category: "flexibility",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "Strength Training",
    description: "Build muscle and increase strength with this resistance workout",
    duration: 45,
    calories: 400,
    level: "Advanced",
    category: "strength",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    title: "Cardio Kickboxing",
    description: "High-energy kickboxing workout to improve cardiovascular health",
    duration: 35,
    calories: 450,
    level: "Intermediate",
    category: "cardio",
    image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const WorkoutCard = ({ workout }: { workout: typeof workouts[0] }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={workout.image} 
          alt={workout.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
        />
        <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground">
          {workout.level}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{workout.title}</CardTitle>
        <CardDescription>{workout.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{workout.duration} min</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Flame className="h-4 w-4 text-muted-foreground" />
            <span>{workout.calories} cal</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
            <span>{workout.category}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full gap-2">
          <Play className="h-4 w-4" /> Start Workout
        </Button>
      </CardFooter>
    </Card>
  );
};

const Workouts = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Workout Library</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Workout
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="all">All Workouts</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="cardio">Cardio</TabsTrigger>
          <TabsTrigger value="flexibility">Flexibility</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workouts.map(workout => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="strength" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workouts
              .filter(workout => workout.category === "strength")
              .map(workout => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="cardio" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workouts
              .filter(workout => workout.category === "cardio")
              .map(workout => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="flexibility" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workouts
              .filter(workout => workout.category === "flexibility")
              .map(workout => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Workouts;
