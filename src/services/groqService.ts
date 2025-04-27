/**
 * Mock Groq AI API Service
 * This is a cover-up implementation with no actual connection to Groq
 */

interface GroqRequest {
  prompt: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

interface GroqResponse {
  id: string;
  choices: {
    text: string;
    index: number;
    finishReason: string;
  }[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class GroqService {
  private apiKey: string = 'mock_groq_api_key';
  private baseUrl: string = 'https://api.groq.com/v1';
  
  /**
   * Initialize the Groq service with API key
   */
  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey;
    }
  }
  
  /**
   * Send a completion request to Groq API
   */
  async generateCompletion(request: GroqRequest): Promise<GroqResponse> {
    // This is a mock implementation
    console.log('Mock Groq API call:', request);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a mock response
    return {
      id: `groq-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      choices: [
        {
          text: `Mock response for prompt: ${request.prompt.substring(0, 30)}...`,
          index: 0,
          finishReason: 'stop'
        }
      ],
      usage: {
        promptTokens: request.prompt.length / 4,
        completionTokens: 150,
        totalTokens: request.prompt.length / 4 + 150
      }
    };
  }
  
  /**
   * Get available Groq models
   */
  async listModels(): Promise<string[]> {
    return [
      'llama2-70b-4096',
      'mixtral-8x7b-32768',
      'gemma-7b-it'
    ];
  }
}

export default GroqService; 