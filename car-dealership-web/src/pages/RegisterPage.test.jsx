import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test/utils/test-utils';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';
import RegisterPage from './RegisterPage';
import { Routes, Route } from 'react-router-dom';

describe('RegisterPage', () => {
  const renderRegister = () => {
    return renderWithProviders(
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
      </Routes>,
      { initialEntries: ['/register'] }
    );
  };

  it('renders registration form', () => {
    renderRegister();
    expect(screen.getByRole('heading', { name: /create an account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows client-side validation errors when submitting empty form', async () => {
    renderRegister();
    await userEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('submits successfully and redirects to login', async () => {
    // Mock the register endpoint
    server.use(
      http.post('http://localhost:8080/api/auth/register', () => {
        return HttpResponse.json({ success: true }, { status: 201 });
      })
    );

    renderRegister();
    
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument(); // Toast message
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    }, { timeout: 2500 });
  });

  it('displays server error toast on failure', async () => {
    server.use(
      http.post('http://localhost:8080/api/auth/register', () => {
        return HttpResponse.json({ message: 'Email already exists' }, { status: 400 });
      })
    );

    renderRegister();
    
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'admin@dealership.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument(); // Toast message
    });
  });
});
