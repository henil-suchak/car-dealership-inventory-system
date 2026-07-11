import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test/utils/test-utils';
import AdminInventoryPage from './AdminInventoryPage';
import useVehicles from '../hooks/useVehicles';
import vehicleApi from '../api/vehicleApi';
import { AuthProvider } from '../context/AuthContext';

vi.mock('../hooks/useVehicles');
vi.mock('../api/vehicleApi');
// Mock the auth hook properly using vi.importActual inside the test setup if needed, or rely on test-utils

describe('AdminInventoryPage', () => {
  const mockVehicles = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2023, price: 25000, quantityInStock: 5, category: 'SEDAN' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useVehicles.mockReturnValue({
      vehicles: mockVehicles,
      loading: false,
      error: null,
      fetchVehicles: vi.fn(),
    });
  });

  it('renders the inventory table with edit/delete buttons', () => {
    renderWithProviders(<AdminInventoryPage />);
    
    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Camry')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restock/i })).toBeInTheDocument();
  });

  it('calls delete API when delete button is clicked and confirmed', async () => {
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    vehicleApi.deleteVehicle.mockResolvedValueOnce({});
    
    renderWithProviders(<AdminInventoryPage />);
    
    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    
    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(vehicleApi.deleteVehicle).toHaveBeenCalledWith(1);
    });
  });

  it('opens add vehicle modal when add button is clicked', async () => {
    renderWithProviders(<AdminInventoryPage />);
    
    await userEvent.click(screen.getByRole('button', { name: /add new vehicle/i }));
    
    expect(screen.getByRole('heading', { name: /add new vehicle/i })).toBeInTheDocument();
  });
});
