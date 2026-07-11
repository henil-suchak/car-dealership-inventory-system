import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';

const customRender = (ui, { initialEntries = ['/'], ...options } = {}) => {
  const AllTheProviders = ({ children }) => {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </MemoryRouter>
    );
  };
  return render(ui, { wrapper: AllTheProviders, ...options });
};

export * from '@testing-library/react';
export { customRender as renderWithProviders };
