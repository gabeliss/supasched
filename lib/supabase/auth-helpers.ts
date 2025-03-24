import { toast } from 'sonner';
import { supabase } from './client';
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string, router: AppRouterInstance) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    toast.success("Successfully signed in!");
    
    // Redirect to dashboard after successful login
    router.replace('/dashboard');
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Login error:', error);
    toast.error(error.message || 'Failed to sign in. Please check your credentials.');
    return { data: null, error };
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  userData: Record<string, any>,
  router: AppRouterInstance
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    if (error) {
      throw error;
    }
    
    toast.success("Account created! Please check your email for verification.");
    
    // Redirect to login page
    router.replace('/login');
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Signup error:', error);
    toast.error(error.message || 'Failed to create account. Please try again.');
    return { data: null, error };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (router: AppRouterInstance) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    toast.success("Successfully signed out!");
    
    // Redirect to home page after sign out
    router.replace('/');
    
    return { error: null };
  } catch (error: any) {
    console.error('Sign out error:', error);
    toast.error(error.message || 'Failed to sign out.');
    return { error };
  }
};

/**
 * Check if user is authenticated and redirect if necessary
 */
export const checkAuth = async (router: AppRouterInstance, redirectTo: string = '/dashboard') => {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    router.replace(redirectTo);
    return true;
  }
  return false;
};

/**
 * Check if user is not authenticated and redirect if necessary
 */
export const checkUnauth = async (router: AppRouterInstance, redirectTo: string = '/login') => {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    router.replace(redirectTo);
    return true;
  }
  return false;
}; 