import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input', () => {
  it('renders with a label', () => {
    render(<Input label="Email" id="email" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('handles value changes', async () => {
    const handleChange = vi.fn();
    render(<Input label="Name" id="name" onChange={handleChange} />);
    
    const input = screen.getByLabelText(/name/i);
    await userEvent.type(input, 'a');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message when provided', () => {
    render(<Input label="Email" id="email" error="Invalid email address" />);
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true');
  });
});
