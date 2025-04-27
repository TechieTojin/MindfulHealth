/**
 * Mock Message Queue Service
 * Simulates a RabbitMQ-like message broker without actual connection
 */

type MessageHandler = (message: any) => Promise<void>;

interface MQConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  vhost?: string;
  heartbeat?: number;
}

interface QueueConfig {
  durable?: boolean;
  autoDelete?: boolean;
  exclusive?: boolean;
  arguments?: Record<string, any>;
}

interface ExchangeConfig {
  type: 'direct' | 'fanout' | 'topic' | 'headers';
  durable?: boolean;
  autoDelete?: boolean;
  internal?: boolean;
  arguments?: Record<string, any>;
}

interface PublishOptions {
  persistent?: boolean;
  expiration?: string;
  contentType?: string;
  contentEncoding?: string;
  headers?: Record<string, any>;
  priority?: number;
  correlationId?: string;
  replyTo?: string;
  messageId?: string;
  timestamp?: number;
  appId?: string;
}

interface ConsumeOptions {
  noAck?: boolean;
  exclusive?: boolean;
  priority?: number;
  prefetch?: number;
}

interface Message {
  content: any;
  properties: PublishOptions;
  fields: {
    exchange: string;
    routingKey: string;
    deliveryTag: number;
    redelivered: boolean;
  };
}

class MQService {
  private config: MQConfig;
  private isConnected: boolean = false;
  private queues: Map<string, any[]> = new Map();
  private exchanges: Map<string, { config: ExchangeConfig, bindings: { queue: string, pattern: string }[] }> = new Map();
  private consumers: Map<string, { handler: MessageHandler, options: ConsumeOptions }[]> = new Map();
  private deliveryTagCounter: number = 1;
  
  constructor(config: MQConfig) {
    this.config = {
      ...config,
      vhost: config.vhost || '/',
      heartbeat: config.heartbeat || 60
    };
    
    // Start message delivery process
    setInterval(() => this.processQueues(), 100);
  }
  
  /**
   * Connect to the message broker
   */
  async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mock MQ connecting to ${this.config.host}:${this.config.port}/${this.config.vhost}`);
        this.isConnected = true;
        resolve(true);
      }, 400);
    });
  }
  
  /**
   * Disconnect from the message broker
   */
  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = false;
        resolve();
      }, 200);
    });
  }
  
  /**
   * Assert that a queue exists, creating it if necessary
   */
  async assertQueue(queue: string, options: QueueConfig = {}): Promise<{ queue: string, messageCount: number }> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.queues.has(queue)) {
          this.queues.set(queue, []);
          this.consumers.set(queue, []);
          console.log(`Mock MQ created queue: ${queue}`);
        }
        
        const messageCount = this.queues.get(queue)?.length || 0;
        
        resolve({
          queue,
          messageCount
        });
      }, 150);
    });
  }
  
  /**
   * Assert that an exchange exists, creating it if necessary
   */
  async assertExchange(exchange: string, type: ExchangeConfig['type'], options: Omit<ExchangeConfig, 'type'> = {}): Promise<{ exchange: string }> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.exchanges.has(exchange)) {
          this.exchanges.set(exchange, {
            config: { type, ...options },
            bindings: []
          });
          console.log(`Mock MQ created exchange: ${exchange} (${type})`);
        }
        
        resolve({ exchange });
      }, 150);
    });
  }
  
  /**
   * Bind a queue to an exchange
   */
  async bindQueue(queue: string, exchange: string, routingKey: string): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.queues.has(queue)) {
          reject(new Error(`Queue ${queue} does not exist`));
          return;
        }
        
        if (!this.exchanges.has(exchange)) {
          reject(new Error(`Exchange ${exchange} does not exist`));
          return;
        }
        
        const exchangeData = this.exchanges.get(exchange)!;
        exchangeData.bindings.push({ queue, pattern: routingKey });
        
        console.log(`Mock MQ bound queue ${queue} to exchange ${exchange} with routing key ${routingKey}`);
        resolve();
      }, 150);
    });
  }
  
  /**
   * Publish a message to an exchange
   */
  async publish(exchange: string, routingKey: string, content: any, options: PublishOptions = {}): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.exchanges.has(exchange)) {
          reject(new Error(`Exchange ${exchange} does not exist`));
          return;
        }
        
        const exchangeData = this.exchanges.get(exchange)!;
        const { type } = exchangeData.config;
        const timestamp = options.timestamp || Date.now();
        
        let targetQueues: string[] = [];
        
        // Route messages based on exchange type
        if (type === 'direct') {
          targetQueues = exchangeData.bindings
            .filter(binding => binding.pattern === routingKey)
            .map(binding => binding.queue);
        } else if (type === 'fanout') {
          targetQueues = exchangeData.bindings.map(binding => binding.queue);
        } else if (type === 'topic') {
          targetQueues = exchangeData.bindings
            .filter(binding => this.matchTopicPattern(binding.pattern, routingKey))
            .map(binding => binding.queue);
        } else if (type === 'headers') {
          // Headers exchange not fully implemented in this mock
          targetQueues = exchangeData.bindings.map(binding => binding.queue);
        }
        
        // Deliver message to target queues
        targetQueues.forEach(queueName => {
          if (this.queues.has(queueName)) {
            const queue = this.queues.get(queueName)!;
            
            const message = {
              content,
              properties: {
                ...options,
                timestamp
              },
              fields: {
                exchange,
                routingKey,
                deliveryTag: this.deliveryTagCounter++,
                redelivered: false
              }
            };
            
            queue.push(message);
            console.log(`Mock MQ published message to queue ${queueName} via exchange ${exchange}`);
          }
        });
        
        resolve(true);
      }, 100);
    });
  }
  
  /**
   * Send a message directly to a queue
   */
  async sendToQueue(queue: string, content: any, options: PublishOptions = {}): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.queues.has(queue)) {
          reject(new Error(`Queue ${queue} does not exist`));
          return;
        }
        
        const queueData = this.queues.get(queue)!;
        const timestamp = options.timestamp || Date.now();
        
        const message = {
          content,
          properties: {
            ...options,
            timestamp
          },
          fields: {
            exchange: '',
            routingKey: queue,
            deliveryTag: this.deliveryTagCounter++,
            redelivered: false
          }
        };
        
        queueData.push(message);
        console.log(`Mock MQ sent message directly to queue ${queue}`);
        resolve(true);
      }, 100);
    });
  }
  
  /**
   * Start consuming messages from a queue
   */
  async consume(queue: string, handler: MessageHandler, options: ConsumeOptions = {}): Promise<{ consumerTag: string }> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.queues.has(queue)) {
          reject(new Error(`Queue ${queue} does not exist`));
          return;
        }
        
        if (!this.consumers.has(queue)) {
          this.consumers.set(queue, []);
        }
        
        const consumers = this.consumers.get(queue)!;
        consumers.push({ handler, options });
        
        const consumerTag = `ctag-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        console.log(`Mock MQ consumer started for queue ${queue}`);
        resolve({ consumerTag });
      }, 150);
    });
  }
  
  /**
   * Acknowledge a message
   */
  async ack(message: Message): Promise<void> {
    return Promise.resolve();
  }
  
  /**
   * Reject a message
   */
  async reject(message: Message, requeue: boolean = false): Promise<void> {
    return Promise.resolve();
  }
  
  /**
   * Get the count of messages in a queue
   */
  async getMessageCount(queue: string): Promise<number> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.queues.has(queue)) {
          reject(new Error(`Queue ${queue} does not exist`));
          return;
        }
        
        const count = this.queues.get(queue)?.length || 0;
        resolve(count);
      }, 50);
    });
  }
  
  /**
   * Get the count of consumers for a queue
   */
  async getConsumerCount(queue: string): Promise<number> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.consumers.has(queue)) {
          reject(new Error(`Queue ${queue} does not exist`));
          return;
        }
        
        const count = this.consumers.get(queue)?.length || 0;
        resolve(count);
      }, 50);
    });
  }
  
  /**
   * Check if connection is established
   */
  isConnectedToMQ(): boolean {
    return this.isConnected;
  }
  
  /**
   * Process messages in queues and deliver to consumers
   */
  private async processQueues(): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    
    // For each queue with consumers
    for (const [queueName, consumersList] of this.consumers.entries()) {
      if (consumersList.length === 0) {
        continue; // No consumers for this queue
      }
      
      const queue = this.queues.get(queueName);
      if (!queue || queue.length === 0) {
        continue; // No messages in queue
      }
      
      // Get oldest message
      const message = queue.shift();
      
      // Find a consumer to handle the message
      const consumer = consumersList[0]; // Simple round-robin could be improved
      
      try {
        // Process the message
        await consumer.handler(message);
        
        // Auto-ack if needed
        if (consumer.options.noAck) {
          // Message is auto-acknowledged
        } else {
          // Manual ack is required
        }
      } catch (error) {
        console.error(`Mock MQ error processing message: ${error}`);
        
        // Requeue the message
        if (!(consumer.options.noAck)) {
          message.fields.redelivered = true;
          queue.unshift(message);
        }
      }
    }
  }
  
  /**
   * Match a topic pattern to a routing key
   * Supports * (match exactly one word) and # (match zero or more words)
   */
  private matchTopicPattern(pattern: string, routingKey: string): boolean {
    // Convert pattern to regex
    const patternRegex = pattern
      .replace(/\./g, '\\.') // Escape dots
      .replace(/\*/g, '([^\\.]+)') // * matches exactly one word
      .replace(/\#/g, '([^\\.]*(?:\\.[-_a-zA-Z0-9]+)*)'); // # matches zero or more words
    
    const regex = new RegExp(`^${patternRegex}$`);
    return regex.test(routingKey);
  }
}

export default MQService; 