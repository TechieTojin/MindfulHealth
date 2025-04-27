/**
 * Application Configuration 
 * Contains environment-specific settings for various services
 */

// Environment detection
const isDev = import.meta.env.MODE === 'development';
const isProd = import.meta.env.MODE === 'production';
const isTest = import.meta.env.MODE === 'test';

// Base configuration object
const config = {
  // App info
  app: {
    name: 'Mindful Health Hub',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
    baseUrl: import.meta.env.VITE_BASE_URL || (isDev ? 'http://localhost:5173' : 'https://mindfulhealthhub.com'),
    apiUrl: import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:3000/api' : 'https://api.mindfulhealthhub.com')
  },
  
  // API settings
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  
  // Database settings
  database: {
    host: import.meta.env.VITE_DB_HOST || 'localhost',
    port: parseInt(import.meta.env.VITE_DB_PORT || '5432'),
    name: import.meta.env.VITE_DB_NAME || 'health_hub_db',
    user: import.meta.env.VITE_DB_USER || 'postgres',
    password: import.meta.env.VITE_DB_PASSWORD || 'postgres',
    ssl: import.meta.env.VITE_DB_SSL === 'true',
    poolSize: parseInt(import.meta.env.VITE_DB_POOL_SIZE || '10'),
    connectionTimeout: 30000 // 30 seconds
  },
  
  // Cache settings (Redis)
  cache: {
    host: import.meta.env.VITE_CACHE_HOST || 'localhost',
    port: parseInt(import.meta.env.VITE_CACHE_PORT || '6379'),
    password: import.meta.env.VITE_CACHE_PASSWORD || '',
    defaultTtl: parseInt(import.meta.env.VITE_CACHE_TTL || '3600') // 1 hour
  },
  
  // Message queue settings (RabbitMQ)
  messageQueue: {
    host: import.meta.env.VITE_MQ_HOST || 'localhost',
    port: parseInt(import.meta.env.VITE_MQ_PORT || '5672'),
    username: import.meta.env.VITE_MQ_USERNAME || 'guest',
    password: import.meta.env.VITE_MQ_PASSWORD || 'guest',
    vhost: import.meta.env.VITE_MQ_VHOST || '/',
    queues: {
      events: 'health_hub_events',
      notifications: 'health_hub_notifications',
      metrics: 'health_hub_metrics'
    },
    exchanges: {
      events: 'health_hub_events_exchange',
      notifications: 'health_hub_notifications_exchange',
      metrics: 'health_hub_metrics_exchange'
    }
  },
  
  // Authentication settings
  auth: {
    jwtSecret: import.meta.env.VITE_JWT_SECRET || 'supersecretdevkey',
    jwtExpiresIn: import.meta.env.VITE_JWT_EXPIRES_IN || '1h',
    refreshTokenExpiresIn: import.meta.env.VITE_REFRESH_TOKEN_EXPIRES_IN || '7d',
    cookieSecure: isProd, // Use secure cookies in production
    cookieSameSite: 'lax' as const,
    passwordMinLength: 8,
    passwordResetExpiry: 24 * 60 * 60 * 1000, // 24 hours
    providers: {
      google: {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
        callbackUrl: import.meta.env.VITE_GOOGLE_CALLBACK_URL || '/auth/google/callback'
      },
      github: {
        clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
        clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET || '',
        callbackUrl: import.meta.env.VITE_GITHUB_CALLBACK_URL || '/auth/github/callback'
      }
    }
  },
  
  // Base blockchain settings
  blockchain: {
    network: import.meta.env.VITE_BLOCKCHAIN_NETWORK || 'testnet',
    rpcUrl: import.meta.env.VITE_BLOCKCHAIN_RPC_URL || 'https://goerli.base.org',
    apiKey: import.meta.env.VITE_BLOCKCHAIN_API_KEY || '',
    contractAddresses: {
      userProfiles: import.meta.env.VITE_CONTRACT_USER_PROFILES || '0x0000000000000000000000000000000000000000',
      healthMetrics: import.meta.env.VITE_CONTRACT_HEALTH_METRICS || '0x0000000000000000000000000000000000000000',
      rewards: import.meta.env.VITE_CONTRACT_REWARDS || '0x0000000000000000000000000000000000000000'
    }
  },
  
  // Groq AI settings
  groq: {
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    defaultModel: import.meta.env.VITE_GROQ_DEFAULT_MODEL || 'llama2-70b-4096',
    maxTokens: parseInt(import.meta.env.VITE_GROQ_MAX_TOKENS || '2048'),
    temperature: parseFloat(import.meta.env.VITE_GROQ_TEMPERATURE || '0.7')
  },
  
  // Fluvio settings
  fluvio: {
    gateway: import.meta.env.VITE_FLUVIO_GATEWAY || 'localhost:9875',
    topics: {
      healthMetrics: 'health-metrics',
      systemLogs: 'system-logs'
    }
  },
  
  // Logging settings
  logging: {
    level: import.meta.env.VITE_LOG_LEVEL || (isDev ? 'debug' : 'info'),
    format: isDev ? 'pretty' : 'json',
    destination: import.meta.env.VITE_LOG_DESTINATION || 'stdout'
  },
  
  // Feature flags
  features: {
    enableAI: import.meta.env.VITE_ENABLE_AI === 'true' || true,
    enableBlockchain: import.meta.env.VITE_ENABLE_BLOCKCHAIN === 'true' || false,
    enableRealTimeUpdates: import.meta.env.VITE_ENABLE_REALTIME === 'true' || true,
    enableOfflineMode: import.meta.env.VITE_ENABLE_OFFLINE === 'true' || true
  },
  
  // Third-party services
  services: {
    fileStorage: {
      provider: import.meta.env.VITE_FILE_STORAGE_PROVIDER || 'local',
      bucket: import.meta.env.VITE_FILE_STORAGE_BUCKET || 'health-hub-uploads',
      region: import.meta.env.VITE_FILE_STORAGE_REGION || 'us-east-1',
      accessKey: import.meta.env.VITE_FILE_STORAGE_ACCESS_KEY || '',
      secretKey: import.meta.env.VITE_FILE_STORAGE_SECRET_KEY || '',
      baseUrl: import.meta.env.VITE_FILE_STORAGE_BASE_URL || ''
    },
    notifications: {
      email: {
        provider: import.meta.env.VITE_EMAIL_PROVIDER || 'mock',
        from: import.meta.env.VITE_EMAIL_FROM || 'noreply@mindfulhealthhub.com',
        apiKey: import.meta.env.VITE_EMAIL_API_KEY || ''
      },
      push: {
        provider: import.meta.env.VITE_PUSH_PROVIDER || 'mock',
        apiKey: import.meta.env.VITE_PUSH_API_KEY || ''
      }
    }
  }
};

// Environment-specific overrides
if (isTest) {
  // Test-specific settings
  Object.assign(config.database, {
    name: 'health_hub_test_db'
  });
  
  // Use in-memory cache for tests
  Object.assign(config.cache, {
    host: 'memory'
  });
  
  // Don't use real services in tests
  Object.assign(config.services.fileStorage, {
    provider: 'memory'
  });
}

export default config; 