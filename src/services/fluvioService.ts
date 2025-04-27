/**
 * Mock Fluvio Streaming Service
 * This is a cover-up implementation with no actual connection to Fluvio
 */

interface FluvioRecord {
  key?: string;
  value: string;
  timestamp: number;
  partition: number;
  offset: number;
}

interface TopicConfig {
  name: string;
  partitions: number;
  replicationFactor: number;
}

interface ConsumerConfig {
  groupId: string;
  autoCommit: boolean;
  fetchMaxBytes?: number;
}

interface ProducerConfig {
  compression?: 'none' | 'gzip' | 'snappy' | 'lz4';
  acks?: 'none' | 'leader' | 'all';
}

type FluvioCallback = (error: Error | null, data?: any) => void;

class FluvioService {
  private clusters: string[] = ['mock-cluster-1'];
  private topics: Map<string, FluvioRecord[]> = new Map();
  private consumers: Map<string, { topic: string, offset: number }> = new Map();
  
  constructor() {
    // Initialize with some mock topics and data
    this.initializeMockData();
  }
  
  private initializeMockData() {
    // Create some mock topics with data
    this.topics.set('health-metrics', [
      {
        key: 'user-1',
        value: JSON.stringify({ heart_rate: 72, steps: 8500, calories: 1200 }),
        timestamp: Date.now() - 3600000,
        partition: 0,
        offset: 0
      },
      {
        key: 'user-2',
        value: JSON.stringify({ heart_rate: 68, steps: 10200, calories: 1450 }),
        timestamp: Date.now() - 1800000,
        partition: 0,
        offset: 1
      }
    ]);
    
    this.topics.set('system-logs', [
      {
        key: 'server-1',
        value: JSON.stringify({ level: 'info', message: 'System startup complete' }),
        timestamp: Date.now() - 86400000,
        partition: 0,
        offset: 0
      },
      {
        key: 'server-1',
        value: JSON.stringify({ level: 'error', message: 'Database connection failed' }),
        timestamp: Date.now() - 43200000,
        partition: 0,
        offset: 1
      }
    ]);
  }
  
  /**
   * Connect to a Fluvio cluster
   */
  connect(options: { endpoint: string }): Promise<void> {
    return new Promise((resolve) => {
      // Simulate connection delay
      setTimeout(() => {
        console.log(`Mock connecting to Fluvio at: ${options.endpoint}`);
        resolve();
      }, 500);
    });
  }
  
  /**
   * Disconnect from a Fluvio cluster
   */
  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
  }
  
  /**
   * Create a new topic
   */
  createTopic(config: TopicConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.topics.has(config.name)) {
          reject(new Error(`Topic ${config.name} already exists`));
          return;
        }
        
        this.topics.set(config.name, []);
        console.log(`Mock topic created: ${config.name} with ${config.partitions} partitions`);
        resolve();
      }, 300);
    });
  }
  
  /**
   * Delete a topic
   */
  deleteTopic(topicName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.topics.has(topicName)) {
          reject(new Error(`Topic ${topicName} doesn't exist`));
          return;
        }
        
        this.topics.delete(topicName);
        console.log(`Mock topic deleted: ${topicName}`);
        resolve();
      }, 300);
    });
  }
  
  /**
   * List all available topics
   */
  listTopics(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from(this.topics.keys()));
      }, 200);
    });
  }
  
  /**
   * Create a producer for a topic
   */
  producer(config?: ProducerConfig) {
    return {
      connect: (): Promise<void> => Promise.resolve(),
      
      send: (topic: string, messages: Array<{ key?: string, value: string }>): Promise<void> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (!this.topics.has(topic)) {
              this.topics.set(topic, []);
            }
            
            const records = this.topics.get(topic)!;
            
            messages.forEach((message, index) => {
              records.push({
                key: message.key,
                value: message.value,
                timestamp: Date.now(),
                partition: 0,
                offset: records.length
              });
            });
            
            console.log(`Mock produced ${messages.length} messages to ${topic}`);
            resolve();
          }, 250);
        });
      },
      
      disconnect: (): Promise<void> => Promise.resolve()
    };
  }
  
  /**
   * Create a consumer for a topic
   */
  consumer(config: ConsumerConfig) {
    const consumerId = `consumer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      connect: (): Promise<void> => Promise.resolve(),
      
      subscribe: (topic: string): Promise<void> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.consumers.set(consumerId, { topic, offset: 0 });
            console.log(`Mock consumer subscribed to topic: ${topic}`);
            resolve();
          }, 200);
        });
      },
      
      consume: (options: { autoCommit: boolean }): Promise<FluvioRecord[]> => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const consumer = this.consumers.get(consumerId);
            if (!consumer) {
              reject(new Error('Consumer not subscribed to any topic'));
              return;
            }
            
            const records = this.topics.get(consumer.topic) || [];
            const batch = records.slice(consumer.offset, consumer.offset + 10);
            
            if (options.autoCommit) {
              consumer.offset += batch.length;
            }
            
            resolve(batch);
          }, 300);
        });
      },
      
      commitOffset: (topic: string, partition: number, offset: number): Promise<void> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const consumer = this.consumers.get(consumerId);
            if (consumer && consumer.topic === topic) {
              consumer.offset = offset + 1;
            }
            resolve();
          }, 150);
        });
      },
      
      disconnect: (): Promise<void> => {
        return new Promise((resolve) => {
          this.consumers.delete(consumerId);
          resolve();
        });
      }
    };
  }
}

export default FluvioService; 