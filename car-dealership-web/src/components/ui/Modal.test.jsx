import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Modal from './Modal';

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={() => {}} title="Test Modal">Content</Modal>);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Test Modal">Modal Content</Modal>);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    render(<Modal isOpen={true} onClose={handleClose} title="Test Modal">Content</Modal>);
    
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
