import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageTitle from "@/components/layout/PageTitle";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Utensils, 
  ArrowRight,
  Trash2,
  Calendar as CalendarIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, addDays, startOfWeek, getDay } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for meal plan
const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

interface PlannedMeal {
  id: number;
  name: string;
  mealType: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
}

interface DayPlan {
  date: Date;
  meals: {
    [key in MealType]?: PlannedMeal;
  };
}

const MealPlanner = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedMealFromStorage, setSelectedMealFromStorage] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("Breakfast");
  
  // Initialize weekly plan
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(
    Array.from({ length: 7 }, (_, i) => ({
      date: addDays(startOfCurrentWeek, i),
      meals: {}
    }))
  );

  // Check for selected meal from the meals page on component mount
  useEffect(() => {
    const storedMeal = localStorage.getItem('selectedMeal');
    if (storedMeal) {
      const parsedMeal = JSON.parse(storedMeal);
      setSelectedMealFromStorage(parsedMeal);
      
      // Open dialog to choose day and meal type
      setAddDialogOpen(true);
      
      // Clean up storage
      localStorage.removeItem('selectedMeal');
    }
  }, []);

  // Sample meal data
  const sampleMeals: PlannedMeal[] = [
    {
      id: 1,
      name: "Greek Yogurt with Berries",
      mealType: "Breakfast",
      calories: 230,
      protein: 15,
      carbs: 25,
      fat: 8,
      image: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=120&h=80&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Grilled Chicken Salad",
      mealType: "Lunch",
      calories: 350,
      protein: 30,
      carbs: 15,
      fat: 18,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=80&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Salmon with Vegetables",
      mealType: "Dinner",
      calories: 420,
      protein: 32,
      carbs: 25,
      fat: 22,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120&h=80&auto=format&fit=crop"
    }
  ];

  // Function to navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = addDays(currentDate, -7);
    setCurrentDate(newDate);
    updateWeeklyPlan(newDate);
  };

  // Function to navigate to next week
  const goToNextWeek = () => {
    const newDate = addDays(currentDate, 7);
    setCurrentDate(newDate);
    updateWeeklyPlan(newDate);
  };

  // Update weekly plan when date changes
  const updateWeeklyPlan = (date: Date) => {
    const startOfNewWeek = startOfWeek(date, { weekStartsOn: 0 });
    setWeeklyPlan(
      Array.from({ length: 7 }, (_, i) => ({
        date: addDays(startOfNewWeek, i),
        meals: {}
      }))
    );
  };

  // Add meal to plan
  const addMealToPlan = (dayIndex: number, mealType: MealType) => {
    // If we have a meal from storage, use it
    if (selectedMealFromStorage && addDialogOpen) {
      setSelectedDay(dayIndex);
      setSelectedMealType(mealType);
      setAddDialogOpen(true);
      return;
    }
    
    // Otherwise use a random meal from sample meals
    const randomMeal = sampleMeals[Math.floor(Math.random() * sampleMeals.length)];
    randomMeal.mealType = mealType;

    const updatedPlan = [...weeklyPlan];
    updatedPlan[dayIndex].meals[mealType] = randomMeal;
    setWeeklyPlan(updatedPlan);

    toast({
      title: "Meal added to plan",
      description: `${randomMeal.name} added for ${mealType} on ${format(weeklyPlan[dayIndex].date, "EEEE")}`,
    });
  };

  // Add selected meal to plan
  const addSelectedMealToPlan = () => {
    if (!selectedMealFromStorage) return;
    
    // Convert the meal format
    const plannedMeal: PlannedMeal = {
      id: selectedMealFromStorage.id,
      name: selectedMealFromStorage.name,
      mealType: selectedMealType,
      calories: selectedMealFromStorage.calories,
      protein: selectedMealFromStorage.protein,
      carbs: selectedMealFromStorage.carbs,
      fat: selectedMealFromStorage.fat,
      image: selectedMealFromStorage.image
    };
    
    const updatedPlan = [...weeklyPlan];
    updatedPlan[selectedDay].meals[selectedMealType] = plannedMeal;
    setWeeklyPlan(updatedPlan);
    
    toast({
      title: "Meal added to plan",
      description: `${plannedMeal.name} added for ${selectedMealType} on ${format(weeklyPlan[selectedDay].date, "EEEE")}`,
    });
    
    // Close dialog
    setAddDialogOpen(false);
    setSelectedMealFromStorage(null);
  };

  // Remove meal from plan
  const removeMealFromPlan = (dayIndex: number, mealType: MealType) => {
    const updatedPlan = [...weeklyPlan];
    const mealName = updatedPlan[dayIndex].meals[mealType]?.name;
    
    if (mealName) {
      delete updatedPlan[dayIndex].meals[mealType];
      setWeeklyPlan(updatedPlan);
      
      toast({
        title: "Meal removed",
        description: `${mealName} removed from ${format(weeklyPlan[dayIndex].date, "EEEE")}'s ${mealType}`,
      });
    }
  };

  // Navigate to Add Meal page
  const navigateToAddMeal = () => {
    navigate("/add-meal");
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Meal Planner" 
        subtitle="Plan your meals for the week ahead" 
      />
      
      {/* Week navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Week
        </Button>
        
        <div className="flex items-center">
          <CalendarDays className="h-5 w-5 mr-2 text-health-primary" />
          <span className="font-medium">
            {format(weeklyPlan[0].date, "MMM d")} - {format(weeklyPlan[6].date, "MMM d, yyyy")}
          </span>
        </div>
        
        <Button variant="outline" size="sm" onClick={goToNextWeek}>
          Next Week
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      {/* Weekly plan */}
      <div className="space-y-4">
        {weeklyPlan.map((day, dayIndex) => (
          <Card key={dayIndex} className={`${getDay(day.date) === getDay(new Date()) ? "bg-health-primary/5" : ""}`}>
            <CardHeader className="py-3">
              <CardTitle className="text-base flex justify-between items-center">
                <span>{format(day.date, "EEEE")} <span className="text-sm font-normal">({format(day.date, "MMM d")})</span></span>
                {getDay(day.date) === getDay(new Date()) && (
                  <Badge className="bg-health-primary">Today</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(["Breakfast", "Lunch", "Dinner", "Snack"] as MealType[]).map((mealType) => (
                  <Card key={mealType} className="border-dashed">
                    <CardHeader className="py-2 px-3">
                      <CardTitle className="text-sm">{mealType}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-3">
                      {day.meals[mealType] ? (
                        <div className="flex items-center gap-3">
                          {day.meals[mealType]?.image && (
                            <img 
                              src={day.meals[mealType]?.image}
                              alt={day.meals[mealType]?.name}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{day.meals[mealType]?.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>{day.meals[mealType]?.calories} kcal</span>
                              <span>•</span>
                              <span>{day.meals[mealType]?.protein}g protein</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => removeMealFromPlan(dayIndex, mealType)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-muted-foreground h-auto py-2"
                          onClick={() => addMealToPlan(dayIndex, mealType)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          <span>Add {mealType}</span>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <Button onClick={navigateToAddMeal} className="flex items-center gap-2">
          <Utensils className="h-4 w-4" />
          <span>Create New Meal</span>
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate("/meal")}
          className="flex items-center gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          <span>Back to Meal Dashboard</span>
        </Button>
      </div>
      
      {/* Dialog for adding selected meal */}
      {selectedMealFromStorage && (
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add to Meal Plan</DialogTitle>
              <DialogDescription>
                Choose which day and meal type you want to add <span className="font-medium">{selectedMealFromStorage.name}</span> to.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Day of the Week</h4>
                <Select
                  value={selectedDay.toString()}
                  onValueChange={(value) => setSelectedDay(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeklyPlan.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {format(day.date, "EEEE")} ({format(day.date, "MMM d")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Meal Type</h4>
                <Select
                  value={selectedMealType}
                  onValueChange={(value) => setSelectedMealType(value as MealType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                    <SelectItem value="Lunch">Lunch</SelectItem>
                    <SelectItem value="Dinner">Dinner</SelectItem>
                    <SelectItem value="Snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={addSelectedMealToPlan}>Add to Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MealPlanner; 