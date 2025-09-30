'use server';

import { cookies } from 'next/headers';

export interface CopyTradeOption {
  _id: string;
  trade_title: string;
  trade_max: number;
  trade_min: number;
  user: string;
  trade_description: string;
  trade_roi_min: number;
  trade_roi_max: number;
  isRecommended: boolean;
  trade_risk: string;
  trade_duration: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CopyTradeOptionsResponse {
  success: boolean;
  data: CopyTradeOption[];
  message?: string;
}

export interface CopyTradeOptionResponse {
  success: boolean;
  data: CopyTradeOption;
  message?: string;
}

export interface CreateCopyTradeOptionRequest {
  trade_title: string;
  trade_max: number;
  trade_min: number;
  trade_description: string;
  trade_roi_min: number;
  trade_roi_max: number;
  isRecommended: boolean;
  trade_risk: string;
  trade_duration: number;
  user?: string; // Optional since we'll set it internally
}

export interface UpdateCopyTradeOptionRequest {
  trade_title?: string;
  trade_max?: number;
  trade_min?: number;
  trade_description?: string;
  trade_roi_min?: number;
  trade_roi_max?: number;
  isRecommended?: boolean;
  trade_risk?: string;
  trade_duration?: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: CopyTradeOption | null;
}

/**
 * Fetch all copy trading options
 */
export async function getCopyTradeOptions(): Promise<CopyTradeOptionsResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        data: [],
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/copytrading-options`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch copy trade options: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data || [],
      message: data.message
    };
  } catch (error) {
    console.error('Error fetching copy trade options:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Failed to fetch copy trade options'
    };
  }
}

/**
 * Create a new copy trading option
 */
export async function createCopyTradeOption(
  tradeData: CreateCopyTradeOptionRequest
): Promise<CopyTradeOptionResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        data: {} as CopyTradeOption,
        message: 'Authentication token not found'
      };
    }

    // Add the default admin user ID to the request
    const requestData = {
      ...tradeData,
      user: "6897a73e63d62b4a2878ab4c" // Default admin user ID
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/copytrading-options`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create copy trade option: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data,
      message: data.message || 'Copy trade option created successfully'
    };
  } catch (error) {
    console.error('Error creating copy trade option:', error);
    return {
      success: false,
      data: {} as CopyTradeOption,
      message: error instanceof Error ? error.message : 'Failed to create copy trade option'
    };
  }
}

/**
 * Update an existing copy trading option
 */
export async function updateCopyTradeOption(
  tradeId: string,
  updateData: UpdateCopyTradeOptionRequest
): Promise<CopyTradeOptionResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        data: {} as CopyTradeOption,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/copytrading-options/${tradeId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update copy trade option: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data,
      message: data.message || 'Copy trade option updated successfully'
    };
  } catch (error) {
    console.error('Error updating copy trade option:', error);
    return {
      success: false,
      data: {} as CopyTradeOption,
      message: error instanceof Error ? error.message : 'Failed to update copy trade option'
    };
  }
}

/**
 * Delete a copy trading option
 */
export async function deleteCopyTradeOption(tradeId: string): Promise<ApiResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/copytrading-options/${tradeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete copy trade option: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.message || 'Copy trade option deleted successfully',
      data: data.data
    };
  } catch (error) {
    console.error('Error deleting copy trade option:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete copy trade option'
    };
  }
}

/**
 * Get a single copy trading option by ID
 */
export async function getCopyTradeOptionById(tradeId: string): Promise<CopyTradeOptionResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        data: {} as CopyTradeOption,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/copytrading-options/${tradeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch copy trade option: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data,
      message: data.message
    };
  } catch (error) {
    console.error('Error fetching copy trade option:', error);
    return {
      success: false,
      data: {} as CopyTradeOption,
      message: error instanceof Error ? error.message : 'Failed to fetch copy trade option'
    };
  }
}