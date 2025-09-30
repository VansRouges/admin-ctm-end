'use server';

import { cookies } from 'next/headers';

export interface Transaction {
  _id: string;
  token_name: string;
  isWithdraw: boolean;
  isDeposit: boolean;
  amount: number;
  token_deposit_address?: string;
  token_withdraw_address?: string;
  user: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  __v: number;
  type: 'deposit' | 'withdrawal';
}

export interface TransactionsResponse {
  success: boolean;
  data: Transaction[];
  count: number;
}

export interface TransactionStats {
  pendingDeposits: number;
  pendingWithdrawals: number;
  approvedToday: number;
  rejectedToday: number;
}

export interface UpdateTransactionStatusResponse {
  success: boolean;
  message: string;
  data?: Transaction;
}

export async function updateDepositStatus(
  depositId: string, 
  status: 'approved' | 'rejected' | 'pending'
): Promise<UpdateTransactionStatusResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/deposits/${depositId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(`Failed to update deposit status: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.message || `Deposit ${status} successfully`,
      data: data.data
    };
  } catch (error) {
    console.error('Error updating deposit status:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update deposit status'
    };
  }
}

export async function updateWithdrawalStatus(
  withdrawalId: string, 
  status: 'approved' | 'rejected' | 'pending'
): Promise<UpdateTransactionStatusResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/withdraws/${withdrawalId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(`Failed to update withdrawal status: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.message || `Withdrawal ${status} successfully`,
      data: data.data
    };
  } catch (error) {
    console.error('Error updating withdrawal status:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update withdrawal status'
    };
  }
}

export async function updateTransactionStatus(
  transactionId: string,
  transactionType: 'deposit' | 'withdrawal',
  status: 'approved' | 'rejected' | 'pending'
): Promise<UpdateTransactionStatusResponse> {
  if (transactionType === 'deposit') {
    return updateDepositStatus(transactionId, status);
  } else {
    return updateWithdrawalStatus(transactionId, status);
  }
}

export async function fetchTransactions(): Promise<TransactionsResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      // Return empty data structure when no token is found
      // This prevents the error but shows no data
      return {
        success: false,
        data: [],
        count: 0
      };
    }

    // Fetch both deposits and withdrawals in parallel
    const [depositsResponse, withdrawalsResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/deposits`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/withdraws`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    ]);

    if (!depositsResponse.ok || !withdrawalsResponse.ok) {
      throw new Error(`Failed to fetch transactions: ${depositsResponse.statusText} / ${withdrawalsResponse.statusText}`);
    }

    const [depositsData, withdrawalsData] = await Promise.all([
      depositsResponse.json(),
      withdrawalsResponse.json()
    ]);
    
    // Normalize and combine transaction data
    const normalizedDeposits = depositsData.data.map((transaction: Omit<Transaction, 'type'>) => ({
      ...transaction,
      type: 'deposit' as const
    }));

    const normalizedWithdrawals = withdrawalsData.data.map((transaction: Omit<Transaction, 'type'>) => ({
      ...transaction,
      type: 'withdrawal' as const
    }));

    // Combine all transactions
    const allTransactions = [...normalizedDeposits, ...normalizedWithdrawals];
    
    // Sort by creation date (newest first)
    allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      success: true,
      data: allTransactions,
      count: allTransactions.length
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    // Return empty data structure on any error to prevent page crash
    return {
      success: false,
      data: [],
      count: 0
    };
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetchTransactions();
  return response.data;
}

export async function calculateTransactionStats(transactions: Transaction[]): Promise<TransactionStats> {
  const today = new Date().toDateString();
  
  return {
    pendingDeposits: transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length,
    pendingWithdrawals: transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending').length,
    approvedToday: transactions.filter(t => {
      const transactionDate = new Date(t.updatedAt).toDateString();
      return t.status === 'approved' && transactionDate === today;
    }).length,
    rejectedToday: transactions.filter(t => {
      const transactionDate = new Date(t.updatedAt).toDateString();
      return t.status === 'rejected' && transactionDate === today;
    }).length,
  };
}