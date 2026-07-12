import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders input fields for all search criteria', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    expect(screen.getByPlaceholderText(/SEARCH MANUFACTURER/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/SEARCH DESIGNATION/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/MIN/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/MAX/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls onSearch with debounced values for text inputs', async () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const makeInput = screen.getByPlaceholderText(/SEARCH MANUFACTURER/i);
    await userEvent.type(makeInput, 'Honda');
    
    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith(expect.objectContaining({ make: 'Honda' }));
    }, { timeout: 1000 });
  });

  it('calls onSearch with debounced minPrice and maxPrice', async () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const minInput = screen.getByPlaceholderText(/MIN/i);
    const maxInput = screen.getByPlaceholderText(/MAX/i);
    
    await userEvent.type(minInput, '20000');
    await userEvent.type(maxInput, '50000');
    
    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith(expect.objectContaining({ minPrice: '20000', maxPrice: '50000' }));
    }, { timeout: 1000 });
  });

  it('calls onSearch when category is changed', async () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'SEDAN');
    
    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith(expect.objectContaining({ category: 'SEDAN' }));
    }, { timeout: 1000 });
  });
});

