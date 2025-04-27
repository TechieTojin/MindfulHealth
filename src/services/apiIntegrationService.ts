/**
 * Mock API Integration Service
 * This is a cover-up implementation for handling external API integrations
 */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
  timestamp: number;
}

interface RequestOptions {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  timeout?: number;
  body?: any;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

class ApiIntegrationService {
  private config: ApiConfig;
  private mockResponses: Map<string, any> = new Map();
  
  constructor(config: ApiConfig) {
    this.config = {
      ...config,
      timeout: config.timeout || 10000,
      retries: config.retries || 3
    };
    
    // Initialize with some mock API endpoints and responses
    this.initializeMockResponses();
  }
  
  private initializeMockResponses() {
    // Health metrics API endpoints
    this.mockResponses.set('GET:/api/health/stats', {
      status: 200,
      data: {
        activeUsers: 1254,
        avgSessionDuration: 12.3,
        dailyActiveUsers: 450,
        weeklyActiveUsers: 1050
      }
    });
    
    this.mockResponses.set('GET:/api/health/user/:id', {
      status: 200,
      data: {
        userId: '{{id}}',
        metrics: {
          steps: 8742,
          caloriesBurned: 456,
          activeMinutes: 65,
          heartRate: { avg: 72, min: 58, max: 142 },
          sleepHours: 7.5
        },
        goals: {
          dailySteps: 10000,
          activeMinutes: 60,
          sleepHours: 8
        },
        streak: 5,
        lastSync: new Date().toISOString()
      }
    });
    
    this.mockResponses.set('POST:/api/health/user/:id/metrics', {
      status: 201,
      data: {
        success: true,
        message: 'Health metrics updated successfully'
      }
    });
    
    // Nutrition API endpoints
    this.mockResponses.set('GET:/api/nutrition/foods', {
      status: 200,
      data: [
        { id: 'food-001', name: 'Apple', calories: 95, carbs: 25, protein: 0.5, fat: 0.3 },
        { id: 'food-002', name: 'Chicken Breast', calories: 165, carbs: 0, protein: 31, fat: 3.6 },
        { id: 'food-003', name: 'Brown Rice', calories: 216, carbs: 45, protein: 5, fat: 1.8 }
      ]
    });
    
    this.mockResponses.set('GET:/api/nutrition/meals/:id', {
      status: 200,
      data: {
        id: '{{id}}',
        name: 'Sample Meal Plan',
        meals: [
          {
            name: 'Breakfast',
            foods: [
              { id: 'food-001', name: 'Apple', servings: 1 },
              { id: 'food-004', name: 'Oatmeal', servings: 1 }
            ]
          },
          {
            name: 'Lunch',
            foods: [
              { id: 'food-002', name: 'Chicken Breast', servings: 1 },
              { id: 'food-003', name: 'Brown Rice', servings: 1 }
            ]
          }
        ],
        totalCalories: 750,
        macros: { carbs: 105, protein: 45, fat: 12 }
      }
    });
    
    // User management API endpoints
    this.mockResponses.set('GET:/api/users', {
      status: 200,
      data: [
        { id: 'user-001', name: 'John Doe', email: 'john@example.com', role: 'user' },
        { id: 'user-002', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
      ]
    });
    
    this.mockResponses.set('GET:/api/users/:id', {
      status: 200,
      data: {
        id: '{{id}}',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        createdAt: '2023-01-15T10:30:00Z',
        lastLogin: '2023-05-20T08:45:00Z',
        settings: {
          notifications: true,
          theme: 'light',
          language: 'en'
        }
      }
    });
    
    this.mockResponses.set('POST:/api/users', {
      status: 201,
      data: {
        success: true,
        userId: 'user-{{randomId}}',
        message: 'User created successfully'
      }
    });
    
    this.mockResponses.set('PUT:/api/users/:id', {
      status: 200,
      data: {
        success: true,
        message: 'User updated successfully'
      }
    });
    
    this.mockResponses.set('DELETE:/api/users/:id', {
      status: 204,
      data: null
    });
  }
  
  /**
   * Make a GET request to the specified endpoint
   */
  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, options);
  }
  
  /**
   * Make a POST request to the specified endpoint
   */
  async post<T = any>(endpoint: string, data: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, { ...options, body: data });
  }
  
  /**
   * Make a PUT request to the specified endpoint
   */
  async put<T = any>(endpoint: string, data: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, { ...options, body: data });
  }
  
  /**
   * Make a DELETE request to the specified endpoint
   */
  async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, options);
  }
  
  /**
   * Make a PATCH request to the specified endpoint
   */
  async patch<T = any>(endpoint: string, data: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, { ...options, body: data });
  }
  
  /**
   * Generic request method
   */
  private async request<T = any>(method: HttpMethod, endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.config.baseUrl}${endpoint}`;
    const headers = {
      ...this.config.headers,
      ...options?.headers
    };
    
    console.log(`Mock API ${method} request to: ${url}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
    
    // Process the mock response
    const response = this.getMockResponse<T>(method, endpoint, options);
    
    return {
      data: response.data,
      status: response.status,
      headers: {
        'content-type': 'application/json',
        'x-request-id': `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        'x-api-version': '1.0.0'
      },
      timestamp: Date.now()
    };
  }
  
  /**
   * Get a mock response for a given request
   */
  private getMockResponse<T>(method: HttpMethod, endpoint: string, options?: RequestOptions): { data: T, status: number } {
    // Extract path parameters (e.g., :id in /api/users/:id)
    let normalizedEndpoint = endpoint;
    const paramRegex = /\/([^\/]+)/g;
    const pathSegments = endpoint.match(paramRegex) || [];
    
    // Map the endpoint to a pattern that can match our mock response keys
    for (const segment of pathSegments) {
      if (segment.includes(':')) {
        // This is a path parameter like /:id/
        const paramName = segment.substring(1); // remove leading '/'
        normalizedEndpoint = normalizedEndpoint.replace(segment, `/${paramName}`);
      }
    }
    
    // Try to find a matching mock response
    const key = `${method}:${normalizedEndpoint}`;
    let mockResponse = this.mockResponses.get(key);
    
    // If no mock response is found, return a 404
    if (!mockResponse) {
      return {
        data: { error: 'Not Found', message: `No endpoint found for ${method} ${endpoint}` } as unknown as T,
        status: 404
      };
    }
    
    // Process any path parameters in the response data
    if (typeof mockResponse.data === 'object' && mockResponse.data !== null) {
      mockResponse = {
        ...mockResponse,
        data: this.processTemplateValues(mockResponse.data, endpoint)
      };
    }
    
    return mockResponse;
  }
  
  /**
   * Process template values in the mock response data (e.g., {{id}})
   */
  private processTemplateValues(data: any, endpoint: string): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.processTemplateValues(item, endpoint));
    }
    
    const result: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && value.includes('{{')) {
        // Extract parameter value from the actual endpoint
        if (value.includes('{{id}}')) {
          const idMatch = endpoint.match(/\/([^\/]+)$/);
          result[key] = idMatch ? value.replace('{{id}}', idMatch[1]) : value;
        } else if (value.includes('{{randomId}}')) {
          result[key] = value.replace('{{randomId}}', Math.floor(Math.random() * 1000000).toString());
        } else {
          result[key] = value;
        }
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.processTemplateValues(value, endpoint);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }
}

export default ApiIntegrationService; 