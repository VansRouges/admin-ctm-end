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

export interface UserFinancialSummary {
  email?: string;
  totalInvestment: number;
  accountBalance: number;
  lockedValue: number;
  currentValue: number;
  lifetimeWithdrawals: number;
  roi: number;
  netGainLoss?: number;
}

export interface FinancialSummaryResponse {
  success: boolean;
  data?: UserFinancialSummary;
  message?: string;
  error?: string;
}

export interface UpdateUserFinancialRequest {
  accountBalance?: number;
  currentValue?: number;
}

export interface PortfolioAdjustment {
  action: string;
  tokenName: string;
  tokenAmount: number;
  usdValue: number;
}

export interface UpdateUserFinancialResponse {
  success: boolean;
  message: string;
  data?: UserFinancialSummary;
  before?: {
    accountBalance: number;
    currentValue: number;
    lockedValue: number;
    roi: number;
  };
  portfolioAdjustments?: PortfolioAdjustment[];
  error?: string;
  errorData?: {
    accountBalance?: number;
    currentValue?: number;
    lockedValue?: number;
    expectedCurrentValue?: number;
  };
}

/**
 * Admin: get user's equity summary (available, locked, current, ROI)
 * GET /api/v1/portfolio/user/:userId/financial-summary
 * Falls back to GET /api/v1/users/:userId (financialSummary) when portfolio route is unavailable.
 */
export async function getUserFinancialSummary(
  userId: string
): Promise<FinancialSummaryResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/portfolio/user/${userId}/financial-summary`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
      }
    );

    const result = await response.json().catch(() => ({}));

    if (response.status === 404) {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/${userId}`,
        {
          method: 'GET',
          headers,
          cache: 'no-store',
        }
      );
      const userResult = await userResponse.json().catch(() => ({}));
      if (userResponse.ok && userResult.financialSummary) {
        return { success: true, data: userResult.financialSummary };
      }
      return {
        success: false,
        message: userResult.message || 'Failed to fetch financial summary',
        error: userResult.error,
      };
    }

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || `Failed to fetch financial summary: ${response.statusText}`,
        error: result.error,
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch financial summary',
    };
  }
}

/**
 * Admin: set accountBalance and/or currentValue (portfolio-backed, durable through sync)
 * PUT /api/v1/portfolio/user/:userId/financial
 * Falls back to PUT /api/v1/users/:userId when portfolio route is unavailable.
 */
export async function updateUserFinancials(
  userId: string,
  payload: UpdateUserFinancialRequest
): Promise<UpdateUserFinancialResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    if (payload.accountBalance === undefined && payload.currentValue === undefined) {
      return {
        success: false,
        message: 'Provide accountBalance and/or currentValue',
        error: 'NO_FINANCIAL_FIELDS',
      };
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/portfolio/user/${userId}/financial`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (response.status === 404) {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/${userId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        }
      );
      const userResult = await userResponse.json().catch(() => ({}));

      if (!userResponse.ok || !userResult.success) {
        return {
          success: false,
          message: userResult.message || `Failed to update financial metrics: ${userResponse.statusText}`,
          error: userResult.error,
          errorData: userResult.data,
        };
      }

      return {
        success: true,
        message: userResult.message || 'Financial metrics updated successfully',
        data: userResult.financialSummary,
        portfolioAdjustments: userResult.portfolioAdjustments,
      };
    }

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || `Failed to update financial metrics: ${response.statusText}`,
        error: result.error,
        errorData: result.data,
      };
    }

    return {
      success: true,
      message: result.message || 'Financial metrics updated successfully',
      data: result.data,
      before: result.before,
      portfolioAdjustments: result.portfolioAdjustments,
    };
  } catch (error) {
    console.error('Error updating user financials:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update financial metrics',
    };
  }
}

