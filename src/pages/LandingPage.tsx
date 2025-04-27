import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { 
  ArrowRight, 
  Heart, 
  Brain, 
  CheckCircle, 
  Sparkles, 
  Zap, 
  ArrowUpRight, 
  MessagesSquare, 
  ChevronDown,
  Calendar,
  Activity,
  Moon,
  KeyRound,
  Lock,
  Shield,
  LineChart,
  Users,
  Star,
  Quote,
  Award
} from "lucide-react";

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll events for animation effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle mouse movement for dynamic effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  // Calculate parallax and mouse-driven effects
  const calculateParallax = (factor: number) => {
    return scrollY * factor;
  };
  
  // Calculate mouse-driven tilt
  const calculateTilt = (element: HTMLElement | null) => {
    if (!element) return { x: 0, y: 0 };
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const tiltX = (mousePosition.x - centerX) / (rect.width / 2) * 5;
    const tiltY = (mousePosition.y - centerY) / (rect.height / 2) * 5;
    
    return { x: tiltX, y: -tiltY };
  };
  
  const heroTilt = calculateTilt(heroRef.current);
  
  // Animation values based on scroll position
  const heroOpacity = Math.max(0, 1 - scrollY / 800);
  const heroScale = Math.max(0.8, 1 - scrollY / 2000);
  const featuresSectionTranslateY = Math.max(0, 100 - scrollY / 5);
  
  // Add animated cursor effect
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setCursorPosition({ x: e.clientX, y: e.clientY });
      setCursorVisible(true);
    };
    
    const handleMouseLeave = () => {
      setCursorVisible(false);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  
  // Update cursor position with smooth animation
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`;
    }
  }, [cursorPosition]);
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Custom cursor overlay */}
      <div 
        ref={cursorRef}
        className={`fixed w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference transition-opacity duration-300 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(4px)',
          marginLeft: '-16px',
          marginTop: '-16px',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      ></div>
      
      {/* Animated background particles - improved with more dynamic elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        {[...Array(30)].map((_, i) => {
          const size = Math.random() * 100 + 50;
          const duration = Math.random() * 20 + 15;
          const delay = Math.random() * 5;
          const opacity = 0.15 + Math.random() * 0.15;
          
          return (
            <div 
              key={i}
              className={`absolute rounded-full bg-gradient-to-r ${
                i % 3 === 0 
                  ? 'from-health-primary/10 to-health-accent/10' 
                  : i % 3 === 1 
                  ? 'from-health-accent/10 to-purple-500/10' 
                  : 'from-purple-500/10 to-health-primary/10'
              }`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                opacity: opacity,
                animation: `float ${duration}s ease-in-out ${delay}s infinite`
              }}
            ></div>
          );
        })}
      </div>
      
      {/* Navigation - make it more modern with blur effect and animation */}
      <nav 
        className="container mx-auto px-4 py-6 flex items-center justify-between sticky top-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: `rgba(var(--background), ${Math.min(0.95, scrollY / 300)})`,
          backdropFilter: scrollY > 10 ? 'blur(10px)' : 'none',
          boxShadow: scrollY > 50 ? '0 4px 30px rgba(0, 0, 0, 0.05)' : 'none'
        }}
      >
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div 
              className="absolute -inset-0.5 bg-gradient-to-r from-health-primary via-health-accent to-purple-500 rounded-full blur opacity-60 animate-pulse-subtle"
              style={{ 
                transform: `rotate(${scrollY / 20}deg)` 
              }}
            ></div>
            <Heart className="h-8 w-8 text-health-primary relative" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-health-primary to-health-accent">MindfulHealth</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {['Features', 'How It Works', 'Privacy', 'About'].map((item, index) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="relative text-sm font-medium group overflow-hidden"
            >
              <span className="relative z-10 group-hover:text-health-primary transition-colors duration-300">{item}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-health-primary to-health-accent group-hover:w-full transition-all duration-300"></span>
              <span className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-health-primary/5 to-health-accent/5 group-hover:h-full -z-10 transition-all duration-500"></span>
            </a>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button 
            asChild 
            variant="outline" 
            className="rounded-full group overflow-hidden relative"
          >
            <Link to="/login" className="flex items-center gap-1">
              <span className="relative z-10">Log In</span>
              <span className="absolute inset-0 bg-gradient-to-r from-health-primary/10 to-health-accent/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="rounded-full bg-gradient-to-r from-health-accent/10 to-purple-500/10 hover:bg-health-accent/20 border-health-accent/30 text-health-accent group relative overflow-hidden"
          >
            <Link to="/web3-auth" className="flex items-center gap-1">
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Web3 Auth</span>
              <KeyRound className="h-4 w-4 relative z-10 group-hover:rotate-12 transition-all duration-300 group-hover:text-white" />
              <span className="absolute inset-0 bg-gradient-to-r from-health-accent to-purple-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Link>
          </Button>
          <Button 
            asChild 
            className="rounded-full bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90 hover:shadow-lg hover:shadow-health-primary/20 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
          >
            <Link to="/register" className="flex items-center gap-1">
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="container mx-auto px-4 py-24 flex flex-col lg:flex-row items-center relative"
        style={{
          transform: `perspective(1000px) rotateX(${heroTilt.y}deg) rotateY(${heroTilt.x}deg) scale(${heroScale})`,
          opacity: heroOpacity
        }}
      >
        {/* Enhanced background geometric shapes with parallax */}
        <div 
          className="absolute -z-10 top-10 right-10 w-64 h-64 bg-gradient-to-br from-health-primary/20 to-health-accent/20 rounded-full blur-3xl"
          style={{ 
            transform: `translate3d(${calculateParallax(-0.12)}px, ${calculateParallax(0.07)}px, 0) scale(${1 + scrollY / 5000})`,
          }}
        ></div>
        <div 
          className="absolute -z-10 bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-health-accent/20 to-purple-500/20 rounded-full blur-3xl"
          style={{ 
            transform: `translate3d(${calculateParallax(0.12)}px, ${calculateParallax(-0.07)}px, 0) scale(${1 + scrollY / 6000})`,
          }}
        ></div>
        <div 
          className="absolute -z-10 top-40 left-20 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-health-primary/20 rounded-full blur-3xl opacity-70"
          style={{ 
            transform: `translate3d(${calculateParallax(-0.05)}px, ${calculateParallax(-0.1)}px, 0) scale(${1 + scrollY / 7000})`,
          }}
        ></div>
        
        <div className="lg:w-1/2 space-y-8 animate-fade-in">
          <div 
            className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-health-primary/10 to-health-accent/10 text-health-primary text-sm font-medium mb-2 backdrop-blur-sm border border-health-primary/20 hover:border-health-primary/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            style={{ 
              transform: `translateY(${calculateParallax(-0.15)}px)` 
            }}
          >
            <Sparkles className="h-4 w-4 mr-1 animate-pulse" /> 
            <span className="relative">
              AI-Powered Health Coaching
              <span className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-health-primary to-transparent opacity-50"></span>
            </span>
          </div>
          
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            style={{ 
              transform: `translateY(${calculateParallax(-0.1)}px)` 
            }}
          >
            Your Personal <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-health-primary via-health-accent to-health-primary bg-size-200 animate-gradient-x">AI Health Coach</span>
              <svg className="absolute -bottom-1 left-0 w-full h-2 text-health-primary/30" viewBox="0 0 120 10" preserveAspectRatio="none">
                <path d="M0,0 C30,7 70,5 120,0 L120,10 L0,10 Z" fill="currentColor"/>
              </svg>
            </span>
          </h1>
          
          <p 
            className="text-xl text-muted-foreground max-w-xl"
            style={{ 
              transform: `translateY(${calculateParallax(-0.05)}px)` 
            }}
          >
            Get personalized health recommendations powered by multimodal AI across text, audio, and video for your fitness, nutrition, and mental wellbeing.
          </p>
          
          <div 
            className="pt-4 flex flex-wrap gap-4"
            style={{ 
              transform: `translateY(${calculateParallax(-0.02)}px)` 
            }}
          >
            <Button 
              asChild 
              size="lg" 
              className="rounded-full bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90 transition-all duration-300 group shadow-lg shadow-health-primary/10 hover:shadow-health-primary/30 relative overflow-hidden"
            >
              <Link to="/register" className="flex items-center gap-2 relative overflow-hidden">
                <span className="relative z-10">Start Your Journey</span>
                <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="rounded-full group hover:border-health-accent/50 hover:bg-health-accent/5 transition-all duration-300 relative overflow-hidden"
            >
              <Link to="/web3-auth" className="flex items-center gap-2">
                <span className="relative z-10 group-hover:text-health-accent transition-colors duration-300">Try Web3 Secure Auth</span>
                <KeyRound className="h-4 w-4 relative z-10 group-hover:rotate-12 transition-transform duration-300 group-hover:text-health-accent" />
                <div className="absolute inset-0 bg-health-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full group hover:border-health-primary/50 transition-all duration-300 relative overflow-hidden"
            >
              <Link to="#how-it-works" className="flex items-center gap-2">
                <span className="relative z-10 group-hover:text-health-primary transition-colors duration-300">Learn More</span>
                <ArrowUpRight className="h-4 w-4 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 group-hover:text-health-primary" />
                <div className="absolute inset-0 bg-health-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </Link>
            </Button>
          </div>
          
          <div 
            className="flex flex-wrap gap-6 pt-8"
            style={{ 
              transform: `translateY(${calculateParallax(0)}px)` 
            }}
          >
            {[
              { text: 'AI-Powered', icon: <Sparkles className="h-5 w-5 text-purple-500" /> },
              { text: 'Personalized Plan', icon: <CheckCircle className="h-5 w-5 text-health-primary" /> },
              { text: 'Secure & Private', icon: <Shield className="h-5 w-5 text-health-accent" /> }
            ].map((feature, index) => (
              <div key={feature.text} className="flex items-center gap-2 group">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-health-primary/10 to-health-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-health-primary/10 group-hover:border-health-primary/30">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div 
          className="lg:w-1/2 mt-16 lg:mt-0 relative perspective-1000"
          style={{ 
            transform: `translateY(${calculateParallax(0.05)}px)` 
          }}
        >
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-border/50 backdrop-blur-sm transform hover:scale-[1.01] transition-all duration-500 preserve-3d cursor-pointer hover:rotate-y-3 hover:rotate-x-3">
            <div className="absolute inset-0 bg-gradient-to-br from-health-primary/10 to-health-accent/10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            {/* Dashboard Mockup instead of image */}
            <div className="w-full h-[400px] bg-card relative p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <span className="text-xl font-bold">Health Dashboard</span>
                  <span className="text-sm text-muted-foreground">Welcome back, Alex</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-health-primary/20 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-health-primary" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-health-accent/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-health-accent" />
                  </div>
                </div>
          </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Steps", value: "8,543", icon: Activity, color: "health-primary" },
                  { label: "Heart Rate", value: "72 bpm", icon: Heart, color: "health-accent" },
                  { label: "Sleep", value: "7.5 hrs", icon: Moon, color: "health-secondary" }
                ].map((metric, i) => (
                  <div key={i} className="bg-card/80 backdrop-blur-sm shadow-sm rounded-xl p-3 border border-border/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground">{metric.label}</span>
                      <div className={`h-6 w-6 rounded-full bg-${metric.color}/20 flex items-center justify-center`}>
                        <metric.icon className={`h-3 w-3 text-${metric.color}`} />
                      </div>
                    </div>
                    <div className="text-xl font-semibold">{metric.value}</div>
                  </div>
                ))}
              </div>
              
              <div className="relative h-32 bg-muted/30 rounded-xl p-4 mb-6">
                <div className="absolute inset-0 flex items-end px-4 pb-4">
                  {[40, 70, 55, 80, 60, 90, 75].map((h, i) => (
                    <div key={i} className="flex-1 flex justify-center">
                      <div 
                        className="w-5 rounded-t-full bg-gradient-to-t from-health-primary to-health-accent"
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="relative z-10 flex justify-between">
                  <span className="text-sm font-medium">Weekly Activity</span>
                  <span className="text-xs text-muted-foreground">+12% from last week</span>
                </div>
            </div>

              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-health-accent/20 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-health-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">AI Coach Suggestion</div>
                    <div className="text-xs text-muted-foreground">Try 10 minutes of meditation today</div>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto h-8 w-8 p-0 rounded-full">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          <div 
            className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-gradient-to-r from-health-primary/20 to-health-accent/20 rounded-2xl blur-sm"
            style={{
              transform: `translate3d(${mousePosition.x / 100}px, ${mousePosition.y / 100}px, 0)`,
            }}
          ></div>
          
          {/* Floating elements */}
          <div 
            className="absolute -top-8 -left-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transform -rotate-6 animate-pulse-subtle hover:scale-105 transition-transform duration-300 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/20"
            style={{
              transform: `translate3d(${mousePosition.x / -80 - 10}px, ${mousePosition.y / -80 - 10}px, 20px) rotate(-6deg)`,
            }}
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-health-primary flex items-center justify-center text-white">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Daily Progress</div>
                <div className="text-sm font-semibold">+28% this week</div>
              </div>
            </div>
          </div>
          
          <div 
            className="absolute -bottom-8 right-12 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transform rotate-3 animate-pulse-subtle delay-300 hover:scale-105 transition-transform duration-300 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/20"
            style={{
              transform: `translate3d(${mousePosition.x / 80 + 10}px, ${mousePosition.y / 80 + 10}px, 30px) rotate(3deg)`,
            }}
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-health-accent flex items-center justify-center text-white">
                <MessagesSquare className="h-4 w-4" />
        </div>
              <div>
                <div className="text-xs text-muted-foreground">AI Coach</div>
                <div className="text-sm font-semibold">3 new insights</div>
          </div>
            </div>
          </div>
            </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-xs text-muted-foreground mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-1.5 bg-muted-foreground/70 rounded-full animate-bounce-slow"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="relative py-32 overflow-hidden"
        style={{ 
          transform: `translateY(${featuresSectionTranslateY}px)`,
          opacity: Math.min(1, (scrollY - 100) / 400)
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 relative">
            <div 
              className="inline-flex items-center px-3 py-1 rounded-full bg-health-primary/10 text-health-primary text-sm font-medium mb-4 backdrop-blur-sm border border-health-primary/20 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 mr-1" /> <span className="relative">Smart Features
              <span className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-health-primary to-transparent opacity-50"></span></span>
            </div>
            <h2 
              className="text-4xl font-bold mb-4 relative inline-block"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Multimodal Health Coaching</span>
              <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-health-primary/30 to-transparent rounded-full"></div>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Our AI-powered health coach analyzes data from multiple sources to provide comprehensive health guidance.
            </p>
            <div 
              className="absolute -z-10 top-1/2 left-1/2 w-96 h-96 bg-health-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
              style={{ 
                transform: `translate(-50%, -50%) scale(${1 + scrollY / 5000})` 
              }}
            ></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Add feature cards with more modern styling */}
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="relative group"
                style={{ 
                  transform: `translateY(${Math.max(0, 50 - (scrollY - 300) / 8)}px)`,
                  opacity: Math.min(1, (scrollY - 300) / 400),
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-health-primary to-health-accent rounded-2xl blur opacity-20 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="bg-card rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-border/50 backdrop-blur-sm relative h-full overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-health-primary/5 to-health-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-gradient-to-br from-health-primary/10 to-health-accent/10 blur-xl group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>
                  <div className="absolute -left-6 -bottom-6 w-12 h-12 rounded-full bg-gradient-to-tr from-health-accent/10 to-health-primary/10 blur-lg group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>
                  
                  <div className="relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-health-primary to-health-accent p-0.5 mb-6 text-white shadow-lg shadow-health-primary/20 group-hover:shadow-health-primary/40 transition-all duration-500 group-hover:scale-110 relative">
                      <div className="h-full w-full bg-card rounded-xl flex items-center justify-center">
                        <feature.icon className="h-7 w-7 text-transparent bg-clip-text bg-gradient-to-br from-health-primary to-health-accent" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-health-primary to-health-accent rounded-2xl blur opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
              </div>
                    <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground group-hover:from-health-primary group-hover:to-health-accent transition-colors duration-500 flex items-center">
                      {feature.title}
                      <div className="ml-2 h-px w-0 bg-gradient-to-r from-health-primary to-health-accent group-hover:w-12 transition-all duration-300"></div>
                    </h3>
                    <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-500">
                      {feature.description}
                    </p>
                    
                    <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-500 mt-0 group-hover:mt-4 opacity-0 group-hover:opacity-100">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto text-sm text-health-primary flex items-center gap-1 hover:bg-transparent hover:text-health-accent"
                      >
                        Learn more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Button>
            </div>
              </div>
            </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-32 relative">
        <div className="text-center mb-20 relative">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-health-primary/10 text-health-primary text-sm font-medium mb-4 backdrop-blur-sm border border-health-primary/20 cursor-pointer transform hover:scale-105 transition-transform duration-300">
            <Sparkles className="h-4 w-4 mr-1" /> <span className="relative">The Process
            <span className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-health-primary to-transparent opacity-50"></span></span>
          </div>
          <h2 className="text-4xl font-bold mb-4 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">How It Works</span>
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-health-accent/30 to-transparent rounded-full"></div>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Our platform uses cutting-edge AI to provide you with personalized health guidance.
          </p>
          <div 
            className="absolute -z-10 top-1/2 left-1/2 w-96 h-96 bg-health-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
            style={{ 
              transform: `translate(-50%, -50%) scale(${1 + scrollY / 8000})` 
            }}
          ></div>
        </div>

        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Connection line with animated gradient */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 z-0 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-health-primary via-health-accent to-health-primary"
              style={{
                width: '200%',
                animation: 'gradient-x 8s linear infinite'
              }}
            ></div>
          </div>
          
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="text-center relative z-10"
              style={{ 
                opacity: Math.min(1, (scrollY - 700) / 400),
                transform: `translateY(${Math.max(0, 50 - (scrollY - 700) / 10)}px)`,
                transitionDelay: `${index * 200}ms`
              }}
            >
              <div className="relative mx-auto mb-8 group hover:scale-110 transition-transform duration-500">
                {/* Number bubble with gradient border */}
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-health-primary to-health-accent blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0.5 rounded-full bg-background"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-r from-health-primary/10 to-health-accent/10 group-hover:from-health-primary/20 group-hover:to-health-accent/20 flex items-center justify-center transition-all duration-500">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-health-primary to-health-accent">
                      {index + 1}
                    </span>
                  </div>
                </div>
                
                {/* Decorative dots */}
                <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-4 flex gap-1 md:hidden">
                  {index < steps.length - 1 && (
                    <>
                      <div className="h-1.5 w-1.5 rounded-full bg-health-primary/40"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-health-primary/30"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-health-primary/20"></div>
                    </>
                  )}
                </div>
            </div>
              
              <div className="bg-card border border-border/50 rounded-xl p-6 backdrop-blur-sm transform transition-transform duration-300 hover:-translate-y-2 group hover:shadow-lg hover:border-health-primary/20 relative overflow-hidden">
                {/* Decorative gradient background */}
                <div className="absolute -inset-10 bg-gradient-to-br from-health-primary/5 to-health-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-2xl"></div>
                
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                  {step.description}
                </p>
                
                <div className="mt-4 h-0 overflow-hidden group-hover:h-8 transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto text-sm text-health-primary"
                  >
                    Learn more
                  </Button>
                </div>
          </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-4 py-32 relative">
        <div 
          className="absolute -z-10 right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-health-primary/5 rounded-full blur-3xl"
          style={{ 
            transform: `translate(20%, -50%) scale(${1 + scrollY / 8000})` 
          }}
        ></div>
        <div 
          className="absolute -z-10 left-0 top-1/3 -translate-y-1/2 w-64 h-64 bg-health-accent/5 rounded-full blur-3xl"
          style={{ 
            transform: `translate(-20%, -50%) scale(${1 + scrollY / 9000})` 
          }}
        ></div>
        
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-health-accent/10 text-health-accent text-sm font-medium mb-4 backdrop-blur-sm border border-health-accent/20 cursor-pointer transform hover:scale-105 transition-transform duration-300">
            <Users className="h-4 w-4 mr-1" /> <span className="relative">User Stories
            <span className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-health-accent to-transparent opacity-50"></span></span>
          </div>
          <h2 className="text-4xl font-bold mb-4 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">What Our Users Say</span>
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-health-primary/30 to-transparent rounded-full"></div>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Hear from our community about how Fluvio has transformed their health journey.
              </p>
            </div>
            
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-6 rounded-2xl border border-border group hover:border-health-primary/20 relative bg-card/80 backdrop-blur-sm transform hover:-translate-y-2 transition-all duration-500 hover:shadow-xl"
              style={{ 
                opacity: Math.min(1, (scrollY - 1200) / 600),
                transform: `translateY(${Math.max(0, 60 - (scrollY - 1200) / 10)}px) scale(${Math.min(1, 0.9 + (scrollY - 1200) / 6000)})`,
                transitionDelay: `${index * 100}ms` 
              }}
            >
              {/* Decorative gradient background */}
              <div className="absolute -inset-10 bg-gradient-to-br from-health-primary/5 to-health-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-2xl"></div>
              
              {/* Quote mark */}
              <div className="absolute -top-3 -left-2 text-6xl text-health-primary/10 group-hover:text-health-primary/20 transition-colors duration-300">
                <Quote />
              </div>
              
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex">
                    {Array(5).fill(0).map((_, starIndex) => (
                      <Star 
                        key={starIndex} 
                        className={`h-5 w-5 ${
                          starIndex < testimonial.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-muted-foreground/20'
                        } transition-transform group-hover:scale-110 duration-300`}
                        style={{ transitionDelay: `${starIndex * 50}ms` }}
                      />
                    ))}
            </div>
                </div>
                <p className="text-lg text-foreground/90 flex-grow mb-6 leading-relaxed relative">
                  <span className="relative">
                    {testimonial.text}
                    <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-health-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  </span>
                </p>
                <div className="flex items-center mt-auto">
                  <div className="relative mr-4 h-12 w-12 overflow-hidden rounded-full border-2 border-transparent group-hover:border-health-primary/30 transition-all duration-500">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
                <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                  
                  {/* Decorative badge */}
                  {testimonial.achievement && (
                    <div className="ml-auto p-1.5 rounded-full bg-health-primary/10 text-health-primary text-xs font-medium border border-health-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0 flex items-center">
                      <Award className="h-3 w-3 mr-1" />
                      <span>{testimonial.achievement}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        
        <div className="mt-16 text-center">
          <Button 
            variant="outline" 
            className="group rounded-full bg-background hover:bg-health-primary/5 border border-border hover:border-health-primary/20 transition-all duration-300"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground/80 to-foreground/60 group-hover:from-health-primary group-hover:to-health-accent transition-all duration-300">View all testimonials</span>
            <ArrowRight className="ml-2 h-4 w-4 text-foreground/60 group-hover:text-health-primary transition-colors duration-300 transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-32 relative">
        <div 
          className="relative overflow-hidden rounded-3xl transform hover:scale-[1.01] transition-all duration-500 group cursor-pointer"
          style={{ 
            opacity: Math.min(1, (scrollY - 1200) / 400),
            transform: `translateY(${Math.max(0, 50 - (scrollY - 1200) / 10)}px)`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-health-primary to-health-accent"></div>
          <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
          <div 
            className="absolute -inset-1 bg-gradient-to-r from-health-primary to-health-accent blur opacity-30 group-hover:opacity-100 transition-all duration-700"
            style={{
              transform: `translate3d(${mousePosition.x / 100}px, ${mousePosition.y / 100}px, 0)`,
            }}
          ></div>
          
          <div className="relative p-12 md:p-20 text-white text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Health Journey?</h2>
            <p className="mb-10 max-w-2xl mx-auto text-white/90 text-lg">
            Join thousands of users who are already benefiting from our AI-powered health coaching.
          </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-health-primary hover:bg-white/90 rounded-full group shadow-lg shadow-white/30 hover:shadow-white/50 transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/register" className="flex items-center gap-2 relative overflow-hidden">
                <span className="relative z-10">Get Started Today</span>
                <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-health-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </Link>
          </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-16 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-health-primary to-health-accent rounded-full blur opacity-60"></div>
                <Heart className="h-7 w-7 text-health-primary relative" />
              </div>
              <span className="text-xl font-bold">MindfulHealth</span>
            </div>
            <div className="flex flex-wrap gap-8">
              {['Home', 'Features', 'About Us', 'Contact', 'Privacy', 'Terms'].map(item => (
                <Link 
                  key={item} 
                  to="#" 
                  className="text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-health-primary to-health-accent group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>
          <div className="text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} MindfulHealth. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Data for features section
const features = [
  {
    title: "Fitness Tracking",
    icon: Zap,
    description: "Analyze your workout data to provide personalized exercise recommendations based on your goals and progress."
  },
  {
    title: "Nutrition Planning",
    icon: Heart,
    description: "Get AI-generated meal plans and nutritional advice tailored to your dietary needs and health objectives."
  },
  {
    title: "Mental Wellbeing",
    icon: Brain,
    description: "Monitor your stress levels and receive mindfulness exercises and mental health recommendations."
  },
  {
    title: "Web3 Security",
    icon: KeyRound,
    description: "Own and control your health data with blockchain-based decentralized identity. Enhanced privacy and security for your sensitive information."
  },
  {
    title: "Voice Coaching",
    icon: MessagesSquare,
    description: "Receive audio guidance and motivation during workouts and meditations through our voice AI assistant."
  },
  {
    title: "Progress Tracking",
    icon: MessagesSquare,
    description: "Visualize your health journey with beautiful charts and insightful analytics to stay motivated."
  }
];

// Data for how it works section
const steps = [
  {
    title: "Connect Your Devices",
    description: "Sync your fitness trackers, cameras, and microphones to provide multimodal data for comprehensive analysis."
  },
  {
    title: "AI Analysis",
    description: "Our advanced AI analyzes your health data in real-time using powerful inference capabilities for accurate insights."
  },
  {
    title: "Personalized Guidance",
    description: "Receive customized health recommendations tailored to your unique health profile and specific goals."
  }
];

// Data for testimonials section
const testimonials = [
  {
    text: "I've never felt better! The AI-powered health coach has helped me achieve my fitness goals and improved my overall wellbeing.",
    rating: 5,
    avatar: "/avatar1.jpg",
    name: "John Doe",
    title: "Fitness Enthusiast",
    achievement: "5-year streak"
  },
  {
    text: "The personalized nutrition plan has been a game-changer for me. I've seen significant improvements in my health and energy levels.",
    rating: 5,
    avatar: "/avatar2.jpg",
    name: "Jane Smith",
    title: "Nutrition Coach"
  },
  {
    text: "The mental wellbeing features have been incredibly helpful in managing stress and anxiety. I'm more relaxed and focused than ever.",
    rating: 5,
    avatar: "/avatar3.jpg",
    name: "Michael Brown",
    title: "Mental Health Advocate"
  }
];

export default LandingPage;
