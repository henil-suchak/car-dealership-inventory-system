import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import * as apiClientModule from '../api/apiClient';
import { jwtDecode } from 'jwt-decode';

// Mock jwt-decode to avoid needing a real JWT format
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

describe('AuthContext', () => {
  it('useAuth throws error if used outside of AuthProvider', () => {
    // Suppress console.error for this expected error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');
    consoleSpy.mockRestore();
  });

  it('provides default unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('login updates user state and sets API token', () => {
    const setTokenSpy = vi.spyOn(apiClientModule, 'setToken');
    
    // Mock decoded payload
    const mockUser = { sub: 'admin@dealership.com', roles: ['ROLE_ADMIN'] };
    jwtDecode.mockReturnValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      result.current.login('fake-jwt-token');
    });

    expect(setTokenSpy).toHaveBeenCalledWith('fake-jwt-token');
    expect(result.current.user).toEqual({
      email: 'admin@dealership.com',
      roles: ['ROLE_ADMIN'],
      isAdmin: true,
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logout clears user state and API token', () => {
    const setTokenSpy = vi.spyOn(apiClientModule, 'setToken');
    jwtDecode.mockReturnValue({ sub: 'user@dealership.com', roles: ['ROLE_USER'] });
    
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    // Login first
    act(() => {
      result.current.login('fake-jwt-token');
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(setTokenSpy).toHaveBeenCalledWith(null);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
