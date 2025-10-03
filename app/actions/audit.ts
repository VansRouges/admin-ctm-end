'use server';

import { cookies } from 'next/headers';

export interface AuditLog {
  _id: string;
  admin: {
    id: string;
    username: string;
    email: string;
  };
  action: string;
  resource: {
    type: string;
    id: string;
    name: string;
  };
  changes?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
  metadata: {
    ip: string;
    userAgent: string;
    statusCode: number;
    method: string;
    endpoint: string;
  };
  description: string;
  createdAt: string;
}

export interface AuditLogsResponse {
  success: boolean;
  message: string;
  data: AuditLog[];
  totalCount: number;
  cached?: boolean;
  source?: string;
}

export interface AuditStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalLogs: number;
    topActions: Array<{ _id: string; count: number }>;
    resourceBreakdown: Array<{ _id: string; count: number }>;
    recentActivity: AuditLog[];
  };
}

export async function getAuditLogs(params?: {
  action?: string;
  resourceType?: string;
  adminId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<AuditLogsResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.action) queryParams.append('action', params.action);
    if (params?.resourceType) queryParams.append('resourceType', params.resourceType);
    if (params?.adminId) queryParams.append('adminId', params.adminId);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/audit-logs${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch audit logs: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
}

export async function getAuditLogById(auditLogId: string): Promise<{ success: boolean; message: string; data: AuditLog }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/audit-logs/${auditLogId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch audit log: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching audit log:', error);
    throw error;
  }
}

export async function getAuditStats(): Promise<AuditStatsResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/audit-logs/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch audit stats: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching audit stats:', error);
    throw error;
  }
}

export async function getAuditLogsByAdmin(adminId: string): Promise<{ success: boolean; message: string; data: AuditLog[]; count: number }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/audit-logs/admin/${adminId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch admin audit logs: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching admin audit logs:', error);
    throw error;
  }
}
