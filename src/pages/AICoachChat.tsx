import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from '@/components/layout/AppLayout';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Sample health topics and questions
const suggestedQuestions = [
  "How can I improve my running form?",
  "What's a good morning stretching routine?",
  "How much protein should I eat daily?",
  "Can you suggest exercises for lower back pain?",
  "What are the benefits of meditation?",
  "How can I sleep better at night?",
  "What should I eat before a workout?",
  "How do I stay motivated to exercise?",
];

// Mock AI responses based on keywords
const mockResponses: Record<string, string> = {
  run: "For better running form, focus on maintaining a straight posture, landing midfoot, keeping a cadence of 170-180 steps per minute, and relaxing your shoulders. Regular intervals and varied terrain will help improve your endurance and speed.",
  stretch: "A good morning stretching routine should include neck rolls, shoulder stretches, hip openers, hamstring stretches, and gentle twists. Hold each stretch for 15-30 seconds and focus on breathing deeply. This will improve your flexibility and reduce injury risk.",
  protein: "The general recommendation for protein intake is 0.8g per kg of body weight for average adults, and 1.2-2.0g per kg for athletes or those doing regular strength training. Good sources include lean meats, fish, eggs, dairy, legumes, and plant-based options like tofu.",
  back: "For lower back pain, try gentle exercises like cat-cow stretches, pelvic tilts, bridges, and bird-dog. Strengthening your core muscles can provide better support for your back. Remember to maintain proper posture throughout the day.",
  meditation: "Meditation benefits include reduced stress and anxiety, improved focus, better emotional regulation, and enhanced sleep quality. Even 5-10 minutes daily can make a difference. Try starting with guided meditations focusing on breath awareness.",
  sleep: "To improve sleep quality, maintain a consistent sleep schedule, create a relaxing bedtime routine, limit screen time before bed, keep your bedroom cool and dark, avoid caffeine after noon, and consider relaxation techniques like deep breathing or meditation.",
  eat: "Before a workout, try to eat a balanced meal with carbs and protein 2-3 hours prior. If you're short on time, a small snack like a banana with peanut butter 30-60 minutes before exercise can provide quick energy without causing digestive discomfort.",
  motivation: "To stay motivated with exercise, set specific and achievable goals, find activities you enjoy, track your progress, mix up your routine, work out with friends, reward yourself for milestones, and remember your 'why' - the deeper reason you started.",
  default: "That's an interesting question about your health journey. While I don't have specific information on that topic, I recommend consulting with a healthcare professional for personalized advice. Is there another health or fitness topic I can help with?"
};

export default function AICoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI health coach. How can I help you with your fitness and wellness goals today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Get AI response based on user input
  const getAIResponse = (userMessage: string): string => {
    const lowercaseMsg = userMessage.toLowerCase();
    
    // Check for keyword matches
    const matchedKey = Object.keys(mockResponses).find(key => 
      lowercaseMsg.includes(key)
    );
    
    return matchedKey ? mockResponses[matchedKey] : mockResponses.default;
  };

  // Send a message and get AI response
  const sendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI thinking and typing
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(userMessage.content),
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Send a suggested question
  const sendSuggestedQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <AppLayout>
      <div className="container py-6 space-y-6">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="suggested">Suggested Topics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-6">
            <Card className="border-none shadow-lg relative min-h-[70vh] flex flex-col">
              <CardHeader className="bg-primary/5 rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Avatar className="h-8 w-8 bg-primary/90">
                    <span className="text-white text-sm">AI</span>
                  </Avatar>
                  AI Health Coach
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-muted rounded-lg px-4 py-2">
                          <span className="flex gap-1">
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask your health and fitness questions..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!input.trim() || isTyping}>
                      Send
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="suggested" className="mt-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Suggested Health Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-3 text-left"
                      onClick={() => sendSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
} 