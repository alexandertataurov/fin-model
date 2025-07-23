// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your component test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';
import { mount } from 'cypress/react18';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { ThemeProvider as CustomThemeProvider } from '../../src/contexts/ThemeContext';

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, you can put these in cypress/support/component.d.ts
// and include that file in your tsconfig.json
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      mountWithProviders(component: React.ReactNode, options?: any): Chainable<any>;
    }
  }
}

Cypress.Commands.add('mount', mount);

// Create a test theme
const testTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Mock auth context for testing
const mockAuthContext = {
  user: {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    full_name: 'Test User',
    is_active: true,
    is_admin: false,
  },
  isAuthenticated: true,
  isLoading: false,
  login: cy.stub(),
  logout: cy.stub(),
  register: cy.stub(),
};

// Custom mount command with providers
Cypress.Commands.add('mountWithProviders', (component: React.ReactNode, options = {}) => {
  const { queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }), authContext = mockAuthContext, ...mountOptions } = options;

  const WrappedComponent = () => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={testTheme}>
          <CustomThemeProvider>
            <CssBaseline />
            <AuthProvider value={authContext}>
              {component}
            </AuthProvider>
          </CustomThemeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );

  return mount(<WrappedComponent />, mountOptions);
});

// Handle uncaught exceptions in component tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore ResizeObserver errors
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  
  // Ignore non-error promise rejections
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  
  return true;
}); 