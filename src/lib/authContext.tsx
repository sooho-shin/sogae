'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface KakaoUser {
  id: string; // Kakao unique ID or account ID
  nickname: string;
  profileImage?: string;
  connectedAt?: string;
}

interface AuthContextType {
  user: KakaoUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (userData: KakaoUser) => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<KakaoUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Load saved session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sogaenamnyeo_kakao_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) {
            setUser(parsed);
          }
        }
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const login = (userData: KakaoUser) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sogaenamnyeo_kakao_user', JSON.stringify(userData));
    }
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sogaenamnyeo_kakao_user');
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: Boolean(user),
        login,
        logout,
        openLoginModal,
        closeLoginModal,
        isLoginModalOpen,
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
