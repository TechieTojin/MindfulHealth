import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark, FaShare, FaThumbsUp, FaRegThumbsUp, FaComment } from 'react-icons/fa';

// Define types for our data
interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: Date;
  readTime: number;
  category: string;
  tags: string[];
  imageUrl: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  relevanceScore: number;
}

interface UserPreference {
  category: string;
  weight: number;
}

// Mock user preferences - in a real app, this would come from user settings or be calculated
const userPreferences: UserPreference[] = [
  { category: 'nutrition', weight: 0.9 },
  { category: 'fitness', weight: 0.8 },
  { category: 'mental-health', weight: 0.7 },
  { category: 'heart-health', weight: 0.6 },
  { category: 'sleep', weight: 0.5 }
];

// Mock function to generate articles
const generateArticles = (count: number): Article[] => {
  const categories = ['nutrition', 'fitness', 'mental-health', 'heart-health', 'sleep', 'general-wellness'];
  const tags = [
    'beginners', 'advanced', 'quick-tips', 'research', 'expert-advice',
    'recipes', 'workout', 'meditation', 'stress-management', 'supplements',
    'prevention', 'treatment', 'lifestyle', 'science', 'technology'
  ];
  
  const articles: Article[] = [];
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const relevanceScore = userPreferences.find(pref => pref.category === category)?.weight || 0.3;
    
    const randomTags = [];
    const numTags = Math.floor(Math.random() * 4) + 1; // 1-4 tags
    for (let j = 0; j < numTags; j++) {
      const tag = tags[Math.floor(Math.random() * tags.length)];
      if (!randomTags.includes(tag)) {
        randomTags.push(tag);
      }
    }
    
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30));
    
    articles.push({
      id: `article-${i}`,
      title: getArticleTitle(category),
      summary: getArticleSummary(category),
      content: getArticleContent(category),
      author: getRandomAuthor(),
      publishDate: pastDate,
      readTime: Math.floor(Math.random() * 20) + 3, // 3-22 minutes
      category,
      tags: randomTags,
      imageUrl: `/images/articles/${category}-${Math.floor(Math.random() * 5) + 1}.jpg`,
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      isLiked: Math.random() > 0.7,
      isSaved: Math.random() > 0.8,
      relevanceScore
    });
  }
  
  // Sort by relevance score
  return articles.sort((a, b) => b.relevanceScore - a.relevanceScore);
};

// Helper functions for generating content
function getArticleTitle(category: string): string {
  const titles = {
    'nutrition': [
      '10 Superfoods That Boost Your Immune System',
      'The Mediterranean Diet: A Comprehensive Guide',
      'Intermittent Fasting: Benefits and Risks',
      'Plant-Based Proteins: Complete Guide for Vegetarians',
      'Understanding Macro and Micronutrients in Your Diet'
    ],
    'fitness': [
      'HIIT vs. Steady-State Cardio: Which is Right for You?',
      'Strength Training Basics for Beginners',
      'The Science Behind Effective Workout Recovery',
      '5 Exercise Routines You Can Do at Home Without Equipment',
      'Building Core Strength: Beyond Basic Crunches'
    ],
    'mental-health': [
      'Mindfulness Meditation: Scientific Benefits and How to Start',
      'Understanding and Managing Anxiety in Daily Life',
      'The Connection Between Exercise and Mental Health',
      'Digital Detox: Improving Mental Wellbeing in the Connected Age',
      'Sleep and Mental Health: The Critical Connection'
    ],
    'heart-health': [
      'Heart-Healthy Diet: Foods That Lower Cholesterol',
      'Understanding Blood Pressure Numbers and What They Mean',
      'Cardio Exercises That Strengthen Your Heart',
      'The Impact of Stress on Heart Health',
      'Warning Signs of Heart Issues You Should Not Ignore'
    ],
    'sleep': [
      'The Science of Sleep Cycles and Better Rest',
      'Creating the Optimal Sleep Environment',
      'Natural Remedies for Better Sleep Quality',
      'How Screen Time Affects Your Sleep Patterns',
      'Understanding and Managing Sleep Disorders'
    ],
    'general-wellness': [
      'Holistic Approach to Health: Mind, Body, and Spirit',
      'Preventive Health Screenings by Age and Gender',
      'Building Healthy Habits That Last',
      'The Benefits of Regular Health Check-ups',
      'Understanding Your Body\'s Unique Signals'
    ]
  };
  
  const categoryTitles = titles[category as keyof typeof titles] || titles['general-wellness'];
  return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
}

function getArticleSummary(category: string): string {
  const summaries = {
    'nutrition': 'Discover essential nutritional insights that can transform your diet and overall health.',
    'fitness': 'Learn evidence-based exercise strategies to optimize your fitness routine and results.',
    'mental-health': 'Explore practical approaches to improve your mental wellbeing and emotional balance.',
    'heart-health': 'Understand key factors that contribute to cardiovascular health and longevity.',
    'sleep': 'Uncover secrets to better sleep quality and how it impacts your overall health.',
    'general-wellness': 'Find balanced approaches to maintaining optimal health across all dimensions of wellbeing.'
  };
  
  return summaries[category as keyof typeof summaries] || summaries['general-wellness'];
}

function getArticleContent(category: string): string {
  return `This is a detailed article about ${category}. It contains evidence-based information, expert insights, and practical advice that you can incorporate into your daily routine. The content is personalized based on your health profile and interests.`;
}

function getRandomAuthor(): string {
  const authors = [
    'Dr. Sarah Johnson',
    'Prof. Michael Chen',
    'Emma Williams, RD',
    'Dr. Robert Smith',
    'Sophia Garcia, PT',
    'Dr. David Wilson',
    'Olivia Brown, MSc',
    'James Taylor, PhD'
  ];
  
  return authors[Math.floor(Math.random() * authors.length)];
}

// Format date to readable string
function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

const PersonalizedInsightsFeed: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [expandedArticle, setExpandedArticle] = useState<Article | null>(null);
  
  // Simulate API call to get articles
  useEffect(() => {
    setIsLoading(true);
    // Simulate network delay
    const timer = setTimeout(() => {
      const newArticles = generateArticles(30);
      setArticles(newArticles);
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter articles based on category and search
  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory ? article.category === activeCategory : true;
    const matchesSearch = searchQuery
      ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    return matchesCategory && matchesSearch;
  });
  
  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const displayedArticles = filteredArticles.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  
  // Handle toggle like
  const handleToggleLike = (id: string) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === id 
          ? { 
              ...article, 
              isLiked: !article.isLiked, 
              likes: article.isLiked ? article.likes - 1 : article.likes + 1 
            } 
          : article
      )
    );
  };
  
  // Handle toggle save
  const handleToggleSave = (id: string) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === id 
          ? { ...article, isSaved: !article.isSaved } 
          : article
      )
    );
  };
  
  // Handle article click
  const handleArticleClick = (article: Article) => {
    setExpandedArticle(article);
  };
  
  // Handle category click
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category === activeCategory ? null : category);
    setPage(1); // Reset to first page when changing category
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">Personalized Insights Feed</h1>
        <div className="flex justify-center items-center mt-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center mt-4 text-gray-600">Loading your personalized health insights...</p>
      </div>
    );
  }
  
  if (expandedArticle) {
    return (
      <div className="min-h-screen p-6">
        <button 
          onClick={() => setExpandedArticle(null)}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to feed
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-2">{expandedArticle.title}</h1>
          
          <div className="flex items-center mb-4 text-gray-600">
            <span className="mr-4">By {expandedArticle.author}</span>
            <span className="mr-4">|</span>
            <span className="mr-4">{formatDate(expandedArticle.publishDate)}</span>
            <span className="mr-4">|</span>
            <span>{expandedArticle.readTime} min read</span>
          </div>
          
          <div className="flex space-x-2 mb-6">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{expandedArticle.category}</span>
            {expandedArticle.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">{tag}</span>
            ))}
          </div>
          
          <div className="mb-6">
            <img 
              src={expandedArticle.imageUrl} 
              alt={expandedArticle.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Health+Article';
              }}
            />
          </div>
          
          <div className="prose max-w-none mb-6">
            <p className="font-bold text-lg mb-4">{expandedArticle.summary}</p>
            <p>{expandedArticle.content}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <h2 className="text-2xl font-bold mt-6 mb-4">Key Takeaways</h2>
            <ul>
              <li>Important point related to {expandedArticle.category} and your health profile</li>
              <li>Evidence-based recommendation that you can implement today</li>
              <li>Long-term benefits you might experience from following this advice</li>
              <li>Common misconceptions about this health topic</li>
            </ul>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          
          <div className="flex justify-between items-center border-t pt-4">
            <div className="flex space-x-4">
              <button 
                onClick={() => handleToggleLike(expandedArticle.id)}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
              >
                {expandedArticle.isLiked ? 
                  <FaThumbsUp className="text-blue-600" /> : 
                  <FaRegThumbsUp />
                }
                <span>{expandedArticle.likes}</span>
              </button>
              
              <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                <FaComment />
                <span>{expandedArticle.comments}</span>
              </button>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => handleToggleSave(expandedArticle.id)}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
              >
                {expandedArticle.isSaved ? 
                  <FaBookmark className="text-blue-600" /> : 
                  <FaRegBookmark />
                }
                <span>Save</span>
              </button>
              
              <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                <FaShare />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Personalized Insights Feed</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/4">
          {/* Search Box */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // Reset to first page when searching
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Articles List */}
          {displayedArticles.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-lg text-gray-600">No articles found matching your criteria.</p>
              <button 
                onClick={() => {
                  setActiveCategory(null);
                  setSearchQuery('');
                }}
                className="mt-3 text-blue-600 hover:text-blue-800"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {displayedArticles.map(article => (
                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 h-48 md:h-full md:w-48">
                      <img 
                        className="h-full w-full object-cover" 
                        src={article.imageUrl}
                        alt={article.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Health+Insight';
                        }}
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                              {article.category}
                            </span>
                            {article.relevanceScore > 0.7 && (
                              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                Recommended for you
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSave(article.id);
                            }}
                          >
                            {article.isSaved ? 
                              <FaBookmark className="text-blue-600" /> : 
                              <FaRegBookmark className="text-gray-400 hover:text-gray-600" />
                            }
                          </button>
                        </div>
                        
                        <button 
                          className="mt-2 text-left"
                          onClick={() => handleArticleClick(article)}
                        >
                          <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">{article.title}</h2>
                        </button>
                        
                        <p className="mt-2 text-gray-600">{article.summary}</p>
                        
                        <div className="mt-2 flex flex-wrap">
                          {article.tags.map(tag => (
                            <span key={tag} className="mr-2 mb-2 text-xs text-gray-500">#{tag}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{article.author}</span>
                            <span className="mx-2">·</span>
                            <span>{formatDate(article.publishDate)}</span>
                            <span className="mx-2">·</span>
                            <span>{article.readTime} min read</span>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleLike(article.id);
                              }}
                              className="flex items-center space-x-1"
                            >
                              {article.isLiked ? 
                                <FaThumbsUp className="text-blue-600" /> : 
                                <FaRegThumbsUp className="text-gray-400 hover:text-gray-600" />
                              }
                              <span className="text-sm text-gray-500">{article.likes}</span>
                            </button>
                            
                            <div className="flex items-center space-x-1">
                              <FaComment className="text-gray-400" />
                              <span className="text-sm text-gray-500">{article.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {filteredArticles.length > 0 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded-md ${
                    page === 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      pageNum === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    page === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/4">
          {/* Categories */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Categories</h2>
            <div className="space-y-2">
              {['nutrition', 'fitness', 'mental-health', 'heart-health', 'sleep', 'general-wellness'].map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
          
          {/* Your Health Summary */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Your Health Focus</h2>
            <div className="space-y-3">
              {userPreferences.map(pref => (
                <div key={pref.category} className="flex items-center justify-between">
                  <span className="text-gray-700">
                    {pref.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${pref.weight * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800">
              Update your preferences
            </button>
          </div>
          
          {/* Trending Topics */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3">Trending Topics</h2>
            <div className="space-y-2">
              <div className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer">#MindfulMeditation</div>
              <div className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer">#NutritionMyths</div>
              <div className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer">#HomeWorkouts</div>
              <div className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer">#SleepHygiene</div>
              <div className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer">#StressReduction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedInsightsFeed; 