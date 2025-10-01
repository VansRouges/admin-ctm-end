"use server";

import { cookies } from "next/headers";

// Support ticket interfaces based on API response structure
export interface SupportTicket {
  _id: string;
  user: string;
  full_name: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  title: string;
  message: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateSupportTicketRequest {
  user: string;
  full_name: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  title: string;
  message: string;
  email: string;
}

export interface UpdateSupportTicketRequest {
  status: "open" | "in_progress" | "resolved" | "closed";
}

// API Response types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface SupportTicketListResponse {
  success: boolean;
  data: SupportTicket[];
  count?: number;
}

const API_BASE_URL = "https://ctm-backend-production-fb7c.up.railway.app/api/v1";

// Allowed statuses
const ALLOWED_STATUSES = ['open', 'in_progress', 'resolved', 'closed'] as const;

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
 * Get all user support tickets
 */
export async function getSupportTickets(): Promise<SupportTicketListResponse> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/user-support`, {
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
      data: data.data || [],
      count: data.count || 0,
    };
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return {
      success: false,
      data: [],
      count: 0,
    };
  }
}

/**
 * Create a new support ticket
 */
export async function createSupportTicket(ticketData: CreateSupportTicketRequest): Promise<ApiResponse<SupportTicket>> {
  try {
    // Validate status
    if (!ALLOWED_STATUSES.includes(ticketData.status)) {
      throw new Error(`Invalid status. Allowed statuses: ${ALLOWED_STATUSES.join(', ')}`);
    }

    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/user-support`, {
      method: "POST",
      headers,
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "Support ticket created successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create support ticket",
      data: {} as SupportTicket,
    };
  }
}

/**
 * Update support ticket status
 */
export async function updateSupportTicketStatus(
  ticketId: string,
  updateData: UpdateSupportTicketRequest
): Promise<ApiResponse<SupportTicket>> {
  try {
    // Validate status
    if (!ALLOWED_STATUSES.includes(updateData.status)) {
      throw new Error(`Invalid status. Allowed statuses: ${ALLOWED_STATUSES.join(', ')}`);
    }

    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/user-support/${ticketId}`, {
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
      message: data.message || "Support ticket updated successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error updating support ticket:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update support ticket",
      data: {} as SupportTicket,
    };
  }
}

/**
 * Delete a support ticket
 */
export async function deleteSupportTicket(ticketId: string): Promise<ApiResponse<SupportTicket>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/user-support/${ticketId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "Support ticket deleted successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error deleting support ticket:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete support ticket",
      data: {} as SupportTicket,
    };
  }
}

/**
 * Get a single support ticket by ID
 */
export async function getSupportTicketById(ticketId: string): Promise<ApiResponse<SupportTicket>> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/user-support/${ticketId}`, {
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
      message: "Support ticket retrieved successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching support ticket:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch support ticket",
      data: {} as SupportTicket,
    };
  }
}

/**
 * Helper function to validate status
 */
export function isValidStatus(status: string): status is SupportTicket['status'] {
  return ALLOWED_STATUSES.includes(status as SupportTicket['status']);
}

/**
 * Get all allowed statuses
 */
export function getAllowedStatuses(): readonly string[] {
  return ALLOWED_STATUSES;
}