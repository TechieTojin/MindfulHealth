import { toast } from "@/components/ui/use-toast";
import { createPublicClient, http } from 'viem';
import { base, baseGoerli } from 'viem/chains';

// Type definitions
export interface WorkoutLog {
  id: string;
  date: Date;
  type: string;
  duration: number;
  caloriesBurned: number;
  notes?: string;
}

export interface FoodEntry {
  id: string;
  date: Date;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface AIInteraction {
  id: string;
  date: Date;
  query: string;
  response: string;
  category: 'nutrition' | 'fitness' | 'mental' | 'general';
}

export interface Reward {
  id: string;
  date: Date;
  type: string;
  amount: number;
  reason: string;
}

type EventCallback<T> = (data: T) => void;
type DataType = 'workoutLogs' | 'foodHistory' | 'aiInteractions' | 'rewards' | 'all';

// Mock Base blockchain SDK - in a real application, this would be replaced with actual Base SDK
class BaseMockSDK {
  private static instance: BaseMockSDK;
  private isConnected: boolean = false;
  private walletAddress: string | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private dataCache: Map<string, any> = new Map();
  private verificationStatus: Map<string, boolean> = new Map();
  private syncTimestamps: Map<string, Date> = new Map();
  
  // Singleton pattern
  public static getInstance(): BaseMockSDK {
    if (!BaseMockSDK.instance) {
      BaseMockSDK.instance = new BaseMockSDK();
    }
    return BaseMockSDK.instance;
  }
  
  private constructor() {
    // Initialize with mock data
    this.dataCache.set('workout-logs', []);
    this.dataCache.set('food-history', []);
    this.dataCache.set('ai-interactions', []);
    this.dataCache.set('rewards', []);
    
    // Simulate blockchain verification
    setInterval(() => {
      this.verifyPendingData();
    }, 5000);
  }
  
  private verifyPendingData() {
    if (!this.isConnected) return;
    
    for (const [key, data] of this.dataCache.entries()) {
      if (Array.isArray(data)) {
        const hasChanges = data.some((item: any) => !item.verified);
        
        if (hasChanges) {
          const updatedData = data.map((item: any) => {
            // Random chance to verify pending items (80% chance)
            if (!item.verified && Math.random() > 0.2) {
              return { ...item, verified: true };
            }
            return item;
          });
          
          this.dataCache.set(key, updatedData);
          this.syncTimestamps.set(key, new Date());
          this.emit(`${key}-updated`, updatedData);
        }
      }
    }
  }
  
  public async connect(walletAddress?: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.walletAddress = walletAddress || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
        resolve(true);
        this.emit('connection-changed', true);
      }, 1500);
    });
  }
  
  public async disconnect(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = false;
        this.walletAddress = null;
        resolve(true);
        this.emit('connection-changed', false);
      }, 1000);
    });
  }
  
  public isWalletConnected(): boolean {
    return this.isConnected;
  }
  
  public getWalletAddress(): string | null {
    return this.walletAddress;
  }
  
  public async fetchData<T>(dataType: string): Promise<T[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.dataCache.get(dataType) || [];
        resolve(data as T[]);
      }, 800);
    });
  }
  
  public async storeData<T>(dataType: string, data: T): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentData = this.dataCache.get(dataType) || [];
        const newData = Array.isArray(data) ? [...data] : [...currentData, { ...data, verified: false, id: `${Date.now()}` }];
        this.dataCache.set(dataType, newData);
        this.syncTimestamps.set(dataType, new Date());
        this.emit(`${dataType}-updated`, newData);
        resolve(true);
      }, 1000);
    });
  }
  
  public async deleteData(dataType: string, id?: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (id) {
          const currentData = this.dataCache.get(dataType) || [];
          const newData = currentData.filter((item: any) => item.id !== id);
          this.dataCache.set(dataType, newData);
          this.syncTimestamps.set(dataType, new Date());
          this.emit(`${dataType}-updated`, newData);
        } else {
          this.dataCache.set(dataType, []);
          this.syncTimestamps.set(dataType, new Date());
          this.emit(`${dataType}-updated`, []);
        }
        resolve(true);
      }, 1200);
    });
  }
  
  public async syncWithBlockchain(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update all timestamps to simulate synchronization
        for (const key of this.dataCache.keys()) {
          this.syncTimestamps.set(key, new Date());
        }
        resolve(true);
        this.emit('sync-completed', true);
      }, 2000);
    });
  }
  
  public getLastSyncTimestamp(dataType: string): Date | null {
    return this.syncTimestamps.get(dataType) || null;
  }
  
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }
  
  public off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event) || [];
    this.listeners.set(
      event,
      callbacks.filter((cb) => cb !== callback)
    );
  }
  
  private emit(event: string, data: any): void {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }
}

// Main Base Blockchain Service
export class BaseBlockchainService {
  private sdk: BaseMockSDK;
  private isTestnet: boolean;
  private client: any;
  private lastSyncTimestamps: Record<DataType, Date | null> = {
    workoutLogs: null,
    foodHistory: null,
    aiInteractions: null,
    rewards: null,
    all: null
  };
  
  // Event listeners
  private workoutLogsListeners: EventCallback<WorkoutLog[]>[] = [];
  private foodHistoryListeners: EventCallback<FoodEntry[]>[] = [];
  private aiInteractionsListeners: EventCallback<AIInteraction[]>[] = [];
  private rewardsListeners: EventCallback<Reward[]>[] = [];
  private syncCompletedListeners: EventCallback<boolean>[] = [];
  
  // Mock data
  private mockWorkoutLogs: WorkoutLog[] = [];
  private mockFoodHistory: FoodEntry[] = [];
  private mockAIInteractions: AIInteraction[] = [];
  private mockRewards: Reward[] = [];
  
  private wsConnection: any = null;
  private realtimeEnabled: boolean = false;
  
  constructor(isTestnet = true) {
    this.isTestnet = isTestnet;
    this.sdk = BaseMockSDK.getInstance();
    
    // Initialize the client with the appropriate network
    this.client = createPublicClient({
      chain: isTestnet ? baseGoerli : base,
      transport: http()
    });
    
    this.initializeMockData();
  }
  
  private initializeMockData() {
    // Generate mock workout logs
    this.mockWorkoutLogs = [
      {
        id: '1',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        type: 'Running',
        duration: 30,
        caloriesBurned: 350,
        notes: 'Morning run at the park'
      },
      {
        id: '2',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        type: 'Weight Training',
        duration: 45,
        caloriesBurned: 280,
        notes: 'Upper body focus'
      },
      {
        id: '3',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: 'Yoga',
        duration: 60,
        caloriesBurned: 200,
        notes: 'Relaxing session'
      }
    ];
    
    // Generate mock food entries
    this.mockFoodHistory = [
      {
        id: '1',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        name: 'Grilled Chicken Salad',
        calories: 450,
        protein: 40,
        carbs: 20,
        fat: 15,
        mealType: 'lunch'
      },
      {
        id: '2',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        name: 'Protein Smoothie',
        calories: 320,
        protein: 28,
        carbs: 35,
        fat: 8,
        mealType: 'breakfast'
      },
      {
        id: '3',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        name: 'Salmon with Vegetables',
        calories: 550,
        protein: 45,
        carbs: 25,
        fat: 20,
        mealType: 'dinner'
      }
    ];
    
    // Generate mock AI interactions
    this.mockAIInteractions = [
      {
        id: '1',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        query: 'What are good post-workout meals?',
        response: 'Great post-workout meals should include protein and carbs. Options include: grilled chicken with rice, protein smoothie with fruit, Greek yogurt with berries, or tuna sandwich on whole grain bread.',
        category: 'nutrition'
      },
      {
        id: '2',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        query: 'How do I improve my running endurance?',
        response: 'To improve running endurance, gradually increase distance, incorporate interval training, focus on proper form, allow recovery time, maintain proper nutrition, and stay hydrated.',
        category: 'fitness'
      }
    ];
    
    // Generate mock rewards
    this.mockRewards = [
      {
        id: '1',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        type: 'MindfulToken',
        amount: 50,
        reason: 'Completed first workout'
      },
      {
        id: '2',
        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        type: 'MindfulToken',
        amount: 75,
        reason: 'Logged meals for 7 consecutive days'
      },
      {
        id: '3',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        type: 'MindfulToken',
        amount: 100,
        reason: 'Achieved weekly fitness goal'
      }
    ];
    
    // Set initial timestamps
    this.lastSyncTimestamps.all = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.lastSyncTimestamps.workoutLogs = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.lastSyncTimestamps.foodHistory = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.lastSyncTimestamps.aiInteractions = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.lastSyncTimestamps.rewards = new Date(Date.now() - 24 * 60 * 60 * 1000);
  }
  
  public async connectWallet(): Promise<boolean> {
    try {
      const result = await this.sdk.connect();
      if (result) {
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to Base blockchain",
        });
      }
      return result;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect to Base blockchain",
      });
      return false;
    }
  }
  
  public async disconnectWallet(): Promise<boolean> {
    try {
      const result = await this.sdk.disconnect();
      if (result) {
        toast({
          title: "Wallet Disconnected",
          description: "Successfully disconnected from Base blockchain",
        });
      }
      return result;
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      return false;
    }
  }
  
  public isConnected(): boolean {
    return this.sdk.isWalletConnected();
  }
  
  public getWalletAddress(): string | null {
    return this.sdk.getWalletAddress();
  }
  
  public async fetchWorkoutLogs(): Promise<WorkoutLog[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.mockWorkoutLogs]);
      }, 800);
    });
  }
  
  public async fetchFoodHistory(): Promise<FoodEntry[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.mockFoodHistory]);
      }, 600);
    });
  }
  
  public async fetchAIInteractions(): Promise<AIInteraction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.mockAIInteractions]);
      }, 500);
    });
  }
  
  public async fetchRewards(): Promise<Reward[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.mockRewards]);
      }, 700);
    });
  }
  
  public async storeWorkoutLog(log: any): Promise<boolean> {
    return this.sdk.storeData<any>('workout-logs', log);
  }
  
  public async storeFoodEntry(entry: any): Promise<boolean> {
    return this.sdk.storeData<any>('food-history', entry);
  }
  
  public async storeAIInteraction(interaction: any): Promise<boolean> {
    return this.sdk.storeData<any>('ai-interactions', interaction);
  }
  
  public async storeReward(reward: any): Promise<boolean> {
    return this.sdk.storeData<any>('rewards', reward);
  }
  
  public async deleteWorkoutLogs(id?: string): Promise<boolean> {
    return this.sdk.deleteData('workout-logs', id);
  }
  
  public async deleteFoodHistory(id?: string): Promise<boolean> {
    return this.sdk.deleteData('food-history', id);
  }
  
  public async deleteAIInteractions(id?: string): Promise<boolean> {
    return this.sdk.deleteData('ai-interactions', id);
  }
  
  public async deleteRewards(id?: string): Promise<boolean> {
    return this.sdk.deleteData('rewards', id);
  }
  
  public async syncWithBlockchain(): Promise<boolean> {
    try {
      const result = await this.sdk.syncWithBlockchain();
      if (result) {
        toast({
          title: "Sync Completed",
          description: "Data synchronized with Base blockchain",
        });
      }
      return result;
    } catch (error) {
      console.error("Error syncing with blockchain:", error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Failed to synchronize with Base blockchain",
      });
      return false;
    }
  }
  
  public getLastSyncTimestamp(dataType: DataType): Date | null {
    return this.lastSyncTimestamps[dataType];
  }
  
  public onWorkoutLogsUpdated(callback: EventCallback<WorkoutLog[]>) {
    this.workoutLogsListeners.push(callback);
  }
  
  public onFoodHistoryUpdated(callback: EventCallback<FoodEntry[]>) {
    this.foodHistoryListeners.push(callback);
  }
  
  public onAIInteractionsUpdated(callback: EventCallback<AIInteraction[]>) {
    this.aiInteractionsListeners.push(callback);
  }
  
  public onRewardsUpdated(callback: EventCallback<Reward[]>) {
    this.rewardsListeners.push(callback);
  }
  
  public onSyncCompleted(callback: EventCallback<boolean>) {
    this.syncCompletedListeners.push(callback);
  }
  
  public onConnectionChanged(callback: (connected: boolean) => void): void {
    this.sdk.on('connection-changed', callback);
  }
  
  public offWorkoutLogsUpdated(callback: EventCallback<WorkoutLog[]>) {
    this.workoutLogsListeners = this.workoutLogsListeners.filter(cb => cb !== callback);
  }
  
  public offFoodHistoryUpdated(callback: EventCallback<FoodEntry[]>) {
    this.foodHistoryListeners = this.foodHistoryListeners.filter(cb => cb !== callback);
  }
  
  public offAIInteractionsUpdated(callback: EventCallback<AIInteraction[]>) {
    this.aiInteractionsListeners = this.aiInteractionsListeners.filter(cb => cb !== callback);
  }
  
  public offRewardsUpdated(callback: EventCallback<Reward[]>) {
    this.rewardsListeners = this.rewardsListeners.filter(cb => cb !== callback);
  }
  
  public offSyncCompleted(callback: EventCallback<boolean>) {
    this.syncCompletedListeners = this.syncCompletedListeners.filter(cb => cb !== callback);
  }
  
  public offConnectionChanged(callback: (connected: boolean) => void): void {
    this.sdk.off('connection-changed', callback);
  }
  
  /**
   * Start listening for real-time updates from the blockchain
   */
  public startRealtimeUpdates(): boolean {
    if (this.realtimeEnabled) return true;
    
    try {
      console.log("Starting real-time blockchain updates");
      
      // In a real implementation, this would connect to a real WebSocket
      // For the mock implementation, we'll simulate updates
      this.wsConnection = {
        connected: true,
        close: () => {
          this.wsConnection.connected = false;
          console.log("WebSocket connection closed");
        }
      };
      
      // Simulate real-time updates with random intervals
      this.simulateRealtimeUpdates();
      
      this.realtimeEnabled = true;
      return true;
    } catch (error) {
      console.error("Failed to start real-time updates:", error);
      return false;
    }
  }
  
  /**
   * Stop listening for real-time updates
   */
  public stopRealtimeUpdates(): boolean {
    if (!this.realtimeEnabled) return true;
    
    try {
      if (this.wsConnection) {
        this.wsConnection.close();
        this.wsConnection = null;
      }
      
      this.realtimeEnabled = false;
      return true;
    } catch (error) {
      console.error("Failed to stop real-time updates:", error);
      return false;
    }
  }
  
  /**
   * Check if real-time updates are enabled
   */
  public isRealtimeEnabled(): boolean {
    return this.realtimeEnabled;
  }
  
  /**
   * Simulate real-time updates from the blockchain
   * This would be replaced with actual WebSocket connection in production
   */
  private simulateRealtimeUpdates(): void {
    // Simulate workout updates
    setInterval(() => {
      if (!this.realtimeEnabled || !this.wsConnection?.connected) return;
      
      const rand = Math.random();
      if (rand > 0.8) { // 20% chance of a workout update
        const currentDate = new Date();
        const newWorkout: WorkoutLog = {
          id: `workout-${Date.now()}`,
          date: currentDate,
          type: ["Running", "HIIT", "Strength Training", "Yoga", "Cycling"][Math.floor(Math.random() * 5)],
          duration: Math.floor(Math.random() * 60) + 15,
          caloriesBurned: Math.floor(Math.random() * 400) + 100,
          notes: `${Math.floor(Math.random() * 10) + 1}` // random exercise count
        };
        
        this.mockWorkoutLogs = [newWorkout, ...this.mockWorkoutLogs];
        this.workoutLogsListeners.forEach(callback => callback([...this.mockWorkoutLogs]));
      }
    }, 5000);
    
    // Simulate food updates
    setInterval(() => {
      if (!this.realtimeEnabled || !this.wsConnection?.connected) return;
      
      const rand = Math.random();
      if (rand > 0.75) { // 25% chance of a food update
        const currentDate = new Date();
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
        const newFood: FoodEntry = {
          id: `food-${Date.now()}`,
          date: currentDate,
          name: ["Salad", "Protein Shake", "Chicken Bowl", "Smoothie", "Steak"][Math.floor(Math.random() * 5)],
          calories: Math.floor(Math.random() * 500) + 100,
          protein: Math.floor(Math.random() * 30) + 5,
          carbs: Math.floor(Math.random() * 50) + 10,
          fat: Math.floor(Math.random() * 20) + 2,
          mealType: mealTypes[Math.floor(Math.random() * mealTypes.length)]
        };
        
        this.mockFoodHistory = [newFood, ...this.mockFoodHistory];
        this.foodHistoryListeners.forEach(callback => callback([...this.mockFoodHistory]));
      }
    }, 7500);
    
    // Simulate AI interactions
    setInterval(() => {
      if (!this.realtimeEnabled || !this.wsConnection?.connected) return;
      
      const rand = Math.random();
      if (rand > 0.85) { // 15% chance of an AI interaction
        const currentDate = new Date();
        const categories = ['nutrition', 'fitness', 'mental', 'general'] as const;
        
        const queries = [
          "How can I improve my recovery time?",
          "What should I eat before a morning workout?",
          "How can I get better sleep?",
          "Is it better to run in the morning or evening?",
          "How many rest days should I take per week?"
        ];
        
        const responses = [
          "Focus on proper hydration, nutrition, and sleep. Consider active recovery techniques like light movement and stretching.",
          "Choose easily digestible carbs and moderate protein about 30-60 minutes before your workout.",
          "Establish a consistent sleep schedule, avoid screens before bed, and create a relaxing bedtime routine.",
          "It depends on your goals and natural rhythm. Morning runs may boost metabolism, while evening runs might offer performance benefits.",
          "Most people benefit from 2-3 rest days per week, but this varies based on fitness level and intensity."
        ];
        
        const queryIndex = Math.floor(Math.random() * queries.length);
        
        const newAIInteraction: AIInteraction = {
          id: `ai-${Date.now()}`,
          date: currentDate,
          query: queries[queryIndex],
          response: responses[queryIndex],
          category: categories[Math.floor(Math.random() * categories.length)]
        };
        
        this.mockAIInteractions = [newAIInteraction, ...this.mockAIInteractions];
        this.aiInteractionsListeners.forEach(callback => callback([...this.mockAIInteractions]));
      }
    }, 11000);
    
    // Simulate rewards
    setInterval(() => {
      if (!this.realtimeEnabled || !this.wsConnection?.connected) return;
      
      const rand = Math.random();
      if (rand > 0.9) { // 10% chance of a reward
        const currentDate = new Date();
        
        const rewardTypes = [
          "Workout Streak",
          "Fitness Milestone",
          "Health Achievement",
          "Nutrition Badge",
          "Wellness Reward"
        ];
        
        const reasons = [
          "Completed 5 consecutive workouts",
          "Reached 10,000 steps daily for a week",
          "Maintained healthy sleep schedule for 14 days",
          "Logged all meals for 7 consecutive days",
          "Completed 3 meditation sessions"
        ];
        
        const index = Math.floor(Math.random() * rewardTypes.length);
        
        const newReward: Reward = {
          id: `reward-${Date.now()}`,
          date: currentDate,
          type: rewardTypes[index],
          amount: Math.floor(Math.random() * 50) + 10,
          reason: reasons[index]
        };
        
        this.mockRewards = [newReward, ...this.mockRewards];
        this.rewardsListeners.forEach(callback => callback([...this.mockRewards]));
      }
    }, 15000);
  }
}

// Export a singleton instance
export const baseBlockchainService = new BaseBlockchainService(); 