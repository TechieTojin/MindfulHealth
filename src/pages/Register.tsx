import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register: registerUser, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      registerSchema.parse(formData);
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
    
    const success = await registerUser(formData.name, formData.email, formData.password);
    
    if (success) {
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      
      navigate("/connect-device");
    } else {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
      });
    }
    
    setIsLoading(false);
  };

  // Password strength indicators
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "" };
    
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const checks = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars];
    const passedChecks = checks.filter(Boolean).length;
    
    if (password.length < 6) return { strength: 1, text: "Weak" };
    if (passedChecks <= 2) return { strength: 2, text: "Medium" };
    if (passedChecks === 3) return { strength: 3, text: "Strong" };
    return { strength: 4, text: "Very strong" };
  };
  
  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-10">
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
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your details to create your health account
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Alex Johnson"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                
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
                  <Label htmlFor="password">Password</Label>
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
                  
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[...Array(4)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1 flex-1 rounded-full ${
                              i < passwordStrength.strength 
                                ? passwordStrength.strength <= 1 
                                  ? "bg-red-500" 
                                  : passwordStrength.strength === 2 
                                    ? "bg-yellow-500" 
                                    : "bg-green-500"
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {passwordStrength.text}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-1 mt-2">
                    <div className="text-sm text-muted-foreground">Password should contain:</div>
                    <ul className="space-y-1">
                      {[
                        { check: formData.password.length >= 6, text: "At least 6 characters" },
                        { check: /[A-Z]/.test(formData.password), text: "One uppercase letter" },
                        { check: /[0-9]/.test(formData.password), text: "One number" },
                        { check: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password), text: "One special character" }
                      ].map((item, i) => (
                        <li key={i} className="text-xs flex items-center gap-1.5">
                          <div className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${
                            item.check ? "bg-green-500/20 text-green-700 dark:text-green-500" : "bg-muted"
                          }`}>
                            {item.check && <Check className="h-2.5 w-2.5" />}
                          </div>
                          <span className={item.check ? "text-foreground" : "text-muted-foreground"}>
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full rounded-lg bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90"
                  disabled={isLoading || authLoading}
                >
                  {isLoading || authLoading ? "Creating account..." : "Create account"}
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
            
            <Link to="/web3-register" className="w-full">
              <Button 
                variant="outline" 
                className="w-full border-health-accent/20 text-health-accent hover:bg-health-accent/10"
              >
                Create Web3 Identity
              </Button>
            </Link>
            
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-health-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register; 