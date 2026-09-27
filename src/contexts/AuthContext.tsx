import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, ServiceProvider } from '../types';
import { storageService } from '../services/storageService';
import { auth, onAuthStateChanged, signInWithGoogle, logoutUser } from '../services/firebase';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  currentProvider?: ServiceProvider;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('roadresq_user_role') as UserRole) || 'CUSTOMER';
  });

  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('roadresq_logged_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      id: 'guest-user',
      name: 'Guest Motorist',
      email: '',
      phone: '',
      role: 'CUSTOMER',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      selectedLanguage: 'en',
      theme: 'system',
      createdAt: new Date().toISOString(),
    };
  });

  const providers = storageService.getProviders();
  const currentProvider = providers[0];

  useEffect(() => {
    // Listen to live Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        const userProfile: UserProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Google User',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          role: currentRole,
          avatarUrl:
            firebaseUser.photoURL ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          selectedLanguage: 'en',
          theme: 'system',
          createdAt: new Date().toISOString(),
        };
        setCurrentUserState(userProfile);
        localStorage.setItem('roadresq_logged_user', JSON.stringify(userProfile));
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentRole]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const user = await signInWithGoogle();
      if (user) {
        setIsAuthenticated(true);
        const userProfile: UserProfile = {
          id: user.uid,
          name: user.displayName || 'Google User',
          email: user.email || '',
          phone: user.phoneNumber || '',
          role: currentRole,
          avatarUrl:
            user.photoURL ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          selectedLanguage: 'en',
          theme: 'system',
          createdAt: new Date().toISOString(),
        };
        setCurrentUserState(userProfile);
        localStorage.setItem('roadresq_logged_user', JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      localStorage.removeItem('roadresq_logged_user');
      setCurrentUserState({
        id: 'guest-user',
        name: 'Guest Motorist',
        email: '',
        phone: '',
        role: 'CUSTOMER',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        selectedLanguage: 'en',
        theme: 'system',
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const setUserRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('roadresq_user_role', role);
    setCurrentUserState((prev) => ({ ...prev, role }));
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUserState(updated);
    localStorage.setItem('roadresq_logged_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        isLoading,
        signInWithGoogle: handleGoogleSignIn,
        logout: handleLogout,
        updateCurrentUser,
        currentProvider,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
