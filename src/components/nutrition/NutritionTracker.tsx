import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Utensils, Calendar, Plus, X, Edit2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NutritionProgress } from '@/components/ui/nutrition-progress';

interface NutrientData {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

interface MealEntry {
  id: string;
  name: string;
  time: string;
  nutrients: NutrientData;
  portions: number;
}

interface NutritionTrackerProps {
  date?: Date;
  className?: string;
  dailyGoals?: NutrientData;
}

const defaultGoals: NutrientData = {
  protein: 120, // grams
  carbs: 250, // grams
  fat: 60, // grams
  calories: 2000,
};

const defaultMeals: MealEntry[] = [
  {
    id: '1',
    name: 'Overnight Oats',
    time: '08:30',
    nutrients: { protein: 15, carbs: 45, fat: 8, calories: 350 },
    portions: 1,
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    time: '13:00',
    nutrients: { protein: 35, carbs: 20, fat: 12, calories: 420 },
    portions: 1,
  },
];

export function NutritionTracker({ 
  date = new Date(), 
  className,
  dailyGoals = defaultGoals 
}: NutritionTrackerProps) {
  const [meals, setMeals] = useState<MealEntry[]>(defaultMeals);
  const [activeTab, setActiveTab] = useState('log');
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<MealEntry>>({
    name: '',
    time: '',
    nutrients: { protein: 0, carbs: 0, fat: 0, calories: 0 },
    portions: 1,
  });

  // Calculate total nutrients
  const totalNutrients = meals.reduce(
    (acc, meal) => {
      return {
        protein: acc.protein + meal.nutrients.protein * meal.portions,
        carbs: acc.carbs + meal.nutrients.carbs * meal.portions,
        fat: acc.fat + meal.nutrients.fat * meal.portions,
        calories: acc.calories + meal.nutrients.calories * meal.portions,
      };
    },
    { protein: 0, carbs: 0, fat: 0, calories: 0 }
  );

  // Calculate percentages of goals
  const percentages = {
    protein: Math.min(100, (totalNutrients.protein / dailyGoals.protein) * 100),
    carbs: Math.min(100, (totalNutrients.carbs / dailyGoals.carbs) * 100),
    fat: Math.min(100, (totalNutrients.fat / dailyGoals.fat) * 100),
    calories: Math.min(100, (totalNutrients.calories / dailyGoals.calories) * 100),
  };

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.time) return;

    const meal: MealEntry = {
      id: Date.now().toString(),
      name: newMeal.name || '',
      time: newMeal.time || '',
      nutrients: newMeal.nutrients || { protein: 0, carbs: 0, fat: 0, calories: 0 },
      portions: newMeal.portions || 1,
    };

    setMeals([...meals, meal]);
    setNewMeal({
      name: '',
      time: '',
      nutrients: { protein: 0, carbs: 0, fat: 0, calories: 0 },
      portions: 1,
    });
    setIsAddingMeal(false);
  };

  const handleRemoveMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('nutrients.')) {
      const nutrientField = field.split('.')[1] as keyof NutrientData;
      setNewMeal({
        ...newMeal,
        nutrients: {
          ...newMeal.nutrients as NutrientData,
          [nutrientField]: Number(value),
        },
      });
    } else {
      setNewMeal({
        ...newMeal,
        [field]: value,
      });
    }
  };

  return (
    <div className={cn("", className)}>
      <Tabs defaultValue="log" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="log" className="flex items-center gap-1">
              <Utensils className="h-4 w-4" />
              <span>Meal Log</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-1">
              <PieChart className="h-4 w-4" />
              <span>Summary</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </Button>
          </div>
        </div>

        <TabsContent value="log" className="mt-0">
          <div className="space-y-4">
            {meals.map((meal) => (
              <Card key={meal.id} className="overflow-hidden border border-border/50">
                <div className="flex items-start p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{meal.name}</span>
                      <span className="text-xs text-muted-foreground">{meal.time}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2 text-sm">
                      <div>
                        <span className="block text-xs text-muted-foreground">Calories</span>
                        <span>{meal.nutrients.calories * meal.portions}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">Protein</span>
                        <span>{meal.nutrients.protein * meal.portions}g</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">Carbs</span>
                        <span>{meal.nutrients.carbs * meal.portions}g</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">Fat</span>
                        <span>{meal.nutrients.fat * meal.portions}g</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Portions: {meal.portions}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => handleRemoveMeal(meal.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {isAddingMeal ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Meal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="meal-name">Meal Name</Label>
                        <Input 
                          id="meal-name" 
                          placeholder="Enter meal name" 
                          value={newMeal.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meal-time">Time</Label>
                        <Input 
                          id="meal-time" 
                          type="time" 
                          value={newMeal.time || ''}
                          onChange={(e) => handleInputChange('time', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="meal-calories">Calories</Label>
                        <Input 
                          id="meal-calories" 
                          type="number" 
                          placeholder="0"
                          value={newMeal.nutrients?.calories || 0}
                          onChange={(e) => handleInputChange('nutrients.calories', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meal-protein">Protein (g)</Label>
                        <Input 
                          id="meal-protein" 
                          type="number" 
                          placeholder="0"
                          value={newMeal.nutrients?.protein || 0}
                          onChange={(e) => handleInputChange('nutrients.protein', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meal-carbs">Carbs (g)</Label>
                        <Input 
                          id="meal-carbs" 
                          type="number" 
                          placeholder="0"
                          value={newMeal.nutrients?.carbs || 0}
                          onChange={(e) => handleInputChange('nutrients.carbs', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meal-fat">Fat (g)</Label>
                        <Input 
                          id="meal-fat" 
                          type="number" 
                          placeholder="0"
                          value={newMeal.nutrients?.fat || 0}
                          onChange={(e) => handleInputChange('nutrients.fat', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meal-portions">Portions</Label>
                      <Input 
                        id="meal-portions" 
                        type="number" 
                        min="0.5" 
                        step="0.5" 
                        value={newMeal.portions || 1}
                        onChange={(e) => handleInputChange('portions', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => setIsAddingMeal(false)}>Cancel</Button>
                  <Button onClick={handleAddMeal}>Add Meal</Button>
                </CardFooter>
              </Card>
            ) : (
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-1 border-dashed"
                onClick={() => setIsAddingMeal(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Add Meal</span>
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="summary" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Summary</CardTitle>
              <CardDescription>
                Your daily nutrition intake compared to your goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <NutritionProgress
                  label="Calories"
                  current={totalNutrients.calories}
                  max={dailyGoals.calories}
                  unit="kcal"
                  type="calories"
                />
                
                <NutritionProgress
                  label="Protein"
                  current={totalNutrients.protein}
                  max={dailyGoals.protein}
                  unit="g"
                  type="protein"
                />
                
                <NutritionProgress
                  label="Carbohydrates"
                  current={totalNutrients.carbs}
                  max={dailyGoals.carbs}
                  unit="g"
                  type="carbs"
                />
                
                <NutritionProgress
                  label="Fat"
                  current={totalNutrients.fat}
                  max={dailyGoals.fat}
                  unit="g"
                  type="fat"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Edit Goals
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 