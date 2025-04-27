import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Plus, Clock, Calendar, ArrowRight, ChevronRight, Heart, X, Bookmark, BookmarkCheck, CircleSlash } from "lucide-react";
import PageTitle from "@/components/layout/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NutritionProgress } from '@/components/ui/nutrition-progress';

// Enhanced meal data with better images
const mealSuggestions = [
  {
    id: 1,
    name: "Protein-Rich Breakfast Bowl",
    description: "Fluffy scrambled eggs, Greek yogurt, avocado slices, whole grain toast, and a sprinkle of chia seeds for an energy boost.",
    calories: 450,
    protein: 35,
    carbs: 45,
    fat: 15,
    cookTime: "15 min",
    dietType: ["High Protein", "Low Sugar"],
    rating: 4.8,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?q=80&w=1295&auto=format&fit=crop",
    chef: {
      name: "Emma Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&auto=format&fit=crop"
    },
    saved: false
  },
  {
    id: 2,
    name: "Mediterranean Lunch Plate",
    description: "Herb-grilled chicken, quinoa tabbouleh, roasted vegetables, hummus, and olive oil drizzle with a side of tzatziki.",
    calories: 550,
    protein: 40,
    carbs: 50,
    fat: 20,
    cookTime: "25 min",
    dietType: ["Mediterranean", "Gluten-Free"],
    rating: 4.9,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop",
    chef: {
      name: "Marco Olivieri",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&auto=format&fit=crop"
    },
    saved: true
  },
  {
    id: 3,
    name: "Balanced Omega Dinner",
    description: "Pan-seared salmon with lemon herb butter, garlic mashed sweet potatoes, and steamed broccoli with toasted almonds.",
    calories: 520,
    protein: 35,
    carbs: 40,
    fat: 25,
    cookTime: "30 min",
    dietType: ["Omega-Rich", "Dairy-Free"],
    rating: 4.7,
    reviewCount: 56,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=687&auto=format&fit=crop",
    chef: {
      name: "Sophia Lee",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&auto=format&fit=crop"
    },
    saved: false
  },
  {
    id: 4,
    name: "Plant-Based Power Bowl",
    description: "Crispy tofu, quinoa, roasted sweet potatoes, kale, avocado, and tahini dressing packed with essential nutrients.",
    calories: 480,
    protein: 22,
    carbs: 65,
    fat: 18,
    cookTime: "20 min",
    dietType: ["Vegan", "Plant-Based"],
    rating: 4.6,
    reviewCount: 103,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=384&auto=format&fit=crop",
    chef: {
      name: "Alex Green",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&auto=format&fit=crop"
    },
    saved: true
  }
];

// Enhanced meal history
const mealHistory = [
  {
    id: 101,
    name: "Berry Oatmeal Breakfast",
    description: "Steel-cut oatmeal with mixed berries, maple syrup, and toasted walnuts",
    calories: 320,
    protein: 12,
    carbs: 58,
    fat: 8,
    date: "2023-06-10T08:30:00",
    image: "https://images.unsplash.com/photo-1517093157656-b9eccef01cb1?q=80&w=387&auto=format&fit=crop"
  },
  {
    id: 102,
    name: "Avocado Chicken Salad",
    description: "Grilled chicken, mixed greens, cherry tomatoes, and avocado with lemon vinaigrette",
    calories: 450,
    protein: 35,
    carbs: 15,
    fat: 28,
    date: "2023-06-10T12:45:00",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=580&auto=format&fit=crop"
  },
  {
    id: 103,
    name: "Asian Veggie Stir-Fry",
    description: "Crispy tofu with stir-fried vegetables in ginger-garlic sauce over brown rice",
    calories: 380,
    protein: 18,
    carbs: 48,
    fat: 14,
    date: "2023-06-09T19:00:00",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=872&auto=format&fit=crop"
  }
];

// Random meal type function to generate random meal types
const getRandomMealType = () => {
  const mealTypes = [
    "Breakfast", "Lunch", "Dinner", "Snack", 
    "Vegan", "Vegetarian", "Keto", "Paleo", 
    "Low-Carb", "High-Protein", "Gluten-Free"
  ];
  return mealTypes[Math.floor(Math.random() * mealTypes.length)];
};

const MealCard = ({ 
  meal, 
  isSuggestion = false,
  onSave 
}: { 
  meal: any, 
  isSuggestion?: boolean,
  onSave: () => void
}) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [mealType, setMealType] = useState(() => getRandomMealType());
  
  // Create a variant of the animation for meals being shown
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  const handleAddToPlan = () => {
    // Store selected meal in localStorage to access it in meal planner
    localStorage.setItem('selectedMeal', JSON.stringify(meal));
    
    // Navigate to meal planner
    navigate('/meal-planner');
    
    // Show toast notification
    toast({
      title: "Meal ready to add",
      description: `${meal.name} is ready to be added to your meal plan.`,
    });
  };

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="overflow-hidden h-full group hover:shadow-md transition-shadow">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={meal.image} 
              alt={meal.name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute top-0 right-0 m-2">
              <Button 
                size="icon" 
                variant="outline" 
                className={cn(
                  "h-8 w-8 rounded-full bg-white/50 backdrop-blur-sm", 
                  meal.saved ? "text-red-500 hover:text-red-600" : "text-muted-foreground"
                )}
                onClick={onSave}
              >
                <Heart className="h-4 w-4" fill={meal.saved ? "currentColor" : "none"} />
              </Button>
            </div>
            {/* Add meal type badge */}
            <div className="absolute bottom-0 left-0 m-2">
              <div className="px-2 py-1 text-xs rounded-md bg-gradient-to-r from-health-primary to-health-accent text-white font-medium">
                {mealType}
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-base">{meal.name}</h3>
              <div className="bg-background/80 px-2 py-1 rounded text-xs font-medium">
                {meal.calories} cal
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{meal.description}</p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <div className="flex flex-col items-center">
                <span className="font-medium">{meal.protein}g</span>
                <span>Protein</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">{meal.carbs}g</span>
                <span>Carbs</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">{meal.fat}g</span>
                <span>Fat</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2">
            {isSuggestion ? (
              <Button 
                size="sm" 
                className="w-full" 
                variant="outline"
                onClick={handleAddToPlan}
              >
                Add to Plan
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="w-full" 
                variant="outline"
                onClick={handleViewDetails}
              >
                View Details
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Meal Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{meal.name}</DialogTitle>
            <DialogDescription>
              Detailed nutritional information for this meal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="md:col-span-2">
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img 
                  src={meal.image} 
                  alt={meal.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-muted-foreground">{meal.description}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Nutrition Facts</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Calories</span>
                  <span className="font-medium">{meal.calories} kcal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Protein</span>
                  <span className="font-medium">{meal.protein}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Carbohydrates</span>
                  <span className="font-medium">{meal.carbs}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fat</span>
                  <span className="font-medium">{meal.fat}g</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Meal Info</h3>
              {meal.cookTime && (
                <div className="flex justify-between text-sm">
                  <span>Cook Time</span>
                  <span className="font-medium">{meal.cookTime}</span>
                </div>
              )}
              {meal.dietType && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {Array.isArray(meal.dietType) ? meal.dietType.map((type: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  )) : (
                    <Badge variant="outline" className="text-xs">
                      {meal.dietType}
                    </Badge>
                  )}
                </div>
              )}
              {meal.chef && (
                <div className="flex items-center gap-2 mt-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={meal.chef.avatar} alt={meal.chef.name} />
                    <AvatarFallback>{meal.chef.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">By {meal.chef.name}</div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button onClick={handleAddToPlan}>
              Add to Meal Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const NutrientBadge = ({ label, value, color }: { label: string, value: number, color: string }) => {
  const getColors = () => {
    switch (color) {
      case 'green':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'red':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <span className={`text-xs font-medium ${getColors()} rounded-full px-2 py-0.5`}>
        {value}g
      </span>
      <span className="text-[10px] text-muted-foreground mt-1">{label}</span>
    </div>
  );
};

const Meal = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [savedMeals, setSavedMeals] = useState<number[]>([2, 4]);
  const [allMeals, setAllMeals] = useState(mealSuggestions.map(meal => ({
    ...meal,
    saved: savedMeals.includes(meal.id)
  })));
  const [mealHistoryItems, setMealHistoryItems] = useState(mealHistory);
  const [activeTab, setActiveTab] = useState("suggestions");
  
  const toggleSaveMeal = useCallback((mealId: number) => {
    setSavedMeals(prev => {
      if (prev.includes(mealId)) {
        toast({
          title: "Meal removed from saved items",
          description: "The meal has been removed from your saved collection.",
        });
        return prev.filter(id => id !== mealId);
      } else {
        toast({
          title: "Meal saved",
          description: "The meal has been added to your saved collection.",
        });
        return [...prev, mealId];
      }
    });
  }, []);

  useEffect(() => {
    setAllMeals(prev => prev.map(meal => ({
      ...meal,
      saved: savedMeals.includes(meal.id)
    })));
  }, [savedMeals]);
  
  const handleAddMeal = useCallback(() => {
    navigate("/add-meal");
  }, [navigate]);

  const handleMealPlan = useCallback(() => {
    navigate("/meal-planner");
  }, [navigate]);

  const handleFindRecipe = useCallback(() => {
    setSearchQuery("");
    setActiveTab("suggestions");
    toast({
      title: "Find Recipe",
      description: "Ready to search for recipes...",
    });
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) searchInput.focus();
  }, []);

  const handleFoodScanner = useCallback(() => {
    navigate("/food-scanner");
  }, [navigate]);
  
  const dailySummary = {
    calories: {
      consumed: 1250,
      goal: 2000
    },
    protein: {
      consumed: 65,
      goal: 100
    },
    carbs: {
      consumed: 120,
      goal: 200
    },
    fat: {
      consumed: 50,
      goal: 70
    }
  };
  
  return (
    <div className="space-y-6">
      <PageTitle title="Meal Planner" subtitle="Discover, track, and plan your meals for optimal nutrition" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Daily summary card */}
        <Card className="col-span-full md:col-span-1 bg-gradient-to-br from-health-primary/5 to-health-accent/5">
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              Today's Summary
              <Badge variant="outline" className="font-normal">
                {new Date().toLocaleDateString(undefined, { weekday: 'long' })}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <NutritionProgressBar 
                label="Calories" 
                current={dailySummary.calories.consumed} 
                max={dailySummary.calories.goal} 
                unit="kcal" 
                color="health-primary"
              />
              <NutritionProgressBar 
                label="Protein" 
                current={dailySummary.protein.consumed} 
                max={dailySummary.protein.goal} 
                unit="g" 
                color="green-500"
              />
              <NutritionProgressBar 
                label="Carbs" 
                current={dailySummary.carbs.consumed} 
                max={dailySummary.carbs.goal} 
                unit="g" 
                color="yellow-500"
              />
              <NutritionProgressBar 
                label="Fat" 
                current={dailySummary.fat.consumed} 
                max={dailySummary.fat.goal} 
                unit="g" 
                color="red-500"
              />
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <MacroStat label="Protein" value={Math.round((dailySummary.protein.consumed / dailySummary.calories.consumed * 4 / 10) * 100)} color="green" />
              <MacroStat label="Carbs" value={Math.round((dailySummary.carbs.consumed / dailySummary.calories.consumed * 4 / 10) * 100)} color="yellow" />
              <MacroStat label="Fat" value={Math.round((dailySummary.fat.consumed / dailySummary.calories.consumed * 9 / 10) * 100)} color="red" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleAddMeal}>Add Today's Meal</Button>
          </CardFooter>
        </Card>
        
        {/* Quick actions */}
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionButton
                icon={<Plus className="h-5 w-5" />}
                label="Add Meal"
                description="Log what you ate"
                color="health-primary"
                onClick={handleAddMeal}
              />
              <QuickActionButton
                icon={<Calendar className="h-5 w-5" />}
                label="Meal Plan"
                description="Plan your week"
                color="purple-500"
                onClick={handleMealPlan}
              />
              <QuickActionButton
                icon={<Search className="h-5 w-5" />}
                label="Find Recipe"
                description="Discover new meals"
                color="blue-500"
                onClick={handleFindRecipe}
              />
              <QuickActionButton
                icon={<ArrowRight className="h-5 w-5" />}
                label="Food Scanner"
                description="Scan nutrition labels"
                color="yellow-500"
                onClick={handleFoodScanner}
              />
            </div>
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                className="text-health-primary"
                onClick={() => navigate("/meal-database")}
              >
                Manage Your Custom Meals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="suggestions" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-6">
          <TabsTrigger value="suggestions">Meal Suggestions</TabsTrigger>
          <TabsTrigger value="history">Meal History</TabsTrigger>
          <TabsTrigger value="saved">Saved Meals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="suggestions">
          <div className="mb-6">
            <Input
              type="search"
              placeholder="Search meals, recipes, or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMeals
              .filter(meal => 
                meal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                meal.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((meal) => (
                <MealCard 
                  key={meal.id} 
                  meal={meal} 
                  isSuggestion={true}
                  onSave={() => toggleSaveMeal(meal.id)} 
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealHistoryItems.map((meal) => (
              <MealCard 
                key={meal.id} 
                meal={meal} 
                onSave={() => toggleSaveMeal(meal.id)} 
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          {savedMeals.length === 0 ? (
            <div className="text-center py-12">
              <CircleSlash className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-medium">No saved meals</h3>
              <p className="text-sm text-muted-foreground">You haven't saved any meals yet. Browse suggestions and save some meals.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allMeals
                .filter(meal => savedMeals.includes(meal.id))
                .map((meal) => (
                  <MealCard 
                    key={meal.id} 
                    meal={meal} 
                    onSave={() => toggleSaveMeal(meal.id)} 
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const NutritionProgressBar = ({ label, current, max, unit, color }: 
  { label: string, current: number, max: number, unit: string, color: string }) => {
  
  // Convert the color prop to a NutrientType
  const mapColorToType = () => {
    switch (color) {
      case 'health-primary':
        return 'default';
      case 'green-500':
        return 'fat';
      case 'yellow-500':
        return 'carbs';
      case 'red-500':
        return 'calories';
      default:
        return 'protein';
    }
  };
  
  return (
    <NutritionProgress
      label={label}
      current={current}
      max={max}
      unit={unit}
      type={mapColorToType() as any}
    />
  );
};

const MacroStat = ({ label, value, color }: { label: string, value: number, color: string }) => {
  const getColors = () => {
    switch (color) {
      case 'green':
        return 'text-green-600 dark:text-green-400';
      case 'yellow':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'red':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };
  
  return (
    <div className="bg-card border rounded-lg p-2">
      <p className={`text-xl font-bold ${getColors()}`}>{value}%</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
};

const QuickActionButton = ({ 
  icon, 
  label, 
  description, 
  color,
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  description: string, 
  color: string,
  onClick: () => void
}) => {
  
  const getColorClasses = () => {
    switch (color) {
      case 'health-primary':
        return { bg: 'bg-health-primary/10', text: 'text-health-primary' };
      case 'purple-500':
        return { bg: 'bg-purple-500/10', text: 'text-purple-500' };
      case 'blue-500':
        return { bg: 'bg-blue-500/10', text: 'text-blue-500' };
      case 'yellow-500':
        return { bg: 'bg-yellow-500/10', text: 'text-yellow-500' };
      default:
        return { bg: 'bg-slate-500/10', text: 'text-slate-500' };
    }
  };
  
  const { bg, text } = getColorClasses();
  
  return (
    <Button 
      variant="outline" 
      className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 border-border/50"
      onClick={onClick}
    >
      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", bg, text)}>
        {icon}
      </div>
      <div className="text-center">
        <p className="font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Button>
  );
};

export default Meal; 