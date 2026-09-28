/**
 * CENTRALIZED API CLIENT
 * =========================================================================
 * Single source of truth for all network communication between the
 * React Native frontend and the future FastAPI backend.
 *
 * Architecture Flow:
 * React Native Components -> Domain Services -> ApiClient -> FastAPI Backend
 * =========================================================================
 */

import { ApiResponse } from '../../types/api';

// Configurable flag for offline / mock testing during Phase 1
export const USE_MOCK_API = true;

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

class ApiClient {
  private authToken: string | null = null;

  public setToken(token: string | null): void {
    this.authToken = token;
  }

  public getToken(): string | null {
    return this.authToken;
  }

  /**
   * Simulates asynchronous network latency for realistic testing of loading
   * and offline states during mock operation.
   */
  public async simulateLatency(ms: number = 350): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generic request dispatcher for the upcoming FastAPI endpoints.
   */
  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `Request failed with status ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (err: any) {
      throw new Error(err.message || 'Network connection failed');
    }
  }

  public get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
