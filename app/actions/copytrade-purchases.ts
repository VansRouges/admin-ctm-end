'use server';

import { cookies } from 'next/headers';

export interface CopytradePurchaseUser {
  _id: string;
  email: string;
}

export interface UserDetails {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface CopytradePurchase {
  _id: string;
  user: string | CopytradePurchaseUser;
  userDetails?: UserDetails;
  copytradeOption?: string;
  trade_title: string;
  initial_investment: number;
  trade_current_value?: number;
  trade_profit_loss?: number;
  trade_status: 'pending' | 'active' | 'completed' | 'cancelled';
  trade_roi_min?: number;
  trade_roi_max?: number;
  trade_duration?: number;
  trade_approval_date?: string;
  trade_end_date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CopytradePurchasesResponse {
  success: boolean;
  data: CopytradePurchase[];
  count?: number;
  message?: string;
}

export interface CopytradePurchaseResponse {
  success: boolean;
  data: CopytradePurchase;
  message?: string;
}

export interface UpdateCopytradePurchaseRequest {
  trade_current_value?: number;
  trade_profit_loss?: number;
  trade_status?: 'pending' | 'active' | 'completed' | 'cancelled';
  trade_end_date?: string;
}

export interface ApprovalResponse {
  success: boolean;
  message: string;
  data: {
    purchase: CopytradePurchase;
    deductions?: Array<{
      tokenName: string;
      tokenAmount: number;
      usdValue: number;
    }>;
    newAccountBalance?: number;
  };
}

export interface DeleteCopytradePurchaseResponse {
  success: boolean;
  message: string;
  data?: CopytradePurchase;
}

export interface EndCopytradePurchaseResponse {
  success: boolean;
  message: string;
  data?: {
    purchase: CopytradePurchase;
    finalValue?: number;
    finalROI?: number;
    newAccountBalance?: number;
  };
}

/**
 * Get all copytrade purchases
 */
export async function getAllCopytradePurchases(params?: {
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
  userId?: string;
}): Promise<CopytradePurchasesResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.userId) queryParams.append('userId', params.userId);

    const queryString = queryParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/copytrade-purchases${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch copytrade purchases: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching copytrade purchases:', error);
    throw error;
  }
}

/**
 * Get copytrade purchases by user ID
 */
export async function getCopytradePurchasesByUser(userId: string): Promise<CopytradePurchasesResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/copytrade-purchases/user/${userId}`,
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
      throw new Error(`Failed to fetch user copytrade purchases: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user copytrade purchases:', error);
    throw error;
  }
}

/**
 * Get copytrade purchase by ID
 */
export async function getCopytradePurchaseById(purchaseId: string): Promise<CopytradePurchaseResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/copytrade-purchases/${purchaseId}`,
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
      throw new Error(`Failed to fetch copytrade purchase: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching copytrade purchase:', error);
    throw error;
  }
}

/**
 * Update copytrade purchase (including approval)
 * When status changes from 'pending' to 'active', it triggers approval and balance deduction
 */
export async function updateCopytradePurchase(
  purchaseId: string,
  updateData: UpdateCopytradePurchaseRequest
): Promise<ApprovalResponse | CopytradePurchaseResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/copytrade-purchases/${purchaseId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update copytrade purchase: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating copytrade purchase:', error);
    throw error;
  }
}

/**
 * Approve copytrade purchase (changes status from pending to active)
 * This triggers automatic portfolio deduction
 */
export async function approveCopytradePurchase(purchaseId: string): Promise<ApprovalResponse> {
  return updateCopytradePurchase(purchaseId, { trade_status: 'active' }) as Promise<ApprovalResponse>;
}

/**
 * Delete copytrade purchase
 */
export async function deleteCopytradePurchase(purchaseId: string): Promise<DeleteCopytradePurchaseResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/copytrade-purchases/${purchaseId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete copytrade purchase: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting copytrade purchase:', error);
    throw error;
  }
}

/**
 * End/Stop an active copytrade purchase
 * Only works for active trades. Calculates final ROI based on risk level and completes the trade.
 */
export async function endCopytradePurchase(purchaseId: string): Promise<EndCopytradePurchaseResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/copytrade-purchases/${purchaseId}/end`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || response.statusText;
      } catch {
        // If JSON parsing fails, use statusText
        errorMessage = response.statusText;
      }
      throw new Error(`Failed to end copytrade purchase: ${errorMessage}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error ending copytrade purchase:', error);
    throw error;
  }
}

