'use server';

import { cookies } from 'next/headers';

export interface Notification {
  _id: string;
  action: 'user_created' | 'deposit' | 'withdraw' | 'copytrade_purchase' | 'support_ticket';
  description: string;
  status: 'unread' | 'read';
  metadata: {
    userId: string;
    userEmail: string;
    amount?: number;
    currency?: string;
    referenceId?: string;
    additionalInfo?: Record<string, unknown>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: Notification[];
  totalCount: number;
  unreadCount: number;
  cached?: boolean;
  source?: string;
}

export interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
  };
}

export async function getNotifications(params?: {
  status?: 'unread' | 'read';
  action?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<NotificationsResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.action) queryParams.append('action', params.action);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notifications${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export async function getNotificationById(notificationId: string): Promise<{ success: boolean; message: string; data: Notification }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notifications/${notificationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notification: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notification:', error);
    throw error;
  }
}

export async function updateNotificationStatus(notificationId: string, status: 'read' | 'unread'): Promise<{ success: boolean; message: string; data: Notification }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notifications/${notificationId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update notification status: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error;
  }
}

export async function markAllAsRead(): Promise<{ success: boolean; message: string; data: { modifiedCount: number } }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notifications/mark-all-read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to mark all as read: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error marking all as read:', error);
    throw error;
  }
}

export async function deleteNotification(notificationId: string): Promise<{ success: boolean; message: string; data: Notification }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete notification: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notifications/unread-count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch unread count: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
}
