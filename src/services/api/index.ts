
// Central API exports
export { UsersAPI } from './users';
export { DocumentsAPI } from './documents';
export { FormSubmissionsAPI } from './formSubmissions';
export { FormTemplatesAPI } from './formTemplates';
export { DepartmentsAPI } from './departments';

// API configuration
export const API_CONFIG = {
  baseURL: '/mock-db',
  timeout: 10000,
  retries: 3
};

// Generic API error handler
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic API response wrapper
export interface APIResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp: string;
}

// Utility function to wrap API calls with error handling
export async function apiCall<T>(
  promise: Promise<T>,
  errorMessage: string = 'API call failed'
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(errorMessage, 500);
  }
}
