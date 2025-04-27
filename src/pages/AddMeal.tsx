import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PageTitle from "@/components/layout/PageTitle";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Camera, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Array of common meals for quick selection
const commonMeals = [
  { id: 1, name: "Greek Yogurt with Berries", calories: 230, protein: 15, carbs: 25, fat: 8, type: "Breakfast" },
  { id: 2, name: "Grilled Chicken Salad", calories: 350, protein: 30, carbs: 15, fat: 18, type: "Lunch" },
  { id: 3, name: "Protein Smoothie", calories: 280, protein: 20, carbs: 35, fat: 5, type: "Snack" },
  { id: 4, name: "Salmon with Roasted Vegetables", calories: 420, protein: 32, carbs: 25, fat: 22, type: "Dinner" },
  { id: 5, name: "Avocado Toast", calories: 310, protein: 10, carbs: 30, fat: 16, type: "Breakfast" },
  { id: 6, name: "Quinoa Bowl with Vegetables", calories: 380, protein: 12, carbs: 60, fat: 10, type: "Lunch" },
];

// Types for meal and related data
interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: Date;
  time: string;
  type: string;
  description: string;
  servingSize: string;
}

const AddMeal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("manual");
  const [date, setDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Form state
  const [meal, setMeal] = useState<Meal>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    date: new Date(),
    time: format(new Date(), "HH:mm"),
    type: "Breakfast",
    description: "",
    servingSize: "1 serving"
  });

  const handleInputChange = (field: keyof Meal, value: any) => {
    setMeal(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchMeal = () => {
    if (searchTerm.trim() === "") return;
    
    setIsSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      // Filter common meals based on search term
      const results = commonMeals.filter(meal => 
        meal.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleSelectMeal = (selectedMeal: any) => {
    setMeal({
      ...meal,
      name: selectedMeal.name,
      calories: selectedMeal.calories,
      protein: selectedMeal.protein,
      carbs: selectedMeal.carbs,
      fat: selectedMeal.fat,
      type: selectedMeal.type || meal.type
    });
    
    setActiveTab("manual");
    toast({
      title: "Meal selected",
      description: `${selectedMeal.name} has been added to the form.`,
    });
  };

  const handleOpenScanner = () => {
    navigate("/food-scanner");
  };

  const handleSaveMeal = () => {
    // Validate required fields
    if (!meal.name) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter a meal name.",
      });
      return;
    }

    // In a real app, save to API
    // For now, just show success message and navigate back
    toast({
      title: "Meal logged successfully",
      description: `${meal.name} has been added to your meal log.`,
    });
    
    // Here we would update the local state or send to an API
    navigate("/meal");
  };

  // Calculate total calories from macronutrients
  const calculateTotalCalories = () => {
    return meal.protein * 4 + meal.carbs * 4 + meal.fat * 9;
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Log Your Meal" 
        subtitle="Record what you've eaten to track your nutrition" 
      />
      
      <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="mb-6">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="search">Search Food</TabsTrigger>
          <TabsTrigger value="recent">Recent Meals</TabsTrigger>
        </TabsList>
        
        {/* Manual Entry Tab */}
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                Meal Details
                <Badge variant="outline">
                  {format(date, "MMMM d, yyyy")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Meal Name</Label>
                    <Input 
                      id="name" 
                      value={meal.name} 
                      onChange={(e) => handleInputChange("name", e.target.value)} 
                      placeholder="e.g., Greek Yogurt with Berries"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea 
                      id="description" 
                      value={meal.description} 
                      onChange={(e) => handleInputChange("description", e.target.value)} 
                      placeholder="Additional details about your meal..."
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="servingSize">Serving Size</Label>
                    <Input 
                      id="servingSize" 
                      value={meal.servingSize} 
                      onChange={(e) => handleInputChange("servingSize", e.target.value)} 
                      placeholder="e.g., 1 cup, 100g"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(date, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => date && setDate(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="time" 
                          type="time" 
                          value={meal.time} 
                          onChange={(e) => handleInputChange("time", e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Meal Type</Label>
                    <Select 
                      defaultValue={meal.type} 
                      onValueChange={(value) => handleInputChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Breakfast">Breakfast</SelectItem>
                        <SelectItem value="Lunch">Lunch</SelectItem>
                        <SelectItem value="Dinner">Dinner</SelectItem>
                        <SelectItem value="Snack">Snack</SelectItem>
                        <SelectItem value="Pre-Workout">Pre-Workout</SelectItem>
                        <SelectItem value="Post-Workout">Post-Workout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Right column - Nutrition information */}
                <div className="space-y-6 bg-card rounded-lg p-4 border">
                  <div className="text-center">
                    <h3 className="font-medium mb-1">Calories</h3>
                    <div className="text-3xl font-bold text-health-primary">{meal.calories}</div>
                    <p className="text-xs text-muted-foreground">Calculated: {calculateTotalCalories()} kcal</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="calories">Manual Calorie Entry</Label>
                        <span className="text-sm text-muted-foreground">{meal.calories} kcal</span>
                      </div>
                      <Slider
                        id="calories"
                        min={0}
                        max={1000}
                        step={5}
                        value={[meal.calories]}
                        onValueChange={(value) => handleInputChange("calories", value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="protein">Protein</Label>
                        <span className="text-sm text-muted-foreground">{meal.protein}g</span>
                      </div>
                      <Slider
                        id="protein"
                        min={0}
                        max={100}
                        step={1}
                        value={[meal.protein]}
                        onValueChange={(value) => handleInputChange("protein", value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="carbs">Carbohydrates</Label>
                        <span className="text-sm text-muted-foreground">{meal.carbs}g</span>
                      </div>
                      <Slider
                        id="carbs"
                        min={0}
                        max={100}
                        step={1}
                        value={[meal.carbs]}
                        onValueChange={(value) => handleInputChange("carbs", value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="fat">Fat</Label>
                        <span className="text-sm text-muted-foreground">{meal.fat}g</span>
                      </div>
                      <Slider
                        id="fat"
                        min={0}
                        max={100}
                        step={1}
                        value={[meal.fat]}
                        onValueChange={(value) => handleInputChange("fat", value[0])}
                      />
                    </div>
                  </div>
                  
                  {/* Macro percentages */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg p-2">
                      <p className="text-sm font-bold">
                        {calculateTotalCalories() === 0 ? 0 : Math.round((meal.protein * 4 / calculateTotalCalories()) * 100)}%
                      </p>
                      <p className="text-xs">Protein</p>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg p-2">
                      <p className="text-sm font-bold">
                        {calculateTotalCalories() === 0 ? 0 : Math.round((meal.carbs * 4 / calculateTotalCalories()) * 100)}%
                      </p>
                      <p className="text-xs">Carbs</p>
                    </div>
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg p-2">
                      <p className="text-sm font-bold">
                        {calculateTotalCalories() === 0 ? 0 : Math.round((meal.fat * 9 / calculateTotalCalories()) * 100)}%
                      </p>
                      <p className="text-xs">Fat</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto" 
                onClick={() => navigate("/meal")}
              >
                Cancel
              </Button>
              <Button 
                className="w-full sm:w-auto bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90"
                onClick={handleSaveMeal}
              >
                Save Meal
              </Button>
              <Button 
                variant="secondary"
                className="w-full sm:w-auto flex items-center gap-2"
                onClick={handleOpenScanner}
              >
                <Camera className="h-4 w-4" />
                <span>Use Food Scanner</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Search Food Tab */}
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Food Database</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search for food items..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchMeal()}
                  />
                </div>
                <Button onClick={handleSearchMeal} disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {searchResults.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {searchTerm ? "No results found. Try another search term." : "Search for food items to see results."}
                  </div>
                ) : (
                  searchResults.map((result) => (
                    <Card key={result.id} className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={() => handleSelectMeal(result)}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{result.name}</h3>
                          <Badge variant="outline">{result.type}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">Calories</p>
                            <p className="font-medium">{result.calories}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">Protein</p>
                            <p className="font-medium">{result.protein}g</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">Carbs</p>
                            <p className="font-medium">{result.carbs}g</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">Fat</p>
                            <p className="font-medium">{result.fat}g</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recent Meals Tab */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recently Logged Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonMeals.slice(0, 6).map((meal) => (
                  <Card key={meal.id} className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={() => handleSelectMeal(meal)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{meal.name}</h3>
                        <Badge variant="outline">{meal.type}</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs">Calories</p>
                          <p className="font-medium">{meal.calories}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs">Protein</p>
                          <p className="font-medium">{meal.protein}g</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs">Carbs</p>
                          <p className="font-medium">{meal.carbs}g</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs">Fat</p>
                          <p className="font-medium">{meal.fat}g</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddMeal; 