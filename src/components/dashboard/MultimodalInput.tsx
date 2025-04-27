
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Video, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const MultimodalInput = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [message, setMessage] = useState("");

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  const handleSendMessage = () => {
    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <Card className="health-stat-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">AI Health Coach</CardTitle>
        <CardDescription>
          Interact with your AI coach using voice, video, or text
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="text">
              <MessageSquare className="h-4 w-4 mr-2" />
              Text
            </TabsTrigger>
            <TabsTrigger value="voice">
              <Mic className="h-4 w-4 mr-2" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="video">
              <Video className="h-4 w-4 mr-2" />
              Video
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-0">
            <div className="flex flex-col gap-2">
              <Textarea
                placeholder="Ask your health coach anything..."
                className="min-h-[100px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button onClick={handleSendMessage} className="self-end bg-health-primary hover:bg-health-dark">
                Send
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="voice" className="mt-0">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-health-primary'}`}>
                <Mic className="h-8 w-8 text-white" />
              </div>
              <Button
                onClick={toggleRecording}
                className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-health-primary hover:bg-health-dark"}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                {isRecording 
                  ? "Listening... Speak clearly into your microphone" 
                  : "Tap the button to start recording your voice"}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="video" className="mt-0">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                {isCameraActive ? (
                  <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center animate-pulse">
                    <p className="text-white">Camera feed would display here</p>
                  </div>
                ) : (
                  <Video className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <Button
                onClick={toggleCamera}
                className={isCameraActive ? "bg-red-500 hover:bg-red-600" : "bg-health-primary hover:bg-health-dark"}
              >
                {isCameraActive ? "Stop Camera" : "Start Camera"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                {isCameraActive 
                  ? "Analyzing your form and movements..." 
                  : "Tap the button to start video analysis"}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MultimodalInput;
