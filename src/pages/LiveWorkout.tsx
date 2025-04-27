import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, PauseCircle, SkipForward, Volume2, Timer, Heart, Users, MessageSquare, Flame, AlertCircle, ChevronUp, Camera, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import PageTitle from '@/components/layout/PageTitle';
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import WebcamStream from "@/components/webcam/WebcamStream";

// Mock WebSocket for real-time updates
class MockWebSocket {
  onmessage: ((event: any) => void) | null = null;
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  readyState = 0;

  constructor(url: string) {
    // Simulate connection after 500ms
    setTimeout(() => {
      this.readyState = 1;
      if (this.onopen) this.onopen();
      this.startMockMessages();
    }, 500);
  }

  send(data: string) {
    // Simulate sending data and getting a response
    const parsedData = JSON.parse(data);
    
    if (parsedData.type === 'chat_message') {
      // Echo back the message with server timestamp
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage({
            data: JSON.stringify({
              type: 'chat_message_received',
              id: Date.now(),
              user: "You",
              message: parsedData.message,
              time: "Just now"
            })
          });
        }
      }, 300);
    }
  }

  close() {
    this.readyState = 3;
    if (this.onclose) this.onclose();
  }

  private startMockMessages() {
    // Simulate real-time participant updates
    const updateInterval = setInterval(() => {
      if (this.readyState !== 1) {
        clearInterval(updateInterval);
        return;
      }

      // Random chance to get a new message
      if (Math.random() > 0.85 && this.onmessage) {
        const mockUsers = ["Jaiby", "Tobin", "Ponnu", "Anish", "Simson", "Mini", "Shibi", "Joseph"];
        const mockMessages = [
          "Keep pushing everyone! You're doing great!",
          "I'm feeling the burn 🔥",
          "How's everyone holding up?",
          "This is more intense than I expected!",
          "Is anyone else's heart rate through the roof?",
          "Stay hydrated everyone",
          "10 more seconds, you can do it!",
          "Loving this workout! 💪",
          "My muscles are on fire right now",
          "Alex, you're a great motivator!",
          "Let's all finish strong!",
          "This is the best part of my day",
          "I'm going to be sore tomorrow for sure"
        ];
        
        this.onmessage({
          data: JSON.stringify({
            type: 'chat_message_received',
            id: Date.now(),
            user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
            message: mockMessages[Math.floor(Math.random() * mockMessages.length)],
            time: "Just now"
          })
        });
      }

      // Random chance to update participant count
      if (Math.random() > 0.7 && this.onmessage) {
        this.onmessage({
          data: JSON.stringify({
            type: 'participants_update',
            count: Math.floor(Math.random() * 5) + 235
          })
        });
      }

    }, 3000); // More frequent messages (every 3 seconds)
  }
}

// Mock workout data
const workoutData = {
  title: "Full Body HIIT Challenge",
  instructor: "Alex Rodriguez",
  duration: 45, // minutes
  calories: 320,
  participants: 238,
  description: "This high-intensity interval training workout targets all major muscle groups and improves cardiovascular fitness. Perfect for intermediate to advanced levels.",
  exercises: [
    { name: "Jumping Jacks", duration: 60, type: "warmup" },
    { name: "Burpees", duration: 45, type: "high-intensity" },
    { name: "Mountain Climbers", duration: 45, type: "high-intensity" },
    { name: "Push-ups", duration: 30, type: "strength" },
    { name: "Squats", duration: 30, type: "strength" },
    { name: "Plank", duration: 60, type: "core" },
    { name: "Russian Twists", duration: 45, type: "core" },
    { name: "High Knees", duration: 45, type: "high-intensity" },
    { name: "Lunges", duration: 30, type: "strength" },
    { name: "Cooldown Stretches", duration: 120, type: "cooldown" }
  ]
};

// Initial chat messages
const initialMessages = [
  { id: 1, user: "Alex", message: "Welcome everyone! Let's crush this workout today!", time: "1m ago" },
  { id: 2, user: "Jaiby", message: "So excited for this session!", time: "45s ago" },
  { id: 3, user: "Tobin", message: "Is this suitable for beginners?", time: "30s ago" },
  { id: 4, user: "Alex", message: "Absolutely Tobin! Just go at your own pace and take breaks when needed.", time: "20s ago" },
  { id: 5, user: "Simson", message: "I've been looking forward to this all week!", time: "15s ago" },
  { id: 6, user: "Mini", message: "Let's do this! 💪", time: "10s ago" }
];

// Add workout video collection after the mock workout data
const workoutVideos = [
  {
    id: 1,
    title: "HIIT Full Body Workout",
    src: "https://cdn.pixabay.com/vimeo/328238344/woman-25953.mp4?width=1280&hash=27e77e7ce3dc24077eace0ee0f6cfa42af95b735",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1280&q=80",
    instructor: "Alex Rodriguez",
    difficulty: "Intermediate"
  },
  {
    id: 2,
    title: "30-Minute Cardio Burn",
    src: "https://cdn.pixabay.com/vimeo/430942142/fitness-41691.mp4?width=1280&hash=3f7d8c6b936fdfdc7a4e245f99075f4dc0e606e9",
    thumbnail: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1280&q=80",
    instructor: "Emma Chen",
    difficulty: "All Levels"
  },
  {
    id: 3,
    title: "Strength Training Basics",
    src: "https://cdn.pixabay.com/vimeo/440777208/weight-training-44203.mp4?width=1280&hash=9d6c7cfab3337f40b3bd543a9f0ba0fc4736bf4a",
    thumbnail: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=1280&q=80",
    instructor: "Michael Johnson",
    difficulty: "Beginner"
  },
  {
    id: 4,
    title: "Core Power Yoga Flow",
    src: "https://cdn.pixabay.com/vimeo/457753291/yoga-46809.mp4?width=1280&hash=8a91f89ffd3b103aad5425647403c90a172931c4",
    thumbnail: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1280&q=80",
    instructor: "Sarah Williams",
    difficulty: "Intermediate"
  }
];

const LiveWorkout: React.FC = () => {
  const { theme } = useTheme();
  const [isLive, setIsLive] = useState<boolean>(false);
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(workoutData.exercises[0].duration);
  const [totalProgress, setTotalProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(75);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [calories, setCalories] = useState<number>(0);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState<string>("");
  const [participants, setParticipants] = useState<number>(workoutData.participants);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showMetrics, setShowMetrics] = useState<boolean>(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [messageReactions, setMessageReactions] = useState<Record<number, string[]>>({});
  const [achievements, setAchievements] = useState<{ id: number; text: string; time: number }[]>([]);
  const [showInstructorCue, setShowInstructorCue] = useState<boolean>(false);
  const [instructorCue, setInstructorCue] = useState<string>("");
  const [workoutIntensity, setWorkoutIntensity] = useState<number>(70); // 0-100 scale
  const [selectedVideo, setSelectedVideo] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isWebcamMinimized, setIsWebcamMinimized] = useState(false);
  const [userMedia, setUserMedia] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<MockWebSocket | null>(null);

  // Add a state for participant webcams
  const [participantCams, setParticipantCams] = useState<Array<{id: string, name: string, avatar?: string}>>([
    { id: 'p1', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop' },
    { id: 'p2', name: 'Mike', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=50&h=50&auto=format&fit=crop' },
    { id: 'p3', name: 'Emma', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=50&h=50&auto=format&fit=crop' }
  ]);

  // Connect to mock WebSocket
  useEffect(() => {
    socketRef.current = new MockWebSocket('wss://mockapi.mindfulhealth.io/live-workout');
    
    socketRef.current.onopen = () => {
      setIsConnected(true);
      toast({
        title: "Connected to live session",
        description: "You're now connected to the workout stream",
        variant: "default",
      });
    };
    
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'chat_message_received') {
        setMessages(prev => [...prev, {
          id: data.id,
          user: data.user,
          message: data.message,
          time: data.time
        }]);
        
        // Remove user from typing indicators if they sent a message
        setTypingUsers(prev => prev.filter(user => user !== data.user));
      }
      
      if (data.type === 'participants_update') {
        setParticipants(data.count);
      }
      
      // Handle typing indicator
      if (data.type === 'typing_indicator') {
        if (data.isTyping) {
          setTypingUsers(prev => prev.includes(data.user) ? prev : [...prev, data.user]);
          
          // Auto-remove typing indicator after a delay
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(user => user !== data.user));
          }, 3000);
        } else {
          setTypingUsers(prev => prev.filter(user => user !== data.user));
        }
      }
      
      // Handle message reactions
      if (data.type === 'message_reaction') {
        setMessageReactions(prev => ({
          ...prev,
          [data.messageId]: [...(prev[data.messageId] || []), data.reaction]
        }));
      }
    };
    
    socketRef.current.onclose = () => {
      setIsConnected(false);
      setShowAlert(true);
    };
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Handle video loading and playback
  useEffect(() => {
    if (videoRef.current) {
      if (isLive && videoRef.current.paused) {
        // Set the selected video or default to the first one
        const videoSrc = selectedVideo === 0 
          ? workoutVideos[0].src 
          : workoutVideos.find(v => v.id === selectedVideo)?.src || workoutVideos[0].src;
        
        const posterImg = selectedVideo === 0 
          ? workoutVideos[0].thumbnail 
          : workoutVideos.find(v => v.id === selectedVideo)?.thumbnail || workoutVideos[0].thumbnail;
        
        videoRef.current.src = videoSrc;
        videoRef.current.poster = posterImg;
        setIsVideoLoaded(false);
        setVideoError(false);
        
        // Start playback when live
        try {
          videoRef.current.play()
            .catch(err => {
              console.warn("Auto-play prevented:", err);
              // Show play button or instructions if autoplay is prevented
            });
        } catch (err) {
          console.error("Video playback error:", err);
          setVideoError(true);
        }
      } else if (!isLive && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    }
  }, [isLive, selectedVideo]);

  // Handle video events
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) return;
    
    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };
    
    const handleError = () => {
      setVideoError(true);
      toast({
        title: "Video Error",
        description: "Failed to load the workout video. Please try another one.",
        variant: "destructive",
      });
    };
    
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement === videoElement || 
        // @ts-ignore
        document.webkitFullscreenElement === videoElement
      );
    };
    
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('error', handleError);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    
    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('error', handleError);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current) return;
    
    if (!document.fullscreenElement) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      // @ts-ignore - Safari support
      } else if (videoRef.current.webkitRequestFullscreen) {
        // @ts-ignore
        videoRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
      // @ts-ignore - Safari support
      } else if (document.webkitExitFullscreen) {
        // @ts-ignore
        document.webkitExitFullscreen();
      }
    }
  }, []);

  // Function to change workout video
  const changeWorkoutVideo = useCallback((videoId: number) => {
    setSelectedVideo(videoId);
    
    if (isLive) {
      toast({
        title: "Video Changed",
        description: `Now playing ${workoutVideos.find(v => v.id === videoId)?.title || 'workout video'}`,
        variant: "default",
      });
    }
  }, [isLive]);

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Workout timer
  useEffect(() => {
    if (!isLive) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Move to next exercise or end workout
          if (currentExercise < workoutData.exercises.length - 1) {
            setCurrentExercise(prev => prev + 1);
            return workoutData.exercises[currentExercise + 1].duration;
          } else {
            setIsLive(false);
            toast({
              title: "Workout Complete!",
              description: "Great job! You've completed today's session.",
              variant: "default",
            });
            return 0;
          }
        }
        return prev - 1;
      });

      // Update total progress
      const totalDuration = workoutData.exercises.reduce((acc, ex) => acc + ex.duration, 0);
      const completedDuration = workoutData.exercises.slice(0, currentExercise).reduce((acc, ex) => acc + ex.duration, 0);
      const currentProgress = completedDuration + (workoutData.exercises[currentExercise].duration - timeRemaining);
      setTotalProgress(Math.min(100, (currentProgress / totalDuration) * 100));
      
      // Update calories and heart rate for simulation
      setCalories(prev => prev + 0.12);
      setHeartRate(prev => {
        const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2 variation
        const newRate = prev + variation;
        // Keep heart rate in realistic range
        return Math.min(Math.max(newRate, 70), 160);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLive, currentExercise, timeRemaining]);

  // Add a function to simulate typing indicators
  useEffect(() => {
    // Simulate random users typing
    if (isConnected) {
      const typingInterval = setInterval(() => {
        if (Math.random() > 0.85) {
          const mockUsers = ["Jaiby", "Tobin", "Ponnu", "Anish", "Simson", "Mini", "Shibi", "Joseph"];
          const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
          
          // Add user to typing indicators
          setTypingUsers(prev => prev.includes(randomUser) ? prev : [...prev, randomUser]);
          
          // Auto-remove typing indicator after a delay
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(user => user !== randomUser));
          }, Math.random() * 3000 + 1000);
        }
      }, 5000);
      
      return () => clearInterval(typingInterval);
    }
  }, [isConnected]);

  // Add a function to simulate message reactions
  useEffect(() => {
    // Simulate random reactions to messages
    if (isConnected && messages.length > 0) {
      const reactionInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          const randomMessageIndex = Math.floor(Math.random() * messages.length);
          const randomMessageId = messages[randomMessageIndex].id;
          const reactions = ["👍", "❤️", "🔥", "💪", "👏", "😊"];
          const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
          
          setMessageReactions(prev => ({
            ...prev,
            [randomMessageId]: [...(prev[randomMessageId] || []), randomReaction]
          }));
        }
      }, 10000);
      
      return () => clearInterval(reactionInterval);
    }
  }, [isConnected, messages]);

  // Add instructor voice cues tied to the exercises
  useEffect(() => {
    if (!isLive) return;
    
    const instructorCues = [
      "Keep your core tight during this exercise!",
      "Remember to breathe deeply - in through the nose, out through the mouth",
      "You're doing great! Push yourself a little harder!",
      "30 seconds left, give it your all!",
      "Focus on your form - quality over quantity!",
      "Stay with me, we're almost there!",
      "Feeling the burn? That means it's working!",
      "Keep that energy up, you're crushing it!",
      "Modify if you need to, listen to your body",
      "This is where champions are made - in these moments of challenge!"
    ];
    
    // Show cues at specific intervals
    const cueIntervals = [5, 15, 30];
    
    if (cueIntervals.includes(timeRemaining)) {
      const randomCue = instructorCues[Math.floor(Math.random() * instructorCues.length)];
      setInstructorCue(randomCue);
      setShowInstructorCue(true);
      
      // Hide cue after 4 seconds
      setTimeout(() => {
        setShowInstructorCue(false);
      }, 4000);
    }
  }, [isLive, timeRemaining]);
  
  // Generate milestone achievements as workout progresses
  useEffect(() => {
    if (!isLive) return;
    
    // Milestones based on exercise transitions and calories
    const calorieThresholds = [50, 100, 150, 200, 250, 300];
    
    // Exercise transition achievement
    if (timeRemaining === workoutData.exercises[currentExercise].duration - 1 && currentExercise > 0) {
      const newAchievement = {
        id: Date.now(),
        text: `Completed ${workoutData.exercises[currentExercise - 1].name}!`,
        time: 3000
      };
      setAchievements(prev => [...prev, newAchievement]);
      
      // Remove achievement after display time
      setTimeout(() => {
        setAchievements(prev => prev.filter(a => a.id !== newAchievement.id));
      }, newAchievement.time);
    }
    
    // Calorie milestone achievement
    const currentCalorieThreshold = calorieThresholds.find(t => 
      Math.floor(calories) === t
    );
    
    if (currentCalorieThreshold) {
      const newAchievement = {
        id: Date.now(),
        text: `🔥 ${currentCalorieThreshold} Calories Burned!`,
        time: 4000
      };
      setAchievements(prev => [...prev, newAchievement]);
      
      // Remove achievement after display time
      setTimeout(() => {
        setAchievements(prev => prev.filter(a => a.id !== newAchievement.id));
      }, newAchievement.time);
    }
    
    // Random encouragement for high heart rate
    if (heartRate > 140 && Math.random() > 0.95) {
      const newAchievement = {
        id: Date.now(),
        text: "💪 Peak Intensity Reached! Keep it up!",
        time: 3000
      };
      setAchievements(prev => [...prev, newAchievement]);
      
      // Remove achievement after display time
      setTimeout(() => {
        setAchievements(prev => prev.filter(a => a.id !== newAchievement.id));
      }, newAchievement.time);
    }
  }, [isLive, currentExercise, timeRemaining, calories, heartRate]);
  
  // Update workout intensity based on current exercise
  useEffect(() => {
    if (!isLive) return;
    
    // Map exercise types to intensity levels
    const intensityMap: Record<string, number> = {
      'warmup': 50,
      'high-intensity': 90,
      'strength': 75,
      'core': 70,
      'cooldown': 40
    };
    
    // Get current exercise type
    const currentType = workoutData.exercises[currentExercise].type;
    const baseIntensity = intensityMap[currentType] || 70;
    
    // Add some variation
    const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
    
    setWorkoutIntensity(Math.min(Math.max(baseIntensity + variation, 30), 100));
  }, [isLive, currentExercise]);

  const toggleLiveWorkout = useCallback(() => {
    if (!isLive) {
      toast({
        title: "Workout Started",
        description: "Your live session has begun. Give it your all!",
        variant: "default",
      });
    }
    setIsLive(!isLive);
  }, [isLive]);

  const skipExercise = useCallback(() => {
    if (currentExercise < workoutData.exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setTimeRemaining(workoutData.exercises[currentExercise + 1].duration);
      toast({
        title: "Exercise Skipped",
        description: `Moving to ${workoutData.exercises[currentExercise + 1].name}`,
        variant: "default",
      });
    }
  }, [currentExercise]);

  // Update the handleSendMessage function to show typing indicator
  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;
    
    // Send message through WebSocket
    socketRef.current.send(JSON.stringify({
      type: 'chat_message',
      message: newMessage
    }));
    
    setNewMessage("");
  }, [newMessage]);
  
  // Add a function to handle input changes and send typing indicators
  const handleMessageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Send typing indicator
    if (e.target.value.trim() && socketRef.current) {
      socketRef.current.send(JSON.stringify({
        type: 'typing_indicator',
        isTyping: true,
        user: "You"
      }));
    }
  }, []);

  // Update the volume handling to affect video
  useEffect(() => {
    if (videoRef.current) {
      // Set video volume (0-1 scale)
      videoRef.current.volume = volume / 100;
      videoRef.current.muted = volume === 0;
    }
  }, [volume]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  const getExerciseColor = useCallback((type: string) => {
    const colors: Record<string, string> = {
      'warmup': 'from-blue-400 to-blue-500',
      'high-intensity': 'from-red-400 to-red-500',
      'strength': 'from-purple-400 to-purple-500',
      'core': 'from-yellow-400 to-yellow-500',
      'cooldown': 'from-green-400 to-green-500'
    };
    
    return colors[type] || 'from-health-primary to-health-accent';
  }, []);
  
  const toggleMetricsPanel = useCallback(() => {
    setShowMetrics(prev => !prev);
  }, []);

  const handleStreamReady = (stream: MediaStream) => {
    setUserMedia(stream);
    console.log("Webcam stream is ready");
    
    // Show success toast when webcam is activated
    toast({
      title: "Camera activated",
      description: "You've joined the workout with your camera!",
      variant: "default",
    });
    
    // Add the stream to the participants
    socketRef.current?.send(JSON.stringify({
      type: 'participant_joined',
      message: 'A new participant joined with webcam'
    }));
    
    // You could implement real-time streaming here
    // For example, connecting to a WebRTC service
  };

  const handleStreamEnd = () => {
    setUserMedia(null);
    console.log("Webcam stream has ended");
  };

  return (
    <div className="space-y-6 mb-12">
      <PageTitle title="Live Workout" subtitle="Join interactive fitness sessions in real-time" />
      
      {/* Connection status alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p>Connection to the live session was lost. Trying to reconnect...</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowAlert(false)}>Dismiss</Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main video stream */}
        <div className="xl:col-span-2">
          <Card className="overflow-hidden border-border/50 shadow-md">
            <div className="relative">
              {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-30">
                  <div className="text-center p-4">
                    <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
                    <h3 className="text-white font-medium mb-2">Video playback error</h3>
                    <p className="text-white/70 text-sm mb-4">The selected workout video couldn't be loaded</p>
                    <Button variant="default" onClick={() => setVideoError(false)}>
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
              
              <video 
                ref={videoRef}
                className="w-full h-auto aspect-video bg-black"
                poster={workoutVideos[0].thumbnail}
                playsInline
                muted={volume === 0}
                loop
                controls={isLive}
              />
              
              {/* Video Loading Overlay */}
              <AnimatePresence>
                {!isVideoLoaded && isLive && !videoError && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 flex items-center justify-center z-30"
                  >
                    <div className="text-center">
                      <div className="h-10 w-10 border-4 border-health-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-white">Loading workout video...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Video Controls Overlay - only show when video is paused or hover */}
              {!isLive && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="rounded-full h-16 w-16 bg-health-primary hover:bg-health-primary/90"
                    onClick={toggleLiveWorkout}
                  >
                    <PlayCircle className="h-8 w-8" />
                  </Button>
                </div>
              )}
              
              {/* Instructor cues overlay */}
              <AnimatePresence>
                {showInstructorCue && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-1/4 left-0 right-0 flex justify-center z-20"
                  >
                    <div className="bg-gradient-to-r from-health-primary/80 to-health-accent/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg max-w-md mx-auto border border-white/20">
                      <p className="font-medium text-center">{instructorCue}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Achievements overlay */}
              <div className="absolute top-20 right-4 z-20 space-y-2">
                <AnimatePresence>
                  {achievements.map(achievement => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-health-primary/30 shadow-lg"
                    >
                      <p className="text-sm font-medium">{achievement.text}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Overlay information */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <Badge variant="destructive" className="bg-red-600 relative overflow-hidden">
                  <span className="relative z-10">LIVE</span>
                  <span className="absolute inset-0 bg-white/30 animate-pulse"></span>
                </Badge>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-white text-sm font-medium rounded-md bg-black/60 px-2 py-1"
                >
                  <Users className="inline-block h-4 w-4 mr-1" /> 
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={participants}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="inline-block min-w-[2rem]"
                    >
                      {participants}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
                
                {userMedia && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-white text-sm font-medium rounded-md bg-health-primary/70 px-2 py-1 backdrop-blur-sm"
                  >
                    <Camera className="inline-block h-4 w-4 mr-1" /> 
                    <span>Camera On</span>
                  </motion.div>
                )}
              </div>
              
              <AnimatePresence>
                {isConnected && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 right-4 flex items-center gap-2"
                  >
                    <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm border-none text-white">
                      <Heart className="inline-block h-4 w-4 mr-1 text-red-500" /> 
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={heartRate}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {heartRate} BPM
                        </motion.span>
                      </AnimatePresence>
                    </Badge>
                    
                    <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm border-none text-white">
                      <Flame className="inline-block h-4 w-4 mr-1 text-orange-500" /> 
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={Math.floor(calories)}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {Math.floor(calories)} cal
                        </motion.span>
                      </AnimatePresence>
                    </Badge>
                    
                    {/* Workout intensity gauge */}
                    <div className="relative h-6 w-20 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 overflow-hidden">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: workoutIntensity / 100 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Intensity</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Current exercise indicator */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-black/70 to-black/80 backdrop-blur-sm p-3 rounded-lg border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <motion.h3 
                      key={currentExercise}
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="text-white font-bold"
                    >
                      {workoutData.exercises[currentExercise].name}
                    </motion.h3>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-white/90 border-none bg-gradient-to-r", 
                        getExerciseColor(workoutData.exercises[currentExercise].type)
                      )}
                    >
                      {workoutData.exercises[currentExercise].type.charAt(0).toUpperCase() + 
                      workoutData.exercises[currentExercise].type.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-white flex items-center">
                    <Timer className="inline-block h-4 w-4 mr-1" /> 
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={timeRemaining}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          "min-w-[3rem] text-center",
                          timeRemaining < 10 && isLive ? "animate-pulse text-red-400 font-bold" : ""
                        )}
                      >
                        {formatTime(timeRemaining)}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                <Progress 
                  value={totalProgress} 
                  className="h-1.5 mt-2 [&>div]:bg-gradient-to-r [&>div]:from-health-primary [&>div]:to-health-accent" 
                />
              </motion.div>
            </div>
            
            <CardFooter className="flex justify-between py-4 bg-card">
              <div className="flex items-center space-x-2">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={toggleLiveWorkout} 
                    variant={isLive ? "destructive" : "default"}
                    size="icon"
                    className={isLive ? "" : "bg-gradient-to-r from-health-primary to-health-accent text-white"}
                  >
                    {isLive ? <PauseCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={skipExercise} 
                    variant="outline" 
                    size="icon"
                    disabled={!isLive || currentExercise === workoutData.exercises.length - 1}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
              
              <div className="flex items-center space-x-2 w-1/3">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0])}
                />
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleMetricsPanel}
                className="flex items-center gap-1"
              >
                <ChevronUp className={cn("h-4 w-4 transition-transform", !showMetrics && "rotate-180")} />
                <span>Metrics</span>
              </Button>
            </CardFooter>
          </Card>
          
          <AnimatePresence>
            {showMetrics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mt-6 border-border/50 shadow-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle>{workoutData.title}</CardTitle>
                    <CardDescription>
                      Instructor: {workoutData.instructor} • Duration: {workoutData.duration} min • 
                      Estimated Calories: {workoutData.calories}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="workout-plan" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="workout-plan">Workout Plan</TabsTrigger>
                        <TabsTrigger value="videos">Video Library</TabsTrigger>
                      </TabsList>
                    
                      <TabsContent value="workout-plan">
                        <p className="text-muted-foreground">{workoutData.description}</p>
                        
                        <div className="mt-6">
                          <h3 className="font-medium mb-3">Workout Plan</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {workoutData.exercises.map((exercise, index) => (
                              <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                  "p-3 rounded-lg border relative overflow-hidden",
                                  index === currentExercise && isLive ? 'border-health-primary' : '',
                                )}
                              >
                                {index === currentExercise && isLive && (
                                  <motion.div 
                                    className="absolute inset-0 bg-health-primary/10"
                                    animate={{ 
                                      background: ['rgba(42, 157, 143, 0.1)', 'rgba(42, 157, 143, 0.2)', 'rgba(42, 157, 143, 0.1)']
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  />
                                )}
                                <div className="flex justify-between items-center relative z-10">
                                  <span className="font-medium">{exercise.name}</span>
                                  <Badge 
                                    variant="outline"
                                    className={cn(
                                      "bg-gradient-to-r bg-clip-text text-transparent font-medium border-0",
                                      getExerciseColor(exercise.type)
                                    )}
                                  >
                                    {formatTime(exercise.duration)}
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground capitalize relative z-10">{exercise.type}</span>
                                
                                {/* Progress bar for current exercise */}
                                {index === currentExercise && isLive && (
                                  <motion.div 
                                    className="h-0.5 bg-health-primary absolute bottom-0 left-0"
                                    initial={{ width: "100%" }}
                                    animate={{ width: `${(timeRemaining / exercise.duration) * 100}%` }}
                                    transition={{ duration: 1 }}
                                  />
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="videos">
                        <h3 className="font-medium mb-3">Available Workout Videos</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {workoutVideos.map((video) => (
                            <Card 
                              key={video.id}
                              className={cn(
                                "overflow-hidden cursor-pointer transition-all hover:shadow-md",
                                selectedVideo === video.id && "ring-2 ring-health-primary"
                              )}
                              onClick={() => changeWorkoutVideo(video.id)}
                            >
                              <div className="relative aspect-video overflow-hidden">
                                <img 
                                  src={video.thumbnail} 
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <PlayCircle className="h-12 w-12 text-white" />
                                </div>
                              </div>
                              <CardContent className="p-3">
                                <h4 className="font-medium text-sm line-clamp-1">{video.title}</h4>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs text-muted-foreground">{video.instructor}</span>
                                  <Badge variant="outline" className="text-xs">{video.difficulty}</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
            
        {/* Chat section */}
        <div className="xl:col-span-1 space-y-6">
          {/* Chat card */}
          <Card className="overflow-hidden h-[400px] flex flex-col">
            <CardHeader className="border-b pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Live Chat</span>
                <Badge variant={isConnected ? "default" : "outline"} className={isConnected ? "bg-green-500" : ""}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow overflow-hidden flex flex-col">
              <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <motion.div 
                      key={msg.id} 
                      className="flex flex-col"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-start gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={
                            msg.user === "Alex" 
                              ? "bg-health-primary/20 text-health-primary" 
                              : theme === "dark" 
                                ? "bg-muted" 
                                : "bg-muted/50"
                          }>
                            {msg.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col w-full">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium",
                              msg.user === "Alex" && "text-health-primary"
                            )}>
                              {msg.user}
                            </span>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                          </div>
                          <p className="text-sm mt-1">{msg.message}</p>
                          
                          {/* Message reactions */}
                          {messageReactions[msg.id] && messageReactions[msg.id].length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {[...new Set(messageReactions[msg.id])].map((reaction, i) => (
                                <Badge 
                                  key={i} 
                                  variant="outline" 
                                  className="px-1.5 py-0 h-5 text-xs flex items-center gap-0.5 bg-muted/30"
                                >
                                  <span>{reaction}</span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {messageReactions[msg.id].filter(r => r === reaction).length}
                                  </span>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing indicators */}
                  {typingUsers.length > 0 && (
                    <motion.div 
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex items-center">
                        {typingUsers.length === 1 ? 
                          <span>{typingUsers[0]} is typing</span> : 
                          <span>{typingUsers.slice(0, 2).join(', ')} {typingUsers.length > 2 ? `and ${typingUsers.length - 2} others` : ''} are typing</span>
                        }
                        <span className="ml-1">
                          <motion.span
                            animate={{
                              opacity: [0, 1, 1, 0],
                              transition: { repeat: Infinity, duration: 1.4 }
                            }}
                          >.</motion.span>
                          <motion.span
                            animate={{
                              opacity: [0, 1, 1, 0],
                              transition: { repeat: Infinity, duration: 1.4, delay: 0.2 }
                            }}
                          >.</motion.span>
                          <motion.span
                            animate={{
                              opacity: [0, 1, 1, 0],
                              transition: { repeat: Infinity, duration: 1.4, delay: 0.4 }
                            }}
                          >.</motion.span>
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-3">
              <form onSubmit={handleSendMessage} className="w-full flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleMessageInputChange}
                  placeholder="Type a message..."
                  className="flex-grow px-3 py-2 text-sm rounded-md border"
                  disabled={!isConnected}
                />
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={!isConnected || !newMessage.trim()}
                  className={cn(
                    !newMessage.trim() || !isConnected 
                      ? "" 
                      : "bg-gradient-to-r from-health-primary to-health-accent"
                  )}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </form>
            </CardFooter>
          </Card>
          
          {/* Workout participants with webcams */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Workout Participants</span>
                <Badge variant="outline" className="font-normal text-xs">
                  {participantCams.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participantCams.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {participantCams.map(participant => (
                    <div 
                      key={participant.id}
                      className="group aspect-square relative rounded-lg overflow-hidden border border-border hover:border-health-primary/50 transition-all"
                    >
                      <img 
                        src={participant.avatar || `https://ui-avatars.com/api/?name=${participant.name}&background=random`}
                        alt={participant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                        <p className="text-white text-xs font-medium truncate">{participant.name}</p>
                      </div>
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500 shadow"></div>
                    </div>
                  ))}
                  
                  {userMedia && (
                    <div className="aspect-square relative rounded-lg overflow-hidden border border-health-primary bg-muted">
                      <video 
                        ref={el => {
                          if (el && userMedia) {
                            el.srcObject = userMedia;
                            el.play().catch(e => console.error("Error playing video:", e));
                          }
                        }}
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-2">
                        <p className="text-white text-xs font-medium truncate">You</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">No active participants</p>
                  <Button variant="outline" size="sm" onClick={() => setShowWebcam(true)} className="mt-2">
                    Turn on your camera
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Webcam Container */}
      <div className={cn(
        "fixed z-50 transition-all duration-300",
        isWebcamMinimized 
          ? "bottom-4 right-4" 
          : showWebcam 
            ? "inset-0 bg-background/80 flex items-center justify-center p-4 backdrop-blur-md" 
            : "hidden"
      )}>
        {showWebcam && (
          <div className={cn(
            "relative",
            isWebcamMinimized 
              ? "w-48 h-48 rounded-lg overflow-hidden shadow-lg ring-2 ring-health-primary/50" 
              : "w-full max-w-2xl"
          )}>
            <WebcamStream
              onStreamReady={handleStreamReady}
              onStreamEnd={handleStreamEnd}
              isMinimized={isWebcamMinimized}
              onToggleMinimize={() => setIsWebcamMinimized(!isWebcamMinimized)}
              showControls={true}
              enableScreenShare={true}
              className="shadow-xl"
            />
            
            {!isWebcamMinimized && (
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 z-50 bg-background/80 backdrop-blur-sm"
                onClick={() => setShowWebcam(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add a button in the video controls section to toggle webcam */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* ... existing video controls ... */}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWebcam(true)}
              className="text-white bg-health-primary/80 border-white/20 hover:bg-health-primary backdrop-blur-sm flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Join with Camera
            </Button>
            
            {/* ... existing controls ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveWorkout; 