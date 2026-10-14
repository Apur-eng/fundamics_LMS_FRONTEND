/**
 * CENTRALIZED PRODUCTION API CLIENT
 * =========================================================================
 * Single source of truth for all network communication between the
 * React Native frontend and the FastAPI backend.
 *
 * Architecture Flow:
 * React Native Components -> Domain Services -> ApiClient -> FastAPI Backend
 * =========================================================================
 */

import { Platform } from 'react-native';
import { ApiResponse } from '../../types/api';

// Configurable flag for offline / mock testing: can be toggled via env
export const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

/**
 * Normalizes the backend base URL.
 * Automatically handles:
 * - Appending `/api/v1` if missing
 * - Android emulator loopback translation (`127.0.0.1` -> `10.0.2.2`)
 * - Trimming trailing slashes
 */
export const normalizeApiBaseUrl = (rawUrl?: string): string => {
  let url = (rawUrl || 'http://127.0.0.1:8000/api/v1').trim().replace(/\/+$/, '');

  if (Platform.OS === 'android' && (url.includes('127.0.0.1') || url.includes('localhost'))) {
    url = url.replace('127.0.0.1', '10.0.2.2').replace('localhost', '10.0.2.2');
  }

  return url.endsWith('/api/v1') ? url : `${url}/api/v1`;
};

// Points to configured FastAPI backend (Dev: 127.0.0.1:8000/api/v1, Preview/Prod: custom domain/api/v1)
export const BASE_URL = normalizeApiBaseUrl(
  process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL
);

/**
 * Builds the full URL for any API request.
 * Safely prevents duplicate `/api/v1` or `/v1` segments in endpoints.
 */
export const buildApiUrl = (endpoint: string): string => {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }

  let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (path.startsWith('/api/v1/')) {
    path = path.slice(7);
  } else if (path === '/api/v1') {
    path = '';
  } else if (path.startsWith('/v1/')) {
    path = path.slice(3);
  }

  return `${BASE_URL}${path}`;
};

const DEFAULT_TIMEOUT_MS = 12000;

export interface ApiClientOptions extends RequestInit {
  timeoutMs?: number;
}

export type ApiErrorCategory =
  | 'AUTH'
  | 'PERMISSION'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'SERVER'
  | 'CONNECTION';

export interface FormattedError {
  title: string;
  message: string;
  category: ApiErrorCategory;
}

export const categorizeApiError = (
  status?: number,
  serverMessage?: string,
  serverCode?: string
): FormattedError => {
  // Network / Connection / CORS failure (status 0 or undefined)
  if (!status || status === 0 || serverCode === 'NETWORK_ERROR' || serverCode === 'CONNECTION_ERROR') {
    return {
      title: 'Connection Issue',
      message:
        'Unable to connect to the LMS backend server. Please verify your network connection and ensure the backend service and CORS configuration are active.',
      category: 'CONNECTION',
    };
  }

  switch (status) {
    case 401:
      return {
        title: 'Authentication Required',
        message: serverMessage || 'Your session has expired or authentication is missing. Please sign in again.',
        category: 'AUTH',
      };
    case 403:
      return {
        title: 'Access Restricted',
        message: serverMessage || 'You do not have permission to access this academic resource.',
        category: 'PERMISSION',
      };
    case 404:
      return {
        title: 'Resource Not Found',
        message: serverMessage || 'The requested resource or endpoint was not found on the server.',
        category: 'NOT_FOUND',
      };
    case 422:
      return {
        title: 'Validation Error',
        message: serverMessage || 'The server could not validate the submitted request parameters.',
        category: 'VALIDATION',
      };
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        title: 'Server Error',
        message: serverMessage || 'The backend service encountered an internal error. Please try again shortly.',
        category: 'SERVER',
      };
    default:
      return {
        title: 'Request Failed',
        message: serverMessage || `Request failed with HTTP status ${status}.`,
        category: 'SERVER',
      };
  }
};

export class ApiError extends Error {
  public statusCode?: number;
  public code?: string;
  public details?: unknown;
  public title: string;
  public category: ApiErrorCategory;
  public rawMessage: string;

  constructor(
    message: string,
    statusCode?: number,
    details?: unknown,
    code?: string,
    title?: string,
    category?: ApiErrorCategory
  ) {
    const formatted = categorizeApiError(statusCode, message, code);
    super(formatted.message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code || `HTTP_${statusCode || 0}`;
    this.details = details;
    this.title = title || formatted.title;
    this.category = category || formatted.category;
    this.rawMessage = message;
  }
}

class ApiClient {
  private authToken: string | null = null;
  private unauthorizedHandler: (() => void) | null = null;
  private isHandlingUnauthorized: boolean = false;

  public setToken(token: string | null): void {
    this.authToken = token;
  }

  public getToken(): string | null {
    return this.authToken;
  }

  /**
   * Registers a callback invoked whenever the backend returns a 401 Unauthorized status.
   */
  public registerUnauthorizedHandler(handler: () => void): () => void {
    this.unauthorizedHandler = handler;
    return () => {
      if (this.unauthorizedHandler === handler) {
        this.unauthorizedHandler = null;
      }
    };
  }

  /**
   * Simulates asynchronous network latency for realistic testing of loading
   * and offline states during mock operation.
   */
  public async simulateLatency(ms: number = 350): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generic request dispatcher for backend endpoints with timeout and error normalization.
   */
  public async request<T>(
    endpoint: string,
    options: ApiClientOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (isDev) {
      console.log(`[API ${options.method || 'GET'}] ${url}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (isDev) {
        console.log(`[API Response ${response.status}] ${url}`);
      }

      if (response.status === 401) {
        // Prevent recursive 401 storms, especially during logout requests
        const isLogoutRequest = endpoint.includes('/auth/logout');
        if (!isLogoutRequest && !this.isHandlingUnauthorized) {
          this.isHandlingUnauthorized = true;
          try {
            this.unauthorizedHandler?.();
          } finally {
            setTimeout(() => {
              this.isHandlingUnauthorized = false;
            }, 1000);
          }
        }
        const formatted = categorizeApiError(401, 'Session expired. Please sign in again.', 'UNAUTHORIZED');
        throw new ApiError(
          formatted.message,
          401,
          null,
          'UNAUTHORIZED',
          formatted.title,
          formatted.category
        );
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        let message = `Request failed with status code ${response.status}`;
        let code = `HTTP_${response.status}`;

        if (errorBody && errorBody.error && typeof errorBody.error === 'object') {
          message = errorBody.error.message || message;
          code = errorBody.error.code || code;
        } else if (errorBody.detail) {
          message = typeof errorBody.detail === 'string' ? errorBody.detail : JSON.stringify(errorBody.detail);
        } else if (errorBody.message) {
          message = errorBody.message;
        }

        if (isDev) {
          console.warn(`[API ${response.status} Error] ${url}: ${message}`);
        }

        const formatted = categorizeApiError(response.status, message, code);
        throw new ApiError(
          formatted.message,
          response.status,
          errorBody,
          code,
          formatted.title,
          formatted.category
        );
      }

      const json = await response.json();

      // If backend returns enveloped format { success: true, data: T }
      if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
        return json as ApiResponse<T>;
      }

      // If backend returns raw DTO (FastAPI standard format)
      return {
        success: true,
        data: json as T,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      clearTimeout(timer);

      if (err instanceof ApiError) {
        throw err;
      }

      if (err.name === 'AbortError') {
        const formatted = categorizeApiError(408, 'Request timed out. Please check your internet connection.', 'TIMEOUT');
        throw new ApiError(formatted.message, 408, null, 'TIMEOUT', formatted.title, formatted.category);
      }

      if (isDev) {
        console.warn(`[API Connection Failure] ${url}:`, err?.message || err);
      }

      const formatted = categorizeApiError(0, err?.message, 'CONNECTION_ERROR');
      throw new ApiError(
        formatted.message,
        0,
        null,
        'CONNECTION_ERROR',
        formatted.title,
        formatted.category
      );
    }
  }

  public get<T>(endpoint: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiClientOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiClientOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public getBaseUrl(): string {
    return BASE_URL;
  }

  /**
   * Performs quick health check against FastAPI backend
   */
  public async checkHealth(): Promise<{ live: boolean; ready: boolean; details?: unknown }> {
    try {
      const liveRes = await fetch(buildApiUrl('/health/live'), { method: 'GET' });
      const readyRes = await fetch(buildApiUrl('/health/ready'), { method: 'GET' });
      const details = readyRes.ok ? await readyRes.json().catch(() => null) : null;
      return {
        live: liveRes.ok,
        ready: readyRes.ok,
        details,
      };
    } catch (err: any) {
      return {
        live: false,
        ready: false,
        details: err?.message || 'Network unreachable',
      };
    }
  }
}

export const apiClient = new ApiClient();
