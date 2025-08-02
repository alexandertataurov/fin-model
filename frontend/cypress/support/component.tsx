// ***********************************************************
// Cypress component support file
// ***********************************************************

import './commands';
import { mount } from 'cypress/react18';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../src/components/ui/theme-provider';

// Extend Cypress Chainable interface - using declare module instead of namespace
declare module 'cypress' {
  interface Chainable {
    mount: typeof mount;
    mountWithProviders(component: React.ReactNode): Chainable<Element>;
  }
}

Cypress.Commands.add('mount', mount);

// Create test QueryClient
const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

// Custom mount command with providers
Cypress.Commands.add('mountWithProviders', (component: React.ReactNode) => {
  return mount(
    <BrowserRouter>
      <QueryClientProvider client={testQueryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          {component}
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', err => {
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});
