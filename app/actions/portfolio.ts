'use server';

import { cookies } from 'next/headers';

export interface PortfolioHolding {
  tokenName: string;
  amount: number;
  averageAcquisitionPrice: number;
  currentPrice: number | null;
  totalInvestedUsd: number;
  currentValue: number | null;
  profitLoss: number | null;
  profitLossPercentage: number | null;
  lastUpdated: string;
}

export interface UserPortfolio {
  userId: string;
  holdings: PortfolioHolding[];
  totalCurrentValue: number;
  totalInvestedValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
}

export interface PortfolioResponse {
  success: boolean;
  data: UserPortfolio;
  message?: string;
}

export interface AvailableToken {
  tokenName: string;
  amount: number;
  averagePrice: number;
}

export interface AvailableTokensResponse {
  success: boolean;
  data: AvailableToken[];
  message?: string;
}

export interface RecalculateBalanceResponse {
  success: boolean;
  message: string;
  data: {
    newBalance: number;
  };
}

export interface UserWithPortfolio {
  user: {
    _id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    profilePicture?: string;
    authProvider?: string;
    isEmailVerified?: boolean;
    isActive?: boolean;
    lastLogin?: string;
    roi?: number;
    kycStatus: boolean;
    accountStatus: boolean;
    totalInvestment?: number;
    accountBalance?: number;
    createdAt: string;
    updatedAt: string;
  };
  portfolio: UserPortfolio;
}

export interface AllUsersWithPortfoliosResponse {
  success: boolean;
  count: number;
  data: UserWithPortfolio[];
  message?: string;
}

/**
 * Get all users with their portfolio information
 * This is more efficient than fetching users and portfolios separately
 */
export async function getAllUsersWithPortfolios(): Promise<AllUsersWithPortfoliosResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/portfolio/users`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch users with portfolios: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users with portfolios:', error);
    throw error;
  }
}

/**
 * Get user's complete portfolio with live prices
 */
export async function getUserPortfolio(userId: string): Promise<PortfolioResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/portfolio/user/${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
}

/**
 * Get user's available tokens for withdrawal
 */
export async function getUserAvailableTokens(userId: string): Promise<AvailableTokensResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/portfolio/user/${userId}/available-tokens`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch available tokens: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching available tokens:', error);
    throw error;
  }
}

/**
 * Recalculate user's account balance from portfolio
 */
export async function recalculateUserBalance(userId: string): Promise<RecalculateBalanceResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/portfolio/user/${userId}/recalculate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to recalculate balance: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error recalculating balance:', error);
    throw error;
  }
}

