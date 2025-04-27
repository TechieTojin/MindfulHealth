/**
 * Mock OAuth Authentication Service
 * This is a cover-up implementation with no actual OAuth connection
 */

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  provider: 'google' | 'github' | 'facebook' | 'apple' | 'microsoft';
}

interface OAuthToken {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
  idToken?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: string;
}

class OAuthService {
  private config: OAuthConfig;
  private currentUser: UserProfile | null = null;
  private tokens: OAuthToken | null = null;
  
  constructor(config: OAuthConfig) {
    this.config = config;
  }
  
  /**
   * Generate the authorization URL for the OAuth provider
   */
  getAuthorizationUrl(): string {
    const baseUrls: Record<string, string> = {
      google: 'https://accounts.google.com/o/oauth2/auth',
      github: 'https://github.com/login/oauth/authorize',
      facebook: 'https://www.facebook.com/v13.0/dialog/oauth',
      apple: 'https://appleid.apple.com/auth/authorize',
      microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
    };
    
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(' '),
      response_type: 'code',
      state: this.generateRandomState(),
    });
    
    return `${baseUrls[this.config.provider]}?${params.toString()}`;
  }
  
  /**
   * Handle the OAuth callback and exchange code for tokens
   */
  async handleCallback(code: string): Promise<OAuthToken> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock tokens
    this.tokens = {
      accessToken: this.generateMockToken(),
      refreshToken: this.generateMockToken(),
      tokenType: 'Bearer',
      expiresIn: 3600,
      scope: this.config.scope.join(' '),
      idToken: this.config.provider === 'google' ? this.generateMockToken() : undefined
    };
    
    // Generate mock user profile based on provider
    this.currentUser = this.generateMockUserProfile();
    
    console.log(`Mock OAuth callback handled for provider: ${this.config.provider}`);
    return this.tokens;
  }
  
  /**
   * Get user profile information using the access token
   */
  async getUserProfile(): Promise<UserProfile | null> {
    if (!this.tokens) {
      throw new Error('Not authenticated. Call handleCallback first.');
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.currentUser;
  }
  
  /**
   * Refresh the access token using the refresh token
   */
  async refreshAccessToken(): Promise<OAuthToken> {
    if (!this.tokens) {
      throw new Error('Not authenticated. No refresh token available.');
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate new access token
    this.tokens = {
      ...this.tokens,
      accessToken: this.generateMockToken(),
      expiresIn: 3600
    };
    
    console.log('Mock access token refreshed');
    return this.tokens;
  }
  
  /**
   * Revoke the current access and refresh tokens
   */
  async revokeTokens(): Promise<void> {
    if (!this.tokens) {
      return;
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    this.tokens = null;
    this.currentUser = null;
    
    console.log('Mock tokens revoked');
  }
  
  /**
   * Check if the user is currently authenticated
   */
  isAuthenticated(): boolean {
    return !!this.tokens;
  }
  
  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    return this.tokens?.accessToken || null;
  }
  
  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  
  private generateMockToken(): string {
    // Generate a realistic looking JWT token (though not actually valid)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: `user-${Math.floor(Math.random() * 1000000)}`,
      iss: `https://${this.config.provider}.com`,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    }));
    const signature = btoa(Math.random().toString(36).substring(2, 15));
    
    return `${header.replace(/=/g, '')}.${payload.replace(/=/g, '')}.${signature.replace(/=/g, '')}`;
  }
  
  private generateMockUserProfile(): UserProfile {
    const providers = {
      google: {
        id: `g-${Math.floor(Math.random() * 1000000)}`,
        email: 'user@gmail.com',
        name: 'Google User',
        picture: 'https://lh3.googleusercontent.com/mock-profile-picture'
      },
      github: {
        id: `gh-${Math.floor(Math.random() * 1000000)}`,
        email: 'dev@github.com',
        name: 'GitHub Developer',
        picture: 'https://avatars.githubusercontent.com/mock-profile-picture'
      },
      facebook: {
        id: `fb-${Math.floor(Math.random() * 1000000)}`,
        email: 'user@facebook.com',
        name: 'Facebook User',
        picture: 'https://graph.facebook.com/mock-profile-picture'
      },
      apple: {
        id: `ap-${Math.floor(Math.random() * 1000000)}`,
        email: 'user@icloud.com',
        name: 'Apple User'
      },
      microsoft: {
        id: `ms-${Math.floor(Math.random() * 1000000)}`,
        email: 'user@outlook.com',
        name: 'Microsoft User',
        picture: 'https://graph.microsoft.com/mock-profile-picture'
      }
    };
    
    return {
      ...providers[this.config.provider],
      provider: this.config.provider
    };
  }
}

export default OAuthService; 