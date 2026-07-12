import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VehicleForm from './VehicleForm';

describe('VehicleForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly for create mode', () => {
    render(<VehicleForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByRole('heading', { name: /add new vehicle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('renders correctly for edit mode', () => {
    const initialData = { id: 1, make: 'Ford', model: 'Focus', year: 2020, price: 15000, quantityInStock: 2, category: 'SEDAN', vin: '1FAD1234567890123' };
    render(<VehicleForm initialData={initialData} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByRole('heading', { name: /edit vehicle/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ford')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Focus')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<VehicleForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/make is required/i)).toBeInTheDocument();
      expect(screen.getByText(/model is required/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid data', async () => {
    render(<VehicleForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await userEvent.type(screen.getByLabelText(/make/i), 'Tesla');
    await userEvent.type(screen.getByLabelText(/model/i), 'Model 3');
    await userEvent.clear(screen.getByLabelText(/year/i));
    await userEvent.type(screen.getByLabelText(/year/i), '2023');
    await userEvent.clear(screen.getByLabelText(/price/i));
    await userEvent.type(screen.getByLabelText(/price/i), '45000');
    await userEvent.clear(screen.getByLabelText(/quantity/i));
    await userEvent.type(screen.getByLabelText(/quantity/i), '5');
    await userEvent.selectOptions(screen.getByLabelText(/category/i), 'SEDAN');
    await userEvent.type(screen.getByLabelText(/vin/i), '5YJ3E1EA5LF000000'); // 17 chars
    
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        price: 45000,
        quantityInStock: 5,
        category: 'SEDAN',
        vin: '5YJ3E1EA5LF000000',
        status: 'AVAILABLE'
      }));
    });
  });
});
