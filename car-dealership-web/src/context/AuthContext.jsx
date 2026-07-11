import React, { createContext, useContext, useState, useMemo } from 'react';
import { setToken } from '../api/apiClient';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (token) => {
    setToken(token);
    try {
      const decoded = jwtDecode(token);
      // Spring Security defaults subject to the username/email
      setUser({
        email: decoded.sub,
        roles: decoded.roles || [],
        isAdmin: decoded.roles?.includes('ROLE_ADMIN') || false
      });
    } catch (e) {
      console.error('Invalid token', e);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
