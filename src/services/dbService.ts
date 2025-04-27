/**
 * Mock Database Service
 * Simulates SQL database operations without actual connection
 */

type QueryResult<T> = {
  rows: T[];
  rowCount: number;
  duration: number;
};

interface ConnectionConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  connectionTimeout?: number;
}

interface DatabasePool {
  totalConnections: number;
  usedConnections: number;
  waitingConnections: number;
  idleConnections: number;
}

class DBService {
  private config: ConnectionConfig;
  private isConnected: boolean = false;
  private mockData: Map<string, any[]> = new Map();
  private poolInfo: DatabasePool = {
    totalConnections: 10,
    usedConnections: 0,
    waitingConnections: 0,
    idleConnections: 10
  };
  
  constructor(config: ConnectionConfig) {
    this.config = config;
    this.initializeMockData();
  }
  
  private initializeMockData() {
    // Initialize with mock tables and data
    this.mockData.set('users', [
      { id: 1, username: 'john_doe', email: 'john@example.com', password_hash: '$2a$10$XpC8gfjdfgkdsjfhkasdhf', created_at: '2023-01-15T10:30:00Z', role: 'user' },
      { id: 2, username: 'jane_smith', email: 'jane@example.com', password_hash: '$2a$10$ZxGjreqoiweruow934khsf', created_at: '2023-02-20T09:15:00Z', role: 'admin' }
    ]);
    
    this.mockData.set('health_metrics', [
      { id: 1, user_id: 1, date: '2023-05-15', steps: 8742, calories_burned: 456, active_minutes: 65, heart_rate_avg: 72 },
      { id: 2, user_id: 1, date: '2023-05-16', steps: 10234, calories_burned: 523, active_minutes: 78, heart_rate_avg: 68 },
      { id: 3, user_id: 2, date: '2023-05-15', steps: 7532, calories_burned: 380, active_minutes: 55, heart_rate_avg: 75 }
    ]);
    
    this.mockData.set('food_entries', [
      { id: 1, user_id: 1, date: '2023-05-15', food_name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, meal_type: 'snack' },
      { id: 2, user_id: 1, date: '2023-05-15', food_name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, meal_type: 'lunch' },
      { id: 3, user_id: 1, date: '2023-05-15', food_name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, meal_type: 'lunch' }
    ]);
    
    this.mockData.set('workouts', [
      { id: 1, user_id: 1, date: '2023-05-15', type: 'running', duration: 30, calories_burned: 320, notes: 'Morning jog' },
      { id: 2, user_id: 1, date: '2023-05-17', type: 'weight_training', duration: 45, calories_burned: 280, notes: 'Upper body' },
      { id: 3, user_id: 2, date: '2023-05-16', type: 'yoga', duration: 60, calories_burned: 200, notes: 'Evening yoga class' }
    ]);
    
    this.mockData.set('ai_interactions', [
      { id: 1, user_id: 1, timestamp: '2023-05-15T08:30:00Z', query: 'How can I improve my sleep?', response: 'To improve sleep, maintain a consistent schedule, create a relaxing bedtime routine, and avoid screens before bed.', category: 'wellness' },
      { id: 2, user_id: 1, timestamp: '2023-05-16T14:15:00Z', query: 'What\'s a good post-workout meal?', response: 'A good post-workout meal includes protein for muscle recovery and carbs to replenish energy, such as chicken with rice or a protein smoothie with fruit.', category: 'nutrition' }
    ]);
  }
  
  /**
   * Connect to the database
   */
  async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mock DB connecting to ${this.config.host}:${this.config.port}/${this.config.database}`);
        this.isConnected = true;
        this.poolInfo.usedConnections = 1;
        this.poolInfo.idleConnections = 9;
        resolve(true);
      }, 300);
    });
  }
  
  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = false;
        this.poolInfo.usedConnections = 0;
        this.poolInfo.idleConnections = 10;
        resolve();
      }, 200);
    });
  }
  
  /**
   * Execute a SQL query
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    this.poolInfo.usedConnections++;
    this.poolInfo.idleConnections--;
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log(`Mock DB executing: ${sql}`);
          console.log(`With params: ${params.join(', ')}`);
          
          const result = this.processMockQuery<T>(sql, params);
          
          this.poolInfo.usedConnections--;
          this.poolInfo.idleConnections++;
          
          resolve({
            rows: result,
            rowCount: result.length,
            duration: Math.random() * 50 + 5 // Random duration between 5-55ms
          });
        } catch (error) {
          this.poolInfo.usedConnections--;
          this.poolInfo.idleConnections++;
          reject(error);
        }
      }, Math.random() * 100 + 50); // Random delay between 50-150ms
    });
  }
  
  /**
   * Get database pool status
   */
  getPoolStatus(): DatabasePool {
    return { ...this.poolInfo };
  }
  
  /**
   * Check if database is connected
   */
  isConnectedToDatabase(): boolean {
    return this.isConnected;
  }
  
  /**
   * Process the mock SQL query and return appropriate results
   */
  private processMockQuery<T>(sql: string, params: any[]): T[] {
    // Very basic SQL parsing - in a real implementation this would be much more robust
    sql = sql.toLowerCase().trim();
    
    // Check if it's a SELECT query
    if (sql.startsWith('select')) {
      return this.handleSelectQuery<T>(sql, params);
    }
    
    // Check if it's an INSERT query
    if (sql.startsWith('insert')) {
      return this.handleInsertQuery<T>(sql, params);
    }
    
    // Check if it's an UPDATE query
    if (sql.startsWith('update')) {
      return this.handleUpdateQuery<T>(sql, params);
    }
    
    // Check if it's a DELETE query
    if (sql.startsWith('delete')) {
      return this.handleDeleteQuery<T>(sql, params);
    }
    
    // Default empty response for other queries
    return [] as T[];
  }
  
  private handleSelectQuery<T>(sql: string, params: any[]): T[] {
    // Extract table name - very basic implementation
    const fromMatch = sql.match(/from\s+(\w+)/i);
    if (!fromMatch || !fromMatch[1]) {
      return [] as T[];
    }
    
    const tableName = fromMatch[1];
    const tableData = this.mockData.get(tableName) || [];
    
    // Very basic WHERE clause handling
    if (sql.includes('where')) {
      const whereMatch = sql.match(/where\s+(.*?)(?:order by|group by|limit|$)/i);
      if (whereMatch && whereMatch[1]) {
        // This is an extremely simple parser for demo only
        // Real implementation would be much more complex
        const whereClause = whereMatch[1].trim();
        
        // Support for basic conditions like "id = ?" or "user_id = ?"
        const conditionMatch = whereClause.match(/(\w+)\s*=\s*\?/i);
        if (conditionMatch && conditionMatch[1] && params.length > 0) {
          const field = conditionMatch[1];
          const value = params[0];
          
          return tableData.filter(row => row[field] == value) as T[];
        }
      }
    }
    
    // If no WHERE clause or parsing failed, return all rows
    return [...tableData] as T[];
  }
  
  private handleInsertQuery<T>(sql: string, params: any[]): T[] {
    // Extract table name
    const insertMatch = sql.match(/insert\s+into\s+(\w+)/i);
    if (!insertMatch || !insertMatch[1]) {
      return [] as T[];
    }
    
    const tableName = insertMatch[1];
    const tableData = this.mockData.get(tableName) || [];
    
    // Create a new ID (simple auto-increment)
    const newId = Math.max(0, ...tableData.map(row => row.id || 0)) + 1;
    
    // Extract column names
    const columnsMatch = sql.match(/\(([^)]+)\)/i);
    if (columnsMatch && columnsMatch[1]) {
      const columns = columnsMatch[1].split(',').map(col => col.trim());
      
      // Create a new record
      const newRecord: any = { id: newId };
      
      // Add values from params
      columns.forEach((col, index) => {
        if (index < params.length) {
          newRecord[col] = params[index];
        }
      });
      
      // Add timestamp if needed
      if (columns.includes('created_at') && !newRecord.created_at) {
        newRecord.created_at = new Date().toISOString();
      }
      
      // Add to mock database
      tableData.push(newRecord);
      this.mockData.set(tableName, tableData);
      
      return [newRecord] as T[];
    }
    
    return [] as T[];
  }
  
  private handleUpdateQuery<T>(sql: string, params: any[]): T[] {
    // Extract table name
    const updateMatch = sql.match(/update\s+(\w+)\s+set/i);
    if (!updateMatch || !updateMatch[1]) {
      return [] as T[];
    }
    
    const tableName = updateMatch[1];
    const tableData = this.mockData.get(tableName) || [];
    
    // Basic WHERE clause handling
    if (sql.includes('where')) {
      const whereMatch = sql.match(/where\s+(.*?)(?:returning|$)/i);
      if (whereMatch && whereMatch[1]) {
        const whereClause = whereMatch[1].trim();
        
        // Support for basic conditions
        const conditionMatch = whereClause.match(/(\w+)\s*=\s*\?/i);
        if (conditionMatch && conditionMatch[1] && params.length > 0) {
          const field = conditionMatch[1];
          const value = params[params.length - 1]; // Last param is typically the where value
          
          // Extract SET clause
          const setMatch = sql.match(/set\s+(.*?)\s+where/i);
          if (setMatch && setMatch[1]) {
            const setClauses = setMatch[1].split(',').map(clause => clause.trim());
            
            // Update matching records
            const updatedRecords: any[] = [];
            
            tableData.forEach((row, index) => {
              if (row[field] == value) {
                // Apply each SET clause
                setClauses.forEach((clause, clauseIndex) => {
                  const setMatch = clause.match(/(\w+)\s*=\s*\?/i);
                  if (setMatch && setMatch[1] && clauseIndex < params.length - 1) {
                    row[setMatch[1]] = params[clauseIndex];
                  }
                });
                
                updatedRecords.push(row);
              }
            });
            
            this.mockData.set(tableName, tableData);
            return updatedRecords as T[];
          }
        }
      }
    }
    
    return [] as T[];
  }
  
  private handleDeleteQuery<T>(sql: string, params: any[]): T[] {
    // Extract table name
    const deleteMatch = sql.match(/delete\s+from\s+(\w+)/i);
    if (!deleteMatch || !deleteMatch[1]) {
      return [] as T[];
    }
    
    const tableName = deleteMatch[1];
    let tableData = this.mockData.get(tableName) || [];
    
    // Basic WHERE clause handling
    if (sql.includes('where')) {
      const whereMatch = sql.match(/where\s+(.*?)(?:returning|$)/i);
      if (whereMatch && whereMatch[1]) {
        const whereClause = whereMatch[1].trim();
        
        // Support for basic conditions
        const conditionMatch = whereClause.match(/(\w+)\s*=\s*\?/i);
        if (conditionMatch && conditionMatch[1] && params.length > 0) {
          const field = conditionMatch[1];
          const value = params[0];
          
          // Find matching records before deleting
          const deletedRecords = tableData.filter(row => row[field] == value);
          
          // Delete matching records
          tableData = tableData.filter(row => row[field] != value);
          this.mockData.set(tableName, tableData);
          
          return deletedRecords as T[];
        }
      }
    } else {
      // Delete all records if no WHERE clause
      const allRecords = [...tableData];
      this.mockData.set(tableName, []);
      return allRecords as T[];
    }
    
    return [] as T[];
  }
}

export default DBService; 