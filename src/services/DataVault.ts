import { BaseBlockchainService } from './baseBlockchainService';
import { toast } from 'react-hot-toast';

export interface DataVaultOptions {
  autoSync?: boolean;
  syncInterval?: number;
}

export class DataVault {
  private blockchain: BaseBlockchainService;
  private isSyncing: boolean = false;
  private syncTimer: NodeJS.Timeout | null = null;
  private options: DataVaultOptions;

  constructor(options: DataVaultOptions = {}) {
    this.blockchain = new BaseBlockchainService();
    this.options = {
      autoSync: options.autoSync ?? true,
      syncInterval: options.syncInterval ?? 300000, // 5 minutes default
    };
    
    if (this.options.autoSync) {
      this.startAutoSync();
    }
    
    // Register for blockchain events
    this.blockchain.onWorkoutLogsUpdated(() => {
      toast.success("Workout logs updated");
    });
    
    this.blockchain.onFoodHistoryUpdated(() => {
      toast.success("Food entries updated");
    });
    
    this.blockchain.onRewardsUpdated(() => {
      toast.success("Rewards updated");
    });
  }
  
  public async syncData(): Promise<boolean> {
    if (this.isSyncing) return false;
    
    try {
      this.isSyncing = true;
      toast.loading("Syncing data with blockchain...");
      
      // Simulate a sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get latest data from blockchain
      await this.blockchain.fetchWorkoutLogs();
      await this.blockchain.fetchFoodHistory();
      await this.blockchain.fetchAIInteractions();
      await this.blockchain.fetchRewards();
      
      toast.dismiss();
      toast.success("Data synchronized successfully");
      this.isSyncing = false;
      return true;
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to sync data");
      console.error("Data sync error:", error);
      this.isSyncing = false;
      return false;
    }
  }
  
  private startAutoSync(): void {
    if (this.syncTimer) clearInterval(this.syncTimer);
    
    this.syncTimer = setInterval(() => {
      this.syncData();
    }, this.options.syncInterval);
  }
  
  public stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }
  
  public async getWorkoutLogs() {
    return this.blockchain.fetchWorkoutLogs();
  }
  
  public async getFoodHistory() {
    return this.blockchain.fetchFoodHistory();
  }
  
  public async getAIInteractions() {
    return this.blockchain.fetchAIInteractions();
  }
  
  public async getRewards() {
    return this.blockchain.fetchRewards();
  }
  
  public dispose(): void {
    this.stopAutoSync();
  }
} 