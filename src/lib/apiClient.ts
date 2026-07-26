import { logger } from './logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  summary?: any;
}

interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function requestWithRetry<T>(
  endpoint: string,
  options: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 10000,
    ...fetchOptions
  } = options;

  // Disable retries in test environment
  const isTestEnv = import.meta.env.MODE === 'test' || import.meta.env.DEV;
  const effectiveRetries = isTestEnv ? 0 : retries;
  const effectiveRetryDelay = isTestEnv ? 0 : retryDelay;

  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  const token = localStorage.getItem('cozy_lagos_auth_token');
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= effectiveRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, {
        ...fetchOptions,
        headers,
        timeout,
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('cozy_lagos_auth_token');
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return {
          success: false,
          error: 'Authentication expired. Please log in again.',
        };
      }

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : effectiveRetryDelay * (attempt + 1);
        logger.warn('API', `Rate limited, retrying after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          response.status || 500,
          response.statusText || 'Error',
          data
        );
      }

      return {
        success: data.success !== false,
        data: data.data || data,
        message: data.message,
        count: data.count,
        summary: data.summary,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on client errors (4xx) except 429
      if (error instanceof ApiError && error.status >= 400 && error.status < 500 && error.status !== 429) {
        logger.error('API', `Client error ${error.status} for ${endpoint}`, error);
        const errorMessage = error.data?.message || error.data?.error || (error.status === 401 ? 'Unauthorized' : error.message);
        return {
          success: false,
          error: errorMessage,
        };
      }

      // Log retry attempts
      if (attempt < effectiveRetries) {
        const delay = effectiveRetryDelay * Math.pow(2, attempt); // Exponential backoff
        logger.warn('API', `Request failed (attempt ${attempt + 1}/${effectiveRetries}), retrying in ${delay}ms`, {
          endpoint,
          error: lastError.message,
        });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  logger.error('API', `All ${effectiveRetries + 1} attempts failed for ${endpoint}`, lastError);
  
  // Extract error message from ApiError data if available
  let errorMessage = lastError?.message || 'Network error. Please check your connection.';
  if (lastError instanceof ApiError && lastError.data?.message) {
    errorMessage = lastError.data.message;
  } else if (lastError instanceof ApiError && lastError.data?.error) {
    errorMessage = lastError.data.error;
  }
  
  return {
    success: false,
    error: errorMessage,
  };
}

// Export the enhanced request function
export const apiRequest = requestWithRetry;

// Export convenience methods
export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestConfig, 'method'>) =>
    requestWithRetry<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data?: any, options?: Omit<RequestConfig, 'method' | 'body'>) =>
    requestWithRetry<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T>(endpoint: string, data?: any, options?: Omit<RequestConfig, 'method' | 'body'>) =>
    requestWithRetry<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  patch: <T>(endpoint: string, data?: any, options?: Omit<RequestConfig, 'method' | 'body'>) =>
    requestWithRetry<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T>(endpoint: string, data?: any, options?: Omit<RequestConfig, 'method' | 'body'>) =>
    requestWithRetry<T>(endpoint, {
      ...options,
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    }),
};

export default api;
