/**
 * Mock Storage Service
 * Simulates file storage operations without actual cloud connection
 */

import config from '../lib/config';

interface StorageConfig {
  provider: 'local' | 's3' | 'gcs' | 'azure' | 'memory';
  bucket: string;
  region?: string;
  accessKey?: string;
  secretKey?: string;
  baseUrl?: string;
}

interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  url: string;
  path: string;
  isPublic: boolean;
  metadata?: Record<string, string>;
}

interface UploadOptions {
  path?: string;
  contentType?: string;
  isPublic?: boolean;
  metadata?: Record<string, string>;
}

interface FileStream {
  data: Uint8Array;
  contentType: string;
  size: number;
}

class StorageService {
  private config: StorageConfig;
  private mockFiles: Map<string, { 
    data: Uint8Array, 
    metadata: FileMetadata 
  }> = new Map();
  private isInitialized: boolean = false;
  
  constructor(storageConfig?: StorageConfig) {
    this.config = storageConfig || {
      provider: config.services.fileStorage.provider as 'local' | 's3' | 'gcs' | 'azure' | 'memory',
      bucket: config.services.fileStorage.bucket,
      region: config.services.fileStorage.region,
      accessKey: config.services.fileStorage.accessKey,
      secretKey: config.services.fileStorage.secretKey,
      baseUrl: config.services.fileStorage.baseUrl
    };
  }
  
  /**
   * Initialize the storage service
   */
  async initialize(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mock Storage initialized with provider: ${this.config.provider}, bucket: ${this.config.bucket}`);
        this.isInitialized = true;
        resolve(true);
      }, 300);
    });
  }
  
  /**
   * Upload a file to storage
   */
  async uploadFile(file: File | Blob | Uint8Array, fileName: string, options: UploadOptions = {}): Promise<FileMetadata> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return new Promise((resolve) => {
      setTimeout(async () => {
        // Convert file to Uint8Array if needed
        let fileData: Uint8Array;
        let fileType = options.contentType || 'application/octet-stream';
        let fileSize = 0;
        
        if (file instanceof File) {
          fileType = file.type || fileType;
          fileSize = file.size;
          const buffer = await file.arrayBuffer();
          fileData = new Uint8Array(buffer);
        } else if (file instanceof Blob) {
          fileType = file.type || fileType;
          fileSize = file.size;
          const buffer = await file.arrayBuffer();
          fileData = new Uint8Array(buffer);
        } else {
          fileData = file;
          fileSize = file.length;
        }
        
        // Generate file path
        const path = options.path ? `${options.path}/${fileName}` : fileName;
        const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
        
        // Create file URL
        const url = this.config.baseUrl 
          ? `${this.config.baseUrl}/${normalizedPath}`
          : `https://${this.config.bucket}.storage.example.com/${normalizedPath}`;
        
        // Create file metadata
        const metadata: FileMetadata = {
          name: fileName,
          size: fileSize,
          type: fileType,
          lastModified: new Date(),
          url,
          path: normalizedPath,
          isPublic: options.isPublic || false,
          metadata: options.metadata
        };
        
        // Store in mock storage
        this.mockFiles.set(normalizedPath, { data: fileData, metadata });
        
        console.log(`Mock Storage uploaded file: ${fileName}, path: ${normalizedPath}, size: ${fileSize} bytes`);
        resolve(metadata);
      }, Math.random() * 500 + 300); // Random delay between 300-800ms
    });
  }
  
  /**
   * Get file metadata without downloading the file
   */
  async getFileMetadata(filePath: string): Promise<FileMetadata | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        const file = this.mockFiles.get(normalizedPath);
        
        if (!file) {
          console.log(`Mock Storage: file not found at path ${normalizedPath}`);
          resolve(null);
          return;
        }
        
        console.log(`Mock Storage retrieved metadata for file: ${normalizedPath}`);
        resolve(file.metadata);
      }, Math.random() * 100 + 50); // Random delay between 50-150ms
    });
  }
  
  /**
   * Download a file
   */
  async downloadFile(filePath: string): Promise<FileStream | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        const file = this.mockFiles.get(normalizedPath);
        
        if (!file) {
          console.log(`Mock Storage: file not found at path ${normalizedPath}`);
          resolve(null);
          return;
        }
        
        console.log(`Mock Storage downloaded file: ${normalizedPath}, size: ${file.metadata.size} bytes`);
        
        resolve({
          data: file.data,
          contentType: file.metadata.type,
          size: file.metadata.size
        });
      }, Math.random() * 400 + 200); // Random delay between 200-600ms
    });
  }
  
  /**
   * Delete a file
   */
  async deleteFile(filePath: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        const exists = this.mockFiles.has(normalizedPath);
        
        if (!exists) {
          console.log(`Mock Storage: file not found at path ${normalizedPath}`);
          resolve(false);
          return;
        }
        
        this.mockFiles.delete(normalizedPath);
        console.log(`Mock Storage deleted file: ${normalizedPath}`);
        resolve(true);
      }, Math.random() * 300 + 100); // Random delay between 100-400ms
    });
  }
  
  /**
   * List files in a directory
   */
  async listFiles(directory: string = ''): Promise<FileMetadata[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedDir = directory.startsWith('/') ? directory.substring(1) : directory;
        const dirPrefix = normalizedDir ? `${normalizedDir}/` : '';
        
        const files: FileMetadata[] = [];
        
        // Find all files in the directory
        for (const [path, file] of this.mockFiles.entries()) {
          if (path.startsWith(dirPrefix)) {
            // Only include files directly in this directory, not in subdirectories
            const remainingPath = path.substring(dirPrefix.length);
            if (!remainingPath.includes('/')) {
              files.push(file.metadata);
            }
          }
        }
        
        console.log(`Mock Storage listed ${files.length} files in directory: ${normalizedDir}`);
        resolve(files);
      }, Math.random() * 300 + 100); // Random delay between 100-400ms
    });
  }
  
  /**
   * Generate a signed URL for temporary access
   */
  async getSignedUrl(filePath: string, expiresInSeconds: number = 3600): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        const file = this.mockFiles.get(normalizedPath);
        
        if (!file) {
          console.log(`Mock Storage: file not found at path ${normalizedPath}`);
          resolve(null);
          return;
        }
        
        // Generate a signed URL (in real implementations this would be cryptographically signed)
        const expiryTimestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;
        const signedUrl = `${file.metadata.url}?token=mock-signature-${Date.now()}&expires=${expiryTimestamp}`;
        
        console.log(`Mock Storage generated signed URL for file: ${normalizedPath}, expires in ${expiresInSeconds} seconds`);
        resolve(signedUrl);
      }, Math.random() * 200 + 50); // Random delay between 50-250ms
    });
  }
  
  /**
   * Create a folder (directory) in the storage
   */
  async createFolder(folderPath: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // In object storage, folders don't really exist - they're just prefixes
        // But we'll create an empty file with a trailing slash to represent it
        const normalizedPath = folderPath.startsWith('/') ? folderPath.substring(1) : folderPath;
        const folderMarkerPath = normalizedPath.endsWith('/') ? `${normalizedPath}.folder` : `${normalizedPath}/.folder`;
        
        // Create an empty folder marker
        const emptyData = new Uint8Array(0);
        const metadata: FileMetadata = {
          name: '.folder',
          size: 0,
          type: 'application/x-directory',
          lastModified: new Date(),
          url: this.config.baseUrl 
            ? `${this.config.baseUrl}/${folderMarkerPath}`
            : `https://${this.config.bucket}.storage.example.com/${folderMarkerPath}`,
          path: folderMarkerPath,
          isPublic: false,
          metadata: { 'content-type': 'application/x-directory' }
        };
        
        this.mockFiles.set(folderMarkerPath, { data: emptyData, metadata });
        
        console.log(`Mock Storage created folder: ${normalizedPath}`);
        resolve(true);
      }, Math.random() * 200 + 100); // Random delay between 100-300ms
    });
  }
  
  /**
   * Delete a folder and all its contents
   */
  async deleteFolder(folderPath: string, recursive: boolean = true): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const normalizedPath = folderPath.startsWith('/') ? folderPath.substring(1) : folderPath;
        const dirPrefix = normalizedPath.endsWith('/') ? normalizedPath : `${normalizedPath}/`;
        
        // Find all files in the directory
        const filesToDelete: string[] = [];
        for (const path of this.mockFiles.keys()) {
          if (path.startsWith(dirPrefix)) {
            filesToDelete.push(path);
          }
        }
        
        // Check if folder is empty for non-recursive deletes
        if (!recursive && filesToDelete.length > 0) {
          reject(new Error('Folder is not empty and recursive delete is not enabled'));
          return;
        }
        
        // Delete all files
        for (const path of filesToDelete) {
          this.mockFiles.delete(path);
        }
        
        console.log(`Mock Storage deleted folder: ${normalizedPath} with ${filesToDelete.length} files`);
        resolve(true);
      }, Math.random() * 300 + 200); // Random delay between 200-500ms
    });
  }
  
  /**
   * Check if a file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        const exists = this.mockFiles.has(normalizedPath);
        
        console.log(`Mock Storage checked if file exists: ${normalizedPath}, result: ${exists}`);
        resolve(exists);
      }, Math.random() * 100 + 50); // Random delay between 50-150ms
    });
  }
  
  /**
   * Copy a file to a new location
   */
  async copyFile(sourceFilePath: string, destinationFilePath: string): Promise<FileMetadata | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedSourcePath = sourceFilePath.startsWith('/') ? sourceFilePath.substring(1) : sourceFilePath;
        const normalizedDestPath = destinationFilePath.startsWith('/') ? destinationFilePath.substring(1) : destinationFilePath;
        
        const sourceFile = this.mockFiles.get(normalizedSourcePath);
        
        if (!sourceFile) {
          console.log(`Mock Storage: source file not found at path ${normalizedSourcePath}`);
          resolve(null);
          return;
        }
        
        // Create new metadata for the destination
        const destMetadata: FileMetadata = {
          ...sourceFile.metadata,
          path: normalizedDestPath,
          lastModified: new Date(),
          url: this.config.baseUrl 
            ? `${this.config.baseUrl}/${normalizedDestPath}`
            : `https://${this.config.bucket}.storage.example.com/${normalizedDestPath}`
        };
        
        // Copy file
        this.mockFiles.set(normalizedDestPath, { 
          data: sourceFile.data, 
          metadata: destMetadata 
        });
        
        console.log(`Mock Storage copied file from: ${normalizedSourcePath} to: ${normalizedDestPath}`);
        resolve(destMetadata);
      }, Math.random() * 400 + 200); // Random delay between 200-600ms
    });
  }
}

export default StorageService; 