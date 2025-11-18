/**
 * API Client Utilities
 * Shared fetcher and API utilities for SWR hooks
 */

export const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  
  return response.json();
};

export const fetcherWithAuth = async (url: string, token?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  
  return response.json();
};
