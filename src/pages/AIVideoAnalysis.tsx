import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import WebcamStream from "@/components/webcam/WebcamStream";
import { AlertCircle, Upload, Check, Camera, RefreshCw, Dumbbell, Trash2, Play, Pause } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import PageTitle from "@/components/layout/PageTitle";

interface AnalysisResult {
  timestamp: number;
  observation: string;
  confidence: number;
  type: "form" | "technique" | "pace" | "general";
}

interface ExerciseDetection {
  name: string;
  confidence: number;
  repetitions: number;
  formScore: number;
}

const mockAnalyzeVideo = async (): Promise<{
  results: AnalysisResult[];
  exercise: ExerciseDetection;
  summary: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock analysis results
  const results: AnalysisResult[] = [
    { 
      timestamp: 3, 
      observation: "Good starting position with back straight",
      confidence: 0.92,
      type: "form" 
    },
    { 
      timestamp: 8, 
      observation: "Knees tracking over toes correctly",
      confidence: 0.88,
      type: "technique" 
    },
    { 
      timestamp: 12, 
      observation: "Slight misalignment in shoulders during lift",
      confidence: 0.76,
      type: "form" 
    },
    { 
      timestamp: 17, 
      observation: "Consistent pace maintained",
      confidence: 0.95,
      type: "pace" 
    },
    { 
      timestamp: 22, 
      observation: "Depth of squat could be improved for better muscle engagement",
      confidence: 0.82,
      type: "technique" 
    },
    { 
      timestamp: 27, 
      observation: "Good control during descent phase",
      confidence: 0.89,
      type: "form" 
    },
    { 
      timestamp: 34, 
      observation: "Breathing pattern is inconsistent",
      confidence: 0.71,
      type: "general" 
    },
  ];
  
  // Mock exercise detection
  const exercise: ExerciseDetection = {
    name: "Barbell Squat",
    confidence: 0.94,
    repetitions: 8,
    formScore: 0.85
  };
  
  // Mock summary
  const summary = "Your squat form is generally good with proper back alignment. Areas for improvement include squat depth and shoulder positioning during the lifting phase. Consistent breathing pattern would enhance overall performance. Detected 8 repetitions with 85% form score.";
  
  return { results, exercise, summary };
};

const AIVideoAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<{
    results: AnalysisResult[];
    exercise: ExerciseDetection;
    summary: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (!selectedFile.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Revoke previous URL to avoid memory leaks
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      
      const url = URL.createObjectURL(selectedFile);
      setVideoUrl(url);
      setIsPlaying(false);
      setAnalysisResults(null);
      
      toast({
        title: "Video uploaded",
        description: `${selectedFile.name} is ready for analysis`
      });
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (!droppedFile.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file",
          variant: "destructive"
        });
        return;
      }
      
      setFile(droppedFile);
      
      // Revoke previous URL to avoid memory leaks
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      
      const url = URL.createObjectURL(droppedFile);
      setVideoUrl(url);
      setIsPlaying(false);
      setAnalysisResults(null);
      
      toast({
        title: "Video uploaded",
        description: `${droppedFile.name} is ready for analysis`
      });
    }
  };
  
  const handleRemoveVideo = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null);
    setVideoUrl(null);
    setAnalysisResults(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleTogglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleStartAnalysis = () => {
    if (!videoUrl) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    
    // Mock API call
    mockAnalyzeVideo().then(results => {
      setAnalysisResults(results);
      setIsAnalyzing(false);
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      toast({
        title: "Analysis complete",
        description: `Detected ${results.exercise.name} with ${results.exercise.repetitions} repetitions`
      });
    }).catch(error => {
      console.error("Analysis error:", error);
      setIsAnalyzing(false);
      clearInterval(progressInterval);
      
      toast({
        title: "Analysis failed",
        description: "An error occurred during analysis",
        variant: "destructive"
      });
    });
  };
  
  const handleStreamReady = (stream: MediaStream) => {
    setIsRecording(true);
    
    // Create a recorder to capture the stream
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const recordedUrl = URL.createObjectURL(blob);
      setRecordedVideoUrl(recordedUrl);
      setVideoUrl(recordedUrl);
      setFile(new File([blob], "recorded-workout.webm", { type: 'video/webm' }));
      setIsRecording(false);
      
      toast({
        title: "Recording saved",
        description: "Your workout video is ready for analysis"
      });
    };
    
    // Start recording
    mediaRecorder.start();
    
    // Stop recording after 30 seconds
    setTimeout(() => {
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    }, 30000);
  };
  
  const handleStreamEnd = () => {
    setIsRecording(false);
  };
  
  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
    };
  }, [videoUrl, recordedVideoUrl]);
  
  return (
    <div className="space-y-6">
      <PageTitle 
        title="AI Video Analysis" 
        subtitle="Upload or record your workout to get AI-powered form analysis and feedback"
      />
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Video
          </TabsTrigger>
          <TabsTrigger value="record" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Record Workout
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Upload Workout Video</CardTitle>
                <CardDescription>
                  Upload a video of your workout for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!videoUrl ? (
                  <div 
                    className="border-2 border-dashed rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleFileChange} 
                      ref={fileInputRef} 
                      className="hidden" 
                    />
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-lg font-medium">Drag & drop video here or click to browse</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports MP4, WebM, MOV (max 100MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden">
                    <video 
                      src={videoUrl} 
                      ref={videoRef}
                      controls={false}
                      className="w-full h-64 object-cover"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleTogglePlayback}
                        className="rounded-full bg-black/30 border-white/30 hover:bg-black/50"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveVideo}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {file && (
                  <div className="text-sm text-muted-foreground">
                    {file.name} ({Math.round(file.size / 1024 / 1024 * 10) / 10} MB)
                  </div>
                )}
                <Button 
                  onClick={handleStartAnalysis} 
                  disabled={!videoUrl || isAnalyzing}
                  className="ml-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Dumbbell className="h-4 w-4 mr-2" />
                      Analyze Workout
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Analysis Results</CardTitle>
                <CardDescription>
                  AI-powered insights into your workout form and technique
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="space-y-4 py-8">
                    <div className="flex justify-center mb-4">
                      <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                    <p className="text-center text-muted-foreground">
                      Analyzing your workout video...
                    </p>
                  </div>
                ) : analysisResults ? (
                  <div className="space-y-6">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="h-5 w-5 text-primary" />
                        <h3 className="font-medium text-lg">Exercise Detected</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Exercise</p>
                          <p className="font-medium">{analysisResults.exercise.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Repetitions</p>
                          <p className="font-medium">{analysisResults.exercise.repetitions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Form Score</p>
                          <div className="flex items-center gap-2">
                            <Progress value={analysisResults.exercise.formScore * 100} className="h-2 flex-1" />
                            <span className="font-medium">{Math.round(analysisResults.exercise.formScore * 100)}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Confidence</p>
                          <p className="font-medium">{Math.round(analysisResults.exercise.confidence * 100)}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-2">Summary</h3>
                      <p className="text-muted-foreground">{analysisResults.summary}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-2">Detailed Observations</h3>
                      <ScrollArea className="h-64 rounded-md border p-4">
                        <div className="space-y-4">
                          {analysisResults.results.map((result, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-3 rounded-lg border"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <Badge variant={
                                  result.type === "form" ? "default" :
                                  result.type === "technique" ? "secondary" :
                                  result.type === "pace" ? "outline" : "destructive"
                                }>
                                  {result.type}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {Math.floor(result.timestamp / 60)}:{String(result.timestamp % 60).padStart(2, '0')}
                                </span>
                              </div>
                              <p>{result.observation}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="text-xs text-muted-foreground">Confidence:</div>
                                <Progress value={result.confidence * 100} className="h-1 flex-1" />
                                <div className="text-xs font-medium">{Math.round(result.confidence * 100)}%</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg">No Analysis Results Yet</h3>
                    <p className="text-muted-foreground mt-1 max-w-md">
                      Upload a workout video and click "Analyze Workout" to get AI-powered form feedback
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="record">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Record Your Workout</CardTitle>
              <CardDescription>
                Use your webcam to record your workout for instant analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  {isRecording || recordedVideoUrl ? (
                    <WebcamStream 
                      onStreamReady={handleStreamReady}
                      onStreamEnd={handleStreamEnd}
                      showControls={true}
                      enableScreenShare={false}
                    />
                  ) : (
                    <div className="border rounded-lg overflow-hidden bg-muted/30 aspect-video flex flex-col items-center justify-center p-4">
                      <Camera className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="font-medium">Ready to Record</h3>
                      <p className="text-muted-foreground text-center mt-1 mb-4">
                        Position yourself so your full body is visible in the frame
                      </p>
                      <Button onClick={() => setIsRecording(true)}>
                        <Camera className="h-4 w-4 mr-2" />
                        Start Recording
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  {recordedVideoUrl ? (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden">
                        <video 
                          src={recordedVideoUrl} 
                          controls 
                          className="w-full aspect-video object-cover"
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setRecordedVideoUrl(null);
                            setVideoUrl(null);
                            setFile(null);
                            setAnalysisResults(null);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Discard
                        </Button>
                        <Button 
                          onClick={handleStartAnalysis}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Dumbbell className="h-4 w-4 mr-2" />
                              Analyze Workout
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg bg-muted/30 aspect-video flex flex-col items-center justify-center p-4">
                      <div className="text-center">
                        <h3 className="font-medium">Recording Tips</h3>
                        <ul className="text-sm text-muted-foreground mt-4 space-y-2 text-left max-w-md">
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            Ensure your entire body is visible in the frame
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            Choose a well-lit area with minimal background distractions
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            Position camera at approximately hip height for best analysis
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            Wear fitted clothing to allow better movement tracking
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {isAnalyzing && (
                <div className="mt-6 space-y-4">
                  <Progress value={analysisProgress} className="h-2" />
                  <p className="text-center text-muted-foreground">
                    Analyzing your workout video... {analysisProgress}%
                  </p>
                </div>
              )}
              
              {analysisResults && (
                <div className="mt-6 space-y-6">
                  <Separator />
                  <h3 className="font-medium text-xl">Analysis Results</h3>
                  
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Dumbbell className="h-5 w-5 text-primary" />
                      <h3 className="font-medium text-lg">Exercise Detected</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Exercise</p>
                        <p className="font-medium">{analysisResults.exercise.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Repetitions</p>
                        <p className="font-medium">{analysisResults.exercise.repetitions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Form Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={analysisResults.exercise.formScore * 100} className="h-2 flex-1" />
                          <span className="font-medium">{Math.round(analysisResults.exercise.formScore * 100)}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="font-medium">{Math.round(analysisResults.exercise.confidence * 100)}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Summary</h3>
                    <p className="text-muted-foreground">{analysisResults.summary}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Detailed Observations</h3>
                    <ScrollArea className="h-64 rounded-md border p-4">
                      <div className="space-y-4">
                        {analysisResults.results.map((result, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 rounded-lg border"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <Badge variant={
                                result.type === "form" ? "default" :
                                result.type === "technique" ? "secondary" :
                                result.type === "pace" ? "outline" : "destructive"
                              }>
                                {result.type}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {Math.floor(result.timestamp / 60)}:{String(result.timestamp % 60).padStart(2, '0')}
                              </span>
                            </div>
                            <p>{result.observation}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="text-xs text-muted-foreground">Confidence:</div>
                              <Progress value={result.confidence * 100} className="h-1 flex-1" />
                              <div className="text-xs font-medium">{Math.round(result.confidence * 100)}%</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIVideoAnalysis; 