import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test/utils/test-utils';
import AdminRoute from './AdminRoute';
import * as AuthContextModule from '../context/AuthContext';
import { Routes, Route } from 'react-router-dom';

describe('AdminRoute', () => {
  it('redirects to / if user is not an admin', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ 
      isAuthenticated: true, 
      user: { isAdmin: false } 
    });

    renderWithProviders(
      <Routes>
        <Route path="/admin" element={
          <AdminRoute>
            <div data-testid="admin-content">Admin Content</div>
          </AdminRoute>
        } />
        <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
      </Routes>,
      { initialEntries: ['/admin'] }
    );

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
  });

  it('renders children if user is an admin', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ 
      isAuthenticated: true, 
      user: { isAdmin: true } 
    });

    renderWithProviders(
      <Routes>
        <Route path="/admin" element={
          <AdminRoute>
            <div data-testid="admin-content">Admin Content</div>
          </AdminRoute>
        } />
      </Routes>,
      { initialEntries: ['/admin'] }
    );

    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
  });
});
