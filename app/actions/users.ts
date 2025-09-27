'use server';

import { cookies } from 'next/headers';

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roi: number;
  role: string;
  kycStatus: boolean;
  currentValue: number;
  accountStatus: boolean;
  totalInvestment: number;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  id: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  count: number;
  data: User[];
}

export async function fetchUsers(): Promise<UsersResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}