import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { ModeToggle } from './ModeToggle';
import { BellDot, CircleUserRound, Search, MessagesSquare, LogOut, User, Settings, Info, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full app-dark-bg">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b border-card-border bg-card-bg/95 backdrop-blur-sm">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search..." 
                    className="pl-10 h-9 w-full rounded-full border-muted-foreground/20 bg-card-bg focus-visible:bg-card-bg"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" size="icon" className="relative">
                      <BellDot className="h-5 w-5" />
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-health-primary"></span>
                    </Button>
                    
                    <Button variant="ghost" size="icon">
                      <MessagesSquare className="h-5 w-5" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-6" />
                  </>
                ) : null}
                
                <ModeToggle />
                
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar>
                          <AvatarImage src="https://t4.ftcdn.net/jpg/00/87/28/19/360_F_87281963_29bnkFXa6RQnJYWeRfrSpieagNxw1Rru.jpg" alt="User" />
                          <AvatarFallback>{user?.name?.substring(0, 2) || "MH"}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user?.name || "User"}</p>
                          <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link to="/profile-settings">
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Profile Settings</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to="/settings">
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to="/about">
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          <span>About Us</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-500 flex items-center gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/login" className="flex items-center gap-1">
                        <LogIn className="h-4 w-4 mr-1" />
                        Log in
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="bg-health-primary hover:bg-health-primary/90">
                      <Link to="/register">
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6 overflow-auto bg-card-bg-alt">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
