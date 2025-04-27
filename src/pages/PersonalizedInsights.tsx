import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaUser, FaUserMd, FaLink, FaCalendarAlt, FaArrowRight, 
  FaArrowLeft, FaSearch, FaEllipsisV, FaBookmark, FaRegBookmark,
  FaChartLine, FaHeartbeat, FaRunning, FaBrain, FaAppleAlt, FaBed,
  FaFilter, FaExternalLinkAlt
} from 'react-icons/fa';
import '../styles/healthPages.css';

// Define proper types
interface Category {
  id: string;
  name: string;
  icon?: React.ComponentType<any>;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: number;
  source: string;
  sourceUrl: string;
  author: string;
  authorCredentials: string;
  authorSpecialty: string;
  relevance: number;
  image: string;
  saved: boolean;
  metrics: {
    views: number;
    saves: number;
    shares: number;
  };
}

// Mock article categories
const categories: Category[] = [
  { id: 'all', name: 'All' },
  { id: 'nutrition', name: 'Nutrition', icon: FaAppleAlt },
  { id: 'fitness', name: 'Fitness', icon: FaRunning },
  { id: 'mental', name: 'Mental Health', icon: FaBrain },
  { id: 'heart', name: 'Heart Health', icon: FaHeartbeat },
  { id: 'sleep', name: 'Sleep', icon: FaBed },
  { id: 'general', name: 'General Wellness', icon: FaChartLine }
];

// More realistic images for health articles
const getCategoryImage = (category: string, index: number): string => {
  const images = {
    nutrition: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1780&auto=format&fit=crop"
    ],
    fitness: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518310383802-640c2de311b6?q=80&w=2070&auto=format&fit=crop"
    ],
    mental: [
      "https://images.unsplash.com/photo-1499728603263-13726abce5fd?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1468971050039-be99497410af?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602192509154-0b900ee1f851?q=80&w=2070&auto=format&fit=crop"
    ],
    heart: [
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559757175-7b21e5afae2a?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?q=80&w=2071&auto=format&fit=crop"
    ],
    sleep: [
      "https://images.unsplash.com/photo-1519003300449-424ad0405076?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1455642305362-08c2a90ab74f?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520206183501-b80df61043c2?q=80&w=1933&auto=format&fit=crop"
    ],
    general: [
      "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506126279646-a697353d3166?q=80&w=2070&auto=format&fit=crop"
    ]
  };
  
  return images[category][index % images[category].length];
};

// Helper function to generate realistic article titles
const getArticleTitle = (category: string): string => {
  const titles: Record<string, string[]> = {
    nutrition: [
      "The Impact of Mediterranean Diet on Your Specific Health Profile",
      "Personalized Nutrition: Tailoring Your Diet to Your Body's Needs",
      "Understanding Your Metabolic Response to Different Foods",
      "How Your Genetic Factors Influence Nutritional Requirements",
      "Optimizing Your Diet Based on Your Health Biomarkers"
    ],
    fitness: [
      "Exercise Routines Optimized for Your Body Type",
      "The Right Intensity: Exercise Levels Based on Your Heart Data",
      "Building a Sustainable Fitness Plan for Your Lifestyle",
      "Recovery Strategies Tailored to Your Physical Response",
      "Your Optimal Workout Timing Based on Circadian Rhythms"
    ],
    mental: [
      "Mindfulness Practices Tailored to Your Stress Patterns",
      "Cognitive Behavioral Strategies for Your Thought Patterns",
      "Digital Detox: Personalized Approach for Your Screen Habits",
      "Social Connection: Building Relationships That Support Your Mental Health",
      "Sleep and Mental Health: Your Personal Connection"
    ],
    heart: [
      "Understanding Your Unique Cardiovascular Risk Factors",
      "Heart-Healthy Habits Customized to Your Lifestyle",
      "Your Blood Pressure Patterns: What They Mean and How to Respond",
      "Exercise and Heart Health: Your Personalized Approach",
      "Stress Management Techniques for Your Cardiovascular Health"
    ],
    sleep: [
      "Your Chronotype: Optimizing Your Day Based on Sleep Patterns",
      "Building a Sleep Routine Around Your Personal Habits",
      "Environmental Factors Affecting Your Specific Sleep Quality",
      "The Connection Between Your Diet and Sleep Quality",
      "Managing Your Screen Time for Better Sleep Outcomes"
    ],
    general: [
      "Preventive Health Strategies Based on Your Risk Profile",
      "Understanding Your Health Data: Making Informed Decisions",
      "Building Sustainable Health Habits That Work for You",
      "Personalized Approaches to Managing Chronic Conditions",
      "Integrating Multiple Health Aspects for Your Overall Wellbeing"
    ]
  };
  
  return titles[category][Math.floor(Math.random() * titles[category].length)];
};

// Helper function to generate realistic article summaries
const getArticleSummary = (category: string, title: string): string => {
  const summaries: Record<string, string[]> = {
    nutrition: [
      `Based on your dietary patterns showing lower intake of omega-3 fatty acids and higher consumption of processed foods, this article provides tailored insights on how Mediterranean diet principles could significantly improve your metabolic markers.`,
      `Your recent food tracking shows you're consuming less than 15g of fiber daily. This article provides personalized recommendations for increasing fiber intake based on your food preferences and health goals.`,
      `Analysis of your meal timing patterns indicates inconsistent eating schedules that may be affecting your insulin response. Learn how to optimize your nutrition timing based on your unique metabolic profile.`
    ],
    fitness: [
      `Your workout data shows high intensity training 4-5 times weekly with minimal recovery periods. This article offers personalized insights on optimizing your rest cycles to prevent the plateau in progress we've detected in your last 3 weeks of activity.`,
      `Based on your heart rate variability data and recovery metrics, we've identified that your current exercise intensity may be too high. This article provides a tailored approach for your specific cardiovascular profile.`,
      `Your movement patterns indicate potential muscular imbalances that could be affecting your workout efficiency. Discover customized exercise modifications based on your unique biomechanical profile.`
    ],
    mental: [
      `Your mood tracking data shows increased stress levels between 2-4pm on workdays. This article provides personalized mindfulness strategies timed specifically for your daily stress patterns.`,
      `Based on your sleep and activity data, we've detected potential connections between your exercise timing and evening anxiety levels. Learn about tailored approaches to mental wellness that align with your specific behavioral patterns.`,
      `Your focus metrics have shown a 23% decline during afternoon work sessions. These cognitive behavioral techniques have been selected specifically for your attention patterns and productivity goals.`
    ],
    heart: [
      `Your recent health check indicated slightly elevated blood pressure readings (average 132/84). This article provides personalized lifestyle modifications specifically effective for your cardiovascular risk profile.`,
      `Based on your family history of heart disease and your current activity levels, this article outlines a personalized approach to cardiovascular health that addresses your specific risk factors.`,
      `Your heart rate variability data suggests moderate autonomic nervous system imbalance. These targeted approaches can help improve your HRV based on your specific cardiovascular metrics.`
    ],
    sleep: [
      `Your sleep tracking shows an average of 6.2 hours of sleep with 14% in deep sleep phase - below optimal levels. These recommendations are customized based on your specific sleep architecture and chronotype.`,
      `Analysis of your sleep patterns indicates potential disruptions around 2-3AM correlating with room temperature fluctuations. This guide provides environment optimization strategies tailored to your sleep data.`,
      `Your evening screen time has increased 42% in the last month, coinciding with declining sleep quality metrics. These digital wellness strategies are specifically designed for your usage patterns and sleep goals.`
    ],
    general: [
      `Based on your comprehensive health profile, including recent lab work showing vitamin D levels at 28 ng/mL, this article provides personalized wellness strategies to optimize your overall health markers.`,
      `Your health data indicates excellent consistency in some habits but challenges maintaining others. This personalized approach to behavior change is based on your specific pattern of habit formation and lifestyle factors.`,
      `Integrating your activity, nutrition, sleep, and stress data, we've identified key opportunity areas for optimizing your overall wellbeing with minimal lifestyle disruption.`
    ]
  };
  
  return summaries[category][Math.floor(Math.random() * summaries[category].length)];
};

// Mock data generator
const generateArticles = (): Article[] => {
  const sources = [
    {name: 'Harvard Health', url: 'https://www.health.harvard.edu/'},
    {name: 'Mayo Clinic', url: 'https://www.mayoclinic.org/'},
    {name: 'Cleveland Clinic', url: 'https://my.clevelandclinic.org/'},
    {name: 'Johns Hopkins Medicine', url: 'https://www.hopkinsmedicine.org/'},
    {name: 'WebMD', url: 'https://www.webmd.com/'},
    {name: 'Medical News Today', url: 'https://www.medicalnewstoday.com/'}
  ];
  
  const authors = [
    {name: 'Dr. Sarah Johnson', credentials: 'MD, PhD', specialty: 'Nutritional Medicine'},
    {name: 'Dr. Michael Chen', credentials: 'MD, FACC', specialty: 'Cardiology'},
    {name: 'Dr. Emily Rodriguez', credentials: 'PhD', specialty: 'Exercise Physiology'},
    {name: 'Dr. David Patel', credentials: 'MD, MPH', specialty: 'Preventive Medicine'},
    {name: 'Dr. Olivia Wilson', credentials: 'PsyD', specialty: 'Behavioral Psychology'},
    {name: 'Dr. James Thompson', credentials: 'MD', specialty: 'Sleep Medicine'}
  ];
  
  const articles: Article[] = [];
  
  // Generate articles for each category
  categories.slice(1).forEach(category => {
    for (let i = 0; i < 3; i++) {
      const title = getArticleTitle(category.id);
      const sourceIndex = Math.floor(Math.random() * sources.length);
      const authorIndex = Math.floor(Math.random() * authors.length);
      
      articles.push({
        id: `${category.id}-${i}`,
        title,
        summary: getArticleSummary(category.id, title),
        category: category.id,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        readTime: Math.floor(Math.random() * 10) + 3,
        source: sources[sourceIndex].name,
        sourceUrl: sources[sourceIndex].url,
        author: authors[authorIndex].name,
        authorCredentials: authors[authorIndex].credentials,
        authorSpecialty: authors[authorIndex].specialty,
        relevance: Math.floor(Math.random() * 15) + 85, // More realistic high match scores (85-100%)
        image: getCategoryImage(category.id, i),
        saved: Math.random() > 0.7,
        metrics: {
          views: Math.floor(Math.random() * 1000) + 100,
          saves: Math.floor(Math.random() * 100) + 10,
          shares: Math.floor(Math.random() * 50) + 5
        }
      });
    }
  });
  
  return articles.sort((a, b) => b.relevance - a.relevance);
};

const PersonalizedInsights = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [savedOnly, setSavedOnly] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'readTime'>('relevance');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const articlesPerPage = 6;
  
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setArticles(generateArticles());
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, savedOnly, sortBy]);
  
  // Filter and sort articles - memoized for performance
  const filteredArticles = useMemo(() => {
    const filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
      const matchesSaved = savedOnly ? article.saved : true;
      
      return matchesSearch && matchesCategory && matchesSaved;
    });
    
    return filtered.sort((a, b) => {
      if (sortBy === 'relevance') return b.relevance - a.relevance;
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return a.readTime - b.readTime;
    });
  }, [articles, searchQuery, activeCategory, savedOnly, sortBy]);
  
  // Paginate articles
  const currentArticles = useMemo(() => {
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    return filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  }, [filteredArticles, currentPage]);
  
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  
  // Handle pagination
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Toggle saved status
  const toggleSaved = (articleId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    
    setArticles(articles.map(article => 
      article.id === articleId 
        ? { ...article, saved: !article.saved } 
        : article
    ));
    
    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle({ ...selectedArticle, saved: !selectedArticle.saved });
    }
  };
  
  // Handle article selection
  const viewArticle = (article: Article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // In a real app, this would trigger an API call to fetch the full article content
  };
  
  // Handle closing article view
  const closeArticleView = () => {
    setSelectedArticle(null);
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Personalized Health Insights</h1>
        <div className="bg-background rounded-lg shadow border border-border p-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-health-primary border-opacity-50 animate-[spin_1s_linear_infinite]"></div>
              <div className="absolute inset-0 rounded-full border-t-4 border-l-4 border-health-primary border-opacity-50 animate-[reverse-spin_1.5s_linear_infinite]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaHeartbeat className="text-health-primary animate-pulse text-xl" />
              </div>
            </div>
            <div className="mt-6 w-full max-w-md">
              <p className="text-center text-foreground font-medium mb-3">Processing your health data</p>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full bg-health-primary w-2/3 rounded-full animate-pulse"></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Analyzing patterns</span>
                <span>67%</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">Finding personalized health insights just for you</p>
              <p className="text-muted-foreground/70 text-xs mt-2">Combining data from your activity, sleep, nutrition, and vital signs</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (selectedArticle) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <button 
          className="mb-6 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          onClick={closeArticleView}
        >
          <FaArrowLeft className="mr-2" /> Back to insights
        </button>
        
        <div className="bg-background border border-border rounded-lg shadow overflow-hidden">
          <img 
            src={selectedArticle.image} 
            alt={selectedArticle.title} 
            className="w-full h-64 object-cover"
          />
          
          {/* User alert banner */}
          <div className="bg-health-primary/10 p-4 border-y border-health-primary/30">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-health-primary/20 flex items-center justify-center text-health-primary mr-3">
                <FaUser />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Personalized for John Smith</p>
                <p className="text-xs text-muted-foreground">Based on your health data from May 15-June 14</p>
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-health-primary/20 text-health-primary">
                  {selectedArticle.relevance}% match
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold mb-4 text-foreground">{selectedArticle.title}</h1>
              <button 
                onClick={() => toggleSaved(selectedArticle.id)} 
                className="text-xl text-foreground opacity-80 hover:opacity-100"
                aria-label={selectedArticle.saved ? "Unsave article" : "Save article"}
              >
                {selectedArticle.saved ? <FaBookmark className="text-health-primary" /> : <FaRegBookmark />}
              </button>
            </div>
            
            <div className="flex flex-wrap items-center mb-6 text-sm text-muted-foreground">
              <div className="flex items-center mr-4 mb-2">
                <FaUserMd className="mr-1" />
                <span>{selectedArticle.author} ({selectedArticle.authorCredentials}, {selectedArticle.authorSpecialty})</span>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <FaCalendarAlt className="mr-1" />
                <span>{formatDate(selectedArticle.date)}</span>
              </div>
              <div className="flex items-center mb-2">
                <FaLink className="mr-1" />
                <a href={selectedArticle.sourceUrl} className="hover:text-health-primary" target="_blank" rel="noopener noreferrer">
                  {selectedArticle.source}
                </a>
              </div>
            </div>
            
            {/* Enhanced metrics section */}
            <div className="p-4 bg-muted rounded-lg mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Match Score</p>
                  <div className="flex items-center mt-1">
                    <div className="w-12 h-12 flex items-center justify-center bg-health-primary/20 rounded-full mr-3">
                      <span className="text-health-primary text-lg font-bold">{selectedArticle.relevance}%</span>
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-foreground">High Relevance</div>
                      <div className="text-muted-foreground">for your profile</div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reading Time</p>
                  <div className="flex items-center mt-1">
                    <div className="text-2xl font-bold text-foreground">{selectedArticle.readTime}</div>
                    <div className="text-xs ml-1">
                      <div className="text-foreground">min</div>
                      <div className="text-muted-foreground">read</div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Community</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="text-xs">
                      <div className="text-foreground font-semibold">{selectedArticle.metrics.views}</div>
                      <div className="text-muted-foreground">views</div>
                    </div>
                    <div className="text-xs">
                      <div className="text-foreground font-semibold">{selectedArticle.metrics.saves}</div>
                      <div className="text-muted-foreground">saves</div>
                    </div>
                    <div className="text-xs">
                      <div className="text-foreground font-semibold">{selectedArticle.metrics.shares}</div>
                      <div className="text-muted-foreground">shares</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Health data context */}
            <div className="p-4 border border-border rounded-lg mb-6 bg-background">
              <h3 className="font-medium text-foreground mb-2 flex items-center">
                <FaChartLine className="mr-2 text-health-primary" /> Your Health Context
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                This content was selected based on the following health markers:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {selectedArticle.category === 'nutrition' && (
                  <>
                    <div className="border-l-2 border-health-primary/50 pl-3">
                      <div className="text-xs text-muted-foreground">Daily Fiber Intake</div>
                      <div className="text-foreground font-medium">15g <span className="text-danger text-xs">(-40% below target)</span></div>
                    </div>
                    <div className="border-l-2 border-health-primary/50 pl-3">
                      <div className="text-xs text-muted-foreground">Processed Food Consumption</div>
                      <div className="text-foreground font-medium">42% <span className="text-danger text-xs">(+12% above target)</span></div>
                    </div>
                  </>
                )}
                {selectedArticle.category === 'fitness' && (
                  <>
                    <div className="border-l-2 border-health-primary/50 pl-3">
                      <div className="text-xs text-muted-foreground">Weekly Active Minutes</div>
                      <div className="text-foreground font-medium">238 min <span className="text-success text-xs">(+28% above target)</span></div>
                    </div>
                    <div className="border-l-2 border-health-primary/50 pl-3">
                      <div className="text-xs text-muted-foreground">Recovery Score (avg)</div>
                      <div className="text-foreground font-medium">62/100 <span className="text-warning text-xs">(needs improvement)</span></div>
                    </div>
                  </>
                )}
                {selectedArticle.category === 'sleep' && (
                  <>
                    <div className="border-l-2 border-health-primary/50 pl-3">
                      <div className="text-xs text-muted-foreground">Average Sleep Duration</div>
                      <div className="text-foreground font-medium">6.2 hours <span className="text-danger text-xs">(-22% below target)</span></div>
                    </div>
                    <div className="border-l-2 border-health-primary/50 pl-3">
                      <div className="text-xs text-muted-foreground">Deep Sleep Percentage</div>
                      <div className="text-foreground font-medium">14% <span className="text-warning text-xs">(target: 20-25%)</span></div>
                    </div>
                  </>
                )}
                {selectedArticle.category === 'heart' && (
                  <>
                    <div className="border-l-2 border-health-primary/50 pl-3">
                      <div className="text-xs text-muted-foreground">Resting Heart Rate (avg)</div>
                      <div className="text-foreground font-medium">72 bpm <span className="text-muted-foreground text-xs">(normal range)</span></div>
                    </div>
                    <div className="border-l-2 border-health-primary/50 pl-3">
                      <div className="text-xs text-muted-foreground">Blood Pressure (avg)</div>
                      <div className="text-foreground font-medium">132/84 <span className="text-warning text-xs">(slightly elevated)</span></div>
                    </div>
                  </>
                )}
                {selectedArticle.category === 'mental' && (
                  <>
                    <div className="border-l-2 border-health-primary/50 pl-3">
                      <div className="text-xs text-muted-foreground">Stress Score (avg)</div>
                      <div className="text-foreground font-medium">68/100 <span className="text-warning text-xs">(moderately elevated)</span></div>
                    </div>
                    <div className="border-l-2 border-health-primary/50 pl-3">
                      <div className="text-xs text-muted-foreground">Mood Variability</div>
                      <div className="text-foreground font-medium">High <span className="text-warning text-xs">(fluctuating pattern)</span></div>
                    </div>
                  </>
                )}
                {selectedArticle.category === 'general' && (
                  <>
                    <div className="border-l-2 border-health-primary/50 pl-3">
                      <div className="text-xs text-muted-foreground">Vitamin D Level</div>
                      <div className="text-foreground font-medium">28 ng/mL <span className="text-warning text-xs">(insufficient)</span></div>
                    </div>
                    <div className="border-l-2 border-health-primary/50 pl-3">
                      <div className="text-xs text-muted-foreground">Habit Consistency Score</div>
                      <div className="text-foreground font-medium">62% <span className="text-muted-foreground text-xs">(improving trend)</span></div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Reading progress bar */}
            <div className="sticky top-0 pt-4 pb-2 bg-background z-10 -mx-6 px-6 mb-4">
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-health-primary rounded-full" style={{ width: '38%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Introduction</span>
                <span>38% read</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-8 text-foreground">
              <p className="font-medium">
                This article has been specifically selected for you based on your health data and profile. It has a {selectedArticle.relevance}% match with your current health situation.
              </p>

              <p>
                {selectedArticle.summary}
              </p>
              
              <p>
                Recent research from {selectedArticle.source} demonstrates that personalized approaches to {selectedArticle.category} can significantly improve outcomes. What works for one person may not work for another, which is why we've selected this content specifically for you.
              </p>
              
              <p>
                According to {selectedArticle.author}, "Understanding your individual health patterns is the first step toward making meaningful improvements. This personalized approach takes into account your unique biology, lifestyle, and preferences."
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">Key Takeaways For You</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Based on your activity patterns, focusing on consistency rather than intensity may yield better results.</li>
                <li>Your sleep data suggests that improvements in this area could have cascading benefits for other health markers.</li>
                <li>Consider the specific recommendations about {selectedArticle.category} as they align with your current health status.</li>
                <li>The personalized action steps outlined can be integrated into your existing routine with minimal disruption.</li>
              </ul>
            </div>
            
            {/* Your personalized action plan */}
            <div className="bg-gradient-to-r from-health-primary/20 to-health-primary/5 p-5 rounded-lg border border-health-primary/30 mb-8">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Your Personalized Action Plan</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-background rounded-full w-6 h-6 flex items-center justify-center text-health-primary font-bold mr-3 mt-0.5 flex-shrink-0 border border-health-primary/30">1</div>
                  <div>
                    <p className="font-medium text-foreground">Start with small adjustments to your current routine</p>
                    <p className="text-sm text-muted-foreground">Based on your habit tracking data, you're more likely to maintain changes when they're introduced gradually.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-background rounded-full w-6 h-6 flex items-center justify-center text-health-primary font-bold mr-3 mt-0.5 flex-shrink-0 border border-health-primary/30">2</div>
                  <div>
                    <p className="font-medium text-foreground">Focus on your evening routine first</p>
                    <p className="text-sm text-muted-foreground">Your data shows the most opportunity for improvement between 8-10pm each day.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-background rounded-full w-6 h-6 flex items-center justify-center text-health-primary font-bold mr-3 mt-0.5 flex-shrink-0 border border-health-primary/30">3</div>
                  <div>
                    <p className="font-medium text-foreground">Track your progress for at least 21 days</p>
                    <p className="text-sm text-muted-foreground">We've observed that you respond well to data feedback and quantifiable improvements.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted rounded-lg mt-8">
              <div>
                <p className="font-medium text-foreground">Was this insight helpful?</p>
                <p className="text-sm text-muted-foreground">Your feedback helps us improve recommendations</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-background border border-border rounded-md hover:bg-muted-foreground/10">Yes</button>
                <button className="px-4 py-2 bg-background border border-border rounded-md hover:bg-muted-foreground/10">No</button>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mt-6">
              <h3 className="font-medium mb-2 text-foreground">Related Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.slice(1).filter(cat => cat.id === selectedArticle.category).map(category => {
                  const Icon = category.icon;
                  return (
                    <span key={category.id} className="inline-flex items-center px-3 py-1 rounded-full bg-health-primary/20 text-health-primary text-sm border border-health-primary/30">
                      {Icon && <Icon className="mr-1" />}
                      {category.name}
                    </span>
                  );
                })}
              </div>
            </div>
            
            {/* Related insights */}
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="font-semibold text-lg mb-4">Related Insights For You</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {articles
                  .filter(a => a.category === selectedArticle.category && a.id !== selectedArticle.id)
                  .slice(0, 2)
                  .map(relatedArticle => (
                    <div 
                      key={relatedArticle.id}
                      className="flex border border-border rounded-lg overflow-hidden hover:border-health-primary/30 transition-colors cursor-pointer"
                      onClick={() => viewArticle(relatedArticle)}
                    >
                      <img src={relatedArticle.image} alt={relatedArticle.title} className="w-24 h-24 object-cover" />
                      <div className="p-3 flex-1">
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">{relatedArticle.title}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{relatedArticle.readTime} min read</span>
                          <span className="text-xs bg-health-primary/10 text-health-primary rounded-full px-2 py-0.5">{relatedArticle.relevance}%</span>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Personalized header with user health summary */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Personalized Health Insights</h1>
          <div className="hidden md:flex items-center">
            <div className="w-8 h-8 rounded-full bg-health-primary/20 flex items-center justify-center text-health-primary mr-2">
              <FaUser />
            </div>
            <span className="text-sm text-foreground">John Smith</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-health-primary/10 via-background to-background rounded-lg border border-border p-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-health-primary/20 flex items-center justify-center text-health-primary mr-3">
                  <FaChartLine className="text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Your Health at a Glance</h2>
                  <p className="text-sm text-muted-foreground">Last updated June 14, 2023 at 8:42 AM</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-background rounded-md border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <FaHeartbeat className="text-danger mr-1.5" />
                      <span className="text-xs font-medium text-foreground">Heart</span>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-warning/10 text-warning">
                      Attention
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-lg font-bold text-foreground">132/84</span>
                    <span className="text-xs text-muted-foreground ml-1">mmHg</span>
                  </div>
                  <div className="text-xs text-warning">
                    Slightly elevated
                  </div>
                </div>
                
                <div className="p-3 bg-background rounded-md border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <FaBed className="text-health-primary mr-1.5" />
                      <span className="text-xs font-medium text-foreground">Sleep</span>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-danger/10 text-danger">
                      Low
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-lg font-bold text-foreground">6.2</span>
                    <span className="text-xs text-muted-foreground ml-1">hours</span>
                  </div>
                  <div className="text-xs text-danger">
                    22% below target
                  </div>
                </div>
                
                <div className="p-3 bg-background rounded-md border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <FaRunning className="text-success mr-1.5" />
                      <span className="text-xs font-medium text-foreground">Activity</span>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-success/10 text-success">
                      Good
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-lg font-bold text-foreground">9,847</span>
                    <span className="text-xs text-muted-foreground ml-1">steps</span>
                  </div>
                  <div className="text-xs text-success">
                    Near your daily goal
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-background rounded-md border border-border">
                <h3 className="text-sm font-medium text-foreground mb-2">Today's Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-warning/10 text-warning border border-warning/20">
                    <FaHeartbeat className="mr-1" /> Monitor blood pressure
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-danger/10 text-danger border border-danger/20">
                    <FaBed className="mr-1" /> Improve sleep duration
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-warning/10 text-warning border border-warning/20">
                    <FaAppleAlt className="mr-1" /> Increase fiber intake
                  </span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3 bg-background rounded-md border border-border p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Weekly Trends</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Sleep Quality</span>
                    <span className="text-xs text-danger">-18%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-danger rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Activity Level</span>
                    <span className="text-xs text-success">+12%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Stress Score</span>
                    <span className="text-xs text-warning">+8%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Nutritional Balance</span>
                    <span className="text-xs text-warning">-5%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <button className="w-full px-3 py-2 text-xs text-health-primary bg-health-primary/10 rounded-md border border-health-primary/20 hover:bg-health-primary/20 transition-colors">
                  View Detailed Health Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-semibold text-foreground mb-1">Recommended Insights</h2>
          <p className="text-sm text-muted-foreground">Health content personalized for your needs</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search insights..."
              className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-health-primary/50 focus:border-health-primary/50 text-foreground bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors ${
              savedOnly 
                ? 'bg-health-primary/20 text-health-primary border-health-primary/30' 
                : 'border-border text-foreground hover:bg-muted'
            }`}
            onClick={() => setSavedOnly(!savedOnly)}
          >
            {savedOnly ? <FaBookmark /> : <FaRegBookmark />}
            <span className="hidden sm:inline">Saved</span>
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-foreground hover:bg-muted md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>
      </div>
      
      {/* Mobile filters */}
      {showFilters && (
        <div className="md:hidden mb-4 p-4 bg-background border border-border rounded-lg">
          <div className="mb-3">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const Icon = category.icon || null;
                return (
                  <button
                    key={category.id}
                    className={`px-3 py-1 rounded-full text-sm inline-flex items-center whitespace-nowrap ${
                      activeCategory === category.id 
                        ? 'bg-health-primary/20 text-health-primary border border-health-primary/30' 
                        : 'bg-background text-foreground border border-border hover:bg-muted'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {Icon && <Icon className="mr-1" />}
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Sort by</h3>
            <div className="flex gap-2">
              {[
                { value: 'relevance', label: 'Relevance' },
                { value: 'date', label: 'Date' },
                { value: 'readTime', label: 'Read Time' }
              ].map(option => (
                <button
                  key={option.value}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === option.value 
                      ? 'bg-health-primary/20 text-health-primary border border-health-primary/30' 
                      : 'bg-background text-foreground border border-border hover:bg-muted'
                  }`}
                  onClick={() => setSortBy(option.value as any)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Categories - desktop */}
      <div className="mb-6 overflow-x-auto whitespace-nowrap pb-2 flex gap-2 hidden md:flex">
        {categories.map(category => {
          const Icon = category.icon || null;
          return (
            <button
              key={category.id}
              className={`px-3 py-1 rounded-full text-sm inline-flex items-center whitespace-nowrap ${
                activeCategory === category.id 
                  ? 'bg-health-primary/20 text-health-primary border border-health-primary/30' 
                  : 'bg-background text-foreground border border-border hover:bg-muted'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {Icon && <Icon className="mr-1" />}
              {category.name}
            </button>
          );
        })}
      </div>
      
      {/* Results info */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredArticles.length === 0 ? 0 : (currentPage - 1) * articlesPerPage + 1}-
          {Math.min(currentPage * articlesPerPage, filteredArticles.length)} of {filteredArticles.length} insights
        </p>
        <div className="text-sm text-muted-foreground hidden md:flex items-center">
          <span className="mr-2">Sorted by:</span>
          <div className="relative inline-block">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-background border border-border rounded-md px-2 py-1 pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-health-primary/50"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="readTime">Read Time</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Articles grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-background border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-2">No insights found matching your criteria</p>
          <button 
            className="text-health-primary hover:text-health-primary/80 transition-colors"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setSavedOnly(false);
            }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          {/* Featured article - only show on first page when no filters are applied */}
          {currentPage === 1 && activeCategory === 'all' && !savedOnly && !searchQuery && (
            <div className="mb-8 bg-gradient-to-r from-health-primary/20 to-background border border-health-primary/30 rounded-lg overflow-hidden shadow-md">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 relative">
                  <img 
                    src={filteredArticles[0].image}
                    alt={filteredArticles[0].title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-health-primary text-white text-xs font-bold px-2 py-1 rounded">
                    FEATURED FOR YOU
                  </div>
                  <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground">
                    {filteredArticles[0].relevance}% match
                  </div>
                </div>
                <div className="p-6 lg:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-3">
                        {(() => {
                          const CategoryIcon = categories.find(c => c.id === filteredArticles[0].category)?.icon;
                          return CategoryIcon ? <CategoryIcon className="text-health-primary mr-1" /> : null;
                        })()}
                        <span className="text-xs font-medium text-health-primary">
                          {categories.find(c => c.id === filteredArticles[0].category)?.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(filteredArticles[0].date)}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-foreground">{filteredArticles[0].title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{filteredArticles[0].summary}</p>
                    
                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-1">Why this matters to you:</div>
                      <div className="flex flex-wrap gap-2">
                        {filteredArticles[0].category === 'nutrition' && (
                          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-danger/10 text-danger border border-danger/20">
                            Low fiber intake
                          </span>
                        )}
                        {filteredArticles[0].category === 'fitness' && (
                          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-warning/10 text-warning border border-warning/20">
                            Recovery needs attention
                          </span>
                        )}
                        {filteredArticles[0].category === 'sleep' && (
                          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-danger/10 text-danger border border-danger/20">
                            Sleep duration -22%
                          </span>
                        )}
                        {filteredArticles[0].category === 'heart' && (
                          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-warning/10 text-warning border border-warning/20">
                            BP slightly elevated
                          </span>
                        )}
                        {filteredArticles[0].category === 'mental' && (
                          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-warning/10 text-warning border border-warning/20">
                            Elevated stress
                          </span>
                        )}
                        {filteredArticles[0].category === 'general' && (
                          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-warning/10 text-warning border border-warning/20">
                            Vitamin D insufficient
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                        <FaUserMd className="text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{filteredArticles[0].author}</div>
                        <div className="text-xs text-muted-foreground">{filteredArticles[0].authorSpecialty}</div>
                      </div>
                    </div>
                    <div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          viewArticle(filteredArticles[0]);
                        }}
                        className="text-health-primary flex items-center text-sm hover:text-health-primary/80"
                      >
                        Read article <FaArrowRight className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentArticles.map(article => {
              const CategoryIcon = categories.find(c => c.id === article.category)?.icon || null;
              return (
                <div 
                  key={article.id} 
                  className="bg-background border border-border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all hover:border-health-primary/30 cursor-pointer group"
                  onClick={() => viewArticle(article)}
                >
                  <div className="relative">
                    <img src={article.image} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button 
                        onClick={(e) => toggleSaved(article.id, e)}
                        className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                        aria-label={article.saved ? "Unsave article" : "Save article"}
                      >
                        {article.saved ? 
                          <FaBookmark className="text-health-primary" /> : 
                          <FaRegBookmark className="text-foreground" />
                        }
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 flex space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-health-primary mr-1"></span>
                        {article.relevance}% match
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-xs font-medium">{article.metrics.views} readers found this helpful</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      {CategoryIcon && (
                        <span className="inline-flex items-center text-xs bg-health-primary/10 text-health-primary px-2 py-0.5 rounded-full border border-health-primary/30">
                          <CategoryIcon className="mr-1" />
                          {categories.find(c => c.id === article.category)?.name}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(article.date)}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold mb-2 line-clamp-2 text-foreground group-hover:text-health-primary transition-colors">{article.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{article.summary}</p>
                    
                    {/* Health trend badge - conditionally shown based on article category */}
                    <div className="mb-3">
                      {article.category === 'nutrition' && (
                        <div className="flex items-center text-xs text-warning">
                          <span className="inline-block w-2 h-2 bg-warning rounded-full mr-1"></span>
                          Your fiber intake is 40% below target
                        </div>
                      )}
                      {article.category === 'fitness' && (
                        <div className="flex items-center text-xs text-success">
                          <span className="inline-block w-2 h-2 bg-success rounded-full mr-1"></span>
                          Your activity level is above average
                        </div>
                      )}
                      {article.category === 'sleep' && (
                        <div className="flex items-center text-xs text-warning">
                          <span className="inline-block w-2 h-2 bg-warning rounded-full mr-1"></span>
                          Your sleep quality needs improvement
                        </div>
                      )}
                      {article.category === 'heart' && (
                        <div className="flex items-center text-xs text-warning">
                          <span className="inline-block w-2 h-2 bg-warning rounded-full mr-1"></span>
                          Your blood pressure is slightly elevated
                        </div>
                      )}
                      {article.category === 'mental' && (
                        <div className="flex items-center text-xs text-warning">
                          <span className="inline-block w-2 h-2 bg-warning rounded-full mr-1"></span>
                          Your stress levels peak at 2-4pm
                        </div>
                      )}
                      {article.category === 'general' && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="inline-block w-2 h-2 bg-health-primary rounded-full mr-1"></span>
                          Suggested based on your health profile
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.split(' ').join('+'))}&background=random&size=32`} 
                          alt={article.author}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-xs text-muted-foreground">{article.readTime} min read</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          viewArticle(article);
                        }}
                        className="text-health-primary font-medium text-sm hover:text-health-primary/80 inline-flex items-center group/btn"
                      >
                        Read more <FaArrowRight className="ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 
                  ? 'text-muted-foreground cursor-not-allowed' 
                  : 'text-foreground hover:bg-muted'
              }`}
              aria-label="Previous page"
            >
              <FaArrowLeft />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 rounded-md ${
                  currentPage === page 
                    ? 'bg-health-primary/20 text-health-primary border border-health-primary/30' 
                    : 'text-foreground hover:bg-muted'
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages 
                  ? 'text-muted-foreground cursor-not-allowed' 
                  : 'text-foreground hover:bg-muted'
              }`}
              aria-label="Next page"
            >
              <FaArrowRight />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default PersonalizedInsights; 