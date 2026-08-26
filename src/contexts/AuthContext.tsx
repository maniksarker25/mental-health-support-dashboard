import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

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
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  sendResetEmail: (email: string) => Promise<boolean>;
  resetPassword: (code: string, newPass: string) => Promise<boolean>;
}

const DEFAULT_USER: AuthUser = {
  id: 'usr-admin-1',
  name: 'Dr. Sarah Jenkins',
  email: 'admin@mentalhealth.org',
  role: 'Clinical Lead & SysAdmin',
  initials: 'SJ',
  lastLogin: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('mha_auth_state');
    return saved ? saved === 'true' : true; // Default logged in for immediate usability, toggleable
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('mha_auth_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    localStorage.setItem('mha_auth_state', String(isAuthenticated));
    if (user) {
      localStorage.setItem('mha_auth_user', JSON.stringify(user));
    }
  }, [isAuthenticated, user]);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    // Simulated network authentication delay
    await new Promise((res) => setTimeout(res, 450));

    if (!email || !email.includes('@')) {
      toast.error('Please provide a valid email address.');
      return false;
    }

    if (!pass || pass.length < 4) {
      toast.error('Please enter your password.');
      return false;
    }

    const updatedUser: AuthUser = {
      ...DEFAULT_USER,
      email: email.trim(),
      lastLogin: new Date().toISOString(),
    };

    setIsAuthenticated(true);
    setUser(updatedUser);
    toast.success(`Welcome back, ${updatedUser.name}!`);
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.setItem('mha_auth_state', 'false');
    toast.info('You have been signed out.');
  }, []);

  const sendResetEmail = useCallback(async (email: string): Promise<boolean> => {
    await new Promise((res) => setTimeout(res, 500));
    if (!email || !email.includes('@')) {
      toast.error('Please provide a valid email address.');
      return false;
    }
    toast.success(`Password reset link sent to ${email}`);
    return true;
  }, []);

  const resetPassword = useCallback(async (code: string, newPass: string): Promise<boolean> => {
    await new Promise((res) => setTimeout(res, 500));
    if (!code || code.trim().length < 4) {
      toast.error('Invalid or expired verification code.');
      return false;
    }
    if (!newPass || newPass.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return false;
    }
    toast.success('Password successfully reset! Please sign in with your new password.');
    return true;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        sendResetEmail,
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
