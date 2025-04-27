import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PageTitle from "@/components/layout/PageTitle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for custom meals
interface CustomMeal {
  id: number;
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  lastUsed: string; // ISO date string
  timesUsed: number;
}

const initialMeals: CustomMeal[] = [
  {
    id: 1,
    name: "Greek Yogurt with Berries",
    type: "Breakfast",
    calories: 230,
    protein: 15,
    carbs: 25,
    fat: 8,
    lastUsed: "2023-06-10",
    timesUsed: 12
  },
  {
    id: 2,
    name: "Grilled Chicken Salad",
    type: "Lunch",
    calories: 350,
    protein: 30,
    carbs: 15,
    fat: 18,
    lastUsed: "2023-06-11",
    timesUsed: 8
  },
  {
    id: 3,
    name: "Protein Smoothie",
    type: "Snack",
    calories: 280,
    protein: 20,
    carbs: 35,
    fat: 5,
    lastUsed: "2023-06-09",
    timesUsed: 15
  },
  {
    id: 4,
    name: "Salmon with Roasted Vegetables",
    type: "Dinner",
    calories: 420,
    protein: 32,
    carbs: 25,
    fat: 22,
    lastUsed: "2023-06-08",
    timesUsed: 6
  }
];

const MealDatabase = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<CustomMeal[]>(initialMeals);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [editingMeal, setEditingMeal] = useState<CustomMeal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter meals based on search query and meal type
  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType ? meal.type === filterType : true;
    return matchesSearch && matchesType;
  });

  // Handle creating or updating a meal
  const handleSaveMeal = (meal: CustomMeal) => {
    if (editingMeal) {
      // Update existing meal
      setMeals(prev => prev.map(m => m.id === meal.id ? meal : m));
      toast({
        title: "Meal updated",
        description: `"${meal.name}" has been updated in your meal database.`,
      });
    } else {
      // Create new meal
      const newMeal = {
        ...meal,
        id: meals.length > 0 ? Math.max(...meals.map(m => m.id)) + 1 : 1,
        lastUsed: new Date().toISOString().split('T')[0],
        timesUsed: 0
      };
      setMeals(prev => [...prev, newMeal]);
      toast({
        title: "Meal created",
        description: `"${meal.name}" has been added to your meal database.`,
      });
    }
    setIsDialogOpen(false);
    setEditingMeal(null);
  };

  // Handle deleting a meal
  const handleDeleteMeal = (id: number) => {
    const mealToDelete = meals.find(m => m.id === id);
    if (mealToDelete) {
      setMeals(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Meal deleted",
        description: `"${mealToDelete.name}" has been removed from your meal database.`,
      });
    }
  };

  // Handle editing a meal
  const handleEditMeal = (meal: CustomMeal) => {
    setEditingMeal(meal);
    setIsDialogOpen(true);
  };

  // Handle creating a new meal
  const handleNewMeal = () => {
    setEditingMeal(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Meal Database" 
        subtitle="Manage your custom meals for easy logging and planning" 
      />
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Your Custom Meals</CardTitle>
            <Button 
              onClick={handleNewMeal}
              className="flex items-center gap-2 bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              <span>Create Meal</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search meals..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{filterType || "All Types"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilterType(null)}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("Breakfast")}>
                  Breakfast
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("Lunch")}>
                  Lunch
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("Dinner")}>
                  Dinner
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("Snack")}>
                  Snack
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                  <TableHead className="text-right">Protein</TableHead>
                  <TableHead className="text-right">Carbs</TableHead>
                  <TableHead className="text-right">Fat</TableHead>
                  <TableHead className="text-right">Last Used</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      {searchQuery || filterType
                        ? "No meals match your search criteria."
                        : "No custom meals created yet. Create your first meal!"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMeals.map((meal) => (
                    <TableRow key={meal.id}>
                      <TableCell className="font-medium">{meal.name}</TableCell>
                      <TableCell>{meal.type}</TableCell>
                      <TableCell className="text-right">{meal.calories}</TableCell>
                      <TableCell className="text-right">{meal.protein}g</TableCell>
                      <TableCell className="text-right">{meal.carbs}g</TableCell>
                      <TableCell className="text-right">{meal.fat}g</TableCell>
                      <TableCell className="text-right">{meal.lastUsed}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleEditMeal(meal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                            onClick={() => handleDeleteMeal(meal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/meal")}
          >
            Back to Meal Dashboard
          </Button>
        </CardFooter>
      </Card>
      
      {/* Meal Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingMeal ? "Edit Meal" : "Create New Meal"}</DialogTitle>
            <DialogDescription>
              {editingMeal 
                ? "Update the details of your custom meal." 
                : "Add a new meal to your database for easy tracking."}
            </DialogDescription>
          </DialogHeader>
          <MealForm 
            initialMeal={editingMeal || {
              id: 0,
              name: "",
              type: "Breakfast",
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              lastUsed: "",
              timesUsed: 0
            }} 
            onSave={handleSaveMeal}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Meal Form component for creating/editing meals
interface MealFormProps {
  initialMeal: CustomMeal;
  onSave: (meal: CustomMeal) => void;
  onCancel: () => void;
}

const MealForm = ({ initialMeal, onSave, onCancel }: MealFormProps) => {
  const [meal, setMeal] = useState<CustomMeal>(initialMeal);

  const handleChange = (field: keyof CustomMeal, value: any) => {
    setMeal(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!meal.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter a name for your meal.",
      });
      return;
    }
    
    onSave(meal);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Meal Name</Label>
          <Input 
            id="name" 
            value={meal.name} 
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., Greek Yogurt with Berries"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Meal Type</Label>
          <RadioGroup 
            value={meal.type}
            onValueChange={(value) => handleChange("type", value)}
            className="flex flex-wrap gap-2"
          >
            {["Breakfast", "Lunch", "Dinner", "Snack"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={`type-${type}`} />
                <Label htmlFor={`type-${type}`}>{type}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="calories">Calories</Label>
            <Input 
              id="calories" 
              type="number" 
              min={0}
              value={meal.calories}
              onChange={(e) => handleChange("calories", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein">Protein (g)</Label>
            <Input 
              id="protein" 
              type="number" 
              min={0}
              value={meal.protein}
              onChange={(e) => handleChange("protein", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input 
              id="carbs" 
              type="number" 
              min={0}
              value={meal.carbs}
              onChange={(e) => handleChange("carbs", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fat">Fat (g)</Label>
            <Input 
              id="fat" 
              type="number" 
              min={0}
              value={meal.fat}
              onChange={(e) => handleChange("fat", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialMeal.id ? "Update Meal" : "Create Meal"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MealDatabase; 