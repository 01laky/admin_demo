import { OpenAPI } from './core/OpenAPI';
import { env } from '../config/env';

/**
 * Configure API client with base URL from environment variables
 * This should be called once when the app starts
 */
export function configureApiClient() {
  // Configure OpenAPI client
  OpenAPI.BASE = env.apiUrl;
  OpenAPI.WITH_CREDENTIALS = false;
  OpenAPI.CREDENTIALS = 'include';
  
  // You can set default headers here if needed
  OpenAPI.HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (env.debugMode) {
    console.log(`API client configured with base URL: ${env.apiUrl}`);
  }
}

/**
 * Set authentication token for API requests
 * The token is automatically added to Authorization header by request.ts
 */
export function setAuthToken(token: string | null) {
  if (token) {
    OpenAPI.TOKEN = token;
    // Remove Authorization from HEADERS if it exists (request.ts will add it from TOKEN)
    const currentHeaders = typeof OpenAPI.HEADERS === 'function' 
      ? {} 
      : (OpenAPI.HEADERS || {});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Authorization, ...headers } = currentHeaders;
    OpenAPI.HEADERS = Object.keys(headers).length > 0 ? headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  } else {
    OpenAPI.TOKEN = undefined;
    // Remove Authorization header if it exists
    const currentHeaders = typeof OpenAPI.HEADERS === 'function' 
      ? {} 
      : (OpenAPI.HEADERS || {});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Authorization, ...headers } = currentHeaders;
    OpenAPI.HEADERS = Object.keys(headers).length > 0 ? headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
}
