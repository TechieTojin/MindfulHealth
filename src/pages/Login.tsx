import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const success = await login(formData.email, formData.password);
    
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome back to MindfulHealth!",
      });
      
      navigate("/connect-device");
    } else {
      setErrors({
        auth: "Invalid email or password. Please try again.",
      });
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-float rounded-full bg-gradient-to-r from-health-primary/10 to-health-accent/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 20 + 15}s`,
              opacity: 0.3
            }}
          ></div>
        ))}
      </div>
      
      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-health-primary to-health-accent rounded-full blur opacity-60 animate-pulse-subtle"></div>
              <Heart className="h-8 w-8 text-health-primary relative" />
            </div>
            <span>MindfulHealth</span>
          </Link>
        </div>
        
        <Card className="border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-health-primary/5 to-health-accent/5 opacity-30"></div>
          <CardHeader className="space-y-1 relative">
            <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your email and password to access your health dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email" 
                    placeholder="hello@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-health-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                
                {errors.auth && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded-md text-sm">
                    {errors.auth}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full rounded-lg bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90"
                  disabled={isLoading || authLoading}
                >
                  {isLoading || authLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 relative">
            <div className="relative flex items-center w-full">
              <div className="flex-grow border-t border-border"></div>
              <div className="px-3 text-sm text-muted-foreground">OR</div>
              <div className="flex-grow border-t border-border"></div>
            </div>
            
            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>
            
            <Link to="/web3-login" className="w-full">
              <Button 
                variant="outline" 
                className="w-full border-health-accent/20 text-health-accent hover:bg-health-accent/10"
              >
                Web3 Authentication
              </Button>
            </Link>
            
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-health-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login; 