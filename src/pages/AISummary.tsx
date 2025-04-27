import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FaChartLine, FaHeartbeat, FaRunning, FaBrain, FaAppleAlt, 
  FaBed, FaSyncAlt, FaCalendarAlt, FaRegLightbulb, FaInfoCircle,
  FaExclamationTriangle, FaCheck, FaBullseye, FaClipboardCheck,
  FaChartPie, FaChartBar, FaArrowUp, FaArrowDown, FaLock, FaShareAlt,
  FaDownload, FaFilter, FaCog, FaLightbulb, FaPrescription, FaSlidersH, FaArrowRight
} from 'react-icons/fa';
import '../styles/healthPages.css';
import services from '../services';

// Enhanced insights data generator
const generateInsights = () => {
  // Basic health metrics
  const metrics = [
    {
      id: 'sleep',
      title: 'Sleep Quality',
      icon: FaBed,
      value: Math.floor(Math.random() * 30) + 70, // 70-100
      change: Math.floor(Math.random() * 20) - 10, // -10 to +10
      status: 'good',
      category: 'lifestyle',
      trend: generateTrendData(7),
      details: {
        avgDuration: Math.floor(Math.random() * 2) + 7, // 7-9 hours
        deepSleep: Math.floor(Math.random() * 20) + 15, // 15-35%
        remSleep: Math.floor(Math.random() * 15) + 20, // 20-35%
        interruptions: Math.floor(Math.random() * 3),
        sleepLatency: Math.floor(Math.random() * 20) + 5 // 5-25 minutes
      }
    },
    {
      id: 'activity',
      title: 'Physical Activity',
      icon: FaRunning,
      value: Math.floor(Math.random() * 40) + 60, // 60-100
      change: Math.floor(Math.random() * 30) - 5, // -5 to +25
      status: 'good',
      category: 'lifestyle',
      trend: generateTrendData(7),
      details: {
        stepsAvg: Math.floor(Math.random() * 4000) + 6000, // 6000-10000 steps
        activeMinutes: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
        caloriesBurned: Math.floor(Math.random() * 400) + 200, // 200-600 calories
        workouts: Math.floor(Math.random() * 5) + 2, // 2-7 workouts/week
        activityTypes: ['Walking', 'Running', 'Strength Training', 'Cycling'].slice(0, Math.floor(Math.random() * 3) + 2)
      }
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      icon: FaAppleAlt,
      value: Math.floor(Math.random() * 35) + 60, // 60-95
      change: Math.floor(Math.random() * 20) - 8, // -8 to +12
      status: 'normal',
      category: 'lifestyle',
      trend: generateTrendData(7),
      details: {
        caloriesAvg: Math.floor(Math.random() * 800) + 1600, // 1600-2400 calories
        protein: Math.floor(Math.random() * 40) + 60, // 60-100g
        carbs: Math.floor(Math.random() * 100) + 150, // 150-250g
        fat: Math.floor(Math.random() * 30) + 50, // 50-80g
        hydration: Math.floor(Math.random() * 1000) + 1500, // 1500-2500ml
        mealQuality: Math.floor(Math.random() * 30) + 70 // 70-100
      }
    },
    {
      id: 'heart',
      title: 'Heart Health',
      icon: FaHeartbeat,
      value: Math.floor(Math.random() * 25) + 75, // 75-100
      change: Math.floor(Math.random() * 12) - 6, // -6 to +6
      status: 'good',
      category: 'vitals',
      trend: generateTrendData(7),
      details: {
        restingHR: Math.floor(Math.random() * 15) + 55, // 55-70 bpm
        hrVariability: Math.floor(Math.random() * 20) + 40, // 40-60ms
        systolic: Math.floor(Math.random() * 20) + 110, // 110-130 mmHg
        diastolic: Math.floor(Math.random() * 15) + 70, // 70-85 mmHg
        o2Saturation: Math.floor(Math.random() * 4) + 96 // 96-99%
      }
    },
    {
      id: 'stress',
      title: 'Stress Level',
      icon: FaBrain,
      value: Math.floor(Math.random() * 40) + 40, // 40-80 (lower is better)
      change: Math.floor(Math.random() * 20) - 15, // -15 to +5
      status: 'attention',
      category: 'mental',
      trend: generateTrendData(7),
      details: {
        averageLevel: Math.floor(Math.random() * 40) + 30, // 30-70
        peakStressTime: ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)],
        recoveryRate: Math.floor(Math.random() * 20) + 60, // 60-80%
        mindfulnessSessions: Math.floor(Math.random() * 7), // 0-7 sessions
        stressFactors: ['Work', 'Sleep', 'Relationships', 'Health', 'Finances'].slice(0, Math.floor(Math.random() * 3) + 1)
      }
    },
    {
      id: 'mentalWellbeing',
      title: 'Mental Wellbeing',
      icon: FaBrain,
      value: Math.floor(Math.random() * 30) + 65, // 65-95
      change: Math.floor(Math.random() * 14) - 7, // -7 to +7
      status: 'normal',
      category: 'mental',
      trend: generateTrendData(7),
      details: {
        moodAverage: Math.floor(Math.random() * 30) + 70, // 70-100
        anxietyLevel: Math.floor(Math.random() * 30) + 10, // 10-40
        focusScore: Math.floor(Math.random() * 30) + 65, // 65-95
        socialConnections: Math.floor(Math.random() * 5) + 2, // 2-7 connections
        cognitivePerformance: Math.floor(Math.random() * 25) + 70 // 70-95
      }
    }
  ];

  // Generate detailed insights with advanced analytics 
  const insights = [
    {
      id: 'insight-1',
      title: 'Sleep pattern improvements',
      description: 'Your sleep consistency has improved by 18% over the past month. Maintaining a regular sleep schedule is contributing positively to your overall health.',
      category: 'sleep',
      type: 'positive',
      confidence: 92,
      relatedMetrics: ['heart', 'mentalWellbeing'],
      actionable: true,
      source: 'Sleep analysis algorithm based on 30-day data',
      actions: ['Maintain 10:30pm bedtime', 'Continue morning sunlight exposure']
    },
    {
      id: 'insight-2',
      title: 'Increased heart rate variability',
      description: 'Your heart rate variability has increased by 12% this month, indicating improved cardiovascular health and better stress recovery.',
      category: 'heart',
      type: 'positive',
      confidence: 89,
      relatedMetrics: ['stress', 'activity'],
      actionable: false,
      source: 'Cardiovascular pattern analysis from wearable data',
      supportingEvidence: 'Consistent correlation between HRV increases and lower stress levels has been observed'
    },
    {
      id: 'insight-3',
      title: 'Exercise consistency',
      description: 'You\'ve maintained your exercise routine for 3 weeks consistently. This pattern is associated with improved long-term fitness outcomes.',
      category: 'activity',
      type: 'positive',
      confidence: 95,
      relatedMetrics: ['heart', 'mentalWellbeing'],
      actionable: true,
      source: 'Activity pattern recognition',
      actions: ['Increase intensity gradually', 'Add one more strength session per week']
    },
    {
      id: 'insight-4',
      title: 'Nutrient imbalance',
      description: 'Your dietary logs show lower than recommended intake of vitamin D and magnesium. Consider adjusting your diet or discussing supplements with your healthcare provider.',
      category: 'nutrition',
      type: 'attention',
      confidence: 87,
      relatedMetrics: ['activity', 'mentalWellbeing'],
      actionable: true,
      source: 'Nutritional analysis based on 14-day food log',
      actions: ['Increase intake of leafy greens', 'Consider vitamin D supplementation', 'Add more nuts and seeds to diet'],
      riskLevel: 'moderate'
    },
    {
      id: 'insight-5',
      title: 'Stress triggers identified',
      description: 'Correlation analysis shows increased stress levels during mid-week work hours. Consider implementing stress management techniques on Wednesdays and Thursdays.',
      category: 'stress',
      type: 'attention',
      confidence: 83,
      relatedMetrics: ['mentalWellbeing', 'sleep', 'heart'],
      actionable: true,
      source: 'Pattern recognition algorithm',
      actions: ['Schedule short breaks on Wednesdays', 'Practice 5-minute breathing exercises', 'Block focus time on calendar'],
      riskLevel: 'moderate'
    },
    {
      id: 'insight-6',
      title: 'Cognitive performance peak times',
      description: 'Your cognitive performance metrics show peak focus and problem-solving abilities between 9-11am. Consider scheduling complex tasks during this window.',
      category: 'mentalWellbeing',
      type: 'neutral',
      confidence: 78,
      relatedMetrics: ['sleep', 'nutrition'],
      actionable: true,
      source: 'Cognitive assessment pattern analysis',
      actions: ['Schedule complex tasks between 9-11am', 'Protect this time block in your calendar']
    },
    {
      id: 'insight-7',
      title: 'Hydration and energy correlation',
      description: 'Days with consistent hydration (>2000ml) show 23% higher energy levels and 18% better mood scores. Your hydration has been below target on 4 of the last 7 days.',
      category: 'nutrition',
      type: 'attention',
      confidence: 91,
      relatedMetrics: ['activity', 'mentalWellbeing'],
      actionable: true,
      source: 'Multivariate correlation analysis',
      actions: ['Set hydration reminders', 'Carry a water bottle', 'Track intake in app'],
      riskLevel: 'low'
    }
  ];

  // Generate personalized recommendations with scientific evidence
  const recommendations = [
    {
      id: 'rec-1',
      title: 'Optimize your sleep environment',
      description: 'Consider blackout curtains and reducing screen time 1 hour before bed to improve sleep quality.',
      category: 'sleep',
      priority: 'medium',
      impact: 'high',
      timeToResult: '1-2 weeks',
      effort: 'low',
      scientificEvidence: 'Strong evidence from multiple sleep studies shows blue light reduction before bed improves sleep latency by 20-30%',
      personalizedReasoning: 'Based on your sleep data showing 25+ minutes average sleep latency'
    },
    {
      id: 'rec-2',
      title: 'Add magnesium-rich foods',
      description: 'Include more nuts, seeds, and leafy greens in your diet to address the magnesium deficiency.',
      category: 'nutrition',
      priority: 'high',
      impact: 'high',
      timeToResult: '2-4 weeks',
      effort: 'medium',
      scientificEvidence: 'Clinical studies indicate magnesium supplementation improves sleep quality and reduces anxiety symptoms',
      personalizedReasoning: 'Your nutritional logs show consistently low magnesium intake (est. 65% of RDA)'
    },
    {
      id: 'rec-3',
      title: 'Try guided meditation',
      description: 'A 10-minute guided meditation during your mid-week workdays may help manage the stress peaks we\'ve identified.',
      category: 'stress',
      priority: 'high',
      impact: 'medium',
      timeToResult: 'immediate',
      effort: 'low',
      scientificEvidence: 'Meta-analysis of 18 studies showed brief mindfulness practice reduces acute stress response by 15-25%',
      personalizedReasoning: 'Pattern analysis shows consistent stress peaks on Wednesday afternoons'
    },
    {
      id: 'rec-4',
      title: 'Increase cardiovascular exercise',
      description: 'Adding 2 more cardio sessions per week could significantly improve your heart health metrics.',
      category: 'activity',
      priority: 'medium',
      impact: 'high',
      timeToResult: '3-6 weeks',
      effort: 'medium',
      scientificEvidence: '150+ min/week of moderate cardiovascular activity associated with 20-30% reduced risk of heart disease',
      personalizedReasoning: 'Your current activity levels (avg 90 min/week) are below optimal for your age and health profile'
    },
    {
      id: 'rec-5',
      title: 'Implement a digital sunset routine',
      description: 'Create an evening routine that gradually reduces digital device usage starting 2 hours before bedtime.',
      category: 'sleep',
      priority: 'medium',
      impact: 'high',
      timeToResult: '1 week',
      effort: 'medium',
      scientificEvidence: 'Research shows 54% improvement in sleep onset with structured digital reduction before bed',
      personalizedReasoning: 'Your sleep data shows correlation between evening device usage and delayed sleep onset'
    },
    {
      id: 'rec-6',
      title: 'Schedule focus blocks for deep work',
      description: 'Set aside 90-minute blocks for focused work during your cognitive peak times (9-11am).',
      category: 'mentalWellbeing',
      priority: 'low',
      impact: 'high',
      timeToResult: 'immediate',
      effort: 'low',
      scientificEvidence: 'Research on ultradian rhythms shows productivity increases of 30-50% when aligning work with natural focus periods',
      personalizedReasoning: 'Your cognitive assessment data shows peak performance during morning hours'
    }
  ];

  // Generate health forecast
  const generateForecast = () => {
    return {
      shortTerm: {
        timeline: '1-2 weeks',
        predictions: [
          { metric: 'Sleep quality', direction: 'improve', confidence: 85, condition: 'if evening routine is maintained' },
          { metric: 'Stress levels', direction: 'improve', confidence: 75, condition: 'with consistent mindfulness practice' }
        ]
      },
      mediumTerm: {
        timeline: '1-3 months',
        predictions: [
          { metric: 'Heart health', direction: 'improve', confidence: 80, condition: 'with increased cardiovascular exercise' },
          { metric: 'Mental wellbeing', direction: 'improve', confidence: 70, condition: 'with continued stress management and sleep improvements' },
          { metric: 'Nutrient deficiencies', direction: 'resolve', confidence: 85, condition: 'with dietary adjustments' }
        ]
      },
      longTerm: {
        timeline: '6+ months',
        predictions: [
          { metric: 'Overall health risk score', direction: 'decrease', confidence: 75, condition: 'with adherence to recommendations' },
          { metric: 'Cognitive performance', direction: 'improve', confidence: 65, condition: 'with continued improvements in sleep, nutrition, and stress management' }
        ]
      },
      potentialRisks: [
        { condition: 'Continued magnesium deficiency', outcome: 'May impact sleep quality and muscle recovery', probability: 'moderate' },
        { condition: 'Sustained high stress periods', outcome: 'May affect long-term heart health and cognitive function', probability: 'low' }
      ]
    };
  };

  // Generate health connections (relations between metrics)
  const generateHealthConnections = () => {
    return [
      { source: 'sleep', target: 'mentalWellbeing', strength: 0.8, impact: 'positive', description: 'Sleep quality strongly influences cognitive performance and mood' },
      { source: 'stress', target: 'heart', strength: 0.7, impact: 'negative', description: 'Elevated stress correlates with increased heart rate and blood pressure' },
      { source: 'nutrition', target: 'activity', strength: 0.6, impact: 'positive', description: 'Proper nutrition provides energy for optimal physical performance' },
      { source: 'sleep', target: 'stress', strength: 0.75, impact: 'negative', description: 'Poor sleep increases stress hormone levels and emotional reactivity' },
      { source: 'activity', target: 'mentalWellbeing', strength: 0.65, impact: 'positive', description: 'Regular physical activity boosts mood and reduces anxiety' }
    ];
  };
  
  // Helper function to generate trend data
  function generateTrendData(days) {
    const data = [];
    let value = Math.floor(Math.random() * 20) + 70;
    
    for (let i = 0; i < days; i++) {
      // Small random change each day
      value += Math.floor(Math.random() * 10) - 5;
      // Keep within range
      value = Math.max(50, Math.min(95, value));
      
      data.push({
        day: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
        value
      });
    }
    
    return data;
  }

  return {
    metrics,
    insights,
    recommendations,
    forecast: generateForecast(),
    healthConnections: generateHealthConnections(),
    lastUpdated: new Date().toISOString(),
    dataPoints: Math.floor(Math.random() * 5000) + 15000, // Number of data points analyzed
    aiModel: "HealthMetrics Pro v2.1",
    analysisConfidence: Math.floor(Math.random() * 10) + 88, // 88-98%
    nextScheduledUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
  };
};

// Main component
const AISummary = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [showDetailPanel, setShowDetailPanel] = useState<string>('');
  const [viewMode, setViewMode] = useState<'standard' | 'advanced'>('standard');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  const currentDate = new Date();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Effect for initial data loading and periodic updates
  useEffect(() => {
    loadData();

    // Set up an automatic refresh every 5 minutes for real-time updates
    const autoRefreshInterval = setInterval(() => {
      if (!refreshing) {
        handleQuietRefresh();
      }
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(autoRefreshInterval);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Effect to simulate real-time data analysis when refreshing
  useEffect(() => {
    if (refreshing) {
      setAnalysisProgress(0);
      intervalRef.current = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(intervalRef.current!);
            return 95;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 150);
    } else if (analysisProgress > 0 && analysisProgress < 100) {
      setAnalysisProgress(100);
      setTimeout(() => setAnalysisProgress(0), 500);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshing]);
  
  // Load data with simulated API call
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setAnalysisProgress(0);
    
    // Start progress animation
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 150);
    
    try {
      // Simulate API call with artificial delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if we have a mock service to use
      if (services && services.groq) {
        // Pretend we're using the Groq service for AI analysis
        console.log('Using Groq service for health analysis');
        await services.groq.generateCompletion({
          prompt: "Analyze health data and generate insights",
          model: "llama2-70b-4096"
        });
      }
      
      // Set the generated data
      setData(generateInsights());
    } catch (error) {
      console.error('Error loading health data:', error);
      // Fallback to generated data
      setData(generateInsights());
    } finally {
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Clear the progress bar after completion
      setTimeout(() => {
        setAnalysisProgress(0);
        setIsLoading(false);
        setRefreshing(false);
      }, 500);
    }
  }, []);
  
  // Handle quiet background refresh without full loading state
  const handleQuietRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    
    try {
      // Simulate lightweight API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update with fresh data
      setData(generateInsights());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Manually trigger data refresh
  const regenerateInsights = () => {
    if (refreshing) return;
    loadData();
  };
  
  if (isLoading || !data) {
    return (
      <div className="container mx-auto p-4 max-w-6xl app-dark-bg">
        <h1 className="text-2xl font-bold mb-6 text-gradient-primary">AI Health Summary</h1>
        <div className="health-card p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="progress-container w-full mb-6">
              <div 
                className="progress-primary" 
                style={{ width: `${analysisProgress}%` }}
              ></div>
            </div>
            <div className="loading-spinner mb-4"></div>
            <div className="text-center space-y-2">
              <p className="text-muted">Analyzing your health data...</p>
              <p className="text-muted/70 text-sm">Processing {(data?.dataPoints || 15000).toLocaleString()} data points using advanced AI algorithms</p>
              <p className="text-xs text-primary mt-4 animate-pulse">Applying machine learning models • Identifying patterns • Generating insights</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const filteredInsights = data.insights.filter((insight: any) => 
    selectedCategory === 'all' || insight.category === selectedCategory
  );
  
  const filteredRecommendations = data.recommendations.filter((rec: any) => 
    selectedCategory === 'all' || rec.category === selectedCategory
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get color for metric status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'var(--success)';
      case 'normal':
        return 'var(--primary)';
      case 'attention':
        return 'var(--warning)';
      case 'poor':
        return 'var(--danger)';
      default:
        return 'var(--text-muted)';
    }
  };
  
  // Get badge for recommendation priority
  const getPriorityBadge = (priority: string, impact: string) => {
    switch (priority) {
      case 'high':
        return (
          <div className="flex items-center gap-1">
            <span className="health-tag tag-danger flex items-center">
              <FaArrowUp className="mr-1" size={10} /> High Priority
            </span>
            <span className={`health-tag ${impact === 'high' ? 'tag-danger' : impact === 'medium' ? 'tag-warning' : 'tag-primary'}`}>
              {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
            </span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-1">
            <span className="health-tag tag-warning">Medium Priority</span>
            <span className={`health-tag ${impact === 'high' ? 'tag-danger' : impact === 'medium' ? 'tag-warning' : 'tag-primary'}`}>
              {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
            </span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center gap-1">
            <span className="health-tag tag-success">Low Priority</span>
            <span className={`health-tag ${impact === 'high' ? 'tag-danger' : impact === 'medium' ? 'tag-warning' : 'tag-primary'}`}>
              {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
            </span>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Get icon for insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <FaCheck className="text-success" />;
      case 'neutral':
        return <FaInfoCircle className="text-primary" />;
      case 'attention':
        return <FaExclamationTriangle className="text-warning" />;
      case 'negative':
        return <FaExclamationTriangle className="text-danger" />;
      default:
        return <FaInfoCircle className="text-muted" />;
    }
  };
  
  // Get change indicator with colored arrows
  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return <span className="text-success text-sm flex items-center"><FaArrowUp className="mr-1" size={10} /> {change}%</span>;
    } else if (change < 0) {
      return <span className="text-danger text-sm flex items-center"><FaArrowDown className="mr-1" size={10} /> {Math.abs(change)}%</span>;
    } else {
      return <span className="text-muted text-sm">–</span>;
    }
  };

  // Get confidence badge
  const getConfidenceBadge = (confidence: number) => {
    let colorClass = 'tag-primary';
    if (confidence >= 90) colorClass = 'tag-success';
    else if (confidence >= 75) colorClass = 'tag-primary';
    else if (confidence >= 60) colorClass = 'tag-warning';
    else colorClass = 'tag-danger';

    return (
      <span className={`health-tag ${colorClass}`}>
        {confidence}% Confidence
      </span>
    );
  };

  // Handle showing details panel
  const toggleDetailPanel = (metricId: string) => {
    if (showDetailPanel === metricId) {
      setShowDetailPanel('');
    } else {
      setShowDetailPanel(metricId);
    }
  };

  // Switch between standard and advanced view
  const toggleViewMode = () => {
    setViewMode(viewMode === 'standard' ? 'advanced' : 'standard');
  };

  // Dummy function for development purposes
  const handleShare = () => {
    alert('Share functionality would be implemented here in a real application');
  };

  const handleDownload = () => {
    alert('Download functionality would be implemented here in a real application');
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header Area with Analysis Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">AI Health Summary</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="font-medium text-primary-light">{data.aiModel}</span>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-success/10 border border-success/20">
              <span className="text-success">{data.analysisConfidence}% confidence</span>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-card-bg border border-card-border">
              <span className="text-muted">{data.dataPoints.toLocaleString()} data points</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted text-sm hidden md:inline border-l border-card-border pl-3">
            Updated: {formatDate(data.lastUpdated)}
          </span>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-lg border border-card-border hover:bg-card-alt transition-colors"
              onClick={handleShare}
              aria-label="Share summary"
            >
              <FaShareAlt className="text-primary-light" />
            </button>
            <button 
              className="p-2 rounded-lg border border-card-border hover:bg-card-alt transition-colors"
              onClick={handleDownload}
              aria-label="Download report"
            >
              <FaDownload className="text-primary-light" />
            </button>
            <button 
              className="p-2 rounded-lg border border-card-border hover:bg-card-alt transition-colors"
              onClick={toggleViewMode}
              aria-label="Change view mode"
            >
              <FaSlidersH className="text-primary-light" />
            </button>
            <button 
              onClick={regenerateInsights}
              className="flex items-center px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-colors"
              disabled={refreshing}
            >
              <FaSyncAlt className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Analyzing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
      
      {refreshing && analysisProgress > 0 && (
        <div className="mb-6">
          <div className="progress-container h-1">
            <div 
              className="progress-primary" 
              style={{ width: `${analysisProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted">Analyzing data...</span>
            <span className="text-xs text-muted">{analysisProgress}%</span>
          </div>
        </div>
      )}
      
      {/* Tabs Navigation */}
      <div className="mb-8">
        <div className="border-b border-card-border">
          <nav className="flex -mb-px">
            <button
              className={`py-3 px-5 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary text-primary-light'
                  : 'border-transparent text-muted hover:text-primary-light hover:border-card-border'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <div className="flex items-center">
                <FaChartLine className="mr-2" /> Overview
              </div>
            </button>
            <button
              className={`py-3 px-5 border-b-2 font-medium text-sm ${
                activeTab === 'insights'
                  ? 'border-primary text-primary-light'
                  : 'border-transparent text-muted hover:text-primary-light hover:border-card-border'
              }`}
              onClick={() => setActiveTab('insights')}
            >
              <div className="flex items-center">
                <FaLightbulb className="mr-2" /> Insights
              </div>
            </button>
            <button
              className={`py-3 px-5 border-b-2 font-medium text-sm ${
                activeTab === 'recommendations'
                  ? 'border-primary text-primary-light'
                  : 'border-transparent text-muted hover:text-primary-light hover:border-card-border'
              }`}
              onClick={() => setActiveTab('recommendations')}
            >
              <div className="flex items-center">
                <FaClipboardCheck className="mr-2" /> Recommendations
              </div>
            </button>
            {viewMode === 'advanced' && (
              <button
                className={`py-3 px-5 border-b-2 font-medium text-sm ${
                  activeTab === 'forecast'
                    ? 'border-primary text-primary-light'
                    : 'border-transparent text-muted hover:text-primary-light hover:border-card-border'
                }`}
                onClick={() => setActiveTab('forecast')}
              >
                <div className="flex items-center">
                  <FaBullseye className="mr-2" /> Health Forecast
                </div>
              </button>
            )}
            {viewMode === 'advanced' && (
              <button
                className={`py-3 px-5 border-b-2 font-medium text-sm ${
                  activeTab === 'connections'
                    ? 'border-primary text-primary-light'
                    : 'border-transparent text-muted hover:text-primary-light hover:border-card-border'
                }`}
                onClick={() => setActiveTab('connections')}
              >
                <div className="flex items-center">
                  <FaChartPie className="mr-2" /> Health Connections
                </div>
              </button>
            )}
          </nav>
        </div>
      </div>
      
      {/* Filters */}
      {(activeTab === 'insights' || activeTab === 'recommendations') && (
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === 'all' 
                  ? 'bg-gradient-primary text-white' 
                  : 'bg-card-bg text-muted border border-card-border hover:bg-card-alt'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </button>
            {['sleep', 'activity', 'heart', 'nutrition', 'stress', 'mental'].map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === category 
                    ? 'bg-gradient-primary text-white' 
                    : 'bg-card-bg text-muted border border-card-border hover:bg-card-alt'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Tab Content */}
      <div className="health-card overflow-hidden rounded-xl shadow-lg border border-card-border">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gradient-primary">Health Metrics Overview</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Time Range: </span>
                {['week', 'month', 'quarter'].map((range) => (
                  <button 
                    key={range}
                    className={`px-3 py-1.5 text-xs rounded-md ${
                      timeRange === range 
                        ? 'bg-primary/20 text-primary-light border border-primary/30' 
                        : 'bg-card-bg-alt border border-card-border'
                    }`}
                    onClick={() => setTimeRange(range as any)}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {data.metrics.map((metric: any) => {
                const Icon = metric.icon;
                return (
                  <div 
                    key={metric.id} 
                    className="health-card border-card-border hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => toggleDetailPanel(metric.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full ${
                            metric.status === 'good' ? 'bg-success/20' : 
                            metric.status === 'normal' ? 'bg-primary/20' : 
                            metric.status === 'attention' ? 'bg-warning/20' : 'bg-danger/20'
                          }`}>
                            <Icon style={{color: getStatusColor(metric.status)}} />
                          </div>
                          <h3 className="ml-2 font-medium">{metric.title}</h3>
                        </div>
                        {getChangeIndicator(metric.change)}
                      </div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-sm text-muted">Score</span>
                        <span className="text-sm font-medium">{metric.value}/100</span>
                      </div>
                      <div className="progress-container">
                        <div 
                          className={
                            metric.status === 'good' ? 'progress-success' : 
                            metric.status === 'normal' ? 'progress-primary' : 
                            metric.status === 'attention' ? 'progress-warning' : 'progress-danger'
                          }
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                      
                      {/* Mini trend chart */}
                      {viewMode === 'advanced' && metric.trend && (
                        <div className="mt-3 pt-3 border-t border-card-border">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted">7-Day Trend</span>
                            <span className="text-xs text-muted">
                              {new Date(metric.trend[0].day).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - 
                              {new Date(metric.trend[metric.trend.length-1].day).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                            </span>
                          </div>
                          <div className="h-8 flex items-end">
                            {metric.trend.map((point: any, index: number) => (
                              <div 
                                key={index} 
                                className="flex-1 mx-[1px]"
                                style={{
                                  height: `${(point.value - 50) * 100 / 45}%`, // Scale to fit height (50-95 range)
                                  backgroundColor: 
                                    point.value >= 80 ? 'var(--success)' :
                                    point.value >= 65 ? 'var(--primary)' :
                                    point.value >= 50 ? 'var(--warning)' : 'var(--danger)',
                                  opacity: 0.7,
                                  borderRadius: '1px'
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {showDetailPanel === metric.id && metric.details && (
                      <div className="p-4 bg-card-alt border-t border-card-border animate-slideDown">
                        <h4 className="font-medium mb-2 text-sm">Detailed Metrics</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(metric.details).map(([key, value]: [string, any]) => (
                            <div key={key} className="bg-card p-2 rounded border border-card-border">
                              <span className="text-xs text-muted block capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="text-sm font-medium">
                                {Array.isArray(value) 
                                  ? value.join(', ') 
                                  : typeof value === 'number' && key.toLowerCase().includes('percent')
                                    ? `${value}%`
                                    : value
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <h2 className="text-xl font-semibold mb-4 text-gradient-primary">Key Insights</h2>
            <div className="space-y-4">
              {data.insights.slice(0, 3).map((insight: any) => (
                <div key={insight.id} className="border border-card-border rounded-lg p-4 hover:shadow-sm transition-shadow bg-card/50">
                  <div className="flex">
                    <div className="mr-3 mt-1">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{insight.title}</h3>
                        {getConfidenceBadge(insight.confidence)}
                      </div>
                      <p className="text-muted text-sm mt-1">{insight.description}</p>
                      
                      {viewMode === 'advanced' && insight.actionable && insight.actions && (
                        <div className="mt-2 pt-2 border-t border-card-border">
                          <p className="text-xs text-primary mb-1">Suggested Actions:</p>
                          <ul className="text-xs text-muted space-y-1">
                            {insight.actions.map((action: string, index: number) => (
                              <li key={index} className="flex items-center">
                                <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {data.insights.length > 3 && (
                <button 
                  className="text-primary text-sm font-medium hover:text-primary/80 transition-colors flex items-center"
                  onClick={() => setActiveTab('insights')}
                >
                  View all {data.insights.length} insights <FaArrowRight className="ml-1" size={12} />
                </button>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-primary">
                  <FaRegLightbulb className="text-lg" />
                </div>
                <div>
                  <h3 className="font-medium text-primary">Your Health Summary</h3>
                  <p className="text-sm mt-1">
                    Based on our analysis of {data.dataPoints.toLocaleString()} data points, your overall health status is good. 
                    You're making excellent progress with your sleep and physical activity. 
                    Consider focusing on addressing your stress management and nutrition for further improvements.
                  </p>
                  
                  {viewMode === 'advanced' && (
                    <div className="mt-3 pt-2 border-t border-primary/20">
                      <h4 className="text-xs font-medium text-primary mb-2">Next Steps</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <button className="bg-white bg-opacity-50 hover:bg-opacity-70 transition-colors border border-primary/30 rounded p-2 text-sm text-primary flex items-center justify-center">
                          <FaPrescription className="mr-2" /> Generate Health Report
                        </button>
                        <button className="bg-white bg-opacity-50 hover:bg-opacity-70 transition-colors border border-primary/30 rounded p-2 text-sm text-primary flex items-center justify-center">
                          <FaBullseye className="mr-2" /> Set Health Goals
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gradient-primary">Detailed Health Insights</h2>
            
            {filteredInsights.length === 0 ? (
              <div className="text-center py-8 border border-card-border rounded-lg">
                <FaInfoCircle className="mx-auto text-muted text-3xl mb-2" />
                <p className="text-muted">No insights available for this category</p>
                <button 
                  className="mt-4 text-primary hover:text-primary/80 transition-colors"
                  onClick={() => setSelectedCategory('all')}
                >
                  View all categories
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInsights.map((insight: any) => (
                  <div key={insight.id} className="border border-card-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex">
                      <div className="mr-3 mt-1">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <h3 className="font-medium">{insight.title}</h3>
                          <div className="flex items-center gap-2">
                            {getConfidenceBadge(insight.confidence)}
                            {insight.riskLevel && (
                              <span className={`health-tag ${
                                insight.riskLevel === 'high' ? 'tag-danger' :
                                insight.riskLevel === 'moderate' ? 'tag-warning' :
                                'tag-success'
                              }`}>
                                {insight.riskLevel.charAt(0).toUpperCase() + insight.riskLevel.slice(1)} Risk
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-muted text-sm mt-1">{insight.description}</p>
                        
                        {viewMode === 'advanced' && (
                          <div className="mt-3 pt-3 border-t border-card-border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {insight.source && (
                                <div>
                                  <span className="text-xs text-primary block mb-1">Source</span>
                                  <span className="text-sm text-muted">{insight.source}</span>
                                </div>
                              )}
                              {insight.relatedMetrics && insight.relatedMetrics.length > 0 && (
                                <div>
                                  <span className="text-xs text-primary block mb-1">Related Metrics</span>
                                  <div className="flex flex-wrap gap-1">
                                    {insight.relatedMetrics.map((metric: string) => (
                                      <span key={metric} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {insight.actionable && insight.actions && (
                              <div className="mt-3">
                                <span className="text-xs text-primary block mb-1">Suggested Actions</span>
                                <ul className="text-xs text-muted space-y-1 mt-2">
                                  {insight.actions.map((action: string, index: number) => (
                                    <li key={index} className="flex items-center">
                                      <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                                      {action}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-3">Understanding Your Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center p-2 border border-card-border rounded-lg">
                  <FaCheck className="text-success mr-2" />
                  <span><strong className="text-success">Positive</strong> <span className="text-muted">Achievements</span></span>
                </div>
                <div className="flex items-center p-2 border border-card-border rounded-lg">
                  <FaInfoCircle className="text-primary mr-2" />
                  <span><strong className="text-primary">Information</strong> <span className="text-muted">Neutral</span></span>
                </div>
                <div className="flex items-center p-2 border border-card-border rounded-lg">
                  <FaExclamationTriangle className="text-warning mr-2" />
                  <span><strong className="text-warning">Attention</strong> <span className="text-muted">Focus areas</span></span>
                </div>
                <div className="flex items-center p-2 border border-card-border rounded-lg">
                  <FaExclamationTriangle className="text-danger mr-2" />
                  <span><strong className="text-danger">Action</strong> <span className="text-muted">Urgent</span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gradient-primary">Personalized Recommendations</h2>
            
            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-8 border border-card-border rounded-lg">
                <FaInfoCircle className="mx-auto text-muted text-3xl mb-2" />
                <p className="text-muted">No recommendations available for this category</p>
                <button 
                  className="mt-4 text-primary hover:text-primary/80 transition-colors"
                  onClick={() => setSelectedCategory('all')}
                >
                  View all categories
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecommendations.map((rec: any) => (
                  <div key={rec.id} className="border border-card-border rounded-lg p-4 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{rec.title}</h3>
                          {getPriorityBadge(rec.priority, rec.impact)}
                        </div>
                        <p className="text-muted text-sm">{rec.description}</p>
                        
                        {viewMode === 'advanced' && (
                          <div className="mt-4 pt-4 border-t border-card-border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <span className="text-xs text-primary block mb-1">Time to Results</span>
                                <span className="text-sm">{rec.timeToResult}</span>
                              </div>
                              <div>
                                <span className="text-xs text-primary block mb-1">Effort Required</span>
                                <span className="text-sm capitalize">{rec.effort}</span>
                              </div>
                              <div>
                                <span className="text-xs text-primary block mb-1">Category</span>
                                <span className="text-sm capitalize">{rec.category}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <span className="text-xs text-primary block mb-1">Scientific Evidence</span>
                                <p className="text-sm text-muted">{rec.scientificEvidence}</p>
                              </div>
                              <div>
                                <span className="text-xs text-primary block mb-1">Why This Is For You</span>
                                <p className="text-sm text-muted">{rec.personalizedReasoning}</p>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex">
                              <button className="btn-primary text-xs py-1 px-4 flex-1">
                                Add to Health Plan
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-2 flex items-center text-xs text-muted">
                          <FaCalendarAlt className="mr-1" />
                          <span>Added {formatDate(data.lastUpdated)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/20">
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-warning">
                  <FaExclamationTriangle />
                </div>
                <div>
                  <h3 className="font-medium text-warning">Important Note</h3>
                  <p className="text-sm mt-1">
                    These recommendations are generated based on AI analysis of your data and general health guidelines. 
                    Always consult with healthcare professionals before making significant changes to your health routine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Health Forecast Tab */}
        {activeTab === 'forecast' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gradient-primary mb-2">Health Trajectory Analysis</h3>
              <p className="text-sm text-muted">
                Based on your current data patterns and medical history, our AI predicts the following potential 
                health outcomes with varying confidence levels.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Short-term forecast */}
              <div className="border border-card-border rounded-lg p-4">
                <h4 className="text-md font-semibold mb-3">Short-term (1-3 months)</h4>
                <div className="space-y-4">
                  {data.forecast.shortTerm.predictions.map((item, index) => (
                    <div key={index} className="border-b border-card-border last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-sm font-medium">{item.metric}</span>
                          <div className="flex items-center mt-1">
                            <div 
                              className={`h-2 w-24 rounded-full ${
                                item.direction === 'improve' ? 'bg-green-500/20' : 
                                item.direction === 'decline' ? 'bg-red-500/20' : 
                                'bg-yellow-500/20'
                              }`}
                            >
                              <div 
                                className={`h-2 rounded-full ${
                                  item.direction === 'improve' ? 'bg-green-500' : 
                                  item.direction === 'decline' ? 'bg-red-500' : 
                                  'bg-yellow-500'
                                }`} 
                                style={{ width: `${item.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted ml-2">{item.confidence}% confidence</span>
                          </div>
                        </div>
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.direction === 'improve' ? 'bg-green-500/10 text-green-500' : 
                            item.direction === 'decline' ? 'bg-red-500/10 text-red-500' : 
                            'bg-yellow-500/10 text-yellow-500'
                          }`}
                        >
                          {item.direction.charAt(0).toUpperCase() + item.direction.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted">{item.condition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medium-term forecast */}
              <div className="border border-card-border rounded-lg p-4">
                <h4 className="text-md font-semibold mb-3">Medium-term (3-6 months)</h4>
                <div className="space-y-4">
                  {data.forecast.mediumTerm.predictions.map((item, index) => (
                    <div key={index} className="border-b border-card-border last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-sm font-medium">{item.metric}</span>
                          <div className="flex items-center mt-1">
                            <div 
                              className={`h-2 w-24 rounded-full ${
                                item.direction === 'improve' ? 'bg-green-500/20' : 
                                item.direction === 'decline' ? 'bg-red-500/20' : 
                                'bg-yellow-500/20'
                              }`}
                            >
                              <div 
                                className={`h-2 rounded-full ${
                                  item.direction === 'improve' ? 'bg-green-500' : 
                                  item.direction === 'decline' ? 'bg-red-500' : 
                                  'bg-yellow-500'
                                }`} 
                                style={{ width: `${item.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted ml-2">{item.confidence}% confidence</span>
                          </div>
                        </div>
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.direction === 'improve' ? 'bg-green-500/10 text-green-500' : 
                            item.direction === 'decline' ? 'bg-red-500/10 text-red-500' : 
                            'bg-yellow-500/10 text-yellow-500'
                          }`}
                        >
                          {item.direction.charAt(0).toUpperCase() + item.direction.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted">{item.condition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long-term forecast */}
              <div className="border border-card-border rounded-lg p-4">
                <h4 className="text-md font-semibold mb-3">Long-term (6-12 months)</h4>
                <div className="space-y-4">
                  {data.forecast.longTerm.predictions.map((item, index) => (
                    <div key={index} className="border-b border-card-border last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-sm font-medium">{item.metric}</span>
                          <div className="flex items-center mt-1">
                            <div 
                              className={`h-2 w-24 rounded-full ${
                                item.direction === 'improve' ? 'bg-green-500/20' : 
                                item.direction === 'decline' ? 'bg-red-500/20' : 
                                'bg-yellow-500/20'
                              }`}
                            >
                              <div 
                                className={`h-2 rounded-full ${
                                  item.direction === 'improve' ? 'bg-green-500' : 
                                  item.direction === 'decline' ? 'bg-red-500' : 
                                  'bg-yellow-500'
                                }`} 
                                style={{ width: `${item.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted ml-2">{item.confidence}% confidence</span>
                          </div>
                        </div>
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.direction === 'improve' ? 'bg-green-500/10 text-green-500' : 
                            item.direction === 'decline' ? 'bg-red-500/10 text-red-500' : 
                            'bg-yellow-500/10 text-yellow-500'
                          }`}
                        >
                          {item.direction.charAt(0).toUpperCase() + item.direction.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted">{item.condition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Health Connections Tab */}
        {activeTab === 'connections' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gradient-primary mb-2">Health Interconnections Map</h3>
              <p className="text-sm text-muted">
                This visualization shows how different aspects of your health are connected,
                helping you understand the relationships between conditions, symptoms, and lifestyle factors.
              </p>
            </div>

            <div className="border border-card-border rounded-lg p-4 mb-6">
              <div className="aspect-square w-full max-w-2xl mx-auto bg-card-background rounded-lg p-4 flex items-center justify-center">
                <div className="text-center text-muted">
                  <svg 
                    className="w-16 h-16 mx-auto text-primary/30 mb-2" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  <p className="text-sm">Interactive health connections map would render here</p>
                  <p className="text-xs mt-2">This would require a specialized visualization library</p>
                </div>
              </div>
            </div>

            {/* Key connections */}
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-3">Key Connections</h4>
              <div className="space-y-4">
                {data.healthConnections.map((connection, index) => (
                  <div key={index} className="border border-card-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="text-sm font-medium">{connection.description}</h5>
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          connection.strength === 'strong' ? 'bg-primary/10 text-primary' :
                          connection.strength === 'moderate' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-purple-500/10 text-purple-500'
                        }`}
                      >
                        {connection.strength.charAt(0).toUpperCase() + connection.strength.slice(1)} connection
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <span className="text-xs text-muted block">{connection.source}</span>
                        <div 
                          className={`h-1 w-full mt-1 ${
                            connection.strength === 'strong' ? 'bg-primary' :
                            connection.strength === 'moderate' ? 'bg-blue-500' :
                            'bg-purple-500'
                          }`}
                        ></div>
                      </div>
                      <div className="px-2">
                        <svg className="w-4 h-4 text-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="13 17 18 12 13 7"></polyline>
                          <polyline points="6 17 11 12 6 7"></polyline>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-muted block">{connection.target}</span>
                        <div 
                          className={`h-1 w-full mt-1 ${
                            connection.strength === 'strong' ? 'bg-primary' :
                            connection.strength === 'moderate' ? 'bg-blue-500' :
                            'bg-purple-500'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISummary; 