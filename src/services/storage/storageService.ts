import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { User } from '../../types/auth';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'fundamics_auth_token',
  USER_SESSION: 'fundamics_user_session',
  ACTIVE_ROLE: 'fundamics_active_role',
} as const;

// In-memory fallback for environments without persistent storage or SSR
const memoryStore = new Map<string, string>();

class StorageService {
  private isSecureStoreAvailable: boolean | null = null;

  private async checkSecureStore(): Promise<boolean> {
    if (this.isSecureStoreAvailable !== null) {
      return this.isSecureStoreAvailable;
    }
    try {
      this.isSecureStoreAvailable = await SecureStore.isAvailableAsync();
    } catch {
      this.isSecureStoreAvailable = false;
    }
    return this.isSecureStoreAvailable;
  }

  private hasWebStorage(): boolean {
    return (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }

  private sanitizeKey(key: string): string {
    return key.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  public async getItem(key: string): Promise<string | null> {
    const safeKey = this.sanitizeKey(key);

    try {
      if (await this.checkSecureStore()) {
        const val = await SecureStore.getItemAsync(safeKey);
        if (val !== null) return val;
      }
    } catch {
      // Fall through if secure store read fails
    }

    try {
      if (this.hasWebStorage()) {
        const val = window.localStorage.getItem(safeKey) ?? window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // Fall through to memory
    }

    return memoryStore.get(safeKey) ?? memoryStore.get(key) ?? null;
  }

  public async setItem(key: string, value: string): Promise<void> {
    const safeKey = this.sanitizeKey(key);
    memoryStore.set(safeKey, value);

    if (this.hasWebStorage()) {
      try {
        window.localStorage.setItem(safeKey, value);
      } catch {
        // Fallback gracefully on storage quota error
      }
    }

    try {
      if (await this.checkSecureStore()) {
        await SecureStore.setItemAsync(safeKey, value);
      }
    } catch {
      // Continue without crashing if secure store write fails
    }
  }

  public async removeItem(key: string): Promise<void> {
    const safeKey = this.sanitizeKey(key);
    memoryStore.delete(safeKey);
    memoryStore.delete(key);

    if (this.hasWebStorage()) {
      try {
        window.localStorage.removeItem(safeKey);
        window.localStorage.removeItem(key);
      } catch {
        // Ignore web storage removal errors
      }
    }

    try {
      if (await this.checkSecureStore()) {
        await SecureStore.deleteItemAsync(safeKey);
      }
    } catch {
      // Ignore secure store removal errors
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
