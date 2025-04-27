// Icons imports
import { 
  Calendar, 
  LayoutDashboard, 
  BarChart, 
  Dumbbell, 
  Brain, 
  Settings, 
  MessageSquare,
  PlayCircle,
  Utensils
} from "lucide-react";

// Navigation items
export const NAV_ITEMS = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500"
  },
  {
    title: "Analytics",
    icon: BarChart,
    href: "/analytics",
    color: "text-violet-500"
  },
  {
    title: "Workouts",
    icon: Dumbbell,
    href: "/workouts",
    color: "text-pink-700"
  },
  {
    title: "Mental Wellness",
    icon: Brain,
    href: "/mental-wellness",
    color: "text-emerald-500"
  },
  {
    title: "Calendar",
    icon: Calendar,
    href: "/calendar",
    color: "text-orange-500"
  },
  {
    title: "AI Coach Chat",
    icon: MessageSquare,
    href: "/chat",
    color: "text-indigo-500"
  },
  {
    title: "Live Workout",
    icon: PlayCircle,
    href: "/live-workout",
    color: "text-red-500"
  },
  {
    title: "Food Scanner",
    icon: Utensils,
    href: "/food-scanner",
    color: "text-green-600",
    badge: "New"
  }
]; 