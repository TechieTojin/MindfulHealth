/**
 * Mock Base Database Service
 * This is a cover-up implementation with no actual connection to Base
 */

type RecordId = string;

interface BaseRecord {
  id: RecordId;
  fields: Record<string, any>;
  createdTime: string;
}

interface TableConfig {
  name: string;
  fields: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'attachment';
  }>;
}

class BaseService {
  private apiKey: string = 'mock_base_api_key';
  private baseId: string = 'appXXXXXXXXXXXXXX';
  private mockData: Map<string, BaseRecord[]> = new Map();
  
  constructor(apiKey?: string, baseId?: string) {
    if (apiKey) {
      this.apiKey = apiKey;
    }
    if (baseId) {
      this.baseId = baseId;
    }
    
    // Initialize with some mock data
    this.initializeMockData();
  }
  
  private initializeMockData() {
    // Users table
    this.mockData.set('Users', [
      {
        id: 'rec123456789',
        fields: {
          name: 'John Doe',
          email: 'john@example.com',
          status: 'active'
        },
        createdTime: '2023-01-15T14:30:00.000Z'
      },
      {
        id: 'rec987654321',
        fields: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          status: 'pending'
        },
        createdTime: '2023-02-20T09:15:00.000Z'
      }
    ]);
    
    // Tasks table
    this.mockData.set('Tasks', [
      {
        id: 'rec123123123',
        fields: {
          title: 'Complete project',
          assignee: 'rec123456789',
          dueDate: '2023-05-10',
          completed: false
        },
        createdTime: '2023-04-01T10:00:00.000Z'
      }
    ]);
  }
  
  /**
   * Get records from a table
   */
  async listRecords(tableName: string): Promise<BaseRecord[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.mockData.get(tableName) || [];
  }
  
  /**
   * Get a single record by ID
   */
  async getRecord(tableName: string, recordId: RecordId): Promise<BaseRecord | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const records = this.mockData.get(tableName) || [];
    return records.find(record => record.id === recordId) || null;
  }
  
  /**
   * Create a new record
   */
  async createRecord(tableName: string, fields: Record<string, any>): Promise<BaseRecord> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newRecord: BaseRecord = {
      id: `rec${Date.now()}${Math.random().toString(36).substring(2, 6)}`,
      fields,
      createdTime: new Date().toISOString()
    };
    
    const tableRecords = this.mockData.get(tableName) || [];
    tableRecords.push(newRecord);
    this.mockData.set(tableName, tableRecords);
    
    return newRecord;
  }
  
  /**
   * Update an existing record
   */
  async updateRecord(tableName: string, recordId: RecordId, fields: Record<string, any>): Promise<BaseRecord> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const tableRecords = this.mockData.get(tableName) || [];
    const recordIndex = tableRecords.findIndex(r => r.id === recordId);
    
    if (recordIndex === -1) {
      throw new Error(`Record not found: ${recordId}`);
    }
    
    const updatedRecord = {
      ...tableRecords[recordIndex],
      fields: {
        ...tableRecords[recordIndex].fields,
        ...fields
      }
    };
    
    tableRecords[recordIndex] = updatedRecord;
    this.mockData.set(tableName, tableRecords);
    
    return updatedRecord;
  }
  
  /**
   * Delete a record
   */
  async deleteRecord(tableName: string, recordId: RecordId): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const tableRecords = this.mockData.get(tableName) || [];
    const filteredRecords = tableRecords.filter(r => r.id !== recordId);
    
    if (filteredRecords.length === tableRecords.length) {
      return false; // No record was deleted
    }
    
    this.mockData.set(tableName, filteredRecords);
    return true;
  }
}

export default BaseService; 