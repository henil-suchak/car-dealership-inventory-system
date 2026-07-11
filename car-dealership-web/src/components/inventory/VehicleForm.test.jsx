import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
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
    const initialData = { id: 1, make: 'Ford', model: 'Focus', year: 2020, price: 15000, quantityInStock: 2, category: 'SEDAN' };
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
      // Year has a default value so it might not show an error, but let's clear it first if we want to test year validation
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid data', async () => {
    render(<VehicleForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const makeInput = screen.getByLabelText(/make/i);
    const modelInput = screen.getByLabelText(/model/i);
    const yearInput = screen.getByLabelText(/year/i);
    const priceInput = screen.getByLabelText(/price/i);
    const quantityInput = screen.getByLabelText(/quantity/i);
    
    await userEvent.clear(makeInput);
    await userEvent.type(makeInput, 'Tesla');
    
    await userEvent.clear(modelInput);
    await userEvent.type(modelInput, 'Model 3');
    
    await userEvent.clear(yearInput);
    await userEvent.type(yearInput, '2023');
    
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, '45000');
    
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, '5');
    await userEvent.selectOptions(screen.getByLabelText(/category/i), 'SEDAN');
    
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        price: 45000,
        quantityInStock: 5,
        category: 'SEDAN',
      });
    });
  });
});
