import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://virtual-date-api.onrender.com';

interface FetchOptions extends RequestInit {
  data?: any;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { data, headers: customHeaders, ...customOptions } = options;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    headers,
    ...customOptions,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  let responseData;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    const errorMsg = responseData.message || response.statusText;

    if (response.status === 401) {
      toast.error('Unauthorized: Please log in again.');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (response.status === 403) {
      toast.error("Forbidden: You don't have access to this resource.");
    } else if (response.status === 404) {
      toast.error('Resource not found.');
    } else if (response.status === 409) {
      toast.error('Conflict: ' + errorMsg);
    } else if (response.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(errorMsg);
    }

    throw new ApiError(response.status, errorMsg, responseData);
  }

  return responseData as T;
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'data'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data?: any, options?: Omit<FetchOptions, 'method' | 'data'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'POST', data }),
  put: <T>(endpoint: string, data?: any, options?: Omit<FetchOptions, 'method' | 'data'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'PUT', data }),
  delete: <T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'data'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};