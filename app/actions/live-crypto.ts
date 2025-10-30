'use server';

import { cookies } from 'next/headers';

export interface LiveCryptoPrice {
  token: string;
  price: number;
}

export interface LiveCryptoPricesResponse {
  success: boolean;
  cached?: boolean;
  count?: number;
  data: LiveCryptoPrice[];
  message?: string;
}

/**
 * Fetch live crypto prices (token/USD) from backend
 */
export async function fetchLiveCryptoPrices(): Promise<LiveCryptoPricesResponse> {
  try {
    // Try to include auth if available; endpoint may not require it
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/crypto-prices`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch live prices: ${response.status} ${response.statusText} - ${text}`);
    }

    const data = await response.json();
    return data as LiveCryptoPricesResponse;
  } catch (error) {
    console.error('Error fetching live crypto prices:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Failed to fetch live crypto prices',
    };
  }
}


