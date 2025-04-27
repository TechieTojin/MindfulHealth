import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <div className="absolute inset-0 rotate-0 scale-0 transition-all dark:rotate-90 dark:scale-100">
            <Moon className="h-[1.2rem] w-[1.2rem] text-health-accent" />
          </div>
          <div className="absolute inset-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:-scale-0">
            <Sun className="h-[1.2rem] w-[1.2rem] text-health-primary" />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2 w-36 rounded-xl border border-border/40 bg-card shadow-lg backdrop-blur-sm">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium rounded-md m-1 hover:bg-muted/80"
        >
          <Sun className="h-4 w-4 text-health-primary" />
          <span>Light</span>
          {theme === 'light' && (
            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-health-primary"></div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium rounded-md m-1 hover:bg-muted/80"
        >
          <Moon className="h-4 w-4 text-health-accent" />
          <span>Dark</span>
          {theme === 'dark' && (
            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-health-accent"></div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium rounded-md m-1 hover:bg-muted/80"
        >
          <span className="i-carbon-screen h-4 w-4"></span>
          <span>System</span>
          {theme === 'system' && (
            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"></div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
