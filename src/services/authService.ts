/**
 * Mock Authentication Service
 * Simulates user authentication and authorization without actual backend
 */

interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'coach';
  permissions: string[];
  profile?: {
    fullName?: string;
    avatar?: string;
    bio?: string;
  };
  metadata?: Record<string, any>;
}

interface RegisterOptions {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'coach';
  profile?: {
    fullName?: string;
    avatar?: string;
    bio?: string;
  };
}

interface LoginOptions {
  usernameOrEmail: string;
  password: string;
  remember?: boolean;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

interface PasswordResetOptions {
  email: string;
}

interface PasswordChangeOptions {
  oldPassword: string;
  newPassword: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private tokens: AuthTokens | null = null;
  private isAuthenticated: boolean = false;
  private mockUsers: Map<string, { 
    user: AuthUser, 
    passwordHash: string, 
    refreshToken?: string 
  }> = new Map();
  
  constructor() {
    this.initializeMockUsers();
    
    // Check local storage for existing session
    this.checkExistingSession();
  }
  
  private initializeMockUsers() {
    // Mock admin user
    this.mockUsers.set('admin@example.com', {
      user: {
        id: 'user-1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        permissions: ['users:read', 'users:write', 'users:delete', 'settings:read', 'settings:write'],
        profile: {
          fullName: 'Admin User',
          avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
          bio: 'System administrator'
        }
      },
      passwordHash: 'hashed-password-123' // In a real system this would be properly hashed
    });
    
    // Mock regular user
    this.mockUsers.set('user@example.com', {
      user: {
        id: 'user-2',
        username: 'user',
        email: 'user@example.com',
        role: 'user',
        permissions: ['settings:read'],
        profile: {
          fullName: 'Regular User',
          avatar: 'https://ui-avatars.com/api/?name=Regular+User&background=0D8ABC&color=fff',
          bio: 'Health enthusiast'
        },
        metadata: {
          lastLogin: '2023-05-15T10:30:00Z',
          createdAt: '2023-01-01T00:00:00Z'
        }
      },
      passwordHash: 'hashed-password-456'
    });
    
    // Mock coach user
    this.mockUsers.set('coach@example.com', {
      user: {
        id: 'user-3',
        username: 'coach',
        email: 'coach@example.com',
        role: 'coach',
        permissions: ['users:read', 'settings:read', 'settings:write'],
        profile: {
          fullName: 'Health Coach',
          avatar: 'https://ui-avatars.com/api/?name=Health+Coach&background=0D8ABC&color=fff',
          bio: 'Certified fitness trainer with 10 years of experience'
        }
      },
      passwordHash: 'hashed-password-789'
    });
  }
  
  private checkExistingSession() {
    try {
      const storedUser = localStorage.getItem('auth_user');
      const storedTokens = localStorage.getItem('auth_tokens');
      
      if (storedUser && storedTokens) {
        this.currentUser = JSON.parse(storedUser);
        this.tokens = JSON.parse(storedTokens);
        this.isAuthenticated = true;
        
        // Check if token is expired
        const now = Date.now() / 1000;
        const tokenExpiry = this.tokens.expiresIn + (JSON.parse(storedTokens) as any).issuedAt;
        
        if (now > tokenExpiry) {
          // Token is expired, try to refresh
          this.refreshToken().catch(() => {
            this.logout();
          });
        }
      }
    } catch (error) {
      console.error('Error restoring authentication session:', error);
      this.logout();
    }
  }
  
  /**
   * Register a new user
   */
  async register(options: RegisterOptions): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validate email format
        if (!options.email.includes('@') || !options.email.includes('.')) {
          reject(new Error('Invalid email format'));
          return;
        }
        
        // Check if user already exists
        if (this.mockUsers.has(options.email)) {
          reject(new Error('User with this email already exists'));
          return;
        }
        
        // Create new user
        const newUser: AuthUser = {
          id: `user-${Date.now()}`,
          username: options.username,
          email: options.email,
          role: options.role || 'user',
          permissions: options.role === 'coach' 
            ? ['users:read', 'settings:read', 'settings:write']
            : ['settings:read'],
          profile: options.profile || {
            fullName: options.username,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(options.username)}&background=0D8ABC&color=fff`
          },
          metadata: {
            createdAt: new Date().toISOString()
          }
        };
        
        // Store user
        this.mockUsers.set(options.email, {
          user: newUser,
          passwordHash: `hashed-${options.password}` // In real system, this would use bcrypt
        });
        
        console.log(`Mock auth registered new user: ${options.email}`);
        resolve(newUser);
      }, 800);
    });
  }
  
  /**
   * Login a user
   */
  async login(options: LoginOptions): Promise<AuthTokens> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Find user by email or username
        const userEntry = Array.from(this.mockUsers.entries()).find(([email, data]) => 
          email === options.usernameOrEmail || data.user.username === options.usernameOrEmail
        );
        
        if (!userEntry) {
          reject(new Error('User not found'));
          return;
        }
        
        const [email, userData] = userEntry;
        
        // Check password (in a real system, this would use bcrypt.compare)
        if (userData.passwordHash !== `hashed-${options.password}`) {
          reject(new Error('Invalid password'));
          return;
        }
        
        // Generate tokens
        const accessToken = this.generateMockJwt(userData.user);
        const refreshToken = this.generateRefreshToken();
        
        const tokens: AuthTokens = {
          accessToken,
          refreshToken,
          expiresIn: 3600, // 1 hour
          tokenType: 'Bearer'
        };
        
        // Update user with refresh token
        userData.refreshToken = refreshToken;
        this.mockUsers.set(email, userData);
        
        // Update current session
        this.currentUser = userData.user;
        this.tokens = tokens;
        this.isAuthenticated = true;
        
        // Store in localStorage if remember is true
        if (options.remember) {
          localStorage.setItem('auth_user', JSON.stringify(userData.user));
          localStorage.setItem('auth_tokens', JSON.stringify({
            ...tokens,
            issuedAt: Math.floor(Date.now() / 1000)
          }));
        }
        
        console.log(`Mock auth logged in user: ${email}`);
        resolve(tokens);
      }, 600);
    });
  }
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null;
        this.tokens = null;
        this.isAuthenticated = false;
        
        // Clear local storage
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_tokens');
        
        console.log('Mock auth logged out user');
        resolve();
      }, 300);
    });
  }
  
  /**
   * Refresh the authentication token
   */
  async refreshToken(): Promise<AuthTokens> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.tokens?.refreshToken) {
          reject(new Error('No refresh token available'));
          return;
        }
        
        // Find user with this refresh token
        const userEntry = Array.from(this.mockUsers.entries()).find(([_, data]) => 
          data.refreshToken === this.tokens?.refreshToken
        );
        
        if (!userEntry) {
          reject(new Error('Invalid refresh token'));
          return;
        }
        
        const [email, userData] = userEntry;
        
        // Generate new tokens
        const accessToken = this.generateMockJwt(userData.user);
        const refreshToken = this.generateRefreshToken();
        
        const tokens: AuthTokens = {
          accessToken,
          refreshToken,
          expiresIn: 3600, // 1 hour
          tokenType: 'Bearer'
        };
        
        // Update user with new refresh token
        userData.refreshToken = refreshToken;
        this.mockUsers.set(email, userData);
        
        // Update current session
        this.tokens = tokens;
        
        // Update localStorage if it exists
        const storedTokens = localStorage.getItem('auth_tokens');
        if (storedTokens) {
          localStorage.setItem('auth_tokens', JSON.stringify({
            ...tokens,
            issuedAt: Math.floor(Date.now() / 1000)
          }));
        }
        
        console.log(`Mock auth refreshed token for user: ${email}`);
        resolve(tokens);
      }, 500);
    });
  }
  
  /**
   * Request a password reset email
   */
  async requestPasswordReset(options: PasswordResetOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.mockUsers.has(options.email)) {
          // Don't reveal if user exists or not for security
          resolve(true);
          return;
        }
        
        console.log(`Mock auth sent password reset email to: ${options.email}`);
        resolve(true);
      }, 800);
    });
  }
  
  /**
   * Change user password
   */
  async changePassword(options: PasswordChangeOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.currentUser) {
          reject(new Error('Not authenticated'));
          return;
        }
        
        // Find user
        const userEntry = Array.from(this.mockUsers.entries()).find(([_, data]) => 
          data.user.id === this.currentUser?.id
        );
        
        if (!userEntry) {
          reject(new Error('User not found'));
          return;
        }
        
        const [email, userData] = userEntry;
        
        // Verify old password
        if (userData.passwordHash !== `hashed-${options.oldPassword}`) {
          reject(new Error('Incorrect current password'));
          return;
        }
        
        // Update password
        userData.passwordHash = `hashed-${options.newPassword}`;
        this.mockUsers.set(email, userData);
        
        console.log(`Mock auth changed password for user: ${email}`);
        resolve(true);
      }, 700);
    });
  }
  
  /**
   * Get the current authenticated user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }
  
  /**
   * Check if user is authenticated
   */
  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }
  
  /**
   * Get authorization header with bearer token
   */
  getAuthHeader(): Record<string, string> | null {
    if (!this.tokens) {
      return null;
    }
    
    return {
      'Authorization': `${this.tokens.tokenType} ${this.tokens.accessToken}`
    };
  }
  
  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    if (!this.currentUser) {
      return false;
    }
    
    return this.currentUser.permissions.includes(permission);
  }
  
  /**
   * Check if user has a specific role
   */
  hasRole(role: 'admin' | 'user' | 'coach'): boolean {
    if (!this.currentUser) {
      return false;
    }
    
    return this.currentUser.role === role;
  }
  
  /**
   * Generate a mock JWT token
   */
  private generateMockJwt(user: AuthUser): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }));
    
    const signature = btoa(Math.random().toString(36).substring(2, 15));
    
    return `${header.replace(/=/g, '')}.${payload.replace(/=/g, '')}.${signature.replace(/=/g, '')}`;
  }
  
  /**
   * Generate a refresh token
   */
  private generateRefreshToken(): string {
    return `refresh-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}

export default AuthService; 