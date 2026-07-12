import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import * as AuthContext from '../context/AuthContext';
import { vi } from 'vitest';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('AppRoutes Integration', () => {
  it('renders Navbar on protected dashboard route', () => {
    AuthContext.useAuth.mockReturnValue({
      user: { role: 'USER', email: 'test@example.com' },
      isAuthenticated: true,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    // Should see the Navbar
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders Navbar on protected admin route', () => {
    AuthContext.useAuth.mockReturnValue({
      user: { role: 'ADMIN', email: 'admin@example.com' },
      isAuthenticated: true,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/admin/inventory']}>
        <AppRoutes />
      </MemoryRouter>
    );

    // Should see the Navbar
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('does NOT render Navbar on public login route', () => {
    AuthContext.useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRoutes />
      </MemoryRouter>
    );

    // Should NOT see the Navbar
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
