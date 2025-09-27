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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/deposits`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Normalize transaction data to include type field
    const normalizedData = {
      ...data,
      data: data.data.map((transaction: Omit<Transaction, 'type'>) => ({
        ...transaction,
        type: transaction.isDeposit ? 'deposit' as const : 'withdrawal' as const
      }))
    };
    
    return normalizedData;
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