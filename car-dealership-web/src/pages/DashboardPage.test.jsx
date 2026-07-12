import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test/utils/test-utils';
import DashboardPage from './DashboardPage';
import useVehicles from '../hooks/useVehicles';

vi.mock('../hooks/useVehicles');

describe('DashboardPage', () => {
  it('renders loading state initially', () => {
    useVehicles.mockReturnValue({ loading: true, vehicles: [], error: null, fetchVehicles: vi.fn() });
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText(/curating vehicles/i)).toBeInTheDocument();
  });

  it('renders error message on API failure', () => {
    useVehicles.mockReturnValue({ loading: false, vehicles: [], error: 'Failed to load', fetchVehicles: vi.fn() });
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it('renders list of vehicles from hook', () => {
    const mockVehicles = [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2023, price: 25000, quantityInStock: 5, category: 'SEDAN' },
      { id: 2, make: 'Honda', model: 'Civic', year: 2022, price: 22000, quantityInStock: 0, category: 'SEDAN' },
    ];
    useVehicles.mockReturnValue({ loading: false, vehicles: mockVehicles, error: null, fetchVehicles: vi.fn() });
    renderWithProviders(<DashboardPage />);
    
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    
    // Toyota should be purchasable, Honda out of stock
    const buttons = screen.getAllByRole('button', { name: /purchase now|sold out/i });
    expect(buttons[0]).not.toBeDisabled(); // Toyota Purchase
    expect(buttons[1]).toBeDisabled();     // Honda Out of stock
  });

  it('handles successful vehicle purchase with optimistic update and toast', async () => {
    const mockVehicles = [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2023, price: 25000, quantityInStock: 5, category: 'SEDAN' },
    ];
    const mockPurchase = vi.fn().mockResolvedValue({});
    useVehicles.mockReturnValue({ 
      loading: false, 
      vehicles: mockVehicles, 
      error: null, 
      fetchVehicles: vi.fn(),
      purchaseVehicle: mockPurchase
    });
    
    renderWithProviders(<DashboardPage />);
    const purchaseButton = screen.getByRole('button', { name: /purchase now/i });
    await userEvent.click(purchaseButton);
    
    expect(mockPurchase).toHaveBeenCalledWith(1);
    expect(screen.getByText(/purchase successful/i)).toBeInTheDocument(); // Toast message
  });

  it('handles failed vehicle purchase with error toast', async () => {
    const mockVehicles = [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2023, price: 25000, quantityInStock: 5, category: 'SEDAN' },
    ];
    const mockPurchase = vi.fn().mockRejectedValue(new Error('Failed'));
    useVehicles.mockReturnValue({ 
      loading: false, 
      vehicles: mockVehicles, 
      error: null, 
      fetchVehicles: vi.fn(),
      purchaseVehicle: mockPurchase
    });
    
    renderWithProviders(<DashboardPage />);
    const purchaseButton = screen.getByRole('button', { name: /purchase now/i });
    await userEvent.click(purchaseButton);
    
    expect(mockPurchase).toHaveBeenCalledWith(1);
    expect(screen.getByText(/purchase failed/i)).toBeInTheDocument(); // Toast message
  });
});
