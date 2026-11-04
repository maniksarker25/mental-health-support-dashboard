import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { baseApi } from '../redux/api/baseApi';
import {
  useForgetPasswordMutation,
  useLoginMutation,
  useResendResetCodeMutation,
  useResetPasswordMutation,
  useVerifyResetCodeMutation,
} from '../redux/api/authApi';
import type { AppDispatch } from '../redux/store';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  lastLogin?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, pass: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  sendResetEmail: (email: string) => Promise<boolean>;
  resendResetCode: (email: string) => Promise<boolean>;
  verifyResetCode: (email: string, code: string) => Promise<boolean>;
  resetPassword: (email: string, newPass: string, confirmPass: string) => Promise<boolean>;
}

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'email' in value &&
    typeof value.email === 'string' &&
    'role' in value &&
    typeof value.role === 'string' &&
    'initials' in value &&
    typeof value.initials === 'string'
  );
}

function getResponseMessage(value: unknown): string | undefined {
  if (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  ) {
    return value.message;
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    typeof value.data === 'object' &&
    value.data !== null &&
    'message' in value.data &&
    typeof value.data.message === 'string'
  ) {
    return value.data.message;
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'string'
  ) {
    return value.error;
  }
  return undefined;
}

function getStoredAuthValue(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

function getStoredAdminUser(): AuthUser | null {
  const savedUser = getStoredAuthValue('mha_auth_user');
  if (!savedUser) return null;
  try {
    const parsed: unknown = JSON.parse(savedUser);
    return isAuthUser(parsed) && (parsed.role === 'superAdmin' || parsed.role === 'Super Admin')
      ? parsed
      : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const [loginRequest] = useLoginMutation();
  const [forgetPasswordRequest] = useForgetPasswordMutation();
  const [resendResetCodeRequest] = useResendResetCodeMutation();
  const [verifyResetCodeRequest] = useVerifyResetCodeMutation();
  const [resetPasswordRequest] = useResetPasswordMutation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(getStoredAuthValue('mha_access_token') && getStoredAdminUser());
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    return getStoredAdminUser();
  });

  useEffect(() => {
    localStorage.setItem('mha_auth_state', String(isAuthenticated));
    if (user) {
      const storage = localStorage.getItem('mha_access_token') ? localStorage : sessionStorage;
      storage.setItem('mha_auth_user', JSON.stringify(user));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsAuthenticated(false);
      setUser(null);
      dispatch(baseApi.util.resetApiState());
      toast.error('Your session expired. Please sign in again.');
    };

    window.addEventListener('mha:session-expired', handleSessionExpired);
    return () => window.removeEventListener('mha:session-expired', handleSessionExpired);
  }, [dispatch]);

  const login = useCallback(async (
    email: string,
    pass: string,
    rememberMe: boolean
  ): Promise<boolean> => {
    if (!email || !email.includes('@')) {
      toast.error('Please provide a valid email address.');
      return false;
    }

    if (!pass || pass.length < 4) {
      toast.error('Please enter your password.');
      return false;
    }

    try {
      const result = await loginRequest({
          email: email.trim(),
          password: pass,
          platform: 'web',
      }).unwrap();

      if (result.data.role !== 'superAdmin') {
        localStorage.removeItem('mha_access_token');
        localStorage.removeItem('mha_auth_user');
        sessionStorage.removeItem('mha_access_token');
        sessionStorage.removeItem('mha_auth_user');
        toast.error('Only a super admin account can access this dashboard.');
        return false;
      }

      if (!result.data.accessToken) {
        throw new Error('The server did not return an access token.');
      }

      const normalizedEmail = email.trim();
      const updatedUser: AuthUser = {
        id: normalizedEmail,
        name: normalizedEmail,
        email: normalizedEmail,
        role: 'Super Admin',
        initials: normalizedEmail.slice(0, 2).toUpperCase(),
        lastLogin: new Date().toISOString(),
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      const otherStorage = rememberMe ? sessionStorage : localStorage;
      storage.setItem('mha_access_token', result.data.accessToken);
      storage.setItem('mha_auth_user', JSON.stringify(updatedUser));
      otherStorage.removeItem('mha_access_token');
      otherStorage.removeItem('mha_auth_user');
      setIsAuthenticated(true);
      setUser(updatedUser);
      dispatch(baseApi.util.resetApiState());
      toast.success('Signed in successfully.');
      return true;
    } catch (error) {
      toast.error(getResponseMessage(error) || 'Unable to sign in.');
      return false;
    }
  }, [dispatch, loginRequest]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('mha_access_token');
    localStorage.removeItem('mha_auth_user');
    sessionStorage.removeItem('mha_access_token');
    sessionStorage.removeItem('mha_auth_user');
    localStorage.setItem('mha_auth_state', 'false');
    dispatch(baseApi.util.resetApiState());
    toast.info('You have been signed out.');
  }, [dispatch]);

  const sendResetEmail = useCallback(async (email: string): Promise<boolean> => {
    if (!email || !email.includes('@')) {
      toast.error('Please provide a valid email address.');
      return false;
    }
    try {
      await forgetPasswordRequest({ email: email.trim() }).unwrap();
      toast.success(`A recovery code was sent to ${email.trim()}.`);
      return true;
    } catch (error) {
      toast.error(getResponseMessage(error) || 'Could not send a recovery code.');
      return false;
    }
  }, [forgetPasswordRequest]);

  const resendResetCode = useCallback(async (email: string): Promise<boolean> => {
    try {
      await resendResetCodeRequest({ email: email.trim() }).unwrap();
      toast.success(`A new recovery code was sent to ${email.trim()}.`);
      return true;
    } catch (error) {
      toast.error(getResponseMessage(error) || 'Could not resend the recovery code.');
      return false;
    }
  }, [resendResetCodeRequest]);

  const verifyResetCode = useCallback(async (
    email: string,
    code: string
  ): Promise<boolean> => {
    const resetCode = Number(code.trim());
    if (!Number.isInteger(resetCode) || resetCode < 100000 || resetCode > 999999) {
      toast.error('Enter the six-digit verification code from your email.');
      return false;
    }
    try {
      await verifyResetCodeRequest({ email: email.trim(), resetCode }).unwrap();
      return true;
    } catch (error) {
      toast.error(getResponseMessage(error) || 'The verification code is invalid or expired.');
      return false;
    }
  }, [verifyResetCodeRequest]);

  const resetPassword = useCallback(async (
    email: string,
    newPass: string,
    confirmPass: string
  ): Promise<boolean> => {
    if (!newPass || newPass.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return false;
    }
    try {
      await resetPasswordRequest({
        email: email.trim(),
        password: newPass,
        confirmPassword: confirmPass,
      }).unwrap();
      toast.success('Password reset successfully. Please sign in with your new password.');
      return true;
    } catch (error) {
      toast.error(getResponseMessage(error) || 'Could not reset the password.');
      return false;
    }
  }, [resetPasswordRequest]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        sendResetEmail,
        resendResetCode,
        verifyResetCode,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
