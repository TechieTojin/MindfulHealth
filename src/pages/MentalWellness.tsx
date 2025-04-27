import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Clock, Headphones, MoonStar, Play, Plus, Sun, BookOpen, CalendarDays, ChevronDown, PenLine, Smile, Frown, Meh, ThumbsUp } from "lucide-react";

const meditationSessions = [
  {
    id: 1,
    title: "Morning Mindfulness",
    description: "Start your day with clarity and intention",
    duration: 10,
    category: "mindfulness",
    time: "morning",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Stress Relief",
    description: "Release tension and find calm in the midst of stress",
    duration: 15,
    category: "stress",
    time: "any",
    image: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "Deep Sleep",
    description: "Prepare your mind for restful sleep",
    duration: 20,
    category: "sleep",
    time: "evening",
    image: "https://images.unsplash.com/photo-1511295742362-92754fef59a4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    title: "Focus Boost",
    description: "Sharpen your concentration and mental clarity",
    duration: 8,
    category: "focus",
    time: "any",
    image: "https://images.unsplash.com/photo-1602192509154-0b900ee1f851?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const journalEntries = [
  {
    id: 1,
    date: "2023-05-12",
    title: "Finding Balance",
    excerpt: "Today I focused on creating more balance between work and relaxation...",
    mood: "positive",
    tags: ["work-life balance", "self-care"]
  },
  {
    id: 2,
    date: "2023-05-10",
    title: "Managing Anxiety",
    excerpt: "Felt anxious about the upcoming presentation, used breathing techniques...",
    mood: "neutral",
    tags: ["anxiety", "coping strategies"]
  },
  {
    id: 3,
    date: "2023-05-07",
    title: "Difficult Conversation",
    excerpt: "Had to have a challenging talk with a coworker today. It went better than expected...",
    mood: "positive",
    tags: ["communication", "work"]
  },
  {
    id: 4,
    date: "2023-05-04",
    title: "Feeling Overwhelmed",
    excerpt: "Too many deadlines converging this week. Need to practice better time management...",
    mood: "negative",
    tags: ["stress", "time management"]
  }
];

const moodData = [
  { date: "05/05", mood: 4 },
  { date: "05/06", mood: 3 },
  { date: "05/07", mood: 4 },
  { date: "05/08", mood: 5 },
  { date: "05/09", mood: 4 },
  { date: "05/10", mood: 3 },
  { date: "05/11", mood: 3 },
  { date: "05/12", mood: 4 },
  { date: "05/13", mood: 5 },
  { date: "05/14", mood: 4 },
  { date: "05/15", mood: 2 },
  { date: "05/16", mood: 3 },
  { date: "05/17", mood: 4 }
];

const MeditationCard = ({ session }: { session: typeof meditationSessions[0] }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={session.image} 
          alt={session.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground text-xs">
          {session.time === "morning" ? (
            <Sun className="h-3 w-3" />
          ) : session.time === "evening" ? (
            <MoonStar className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          <span>{session.time}</span>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{session.title}</CardTitle>
        <CardDescription>{session.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{session.duration} min</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full gap-2">
          <Play className="h-4 w-4" /> Begin Session
        </Button>
      </CardFooter>
    </Card>
  );
};

const JournalEntryCard = ({ entry }: { entry: typeof journalEntries[0] }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{entry.title}</CardTitle>
          <div className="flex items-center text-muted-foreground text-xs">
            <CalendarDays className="h-3 w-3 mr-1" />
            {new Date(entry.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{entry.excerpt}</p>
        <div className="mt-3 flex items-center">
          <div className="mr-2">
            {entry.mood === "positive" && <Smile className="h-4 w-4 text-green-500" />}
            {entry.mood === "neutral" && <Meh className="h-4 w-4 text-amber-500" />}
            {entry.mood === "negative" && <Frown className="h-4 w-4 text-red-500" />}
          </div>
          <div className="flex gap-1">
            {entry.tags.map((tag, index) => (
              <span key={index} className="text-xs px-2 py-0.5 bg-muted rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full text-xs">
          Read Full Entry
        </Button>
      </CardFooter>
    </Card>
  );
};

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Tracker</CardTitle>
        <CardDescription>Track your emotional wellbeing over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Today's Mood</h4>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                    currentMood === mood 
                      ? 'bg-primary/20 border border-primary' 
                      : 'hover:bg-muted border border-transparent'
                  }`}
                >
                  <div className="mb-1">
                    {mood === 1 && <Frown className={`h-8 w-8 ${currentMood === mood ? 'text-primary' : 'text-muted-foreground'}`} />}
                    {mood === 2 && <Frown className={`h-8 w-8 ${currentMood === mood ? 'text-primary' : 'text-muted-foreground'}`} />}
                    {mood === 3 && <Meh className={`h-8 w-8 ${currentMood === mood ? 'text-primary' : 'text-muted-foreground'}`} />}
                    {mood === 4 && <Smile className={`h-8 w-8 ${currentMood === mood ? 'text-primary' : 'text-muted-foreground'}`} />}
                    {mood === 5 && <Smile className={`h-8 w-8 ${currentMood === mood ? 'text-primary' : 'text-muted-foreground'}`} />}
                  </div>
                  <span className="text-xs">
                    {mood === 1 && "Very Bad"}
                    {mood === 2 && "Bad"}
                    {mood === 3 && "Neutral"}
                    {mood === 4 && "Good"}
                    {mood === 5 && "Great"}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <h4 className="text-sm font-medium">Mood History</h4>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                View Full History
              </Button>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="flex items-end h-28 gap-1">
                {moodData.map((day, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div 
                      className={`w-full rounded-t transition-all ${
                        day.mood === 1 ? 'bg-red-500 h-[20%]' :
                        day.mood === 2 ? 'bg-orange-500 h-[40%]' :
                        day.mood === 3 ? 'bg-amber-500 h-[60%]' :
                        day.mood === 4 ? 'bg-lime-500 h-[80%]' :
                        'bg-green-500 h-full'
                      }`}
                    ></div>
                    <span className="text-[9px] mt-1 text-muted-foreground">{day.date.split('/')[1]}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>May 5</span>
                <span>May 17</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2">
          <PenLine className="h-4 w-4" /> Add Journal Entry
        </Button>
      </CardFooter>
    </Card>
  );
};

const MentalWellness = () => {
  const [activeJournalTab, setActiveJournalTab] = useState<string>("recent");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mental Wellness</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Journal Entry
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Wellness Score</CardTitle>
            <CardDescription>Based on your sleep, activity, and stress levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="hsl(var(--muted))" 
                    strokeWidth="10" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="10" 
                    strokeDasharray="283" 
                    strokeDashoffset="70" 
                    strokeLinecap="round" 
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">76</span>
                  <span className="text-muted-foreground text-sm">Very Good</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Sleep Quality</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Stress Level</span>
                  <span className="text-sm font-medium">32%</span>
                </div>
                <Progress value={32} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Mood Balance</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Wellness Streak</CardTitle>
            <CardDescription>Your mindfulness practice history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-center mb-6">
                <span className="text-5xl font-bold block">14</span>
                <span className="text-muted-foreground">Day Streak</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 21 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i < 14 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    {i < 14 && <Brain className="h-5 w-5" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full gap-2">
                <Headphones className="h-4 w-4" /> Start Today's Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="stress">Stress Relief</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {meditationSessions.map(session => (
              <MeditationCard key={session.id} session={session} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="mindfulness" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {meditationSessions
              .filter(session => session.category === "mindfulness")
              .map(session => (
                <MeditationCard key={session.id} session={session} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sleep" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {meditationSessions
              .filter(session => session.category === "sleep")
              .map(session => (
                <MeditationCard key={session.id} session={session} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stress" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {meditationSessions
              .filter(session => session.category === "stress")
              .map(session => (
                <MeditationCard key={session.id} session={session} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <MoodTracker />
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" /> Journal
                  </CardTitle>
                  <CardDescription>Track your thoughts and feelings</CardDescription>
                </div>
                <Button size="sm" className="gap-1">
                  <PenLine className="h-4 w-4" /> New Entry
                </Button>
              </div>
              <div className="flex border-b space-x-4 mt-2">
                <button 
                  className={`pb-2 text-sm font-medium ${
                    activeJournalTab === "recent" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveJournalTab("recent")}
                >
                  Recent Entries
                </button>
                <button 
                  className={`pb-2 text-sm font-medium ${
                    activeJournalTab === "tagged" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveJournalTab("tagged")}
                >
                  Tagged
                </button>
                <button 
                  className={`pb-2 text-sm font-medium ${
                    activeJournalTab === "favorites" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveJournalTab("favorites")}
                >
                  Favorites
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {journalEntries.map(entry => (
                  <JournalEntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="ghost" size="sm" className="gap-1">
                View All Entries <ChevronDown className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentalWellness;
