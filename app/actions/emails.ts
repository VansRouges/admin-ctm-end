"use server";

import { cookies } from "next/headers";

// Email interfaces based on API response structure
export interface Email {
  _id: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  status: string;
  email_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateEmailRequest {
  from: string;
  to: string;
  subject: string;
  message: string;
  status: string;
  email_id: string;
}

export interface UpdateEmailRequest {
  subject?: string;
  message?: string;
  status?: string;
}

// API Response types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface EmailListResponse {
  success: boolean;
  data: Email[];
  count: number;
}

const API_BASE_URL = "https://ctm-backend-production-fb7c.up.railway.app/api/v1";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("No authentication token found");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Get all admin emails
 */
export async function getEmails(): Promise<EmailListResponse> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/admin-emails`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Sort by most recent first (createdAt descending)
    const sortedData = (data.data || []).sort((a: Email, b: Email) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return {
      success: true,
      data: sortedData,
      count: data.count || 0,
    };
  } catch (error) {
    console.error("Error fetching emails:", error);
    return {
      success: false,
      data: [],
      count: 0,
    };
  }
}

/**
 * Create a new admin email
 */
export async function createEmail(emailData: CreateEmailRequest): Promise<ApiResponse<Email>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/admin-emails`, {
      method: "POST",
      headers,
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "Admin email created successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error creating email:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create email",
      data: {} as Email,
    };
  }
}

/**
 * Update an existing admin email
 */
export async function updateEmail(
  emailId: string,
  updateData: UpdateEmailRequest
): Promise<ApiResponse<Email>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/admin-emails/${emailId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "Admin email updated successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error updating email:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update email",
      data: {} as Email,
    };
  }
}

/**
 * Delete an admin email
 */
export async function deleteEmail(emailId: string): Promise<ApiResponse<Email>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/admin-emails/${emailId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "Admin email deleted successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error deleting email:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete email",
      data: {} as Email,
    };
  }
}

/**
 * Get a single admin email by ID
 */
export async function getEmailById(emailId: string): Promise<ApiResponse<Email>> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/admin-emails/${emailId}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: "Email retrieved successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching email:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch email",
      data: {} as Email,
    };
  }
}