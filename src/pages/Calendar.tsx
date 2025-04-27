
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import { format } from "date-fns";

const scheduleItems = [
  {
    id: 1,
    title: "Morning Yoga",
    date: new Date(2025, 3, 17, 7, 30),
    duration: 30,
    type: "workout"
  },
  {
    id: 2,
    title: "Team Meeting",
    date: new Date(2025, 3, 17, 10, 0),
    duration: 60,
    type: "work"
  },
  {
    id: 3,
    title: "Lunch with Alex",
    date: new Date(2025, 3, 17, 12, 30),
    duration: 60,
    type: "personal"
  },
  {
    id: 4,
    title: "HIIT Workout",
    date: new Date(2025, 3, 17, 18, 0),
    duration: 45,
    type: "workout"
  },
  {
    id: 5,
    title: "Evening Meditation",
    date: new Date(2025, 3, 17, 21, 0),
    duration: 15,
    type: "wellness"
  }
];

const ScheduleItem = ({ item }: { item: typeof scheduleItems[0] }) => {
  return (
    <div className="flex items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0 w-16 text-center">
        <div className="text-sm font-medium">
          {format(item.date, "h:mm")}
          <span className="text-xs">{format(item.date, "a")}</span>
        </div>
      </div>
      <div className={`w-1 h-full min-h-[60px] rounded-full mx-4 
        ${item.type === "workout" ? "bg-blue-400" : 
          item.type === "wellness" ? "bg-purple-400" : 
          item.type === "work" ? "bg-yellow-400" : "bg-green-400"}`} 
      />
      <div className="flex-1">
        <h4 className="font-medium">{item.title}</h4>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Clock className="h-3 w-3 mr-1" />
          <span>{item.duration} min</span>
        </div>
      </div>
    </div>
  );
};

const CalendarPage = () => {
  const [date, setDate] = React.useState<Date>(new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <div className="flex items-center gap-4">
          <Select defaultValue="filter-all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="filter-all">All Events</SelectItem>
              <SelectItem value="filter-workouts">Workouts</SelectItem>
              <SelectItem value="filter-wellness">Wellness</SelectItem>
              <SelectItem value="filter-personal">Personal</SelectItem>
              <SelectItem value="filter-work">Work</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Date</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Schedule for {format(date, "EEEE, MMMM d, yyyy")}</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-7">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Today
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="day" className="w-full">
              <TabsList className="w-full md:w-auto mb-6">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
              
              <TabsContent value="day" className="space-y-4">
                <div className="divide-y">
                  {scheduleItems.map((item) => (
                    <ScheduleItem key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="week">
                <div className="text-center py-8 px-4">
                  <h3 className="text-lg font-medium mb-2">Week View</h3>
                  <p className="text-muted-foreground">Switch to the week view to see your schedule for the entire week.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="month">
                <div className="text-center py-8 px-4">
                  <h3 className="text-lg font-medium mb-2">Month View</h3>
                  <p className="text-muted-foreground">Switch to the month view to see an overview of your entire month.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
