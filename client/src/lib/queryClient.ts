import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

// Default fetcher function for react-query
export const defaultQueryFn = async ({ queryKey }: { queryKey: any[] }): Promise<any> => {
  const url = queryKey[0] as string;
  const response = await fetch(url, {
    credentials: 'include', // Include cookies for authentication
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// API request helper for mutations
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return response.json();
};