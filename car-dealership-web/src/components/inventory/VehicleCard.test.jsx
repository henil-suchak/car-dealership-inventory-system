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
  };

  it('renders vehicle details correctly', () => {
    useAuth.mockReturnValue({ user: { isAdmin: false } });
    render(<VehicleCard vehicle={mockVehicle} onPurchase={() => {}} />);
    
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('$25,000.00')).toBeInTheDocument();
    expect(screen.getByText('5 Available')).toBeInTheDocument();
  });

  it('disables purchase button when quantityInStock is 0', () => {
    useAuth.mockReturnValue({ user: { isAdmin: false } });
    const outOfStockVehicle = { ...mockVehicle, quantityInStock: 0 };
    render(<VehicleCard vehicle={outOfStockVehicle} onPurchase={() => {}} />);
    
    const purchaseButton = screen.getByRole('button', { name: /sold out|purchase now/i });
    expect(purchaseButton).toBeDisabled();
    expect(screen.getAllByText(/out of stock/i).length).toBeGreaterThan(0);
  });

  it('calls onPurchase when purchase button is clicked', async () => {
    useAuth.mockReturnValue({ user: { isAdmin: false } });
    const handlePurchase = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onPurchase={handlePurchase} />);
    
    await userEvent.click(screen.getByRole('button', { name: /purchase/i }));
    expect(handlePurchase).toHaveBeenCalledWith(1);
  });
});
