import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test/utils/test-utils';
import ProtectedRoute from './ProtectedRoute';
import * as AuthContextModule from '../context/AuthContext';
import { Routes, Route } from 'react-router-dom';

describe('ProtectedRoute', () => {
  it('redirects to /login if user is not authenticated', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ isAuthenticated: false });

    renderWithProviders(
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <div data-testid="protected-content">Secret Content</div>
          </ProtectedRoute>
        } />
        <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
      </Routes>,
      { initialEntries: ['/'] }
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('renders children if user is authenticated', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ isAuthenticated: true });

    renderWithProviders(
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <div data-testid="protected-content">Secret Content</div>
          </ProtectedRoute>
        } />
      </Routes>,
      { initialEntries: ['/'] }
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
