import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const loading = false;

  useEffect(() => {
    // Synchronize user if localStorage changes in another tab/window
    const handleStorageChange = () => {
      setUser(authService.getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email, password, requestedRole = null) => {
    const res = await authService.login(email, password, requestedRole);
    setUser(res.user);
    return res;
  };

  const quickDemoLogin = async (role) => {
    const res = await authService.quickDemoLogin(role);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role, isAuthenticated: !!user, loading, login, quickDemoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
