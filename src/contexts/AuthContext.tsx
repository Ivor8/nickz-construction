import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import type { AdminProfile } from '@/lib/types';

interface AuthContextType {
  user: AdminProfile | null;
  profile: AdminProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminProfile | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      const adminData = response.admin;
      setUser(adminData);
      setProfile(adminData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      localStorage.removeItem('authToken');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('authToken', response.token);
      setUser(response.admin);
      setProfile(response.admin);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signOut,
      isSuperAdmin: profile?.role === 'super_admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
