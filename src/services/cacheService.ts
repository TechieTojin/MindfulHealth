/**
 * Mock Cache Service
 * Simulates in-memory cache like Redis without actual connection
 */

interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  ttl?: number; // default TTL in seconds
}

interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  memoryUsage: number;
  uptime: number;
}

type CacheValue = string | number | boolean | object | null;

class CacheService {
  private config: CacheConfig;
  private cache: Map<string, { value: CacheValue, expiry: number | null }> = new Map();
  private isConnected: boolean = false;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    keys: 0,
    memoryUsage: 0,
    uptime: 0
  };
  private startTime: number = Date.now();
  
  constructor(config: CacheConfig) {
    this.config = {
      ...config,
      db: config.db || 0,
      ttl: config.ttl || 3600 // Default 1 hour TTL
    };
    
    // Start the expiry checker
    setInterval(() => this.checkExpiredKeys(), 5000);
    
    // Start stats calculator
    setInterval(() => {
      this.stats.uptime = Math.floor((Date.now() - this.startTime) / 1000);
      this.stats.keys = this.cache.size;
      this.stats.memoryUsage = this.estimateMemoryUsage();
    }, 10000);
  }
  
  /**
   * Connect to the cache server
   */
  async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mock Cache connecting to ${this.config.host}:${this.config.port}`);
        this.isConnected = true;
        resolve(true);
      }, 200);
    });
  }
  
  /**
   * Disconnect from the cache server
   */
  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = false;
        resolve();
      }, 100);
    });
  }
  
  /**
   * Get a value from cache
   */
  async get<T = any>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = this.cache.get(key);
        
        if (!item) {
          this.stats.misses++;
          resolve(null);
          return;
        }
        
        if (item.expiry !== null && item.expiry < Date.now()) {
          this.cache.delete(key);
          this.stats.misses++;
          resolve(null);
          return;
        }
        
        this.stats.hits++;
        resolve(item.value as T);
      }, Math.random() * 30 + 5); // Random delay between 5-35ms
    });
  }
  
  /**
   * Set a value in cache
   */
  async set(key: string, value: CacheValue, ttl?: number): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const expiry = ttl !== undefined ? 
          (ttl > 0 ? Date.now() + (ttl * 1000) : null) : 
          (this.config.ttl ? Date.now() + (this.config.ttl * 1000) : null);
        
        this.cache.set(key, { value, expiry });
        resolve(true);
      }, Math.random() * 20 + 10); // Random delay between 10-30ms
    });
  }
  
  /**
   * Delete a key from cache
   */
  async del(key: string): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const existed = this.cache.has(key);
        this.cache.delete(key);
        resolve(existed);
      }, Math.random() * 15 + 5); // Random delay between 5-20ms
    });
  }
  
  /**
   * Check if a key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = this.cache.get(key);
        
        if (!item) {
          resolve(false);
          return;
        }
        
        if (item.expiry !== null && item.expiry < Date.now()) {
          this.cache.delete(key);
          resolve(false);
          return;
        }
        
        resolve(true);
      }, Math.random() * 10 + 5); // Random delay between 5-15ms
    });
  }
  
  /**
   * Get the TTL for a key in seconds
   */
  async ttl(key: string): Promise<number> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = this.cache.get(key);
        
        if (!item) {
          resolve(-2); // Key doesn't exist
          return;
        }
        
        if (item.expiry === null) {
          resolve(-1); // Key exists but has no expiry
          return;
        }
        
        const ttlMs = item.expiry - Date.now();
        if (ttlMs <= 0) {
          this.cache.delete(key);
          resolve(-2); // Key has expired
          return;
        }
        
        resolve(Math.ceil(ttlMs / 1000)); // Return seconds
      }, Math.random() * 10 + 5);
    });
  }
  
  /**
   * Get all keys matching a pattern
   * This is a very basic implementation that only supports * as a wildcard at the end
   */
  async keys(pattern: string): Promise<string[]> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = Date.now();
        const matchingKeys: string[] = [];
        
        if (pattern === '*') {
          // Return all non-expired keys
          this.cache.forEach((item, key) => {
            if (item.expiry === null || item.expiry > now) {
              matchingKeys.push(key);
            }
          });
        } else if (pattern.endsWith('*')) {
          // Simple prefix matching
          const prefix = pattern.slice(0, -1);
          this.cache.forEach((item, key) => {
            if (key.startsWith(prefix) && (item.expiry === null || item.expiry > now)) {
              matchingKeys.push(key);
            }
          });
        } else {
          // Exact match
          if (this.cache.has(pattern)) {
            const item = this.cache.get(pattern)!;
            if (item.expiry === null || item.expiry > now) {
              matchingKeys.push(pattern);
            }
          }
        }
        
        resolve(matchingKeys);
      }, Math.random() * 50 + 20); // Random delay between 20-70ms for potentially expensive operation
    });
  }
  
  /**
   * Increment a numeric value stored at key
   */
  async incr(key: string): Promise<number> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const item = this.cache.get(key);
        
        if (!item) {
          // Key doesn't exist, create it with value 1
          this.cache.set(key, { value: 1, expiry: null });
          resolve(1);
          return;
        }
        
        if (item.expiry !== null && item.expiry < Date.now()) {
          // Key has expired, create new one
          this.cache.set(key, { value: 1, expiry: null });
          resolve(1);
          return;
        }
        
        // Check if value is a number
        if (typeof item.value === 'number') {
          const newValue = item.value + 1;
          this.cache.set(key, { value: newValue, expiry: item.expiry });
          resolve(newValue);
        } else {
          reject(new Error('Value at key is not a number'));
        }
      }, Math.random() * 15 + 5);
    });
  }
  
  /**
   * Remove all keys from the current database
   */
  async flushDb(): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.cache.clear();
        resolve(true);
      }, Math.random() * 100 + 50); // Slow operation
    });
  }
  
  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({...this.stats});
      }, 10);
    });
  }
  
  /**
   * Check if cache is connected
   */
  isConnectedToCache(): boolean {
    return this.isConnected;
  }
  
  /**
   * Check for and remove expired keys
   */
  private checkExpiredKeys(): void {
    const now = Date.now();
    
    this.cache.forEach((item, key) => {
      if (item.expiry !== null && item.expiry < now) {
        this.cache.delete(key);
      }
    });
  }
  
  /**
   * Estimate memory usage of the cache (very rough estimate)
   */
  private estimateMemoryUsage(): number {
    let bytes = 0;
    
    this.cache.forEach((item, key) => {
      // Rough estimation: 2 bytes per character for keys
      bytes += key.length * 2;
      
      // Add value size estimation
      if (typeof item.value === 'string') {
        bytes += item.value.length * 2;
      } else if (typeof item.value === 'number' || typeof item.value === 'boolean') {
        bytes += 8;
      } else if (item.value === null) {
        bytes += 4;
      } else if (typeof item.value === 'object') {
        // Very rough estimation for objects
        bytes += JSON.stringify(item.value).length * 2;
      }
      
      // Add overhead for expiry
      bytes += 8;
    });
    
    return bytes;
  }
}

export default CacheService; 