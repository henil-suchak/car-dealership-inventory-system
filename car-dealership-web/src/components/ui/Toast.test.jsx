import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Toast from './Toast';

describe('Toast', () => {
  it('renders success toast', () => {
    render(<Toast message="Saved successfully" type="success" onClose={() => {}} />);
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders error toast', () => {
    render(<Toast message="Failed to save" type="error" onClose={() => {}} />);
    expect(screen.getByText('Failed to save')).toBeInTheDocument();
  });
});
