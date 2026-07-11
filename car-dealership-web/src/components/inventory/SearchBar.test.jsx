import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders input fields for search criteria', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    expect(screen.getByPlaceholderText(/make/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/model/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Category select
  });

  it('calls onSearch with debounced values when typing', async () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const makeInput = screen.getByPlaceholderText(/make/i);
    await userEvent.type(makeInput, 'Honda');
    
    // The component uses useDebounce, so we wait for the callback
    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith(expect.objectContaining({ make: 'Honda' }));
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
