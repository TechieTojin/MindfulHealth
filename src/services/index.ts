/**
 * Services Index File
 * Exports all mock service implementations
 */

import ApiIntegrationService from './apiIntegrationService';
import BaseService from './baseService';
import FluvioService from './fluvioService';
import GroqService from './groqService';
import OAuthService from './oauthService';
import DBService from './dbService';
import CacheService from './cacheService';
import MQService from './mqService';
import AuthService from './authService';
import StorageService from './storageService';

// Re-export existing services
import { DataVault } from './DataVault';
import { BaseBlockchainService } from './baseBlockchainService';

export {
  ApiIntegrationService,
  BaseService,
  FluvioService,
  GroqService,
  OAuthService,
  DataVault,
  BaseBlockchainService,
  DBService,
  CacheService,
  MQService,
  AuthService,
  StorageService
};

// Default export as a convenient services object
const services = {
  api: new ApiIntegrationService({ baseUrl: 'https://api.example.com' }),
  base: new BaseService(),
  fluvio: new FluvioService(),
  groq: new GroqService(),
  oauth: new OAuthService({
    clientId: 'mock-client-id',
    clientSecret: 'mock-client-secret',
    redirectUri: 'http://localhost:3000/oauth/callback',
    scope: ['profile', 'email'],
    provider: 'google'
  }),
  dataVault: new DataVault(),
  blockchain: new BaseBlockchainService(),
  db: new DBService({
    host: 'localhost',
    port: 5432,
    database: 'health_hub_db',
    user: 'postgres',
    password: 'postgres'
  }),
  cache: new CacheService({
    host: 'localhost',
    port: 6379,
    ttl: 3600
  }),
  mq: new MQService({
    host: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    vhost: '/'
  }),
  auth: new AuthService(),
  storage: new StorageService()
};

export default services; 