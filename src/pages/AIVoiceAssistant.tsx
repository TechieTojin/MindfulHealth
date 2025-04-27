import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, Volume2, VolumeX, User, Bot, Play, Headphones, RefreshCw, StopCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import PageTitle from "@/components/layout/PageTitle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Speech Recognition type declarations
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
}

// Define SpeechRecognition interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionError) => void) | null;
  onend: (() => void) | null;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
}

// Sample health questions for suggestions
const healthQuestionSuggestions = [
  "What's a good post-workout meal?",
  "How can I improve my sleep quality?",
  "What exercises help with lower back pain?",
  "How much water should I drink daily?",
  "What are the benefits of meditation?",
  "How can I reduce stress naturally?",
  "What's a balanced breakfast look like?",
  "How to maintain motivation for exercise?",
];

// Sample health tips that the AI will randomly provide
const healthTips = [
  "Try to get at least 7-8 hours of sleep each night for optimal recovery.",
  "Staying hydrated improves energy levels and cognitive function.",
  "Including protein in every meal helps with muscle recovery and satiety.",
  "Even short 5-minute meditation sessions can significantly reduce stress.",
  "Aim for 150 minutes of moderate exercise per week for heart health.",
  "Walking 10,000 steps daily can improve cardiovascular health.",
  "Eating a variety of colorful fruits and vegetables ensures you get diverse nutrients.",
  "Regular stretching can improve flexibility and reduce injury risk.",
  "Strength training at least twice weekly helps maintain muscle mass as you age.",
  "Digital detox periods can improve sleep quality and reduce anxiety."
];

// Sample user names for auto-conversation simulation
const sampleUserNames = [
  "Emma Johnson", "Liam Smith", "Olivia Brown", "Noah Davis", "Ava Wilson",
  "William Taylor", "Sophia Martinez", "James Anderson", "Isabella Thomas", "Logan Jackson",
  "Charlotte White", "Benjamin Harris", "Mia Martin", "Mason Thompson", "Amelia Garcia",
  "Elijah Robinson", "Harper Lewis", "Oliver Walker", "Evelyn Allen", "Jacob Young",
  "Abigail King", "Lucas Wright", "Emily Scott", "Michael Green", "Elizabeth Baker",
  "Alexander Hall", "Sofia Adams", "Ethan Nelson", "Avery Hill", "Matthew Rivera",
  "Ella Mitchell", "Daniel Phillips", "Eleanor Campbell", "Henry Evans", "Madison Carter",
  "Joseph Parker", "Victoria Collins", "Carter Edwards", "Grace Morris", "Owen Rogers",
  "Chloe Cook", "Gabriel Morgan", "Penelope Cooper", "Samuel Bailey", "Layla Richardson",
  "John Reed", "Zoey Cox", "David Howard", "Lily Ward", "Wyatt Torres"
];

// Additional sample questions for auto-conversation
const additionalQuestions = [
  "What are good exercises for beginners?",
  "How can I reduce inflammation naturally?",
  "What foods help with muscle recovery?",
  "How to improve cardiovascular health?",
  "What are the best stretches for flexibility?",
  "How to track fitness progress effectively?",
  "What's the ideal protein intake for muscle building?",
  "How to manage diabetes with diet?",
  "What exercises help with posture improvement?",
  "How to maintain weight loss long term?",
  "What are good recovery techniques after intense workouts?",
  "How to boost metabolism naturally?",
  "What's the best time of day to exercise?",
  "How to prevent muscle cramps during exercise?",
  "What foods help with brain health?",
  "How to improve lung capacity?",
  "What's a good pre-workout meal?",
  "How to reduce cholesterol naturally?",
  "What exercises are best for core strength?",
  "How to prevent exercise burnout?"
];

const AIVoiceAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your health assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [autoMode, setAutoMode] = useState(false);
  const [peopleCount, setPeopleCount] = useState(50);
  const [currentConversations, setCurrentConversations] = useState(0);
  const [totalConversations, setTotalConversations] = useState(0);
  const autoModeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // @ts-ignore - TypeScript doesn't know about webkit prefixed APIs
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionAPI();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;
            setInputValue(current => current + transcript + ' ');
          }
        }
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionError) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        
        toast({
          title: "Microphone Error",
          description: "There was a problem with your microphone. Please try again.",
          variant: "destructive"
        });
      };
      
      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Try using Chrome or Edge.",
        variant: "destructive"
      });
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);
  
  // Auto-conversation effect
  useEffect(() => {
    if (autoMode) {
      // Show toast notification when auto mode is enabled
      toast({
        title: "Auto Mode Enabled",
        description: `Simulating conversations with ${peopleCount} people every 40 seconds.`,
      });
      
      // Start the auto-conversation interval
      autoModeIntervalRef.current = setInterval(() => {
        simulateConversations();
      }, 40000); // Run every 40 seconds
      
      // Immediately run the first batch
      simulateConversations();
      
      return () => {
        if (autoModeIntervalRef.current) {
          clearInterval(autoModeIntervalRef.current);
          autoModeIntervalRef.current = null;
        }
      };
    }
  }, [autoMode, peopleCount]);
  
  // Simulate conversations for multiple users
  const simulateConversations = async () => {
    // Reset current conversations counter
    setCurrentConversations(0);
    
    // Clear previous messages to avoid overwhelming the UI
    setMessages([
      {
        id: '1',
        content: "Auto Mode: Simulating conversations with multiple users.",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    
    // Process conversations in batches to avoid UI freezing
    for (let i = 0; i < peopleCount; i++) {
      // Get a random user name
      const userName = sampleUserNames[Math.floor(Math.random() * sampleUserNames.length)];
      
      // Get a random question
      const allQuestions = [...healthQuestionSuggestions, ...additionalQuestions];
      const question = allQuestions[Math.floor(Math.random() * allQuestions.length)];
      
      // Add user message
      const userMessage: Message = {
        id: `auto-user-${Date.now()}-${i}`,
        content: question,
        sender: 'user',
        timestamp: new Date()
      };
      
      // Use custom user name with the message
      setMessages(prev => [...prev, {
        ...userMessage,
        content: `[${userName}]: ${question}`
      }]);
      
      // Simulate a small delay between users
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Get AI response
      const aiResponse = await mockAIResponse(question);
      
      // Add AI message
      const aiMessage: Message = {
        id: `auto-ai-${Date.now()}-${i}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update current and total conversation counts
      setCurrentConversations(i + 1);
      setTotalConversations(prev => prev + 1);
    }
    
    // Notify completion of batch
    toast({
      title: "Batch Completed",
      description: `Processed ${peopleCount} conversations. Total: ${totalConversations + peopleCount}`,
    });
  };
  
  const toggleAutoMode = () => {
    if (autoMode) {
      // Stop auto mode
      if (autoModeIntervalRef.current) {
        clearInterval(autoModeIntervalRef.current);
        autoModeIntervalRef.current = null;
      }
      
      toast({
        title: "Auto Mode Disabled",
        description: "Conversation simulation stopped.",
      });
      
      // Clear simulated messages
      setMessages([
        {
          id: '1',
          content: "Hello! I'm your health assistant. How can I help you today?",
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
    
    setAutoMode(!autoMode);
  };
  
  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      
      // Send the transcribed message if there's content
      if (inputValue.trim()) {
        handleSendMessage();
      }
    } else {
      setInputValue('');
      recognition.start();
      setIsListening(true);
      
      toast({
        title: "Listening...",
        description: "Speak now. I'm listening for your question.",
      });
    }
  };
  
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    toast({
      title: audioEnabled ? "Voice Response Disabled" : "Voice Response Enabled",
      description: audioEnabled 
        ? "AI assistant will no longer speak responses." 
        : "AI assistant will now speak responses.",
    });
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setInputValue('');
    
    // Add loading message from AI
    const loadingMessage: Message = {
      id: 'loading-' + Date.now().toString(),
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    setIsProcessing(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
      
      // Get AI response
      const aiResponse = await mockAIResponse(userMessage.content);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      // Add AI response to chat
      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response if audio is enabled
      if (audioEnabled) {
        speakText(aiResponse);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now().toString(),
          content: "I'm sorry, I couldn't process your request. Please try again.",
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const mockAIResponse = async (query: string): Promise<string> => {
    // For auto mode, reduce the delay to process faster
    if (autoMode) {
      await new Promise(resolve => setTimeout(resolve, 50));
    } else {
      // Regular delay for manual mode
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Simple keyword matching for responses
    if (lowerQuery.includes('workout') || lowerQuery.includes('exercise')) {
      return "Regular exercise is crucial for maintaining good health. Aim for a mix of cardio, strength training, and flexibility exercises. For cardio, try to get 150 minutes of moderate activity per week. For strength training, work all major muscle groups at least twice a week. Always remember to warm up before and cool down after your workout.";
    } else if (lowerQuery.includes('meal') || lowerQuery.includes('diet') || lowerQuery.includes('nutrition')) {
      return "A balanced diet should include a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. Try to limit processed foods, added sugars, and excessive salt. Consider the plate method: fill half your plate with vegetables and fruits, a quarter with lean protein, and a quarter with whole grains or starchy vegetables.";
    } else if (lowerQuery.includes('sleep') || lowerQuery.includes('rest')) {
      return "Quality sleep is essential for physical recovery and mental health. Adults should aim for 7-9 hours of sleep per night. To improve sleep quality, maintain a consistent sleep schedule, create a relaxing bedtime routine, keep your bedroom cool and dark, limit screen time before bed, and avoid caffeine and large meals close to bedtime.";
    } else if (lowerQuery.includes('stress') || lowerQuery.includes('anxiety')) {
      return "Managing stress is important for overall wellbeing. Try techniques like deep breathing, meditation, progressive muscle relaxation, or mindfulness. Regular physical activity, adequate sleep, and social connections can also help reduce stress. If stress becomes overwhelming, consider speaking with a mental health professional.";
    } else if (lowerQuery.includes('water') || lowerQuery.includes('hydration')) {
      return "Staying hydrated is crucial for optimal body function. While individual needs vary, a general guideline is to aim for about 8 cups (64 ounces) of water daily. Your needs may increase with exercise, hot weather, or certain health conditions. A good indicator of hydration is having pale yellow urine.";
    } else {
      // Return a random health tip for other queries
      return healthTips[Math.floor(Math.random() * healthTips.length)];
    }
  };
  
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive"
      });
      return;
    }
    
    // Stop any ongoing speech
    stopSpeaking();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 1.0; // Speed
    utterance.pitch = 1.0; // Pitch
    utterance.volume = 1.0; // Volume
    
    // Try to use a female voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('female'));
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    
    // Focus the input after setting the value
    document.getElementById('message-input')?.focus();
  };
  
  return (
    <div className="space-y-4">
      <PageTitle 
        title="AI Voice Assistant" 
        subtitle="Ask health and wellness questions using your voice or text"
      />
      
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-mode" 
                checked={autoMode} 
                onCheckedChange={toggleAutoMode}
                disabled={isProcessing}
              />
              <Label htmlFor="auto-mode">Auto Conversation Mode</Label>
            </div>
            
            <div className="flex items-center space-x-4">
              {autoMode && (
                <>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold">{currentConversations}</span>/{peopleCount} current • 
                    <span className="font-semibold ml-1">{totalConversations}</span> total
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={simulateConversations}
                    disabled={isProcessing}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Run Now
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={toggleAutoMode}
                    className="flex items-center gap-1"
                  >
                    <StopCircle className="h-4 w-4" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-primary" />
              Health Voice Assistant {autoMode && <Badge variant="outline">Auto Mode</Badge>}
            </CardTitle>
            <CardDescription>
              {autoMode 
                ? `Simulating conversations with ${peopleCount} people every 40 seconds` 
                : "Ask questions about health, fitness, nutrition, and wellness"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col h-[500px]">
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-shrink-0 pt-1">
                          <Avatar className={message.sender === 'user' ? 'ml-3' : 'mr-3'}>
                            {message.sender === 'user' ? (
                              <>
                                <AvatarImage src="https://t4.ftcdn.net/jpg/00/87/28/19/360_F_87281963_29bnkFXa6RQnJYWeRfrSpieagNxw1Rru.jpg" />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </>
                            ) : (
                              <>
                                <AvatarImage src="https://t4.ftcdn.net/jpg/00/87/28/19/360_F_87281963_29bnkFXa6RQnJYWeRfrSpieagNxw1Rru.jpg" />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  <Bot className="h-4 w-4" />
                                </AvatarFallback>
                              </>
                            )}
                          </Avatar>
                        </div>
                        <div>
                          <div
                            className={`rounded-lg p-3 text-sm ${
                              message.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {message.isLoading ? (
                              <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                                <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                                <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                              </div>
                            ) : (
                              message.content
                            )}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                            {message.sender === 'ai' && audioEnabled && !message.isLoading && !autoMode && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5" 
                                onClick={() => speakText(message.content)}
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                            <span>{formatTime(message.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Input
                      id="message-input"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your health question..."
                      className="pr-10"
                      disabled={isProcessing || autoMode}
                    />
                    {isListening && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="flex space-x-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:0.2s]" />
                          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    type="button"
                    size="icon"
                    variant={isListening ? "destructive" : "default"}
                    onClick={toggleListening}
                    disabled={!recognition || autoMode}
                    title={isListening ? "Stop listening" : "Start listening"}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={toggleAudio}
                    disabled={autoMode}
                    title={audioEnabled ? "Disable voice response" : "Enable voice response"}
                  >
                    {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim() || isProcessing || autoMode}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {autoMode ? "Auto Mode Settings" : "Suggested Questions"}
            </CardTitle>
            <CardDescription>
              {autoMode 
                ? "Configure automatic conversation simulation" 
                : "Try asking one of these health questions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {autoMode ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="people-count">Number of People (per 40s)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="people-count"
                      type="number"
                      min="1"
                      max="100"
                      value={peopleCount}
                      onChange={(e) => setPeopleCount(parseInt(e.target.value) || 50)}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Statistics</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-xs text-muted-foreground">Current Batch</div>
                      <div className="text-xl font-bold">{currentConversations}/{peopleCount}</div>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-xs text-muted-foreground">Total Processed</div>
                      <div className="text-xl font-bold">{totalConversations}</div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={simulateConversations}
                  disabled={isProcessing}
                >
                  Run Simulation Manually
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {healthQuestionSuggestions.map((question, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => handleSuggestionClick(question)}
                    >
                      <span className="line-clamp-2">{question}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 border-t px-6 py-4">
            {autoMode ? (
              <div className="w-full">
                <div className="text-sm font-medium mb-2">Auto Mode Information</div>
                <p className="text-sm text-muted-foreground mb-2">
                  Auto mode simulates conversations with multiple users every 40 seconds.
                  This is useful for testing the system's performance under load.
                </p>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={toggleAutoMode}
                >
                  Disable Auto Mode
                </Button>
              </div>
            ) : (
              <>
                <div className="text-sm font-medium">Voice Commands</div>
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <Badge variant="outline" className="bg-muted">
                      "Stop listening"
                    </Badge>
                    <span className="text-muted-foreground">Stops voice input</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <Badge variant="outline" className="bg-muted">
                      "Cancel"
                    </Badge>
                    <span className="text-muted-foreground">Cancels current task</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <Badge variant="outline" className="bg-muted">
                      "Read that again"
                    </Badge>
                    <span className="text-muted-foreground">Repeats last response</span>
                  </div>
                </div>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AIVoiceAssistant; 