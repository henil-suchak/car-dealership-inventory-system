import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../test/utils/test-utils';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';
import LoginPage from './LoginPage';
import { Routes, Route } from 'react-router-dom';

describe('LoginPage', () => {
  const renderLogin = () => {
    return renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<div data-testid="dashboard">Dashboard</div>} />
      </Routes>,
      { initialEntries: ['/login'] }
    );
  };

  it('renders login form', () => {
    renderLogin();
    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows client-side validation errors when submitting empty form', async () => {
    renderLogin();
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('submits successfully, stores session and redirects to dashboard', async () => {
    // We provide a valid JWT structure so jwtDecode doesn't throw.
    // JWT format: header.payload.signature
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBkZWFsZXJzaGlwLmNvbSIsImlzQWRtaW4iOnRydWUsImV4cCI6MTcxNjIzOTAyMn0.signature';
    
    server.use(
      http.post(/\/api\/auth\/login/, () => {
        return HttpResponse.json({ token: fakeJwt }, { status: 200 });
      })
    );

    renderLogin();
    
    await userEvent.type(screen.getByLabelText(/email/i), 'admin@dealership.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'admin123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument(); // Toast message
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    }, { timeout: 2500 });
  });

  it('displays server error on 401 invalid credentials', async () => {
    server.use(
      http.post(/\/api\/auth\/login/, () => {
        return HttpResponse.json({ message: 'Bad credentials' }, { status: 401 });
      })
    );

    renderLogin();
    
    await userEvent.type(screen.getByLabelText(/email/i), 'wrong@email.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/bad credentials/i)).toBeInTheDocument(); // Toast message
    });
  });
});
