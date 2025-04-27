import React, { useState, useEffect } from 'react';
import { 
  FaArrowRight, FaArrowLeft, FaCheckCircle, FaNotesMedical, FaInfoCircle, 
  FaExclamationTriangle, FaPhone, FaSync, FaSearch, FaTimes, FaFilter, FaCheck
} from 'react-icons/fa';
import '../styles/healthPages.css';

// Mock data for symptoms
const SYMPTOMS = [
  { id: 1, name: "Headache", category: "Neurological" },
  { id: 2, name: "Fever", category: "General" },
  { id: 3, name: "Cough", category: "Respiratory" },
  { id: 4, name: "Fatigue", category: "General" },
  { id: 5, name: "Sore Throat", category: "ENT" },
  { id: 6, name: "Shortness of Breath", category: "Respiratory" },
  { id: 7, name: "Nausea", category: "Gastrointestinal" },
  { id: 8, name: "Dizziness", category: "Neurological" },
  { id: 9, name: "Chest Pain", category: "Cardiovascular" },
  { id: 10, name: "Runny Nose", category: "ENT" },
  { id: 11, name: "Muscle Aches", category: "Musculoskeletal" },
  { id: 12, name: "Joint Pain", category: "Musculoskeletal" },
  { id: 13, name: "Abdominal Pain", category: "Gastrointestinal" },
  { id: 14, name: "Diarrhea", category: "Gastrointestinal" },
  { id: 15, name: "Rash", category: "Dermatological" },
  { id: 16, name: "Vomiting", category: "Gastrointestinal" },
  { id: 17, name: "Chills", category: "General" },
  { id: 18, name: "Loss of Appetite", category: "General" },
  { id: 19, name: "Sneezing", category: "ENT" },
  { id: 20, name: "Swelling", category: "General" }
];

// Define steps for the wizard
const STEPS = [
  "Select Symptoms",
  "Additional Questions",
  "Results",
  "Recommendations"
];

const ModernSymptomChecker: React.FC = () => {
  // State variables
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>("");

  // Toggle symptom selection
  const toggleSymptom = (symptomId: number) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  // Progress bar animation during analysis
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 150);
    } else if (analysisProgress > 0) {
      setAnalysisProgress(100);
      setTimeout(() => setAnalysisProgress(0), 500);
    }
    
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle next button click
  const handleNext = () => {
    if (currentStep === 0 && selectedSymptoms.length === 0) {
      alert("Please select at least one symptom to continue.");
      return;
    }

    if (currentStep === 1) {
      setIsLoading(true);
      // Simulate API call to get conditions based on symptoms
      setTimeout(() => {
        setIsLoading(false);

        const matchedConditions = [
          {
            id: 1,
            name: "Common Cold",
            probability: 75,
            severity: "low",
            description: "The common cold is a viral infection of your nose and throat. It's usually harmless, although it might not feel that way. Many types of viruses can cause a common cold.",
            matchingSymptoms: [3, 5, 10, 19],
            nonMatchingSymptoms: [9, 13]
          },
          {
            id: 2,
            name: "Influenza",
            probability: 65,
            severity: "medium",
            description: "Influenza (flu) is a viral infection that attacks your respiratory system — your nose, throat and lungs. Influenza is commonly called the flu, but it's not the same as stomach 'flu' viruses that cause diarrhea and vomiting.",
            matchingSymptoms: [2, 3, 4, 17],
            nonMatchingSymptoms: [15, 20]
          },
          {
            id: 3,
            name: "COVID-19",
            probability: 40,
            severity: "high",
            description: "Coronavirus disease (COVID-19) is an infectious disease caused by the SARS-CoV-2 virus. Most people infected with the virus will experience mild to moderate respiratory illness and recover without requiring special treatment.",
            matchingSymptoms: [2, 3, 4, 6],
            nonMatchingSymptoms: [12, 15]
          }
        ];

        setResults(matchedConditions);
      }, 2000);
    }

    setCurrentStep(currentStep + 1);
  };

  // Handle previous button click
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedSymptoms([]);
    setSearchQuery("");
    setAge("");
    setGender("");
    setDuration("");
    setResults([]);
  };

  // Helper function to get symptom name by ID
  const getSymptomName = (id: number) => {
    const symptom = SYMPTOMS.find(s => s.id === id);
    return symptom ? symptom.name : "";
  };

  // Filter symptoms based on search query and category
  const filteredSymptoms = SYMPTOMS.filter(symptom => 
    (symptom.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     symptom.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterCategory === "" || symptom.category === filterCategory)
  );

  // Get unique categories for filtering
  const symptomCategories = [...new Set(SYMPTOMS.map(s => s.category))].sort();

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'var(--success)';
      case 'medium': return 'var(--warning)';
      case 'high': return 'var(--danger)';
      default: return 'var(--primary)';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl animate-fadeIn">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gradient-primary">
            Symptom Checker
          </h1>
          {currentStep > 0 && (
            <button 
              className="flex items-center text-sm px-4 py-2 border border-card-border rounded-lg hover:bg-card-alt transition-colors"
              onClick={handleRestart}
            >
              <FaArrowLeft className="mr-2" /> Start Over
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="progress-container h-2">
            <div 
              className="progress-primary" 
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-3">
            {STEPS.map((step, index) => (
              <span 
                key={step} 
                className={`px-3 py-1 rounded-full text-xs ${
                  currentStep >= index 
                    ? "bg-primary/20 text-primary-light font-medium" 
                    : "text-muted"
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Content Area with enhanced styling */}
        <div className="health-card p-6 rounded-xl shadow-lg border border-card-border">
          {/* Step 1: Select Symptoms */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="border-b border-card-border pb-4 mb-6">
                <h2 className="text-xl font-bold">Select Your Symptoms</h2>
                <p className="text-muted mt-2">
                  Select all symptoms you're experiencing. This helps us provide more accurate results.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <input
                    className="w-full p-3 pl-10 border border-card-border rounded-lg bg-card-bg-alt focus:border-primary focus:outline-none transition-colors"
                    placeholder="Search symptoms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                </div>
                
                <div className="w-full md:w-48">
                  <select
                    className="w-full p-3 border border-card-border rounded-lg bg-card-bg-alt focus:border-primary focus:outline-none transition-colors"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {symptomCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-card-bg-alt rounded-xl p-6 border border-card-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredSymptoms.map(symptom => (
                    <div 
                      key={symptom.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedSymptoms.includes(symptom.id) 
                          ? "border-primary bg-primary/10" 
                          : "border-card-border bg-card-bg hover:border-primary/50"
                      } hover:shadow-md`}
                      onClick={() => toggleSymptom(symptom.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-medium">{symptom.name}</span>
                          <span className="text-xs text-muted mt-1">{symptom.category}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          selectedSymptoms.includes(symptom.id)
                            ? "bg-primary border-primary"
                            : "border-card-border"
                        }`}>
                          {selectedSymptoms.includes(symptom.id) && (
                            <FaCheck className="text-white text-xs" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredSymptoms.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-muted">No symptoms found matching your search.</p>
                    <button 
                      className="mt-3 text-primary-light bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
                      onClick={() => {
                        setSearchQuery("");
                        setFilterCategory("");
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {selectedSymptoms.length > 0 && (
                <div className="mt-6 bg-card-bg rounded-xl p-5 border border-card-border">
                  <h3 className="font-medium mb-3">Selected Symptoms ({selectedSymptoms.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map(id => (
                      <span 
                        key={id} 
                        className="health-tag tag-primary flex items-center"
                      >
                        {getSymptomName(id)}
                        <button 
                          className="ml-2 text-primary-light bg-primary/20 rounded-full w-5 h-5 flex items-center justify-center hover:bg-primary/30 transition-colors" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSymptom(id);
                          }}
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Additional Questions */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-card-border pb-4 mb-6">
                <h2 className="text-xl font-bold">Additional Information</h2>
                <p className="text-muted mt-2">
                  Please provide some additional details to help us analyze your symptoms more accurately.
                </p>
              </div>

              <div className="bg-card-bg-alt rounded-xl p-6 border border-card-border space-y-6">
                <div className="w-full">
                  <label className="block mb-2 font-medium">Age</label>
                  <input 
                    className="w-full p-3 border border-card-border rounded-lg bg-card-bg focus:border-primary focus:outline-none transition-colors"
                    placeholder="Enter your age" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)}
                    type="number"
                  />
                </div>
                
                <div className="w-full">
                  <label className="block mb-2 font-medium">Gender</label>
                  <div className="flex flex-wrap gap-4">
                    {["male", "female", "other"].map(option => (
                      <label key={option} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        gender === option 
                          ? "border-primary bg-primary/10" 
                          : "border-card-border hover:bg-card-bg"
                      }`}>
                        <div className={`w-5 h-5 rounded-full mr-3 border-2 flex items-center justify-center ${
                          gender === option 
                            ? "border-primary" 
                            : "border-card-border"
                        }`}>
                          {gender === option && (
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                          )}
                        </div>
                        <input 
                          type="radio" 
                          name="gender" 
                          value={option} 
                          checked={gender === option} 
                          onChange={() => setGender(option)} 
                          className="sr-only"
                        />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="w-full">
                  <label className="block mb-2 font-medium">How long have you been experiencing these symptoms?</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["hours", "day", "days", "week", "weeks", "longer"].map((option) => (
                      <label key={option} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        duration === option 
                          ? "border-primary bg-primary/10" 
                          : "border-card-border hover:bg-card-bg"
                      }`}>
                        <div className={`w-5 h-5 rounded-full mr-3 border-2 flex items-center justify-center ${
                          duration === option 
                            ? "border-primary" 
                            : "border-card-border"
                        }`}>
                          {duration === option && (
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                          )}
                        </div>
                        <input 
                          type="radio" 
                          name="duration" 
                          value={option} 
                          checked={duration === option} 
                          onChange={() => setDuration(option)} 
                          className="sr-only"
                        />
                        {option === "hours" && "A few hours"}
                        {option === "day" && "About a day"}
                        {option === "days" && "Several days"}
                        {option === "week" && "About a week"}
                        {option === "weeks" && "Several weeks"}
                        {option === "longer" && "Longer than a month"}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-card-border pb-4 mb-6">
                <h2 className="text-xl font-bold">Possible Conditions</h2>
                <p className="text-muted mt-2">
                  Based on the symptoms you reported, here are some potential conditions to consider.
                </p>
              </div>

              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="w-full progress-container mb-6">
                    <div className="progress-primary" style={{ width: `${analysisProgress}%` }}></div>
                  </div>
                  <div className="loading-spinner mx-auto mb-6"></div>
                  <p className="font-medium text-lg">Analyzing your symptoms...</p>
                  <p className="text-muted mt-3">Using AI to match your symptoms with possible conditions</p>
                </div>
              ) : (
                <>
                  {results.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <FaInfoCircle className="text-primary-light text-2xl" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Conditions Matched</h3>
                      <p className="text-muted max-w-md mx-auto">No conditions matched your symptoms. Please try adding more symptoms or providing additional details.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {results.map((condition) => (
                        <details key={condition.id} className="group bg-card-bg-alt rounded-xl overflow-hidden border border-card-border">
                          <summary className="p-5 cursor-pointer hover:bg-card-bg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="rounded-full w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${getSeverityColor(condition.severity)}20` }}>
                                  <FaInfoCircle style={{ color: getSeverityColor(condition.severity) }} />
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg">{condition.name}</h3>
                                  <span 
                                    className="health-tag mt-1"
                                    style={{ 
                                      backgroundColor: `${getSeverityColor(condition.severity)}20`,
                                      color: getSeverityColor(condition.severity),
                                      borderColor: `${getSeverityColor(condition.severity)}30`,
                                    }}>
                                      {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)} Severity
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span 
                                  className="text-2xl font-bold"
                                  style={{ 
                                    color: condition.probability > 70 ? 'var(--danger)' : 
                                           condition.probability > 40 ? 'var(--warning)' : 
                                           'var(--success)' 
                                  }}
                                >
                                  {condition.probability}%
                                </span>
                                <span className="text-xs text-muted">Match</span>
                              </div>
                            </div>
                          </summary>
                          <div className="p-5 border-t border-card-border bg-card-bg">
                            <div className="space-y-4">
                              <p className="text-muted">{condition.description}</p>
                              
                              <div>
                                <h4 className="font-medium mb-2">Matching Symptoms:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {condition.matchingSymptoms.map(id => (
                                    <span key={id} className="health-tag tag-success flex items-center">
                                      <FaCheck className="mr-1 text-xs" /> {getSymptomName(id)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              {condition.nonMatchingSymptoms && condition.nonMatchingSymptoms.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Missing Symptoms:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {condition.nonMatchingSymptoms.map(id => (
                                      <span key={id} className="health-tag flex items-center" style={{
                                        backgroundColor: 'var(--card-bg-alt)',
                                        color: 'var(--text-muted)',
                                        borderColor: 'var(--card-border)'
                                      }}>
                                        <FaTimes className="mr-1 text-xs" /> {getSymptomName(id)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="mt-4 p-3 rounded-lg border border-primary/20 bg-primary/5">
                                <p className="text-sm flex items-start">
                                  <FaInfoCircle className="mr-2 mt-0.5 text-primary-light" />
                                  <span>This is not a medical diagnosis. Always consult with a healthcare provider for proper evaluation.</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 4: Recommendations */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-card-border pb-4 mb-6">
                <h2 className="text-xl font-bold">Next Steps & Recommendations</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card-bg-alt p-6 rounded-xl border-2 border-danger/30">
                  <div className="flex flex-col items-start space-y-4">
                    <div className="p-3 rounded-full bg-danger/10 mb-1">
                      <FaExclamationTriangle className="w-6 h-6 text-danger" />
                    </div>
                    <h3 className="text-lg font-bold">Emergency Warning Signs</h3>
                    <p className="text-muted">Seek immediate medical attention if you experience:</p>
                    <ul className="list-disc pl-5 space-y-2 text-muted">
                      <li>Difficulty breathing or shortness of breath</li>
                      <li>Persistent pain or pressure in the chest</li>
                      <li>New confusion or inability to wake up</li>
                      <li>Bluish lips or face</li>
                    </ul>
                    
                    <button 
                      className="mt-2 flex items-center bg-danger hover:bg-danger/90 text-white px-5 py-3 rounded-lg transition-colors w-full justify-center"
                    >
                      <FaPhone className="mr-2" /> Emergency Numbers
                    </button>
                  </div>
                </div>
                
                <div className="bg-card-bg-alt p-6 rounded-xl border-2 border-success/30">
                  <div className="flex flex-col items-start space-y-4">
                    <div className="p-3 rounded-full bg-success/10 mb-1">
                      <FaCheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <h3 className="text-lg font-bold">Self-Care Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted">
                      <li>Stay hydrated and get adequate rest</li>
                      <li>Monitor your symptoms and keep a symptom diary</li>
                      <li>Take over-the-counter medications as directed for symptom relief</li>
                      <li>Maintain good hand hygiene to prevent spreading illness</li>
                    </ul>
                    
                    <button 
                      className="mt-2 border-2 border-success text-success hover:bg-success/10 px-5 py-3 rounded-lg transition-colors w-full justify-center flex items-center"
                    >
                      Self-Care Guide
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-card-bg p-6 rounded-xl border border-card-border text-center">
                <h3 className="text-lg font-bold mb-3">Need to talk to a healthcare professional?</h3>
                <p className="text-muted mb-6 max-w-xl mx-auto">
                  While this symptom checker provides guidance, it's not a substitute for professional medical advice.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    className="btn-primary flex items-center justify-center mx-auto px-6 py-3"
                    onClick={handleRestart}
                  >
                    <FaNotesMedical className="mr-2" /> Start New Symptom Check
                  </button>
                  <button className="btn-secondary flex items-center justify-center mx-auto px-6 py-3">
                    Find Healthcare Provider
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            className={`flex items-center border border-card-border px-4 py-3 rounded-lg ${
              currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-card-alt'
            }`}
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          
          {currentStep < STEPS.length - 1 && (
            <button
              className="btn-primary flex items-center px-6 py-3 rounded-lg"
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSync className="mr-2 animate-spin" /> Analyzing
                </>
              ) : (
                <>
                  {currentStep === STEPS.length - 2 ? "Finish" : "Next"} <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernSymptomChecker; 