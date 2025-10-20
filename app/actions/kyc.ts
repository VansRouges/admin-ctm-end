'use server';

import { cookies } from 'next/headers';

export interface KYCUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface KYCDocument {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface KYCAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface KYC {
  _id: string;
  userId: KYCUser;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: KYCAddress;
  documents: {
    validId?: KYCDocument;
    passport?: KYCDocument;
    proofOfAddress?: KYCDocument;
    selfie?: KYCDocument;
  };
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  reviewedBy: string | null;
  reviewedAt: string | null;
  submittedAt: string;
  resubmissionCount: number;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
  age?: number;
  daysSinceSubmission?: number;
  documentCount?: number;
  canResubmit?: boolean;
}

export interface KYCsResponse {
  success: boolean;
  kycs: KYC[];
  pagination: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
}

export interface KYCDetailResponse {
  success: boolean;
  kyc: KYC;
}

export interface KYCUpdateResponse {
  success: boolean;
  message: string;
  kyc: KYC;
}

export async function getAllKYCs(params?: {
  status?: 'pending' | 'approved' | 'rejected' | 'under_review';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<KYCsResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/kyc/admin/all${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch KYCs: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching KYCs:', error);
    throw error;
  }
}

export async function getKYCById(kycId: string): Promise<KYCDetailResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/kyc/admin/${kycId}`;
    console.log('Fetching KYC from URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch KYC: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching KYC:', error);
    throw error;
  }
}

export async function updateKYCStatus(
  kycId: string, 
  status: 'approved' | 'rejected' | 'under_review' | 'pending'
): Promise<KYCUpdateResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/kyc/admin/${kycId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update KYC status: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating KYC status:', error);
    throw error;
  }
}

export async function deleteKYC(kycId: string): Promise<{ success: boolean; message: string; kyc: KYC }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/kyc/admin/${kycId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete KYC: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting KYC:', error);
    throw error;
  }
}
