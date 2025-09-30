'use server';

import { cookies } from 'next/headers';

export interface CryptoOption {
  _id: string;
  token_name: string;
  token_address: string;
  user: string;
  token_symbol: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CryptoOptionsResponse {
  success: boolean;
  data: CryptoOption[];
  message?: string;
}

export interface CryptoOptionResponse {
  success: boolean;
  data: CryptoOption;
  message?: string;
}

export interface CreateCryptoOptionRequest {
  token_name: string;
  token_address: string;
  token_symbol: string;
  user?: string; // Optional since we'll set it internally
}

export interface UpdateCryptoOptionRequest {
  token_name?: string;
  token_address?: string;
  token_symbol?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: CryptoOption | null;
}

/**
 * Fetch all cryptocurrency options
 */
export async function getCryptoOptions(): Promise<CryptoOptionsResponse> {
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/crypto-options`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch crypto options: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data || [],
      message: data.message
    };
  } catch (error) {
    console.error('Error fetching crypto options:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Failed to fetch crypto options'
    };
  }
}

/**
 * Create a new cryptocurrency option
 */
export async function createCryptoOption(
  cryptoData: CreateCryptoOptionRequest
): Promise<CryptoOptionResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        data: {} as CryptoOption,
        message: 'Authentication token not found'
      };
    }

    // Add the default admin user ID to the request
    const requestData = {
      ...cryptoData,
      user: "6897a73e63d62b4a2878ab4c" // Default admin user ID
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/crypto-options`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create crypto option: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data,
      message: data.message || 'Crypto option created successfully'
    };
  } catch (error) {
    console.error('Error creating crypto option:', error);
    return {
      success: false,
      data: {} as CryptoOption,
      message: error instanceof Error ? error.message : 'Failed to create crypto option'
    };
  }
}

/**
 * Update an existing cryptocurrency option
 */
export async function updateCryptoOption(
  cryptoId: string,
  updateData: UpdateCryptoOptionRequest
): Promise<CryptoOptionResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        data: {} as CryptoOption,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/crypto-options/${cryptoId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update crypto option: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data,
      message: data.message || 'Crypto option updated successfully'
    };
  } catch (error) {
    console.error('Error updating crypto option:', error);
    return {
      success: false,
      data: {} as CryptoOption,
      message: error instanceof Error ? error.message : 'Failed to update crypto option'
    };
  }
}

/**
 * Delete a cryptocurrency option
 */
export async function deleteCryptoOption(cryptoId: string): Promise<ApiResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/crypto-options/${cryptoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete crypto option: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.message || 'Crypto option deleted successfully',
      data: data.data
    };
  } catch (error) {
    console.error('Error deleting crypto option:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete crypto option'
    };
  }
}

/**
 * Get a single cryptocurrency option by ID
 */
export async function getCryptoOptionById(cryptoId: string): Promise<CryptoOptionResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        success: false,
        data: {} as CryptoOption,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/crypto-options/${cryptoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch crypto option: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data,
      message: data.message
    };
  } catch (error) {
    console.error('Error fetching crypto option:', error);
    return {
      success: false,
      data: {} as CryptoOption,
      message: error instanceof Error ? error.message : 'Failed to fetch crypto option'
    };
  }
}