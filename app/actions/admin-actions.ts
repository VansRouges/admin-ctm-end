'use server';

import { cookies } from 'next/headers';

// Admin Deposit Creation
export interface AdminDepositRequest {
  userId: string;
  token_name: string;
  amount: number;
  token_deposit_address?: string;
  autoApprove?: boolean;
}

export interface AdminDepositResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    token_name: string;
    amount: number;
    user: string;
    status: 'pending' | 'approved' | 'rejected';
    isDeposit: boolean;
    isWithdraw: boolean;
    createdAt: string;
    updatedAt: string;
    usdValue?: number;
    tokenPriceAtApproval?: number;
    approvedAt?: string;
  };
  usdValueAdded?: number;
  userNewBalance?: number;
}

export async function createAdminDeposit(
  depositData: AdminDepositRequest
): Promise<AdminDepositResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/deposits/admin`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(depositData),
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
      return {
        success: false,
        message: errorMessage
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating admin deposit:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create deposit'
    };
  }
}

// Admin Withdrawal Creation
export interface AdminWithdrawalRequest {
  userId: string;
  token_name: string;
  amount: number;
  token_withdraw_address?: string;
  autoApprove?: boolean;
}

export interface AdminWithdrawalResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    token_name: string;
    amount: number;
    user: string;
    status: 'pending' | 'approved' | 'rejected';
    isWithdraw: boolean;
    isDeposit: boolean;
    createdAt: string;
    updatedAt: string;
    usdValue?: number;
    tokenPriceAtApproval?: number;
    approvedAt?: string;
  };
  usdValueDeducted?: number;
  userNewBalance?: number;
  userPreviousBalance?: number;
}

export async function createAdminWithdrawal(
  withdrawalData: AdminWithdrawalRequest
): Promise<AdminWithdrawalResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/withdraws/admin`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(withdrawalData),
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
      return {
        success: false,
        message: errorMessage
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating admin withdrawal:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create withdrawal'
    };
  }
}

// Admin Copytrade Purchase Creation
export interface AdminCopytradePurchaseRequest {
  userId: string;
  copytradeOptionId: string;
  initial_investment: number;
  autoApprove?: boolean;
}

export interface AdminCopytradePurchaseResponse {
  success: boolean;
  message: string;
  data?: {
    purchase: {
      _id: string;
      user: string;
      copytradeOption: string;
      trade_title: string;
      trade_min: number;
      trade_max: number;
      trade_risk: string;
      trade_roi_min: number;
      trade_roi_max: number;
      trade_duration: number;
      initial_investment: number;
      trade_current_value: number;
      trade_profit_loss: number;
      trade_status: 'pending' | 'active' | 'completed' | 'cancelled';
      createdAt: string;
      updatedAt: string;
      trade_start_date?: string;
      trade_end_date?: string;
      trade_approval_date?: string;
    };
    note?: string;
    deductions?: Array<{
      tokenName: string;
      tokenAmount: number;
      usdValue: number;
    }>;
    newAccountBalance?: number;
  };
}

export async function createAdminCopytradePurchase(
  purchaseData: AdminCopytradePurchaseRequest
): Promise<AdminCopytradePurchaseResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/copytrade-purchases/admin`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
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
      return {
        success: false,
        message: errorMessage
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating admin copytrade purchase:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create copytrade purchase'
    };
  }
}

