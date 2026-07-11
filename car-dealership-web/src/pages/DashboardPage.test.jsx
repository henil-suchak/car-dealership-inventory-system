import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test/utils/test-utils';
import DashboardPage from './DashboardPage';
import useVehicles from '../hooks/useVehicles';

vi.mock('../hooks/useVehicles');

describe('DashboardPage', () => {
  it('renders loading state initially', () => {
    useVehicles.mockReturnValue({ loading: true, vehicles: [], error: null, fetchVehicles: vi.fn() });
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error message on API failure', () => {
    useVehicles.mockReturnValue({ loading: false, vehicles: [], error: 'Failed to load', fetchVehicles: vi.fn() });
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it('renders list of vehicles from hook', () => {
    const mockVehicles = [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2023, price: 25000, quantityInStock: 5 },
      { id: 2, make: 'Honda', model: 'Civic', year: 2022, price: 22000, quantityInStock: 0 },
    ];
    useVehicles.mockReturnValue({ loading: false, vehicles: mockVehicles, error: null, fetchVehicles: vi.fn() });
    renderWithProviders(<DashboardPage />);
    
    expect(screen.getByText('Toyota Camry (2023)')).toBeInTheDocument();
    expect(screen.getByText('Honda Civic (2022)')).toBeInTheDocument();
    
    // Toyota should be purchasable, Honda out of stock
    const buttons = screen.getAllByRole('button', { name: /purchase|out of stock/i });
    expect(buttons[0]).not.toBeDisabled(); // Toyota Purchase
    expect(buttons[1]).toBeDisabled();     // Honda Out of stock
  });
});
