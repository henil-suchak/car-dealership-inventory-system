import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import VehicleCard from './VehicleCard';
import { AuthProvider } from '../../context/AuthContext';

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});
import { useAuth } from '../../context/AuthContext';

describe('VehicleCard', () => {
  const mockVehicle = {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    category: 'SEDAN',
    price: 25000,
    quantityInStock: 5,
    status: 'AVAILABLE'
  };

  it('renders vehicle details correctly', () => {
    useAuth.mockReturnValue({ user: { isAdmin: false } });
    render(<VehicleCard vehicle={mockVehicle} onPurchase={() => {}} />);
    
    expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('$25,000.00')).toBeInTheDocument();
    expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
  });

  it('disables purchase button when quantityInStock is 0', () => {
    useAuth.mockReturnValue({ user: { isAdmin: false } });
    const outOfStockVehicle = { ...mockVehicle, quantityInStock: 0, status: 'SOLD' };
    render(<VehicleCard vehicle={outOfStockVehicle} onPurchase={() => {}} />);
    
    const purchaseButton = screen.getByRole('button', { name: /unavailable|purchase now/i });
    expect(purchaseButton).toBeDisabled();
    expect(screen.getAllByText(/SOLD/i).length).toBeGreaterThan(0);
  });

  it('calls onPurchase when purchase button is clicked', async () => {
    useAuth.mockReturnValue({ user: { isAdmin: false } });
    const handlePurchase = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onPurchase={handlePurchase} />);
    
    await userEvent.click(screen.getByRole('button', { name: /purchase now/i }));
    expect(handlePurchase).toHaveBeenCalledWith(1);
  });

  it('does NOT render admin controls for regular user', () => {
    useAuth.mockReturnValue({ user: { isAdmin: false } });
    render(<VehicleCard vehicle={mockVehicle} onPurchase={() => {}} />);
    
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /restock/i })).not.toBeInTheDocument();
  });

  it('renders admin controls for ADMIN user', () => {
    useAuth.mockReturnValue({ user: { isAdmin: true } });
    render(<VehicleCard vehicle={mockVehicle} onPurchase={() => {}} />);
    
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restock/i })).toBeInTheDocument();
  });
});
