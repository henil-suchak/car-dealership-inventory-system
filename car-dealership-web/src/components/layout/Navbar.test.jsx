import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import * as AuthContext from '../../context/AuthContext';
import { vi } from 'vitest';

// Mock the auth context
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Navbar Component', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Dashboard and Logout links for regular USER', () => {
    AuthContext.useAuth.mockReturnValue({
      user: { role: 'USER', email: 'test@example.com' },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Admin Inventory')).not.toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders Admin Inventory link for ADMIN', () => {
    AuthContext.useAuth.mockReturnValue({
      user: { role: 'ADMIN', email: 'admin@example.com' },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Admin Inventory')).toBeInTheDocument();
  });

  it('calls logout function when Logout is clicked', () => {
    AuthContext.useAuth.mockReturnValue({
      user: { role: 'USER', email: 'test@example.com' },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
