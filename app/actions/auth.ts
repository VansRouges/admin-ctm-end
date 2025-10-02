'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return {
      error: 'Username and password are required'
    };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Store the token in a cookie on the server side
      const cookieStore = await cookies();
      cookieStore.set('token', data.data.token, {
        path: '/',
        maxAge: 86400, // 24 hours
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true, // More secure - prevents client-side access
      });
    } else {
      return {
        error: data.message || 'Login failed. Please check your credentials.'
      };
    }
  } catch (err) {
    console.error('Login error:', err);
    return {
      error: 'Network error. Please try again.'
    };
  }

  // Redirect to dashboard after successful login (outside try-catch to avoid catching redirect)
  redirect('/dashboard');
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    // Call the logout endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }

    // Delete the token cookie
    cookieStore.delete('token');

    return {
      success: true,
      message: data.message || 'Logout successful'
    };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}