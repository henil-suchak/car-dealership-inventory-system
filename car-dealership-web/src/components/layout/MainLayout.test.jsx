import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from './MainLayout';
import * as AuthContext from '../../context/AuthContext';
import { vi } from 'vitest';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock Outlet from react-router-dom to simulate child routes
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet-content">Outlet Content</div>,
  };
});

describe('MainLayout Component', () => {
  beforeEach(() => {
    AuthContext.useAuth.mockReturnValue({
      user: { role: 'USER', email: 'test@example.com' },
      logout: vi.fn(),
    });
  });

  it('renders Navbar and Outlet', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    );

    // Navbar should be rendered (Dashboard link exists)
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Outlet should be rendered
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });
});
