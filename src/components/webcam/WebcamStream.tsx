import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Mic, MicOff, Video, VideoOff, Monitor, X, RotateCcw, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WebcamStreamProps {
  onStreamReady?: (stream: MediaStream) => void;
  onStreamEnd?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  showControls?: boolean;
  enableScreenShare?: boolean;
  aspectRatio?: "square" | "video"; // 1:1 or 16:9
  className?: string;
}

const WebcamStream: React.FC<WebcamStreamProps> = ({
  onStreamReady,
  onStreamEnd,
  isMinimized = false,
  onToggleMinimize,
  showControls = true,
  enableScreenShare = true,
  aspectRatio = "video",
  className
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const webcamRef = useRef<HTMLVideoElement>(null);
  
  // Function to get available media devices
  const getAvailableDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableDevices(videoDevices);
      
      // Set the default device if we have devices and none is selected
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error("Error getting media devices:", error);
    }
  }, [selectedDeviceId]);
  
  // Get available devices on component mount
  useEffect(() => {
    getAvailableDevices();
    
    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', getAvailableDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getAvailableDevices);
    };
  }, [getAvailableDevices]);
  
  // Function to start the webcam stream
  const startWebcam = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setPermissionDenied(false);
    
    try {
      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId 
          ? { deviceId: { exact: selectedDeviceId } } 
          : true,
        audio: micEnabled
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsActive(true);
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = mediaStream;
      }
      
      if (onStreamReady) {
        onStreamReady(mediaStream);
      }
      
      toast({
        title: "Camera activated",
        description: "Your webcam stream is now active"
      });
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setPermissionDenied(true);
      
      toast({
        title: "Camera access denied",
        description: "Please check your browser permissions and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [micEnabled, onStreamReady, selectedDeviceId, isLoading]);
  
  // Function to stop the webcam stream
  const stopWebcam = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = null;
      }
      
      setStream(null);
      setIsActive(false);
      setIsScreenSharing(false);
      
      if (onStreamEnd) {
        onStreamEnd();
      }
      
      toast({
        title: "Camera deactivated",
        description: "Your webcam stream has ended"
      });
    }
  }, [stream, onStreamEnd]);
  
  // Function to toggle camera
  const toggleCamera = useCallback(() => {
    if (!stream) return;
    
    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length > 0) {
      const enabled = !cameraEnabled;
      videoTracks.forEach(track => {
        track.enabled = enabled;
      });
      setCameraEnabled(enabled);
    }
  }, [stream, cameraEnabled]);
  
  // Function to toggle microphone
  const toggleMic = useCallback(() => {
    if (!stream) return;
    
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length > 0) {
      const enabled = !micEnabled;
      audioTracks.forEach(track => {
        track.enabled = enabled;
      });
      setMicEnabled(enabled);
    }
  }, [stream, micEnabled]);
  
  // Function to start screen sharing
  const startScreenShare = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const displayMediaOptions = {
        video: {
          cursor: "always"
        },
        audio: micEnabled
      };
      
      // @ts-ignore - TypeScript doesn't recognize getDisplayMedia
      const screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      setStream(screenStream);
      setIsActive(true);
      setIsScreenSharing(true);
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = screenStream;
      }
      
      if (onStreamReady) {
        onStreamReady(screenStream);
      }
      
      // Listen for when user stops sharing via browser UI
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopWebcam();
        toast({
          title: "Screen sharing ended",
          description: "Your screen sharing session has ended"
        });
      });
      
      toast({
        title: "Screen sharing started",
        description: "You are now sharing your screen"
      });
    } catch (error) {
      console.error("Error starting screen share:", error);
      
      toast({
        title: "Screen sharing error",
        description: "Could not start screen sharing",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [stream, micEnabled, onStreamReady, isLoading, stopWebcam]);
  
  // Switch between webcam and screen sharing
  const switchToWebcam = useCallback(() => {
    stopWebcam();
    setTimeout(() => {
      startWebcam();
    }, 500);
  }, [startWebcam, stopWebcam]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);
  
  // Handle device change
  const handleDeviceChange = useCallback((deviceId: string) => {
    setSelectedDeviceId(deviceId);
    
    // If already active, restart with new device
    if (isActive && !isScreenSharing) {
      stopWebcam();
      setTimeout(() => {
        setSelectedDeviceId(deviceId);
        startWebcam();
      }, 500);
    }
  }, [isActive, isScreenSharing, startWebcam, stopWebcam]);
  
  return (
    <div className={cn(
      "relative rounded-lg overflow-hidden border bg-muted/30",
      isMinimized ? "w-40 h-40" : "w-full",
      aspectRatio === "square" ? "aspect-square" : "aspect-video",
      className
    )}>
      {/* Camera/Screen preview */}
      <video
        ref={webcamRef}
        autoPlay
        playsInline
        muted
        className={cn(
          "w-full h-full object-cover",
          !isActive && "hidden"
        )}
      />
      
      {/* Permission denied state */}
      {permissionDenied && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 p-4 text-center">
          <Camera className="h-10 w-10 text-destructive mb-2" />
          <h3 className="font-medium mb-1">Camera access denied</h3>
          <p className="text-sm text-muted-foreground mb-4">Please check your browser permissions and try again</p>
          <Button 
            variant="default" 
            onClick={() => {
              setPermissionDenied(false);
              startWebcam();
            }}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
      
      {/* Initial state - no stream */}
      {!isActive && !permissionDenied && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 p-4">
          <Camera className="h-10 w-10 text-primary mb-2" />
          <h3 className="font-medium mb-1">Start your camera</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {availableDevices.length === 0 
              ? "No camera devices detected" 
              : "Share your video with other participants"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="default" 
              onClick={startWebcam}
              disabled={isLoading || availableDevices.length === 0}
              className="gap-2"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Video className="h-4 w-4" />
              )}
              Start Camera
            </Button>
            
            {enableScreenShare && (
              <Button 
                variant="outline" 
                onClick={startScreenShare}
                disabled={isLoading}
                className="gap-2"
              >
                <Monitor className="h-4 w-4" />
                Share Screen
              </Button>
            )}
          </div>
          
          {availableDevices.length > 1 && (
            <div className="mt-4 w-full max-w-xs">
              <Label htmlFor="camera-select" className="text-xs text-muted-foreground">
                Select camera
              </Label>
              <select
                id="camera-select"
                value={selectedDeviceId}
                onChange={(e) => handleDeviceChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border mt-1"
                disabled={isLoading}
              >
                {availableDevices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${availableDevices.indexOf(device) + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      
      {/* Minimized indicator */}
      {isMinimized && isActive && onToggleMinimize && (
        <div 
          className="absolute top-2 right-2 z-20 cursor-pointer" 
          onClick={onToggleMinimize}
        >
          <div className="bg-background/80 rounded-md p-1 backdrop-blur-sm">
            <Check className="h-4 w-4" />
          </div>
        </div>
      )}
      
      {/* Status indicators */}
      {isActive && (
        <div className="absolute top-2 left-2 flex items-center gap-2">
          {isScreenSharing ? (
            <Badge variant="default" className="bg-blue-500">
              Screen
            </Badge>
          ) : (
            <Badge variant="default" className="bg-green-500">
              Live
            </Badge>
          )}
        </div>
      )}
      
      {/* Controls */}
      {showControls && isActive && !isMinimized && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex justify-center">
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={cameraEnabled ? "default" : "destructive"}
                    size="icon"
                    onClick={toggleCamera}
                    className="rounded-full h-10 w-10"
                  >
                    {cameraEnabled ? (
                      <Video className="h-5 w-5" />
                    ) : (
                      <VideoOff className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{cameraEnabled ? "Turn off camera" : "Turn on camera"}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={micEnabled ? "default" : "destructive"}
                    size="icon"
                    onClick={toggleMic}
                    className="rounded-full h-10 w-10"
                  >
                    {micEnabled ? (
                      <Mic className="h-5 w-5" />
                    ) : (
                      <MicOff className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{micEnabled ? "Mute microphone" : "Unmute microphone"}</p>
                </TooltipContent>
              </Tooltip>
              
              {enableScreenShare && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isScreenSharing ? "default" : "outline"}
                      size="icon"
                      onClick={isScreenSharing ? switchToWebcam : startScreenShare}
                      className="rounded-full h-10 w-10"
                    >
                      <Monitor className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isScreenSharing ? "Switch to camera" : "Share screen"}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={stopWebcam}
                    className="rounded-full h-10 w-10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>End stream</p>
                </TooltipContent>
              </Tooltip>
              
              {onToggleMinimize && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onToggleMinimize}
                      className="ml-2"
                    >
                      Minimize
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Minimize webcam view</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default WebcamStream; 