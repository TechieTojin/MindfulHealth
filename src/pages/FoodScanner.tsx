import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Camera, Image as ImageIcon, Utensils, X, Check, AlertCircle, RefreshCw, Save, ChevronRight, Zap } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import PageTitle from '@/components/layout/PageTitle';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Types
interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface FoodDetection {
  name: string;
  confidence: number;
  nutrition: NutritionInfo;
}

interface MealSuggestion {
  title: string;
  description: string;
  nutritionInfo: NutritionInfo;
  healthScore: number;
}

// Mock Groq API call for food detection (in a real app, this would call Groq Vision API)
const mockDetectFood = async (imageData: string): Promise<FoodDetection> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Mock detection result
      resolve({
        name: "Grilled Chicken with Brown Rice and Vegetables",
        confidence: 0.89,
        nutrition: {
          calories: 420,
          protein: 35,
          carbs: 45,
          fat: 12,
          fiber: 6
        }
      });
    }, 1500);
  });
};

// Mock Groq API call for meal suggestions (in a real app, this would call Groq LLM API)
const mockGetMealSuggestions = async (foodData: FoodDetection): Promise<MealSuggestion[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Mock suggestions based on detected food
      resolve([
        {
          title: "Quinoa Bowl with Grilled Chicken",
          description: "Replace brown rice with protein-rich quinoa for more nutrients and a lower glycemic index. Add more leafy greens for additional fiber.",
          nutritionInfo: {
            calories: 390,
            protein: 38,
            carbs: 38,
            fat: 11,
            fiber: 8
          },
          healthScore: 92
        },
        {
          title: "Cauliflower Rice Chicken Bowl",
          description: "Lower-carb alternative using cauliflower rice instead of brown rice. Add avocado for healthy fats and more nutrient density.",
          nutritionInfo: {
            calories: 350,
            protein: 36,
            carbs: 18,
            fat: 16,
            fiber: 9
          },
          healthScore: 89
        },
        {
          title: "Mediterranean Chicken Plate",
          description: "Switch to a Mediterranean-style plate with hummus, tabbouleh, and olive oil dressing for heart-healthy benefits.",
          nutritionInfo: {
            calories: 430,
            protein: 34,
            carbs: 42,
            fat: 15,
            fiber: 7
          },
          healthScore: 88
        }
      ]);
    }, 2000);
  });
};

const FoodScanner = () => {
  const [activeTab, setActiveTab] = useState<string>("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detectedFood, setDetectedFood] = useState<FoodDetection | null>(null);
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [userGoal, setUserGoal] = useState<string>("balanced"); // balanced, low-carb, high-protein
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start camera when component mounts and tab is 'camera'
  useEffect(() => {
    if (activeTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  // Start webcam
  const startCamera = async () => {
    if (!videoRef.current) return;
    
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError("Unable to access camera. Please check permissions.");
      setIsCameraActive(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  // Capture image from webcam
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Reset the scan state
  const resetScan = () => {
    setCapturedImage(null);
    setDetectedFood(null);
    setSuggestions([]);
    setIsAnalyzing(false);
    if (activeTab === "camera") {
      startCamera();
    }
  };

  // Analyze captured food image
  const analyzeFood = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      // In a real app, send image to Groq Vision API
      const detectionResult = await mockDetectFood(capturedImage);
      setDetectedFood(detectionResult);
      
      // Get meal suggestions based on detected food
      const suggestionsResult = await mockGetMealSuggestions(detectionResult);
      setSuggestions(suggestionsResult);
      
      toast({
        title: "Food Analyzed",
        description: `Detected: ${detectionResult.name}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error analyzing food:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the food image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add meal to user's tracked meals
  const addToMyMeals = () => {
    if (!detectedFood) return;
    
    toast({
      title: "Meal Added",
      description: `${detectedFood.name} has been added to your meals.`,
      variant: "default",
    });
  };

  // Format nutrition value (add unit)
  const formatNutritionValue = (value: number, unit: string) => {
    return `${value}${unit}`;
  };

  // Calculate percentage for progress bars
  const calculatePercentage = (current: number, total: number) => {
    return Math.min(Math.round((current / total) * 100), 100);
  };
  
  return (
    <div className="space-y-6 mb-12">
      <PageTitle 
        title="Food Scanner" 
        subtitle="Scan your meals for nutritional analysis and personalized suggestions" 
      />
      
      <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="camera" disabled={!!detectedFood}>
            <Camera className="h-4 w-4 mr-2" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="upload" disabled={!!detectedFood}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="camera" className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative">
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 p-6 z-20">
                  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                  <p className="text-center text-destructive font-medium mb-2">{cameraError}</p>
                  <Button variant="outline" onClick={startCamera}>Try Again</Button>
                </div>
              )}
              
              <div className="relative aspect-[4/3] bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover",
                    isCameraActive ? "opacity-100" : "opacity-0"
                  )}
                />
                
                {capturedImage && (
                  <img 
                    src={capturedImage} 
                    alt="Captured food" 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                )}
                
                {!isCameraActive && !capturedImage && !cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30">
                    <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Camera inactive</p>
                  </div>
                )}
                
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              {!capturedImage && !detectedFood && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Button
                    onClick={captureImage}
                    className="rounded-full h-14 w-14 bg-health-primary hover:bg-health-primary/90"
                    disabled={!isCameraActive}
                  >
                    <Camera className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {capturedImage && !detectedFood && (
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={resetScan}>
                <X className="h-4 w-4 mr-2" />
                Retake
              </Button>
              <Button onClick={analyzeFood} disabled={isAnalyzing} className="bg-health-primary hover:bg-health-primary/90">
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Utensils className="h-4 w-4 mr-2" />
                    Scan Food
                  </>
                )}
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg py-12 px-6">
                {capturedImage ? (
                  <div className="w-full">
                    <div className="relative aspect-[4/3] mb-4">
                      <img 
                        src={capturedImage} 
                        alt="Uploaded food" 
                        className="rounded-lg object-cover w-full h-full" 
                      />
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" onClick={resetScan}>
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                      <Button onClick={analyzeFood} disabled={isAnalyzing} className="bg-health-primary hover:bg-health-primary/90">
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Utensils className="h-4 w-4 mr-2" />
                            Scan Food
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Food Image</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Upload a clear image of your meal for analysis
                    </p>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button onClick={triggerFileUpload} className="bg-health-primary hover:bg-health-primary/90">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Browse Images
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {detectedFood && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card className="border-health-primary/20 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-health-primary/10 to-health-accent/10 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{detectedFood.name}</CardTitle>
                    <CardDescription>
                      Detected with {Math.round(detectedFood.confidence * 100)}% confidence
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-health-primary/10 text-health-primary border-health-primary/30">
                    {detectedFood.nutrition.calories} calories
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium flex items-center">
                      <Utensils className="h-4 w-4 mr-2 text-health-primary" />
                      Nutrition Information
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Protein</Label>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{formatNutritionValue(detectedFood.nutrition.protein, "g")}</span>
                          <span className="text-xs text-muted-foreground">25% of meal</span>
                        </div>
                        <Progress
                          value={calculatePercentage(detectedFood.nutrition.protein, 140)}
                          className="h-2 bg-muted [&>div]:bg-blue-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Carbs</Label>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{formatNutritionValue(detectedFood.nutrition.carbs, "g")}</span>
                          <span className="text-xs text-muted-foreground">30% of meal</span>
                        </div>
                        <Progress
                          value={calculatePercentage(detectedFood.nutrition.carbs, 150)}
                          className="h-2 bg-muted [&>div]:bg-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Fat</Label>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{formatNutritionValue(detectedFood.nutrition.fat, "g")}</span>
                          <span className="text-xs text-muted-foreground">15% of meal</span>
                        </div>
                        <Progress
                          value={calculatePercentage(detectedFood.nutrition.fat, 80)}
                          className="h-2 bg-muted [&>div]:bg-red-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Fiber</Label>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{formatNutritionValue(detectedFood.nutrition.fiber, "g")}</span>
                          <span className="text-xs text-muted-foreground">24% of daily</span>
                        </div>
                        <Progress
                          value={calculatePercentage(detectedFood.nutrition.fiber, 25)}
                          className="h-2 bg-muted [&>div]:bg-green-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button onClick={addToMyMeals} className="bg-health-primary hover:bg-health-primary/90">
                      <Save className="h-4 w-4 mr-2" />
                      Add to My Meals
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Meal Suggestions</h2>
                
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Goal:</Label>
                  <select
                    value={userGoal}
                    onChange={(e) => setUserGoal(e.target.value)}
                    className="rounded-md border border-border bg-background px-3 py-1 text-sm"
                  >
                    <option value="balanced">Balanced</option>
                    <option value="low-carb">Low Carb</option>
                    <option value="high-protein">High Protein</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion, index) => (
                  <Card 
                    key={index}
                    className="border-border/50 hover:border-health-primary/30 transition-all hover:shadow-md"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{suggestion.title}</CardTitle>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-white border-0",
                            suggestion.healthScore >= 90 
                              ? "bg-green-500" 
                              : suggestion.healthScore >= 80 
                                ? "bg-green-600" 
                                : "bg-yellow-500"
                          )}
                        >
                          {suggestion.healthScore}/100
                        </Badge>
                      </div>
                      
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className="text-muted-foreground">
                          {suggestion.nutritionInfo.calories} cal
                        </span>
                        <span className="text-muted-foreground">
                          {suggestion.nutritionInfo.protein}g protein
                        </span>
                        <span className="text-muted-foreground">
                          {suggestion.nutritionInfo.carbs}g carbs
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>{suggestion.description}</p>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-between">
                      <Badge variant="outline" className="bg-health-accent/10 text-health-accent border-health-accent/30">
                        <Zap className="h-3 w-3 mr-1" />
                        {userGoal === "low-carb" 
                          ? `${detectedFood.nutrition.carbs - suggestion.nutritionInfo.carbs}g less carbs` 
                          : userGoal === "high-protein"
                            ? `${suggestion.nutritionInfo.protein - detectedFood.nutrition.protein}g more protein`
                            : `${detectedFood.nutrition.calories - suggestion.nutritionInfo.calories} fewer calories`
                        }
                      </Badge>
                      
                      <Button variant="ghost" size="sm" className="h-8 text-health-primary">
                        Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline" onClick={resetScan}>
                <Camera className="h-4 w-4 mr-2" />
                Scan Another Meal
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default FoodScanner; 