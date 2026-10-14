import { Platform } from 'react-native';
import { User } from '../../types/auth';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@fundamics:auth_token',
  USER_SESSION: '@fundamics:user_session',
  ACTIVE_ROLE: '@fundamics:active_role',
} as const;

// In-memory fallback for environments without persistent storage
const memoryStore = new Map<string, string>();

class StorageService {
  private hasWebStorage(): boolean {
    return (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }

  public async getItem(key: string): Promise<string | null> {
    try {
      if (this.hasWebStorage()) {
        return window.localStorage.getItem(key);
      }
      return memoryStore.get(key) ?? null;
    } catch {
      return memoryStore.get(key) ?? null;
    }
  }

  public async setItem(key: string, value: string): Promise<void> {
    try {
      if (this.hasWebStorage()) {
        window.localStorage.setItem(key, value);
      }
      memoryStore.set(key, value);
    } catch {
      memoryStore.set(key, value);
    }
  }

  public async removeItem(key: string): Promise<void> {
    try {
      if (this.hasWebStorage()) {
        window.localStorage.removeItem(key);
      }
      memoryStore.delete(key);
    } catch {
      memoryStore.delete(key);
    }
  }

  public async getAuthToken(): Promise<string | null> {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  public async setAuthToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  public async getUserSession(): Promise<User | null> {
    const raw = await this.getItem(STORAGE_KEYS.USER_SESSION);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  public async setUserSession(user: User): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
    await this.setItem(STORAGE_KEYS.ACTIVE_ROLE, user.role);
  }

  public async clearAuth(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await this.removeItem(STORAGE_KEYS.USER_SESSION);
    await this.removeItem(STORAGE_KEYS.ACTIVE_ROLE);
  }
}

export const storageService = new StorageService();
