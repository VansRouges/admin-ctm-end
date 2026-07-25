'use server';

import { cookies } from 'next/headers';

const baseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL;

export interface StockPurchaseUser {
  _id: string;
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

export interface AdminStockPurchase {
  _id: string;
  user: string | StockPurchaseUser;
  symbol: string;
  name: string;
  exchange: string;
  quantity: number;
  purchase_price: number;
  initial_investment: number;
  stock_status:
    | 'pending'
    | 'active'
    | 'pending_liquidation'
    | 'completed'
    | 'cancelled';
  current_price?: number | null;
  current_value?: number | null;
  profit_loss?: number | null;
  isProfit?: boolean | null;
  admin_final_value?: number | null;
  admin_is_profit?: boolean | null;
  liquidation_requested_at?: string | null;
  approved_at?: string | null;
  liquidated_at?: string | null;
  createdAt: string;
  updatedAt: string;
}

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function getAllStockPurchases(status?: string): Promise<{
  success: boolean;
  data: AdminStockPurchase[];
  message?: string;
}> {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, data: [], message: 'No authentication token found' };
    }

    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await fetch(`${baseUrl()}/api/v1/stock-purchases${qs}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        success: false,
        data: [],
        message: `Failed to fetch stock purchases: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { success: true, data: data.data || [] };
  } catch (error) {
    console.error('Error fetching stock purchases:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Failed to fetch stock purchases',
    };
  }
}

export async function approveStockPurchase(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: 'No authentication token found' };

    const response = await fetch(`${baseUrl()}/api/v1/stock-purchases/${id}/approve`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Failed to approve purchase' };
    }
    return { success: true, message: data.message || 'Approved' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to approve purchase',
    };
  }
}

export async function settleStockLiquidation(
  id: string,
  payload: { finalValue: number; isProfit: boolean }
): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: 'No authentication token found' };

    const response = await fetch(
      `${baseUrl()}/api/v1/stock-purchases/${id}/settle-liquidation`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Failed to settle liquidation' };
    }
    return { success: true, message: data.message || 'Settled' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to settle liquidation',
    };
  }
}

export async function rejectStockPurchase(
  id: string,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: 'No authentication token found' };

    const response = await fetch(`${baseUrl()}/api/v1/stock-purchases/${id}/reject`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
      cache: 'no-store',
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Failed to reject' };
    }
    return { success: true, message: data.message || 'Rejected' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to reject',
    };
  }
}
