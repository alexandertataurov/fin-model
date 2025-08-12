import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AuthContext, type AuthContextType } from '@/contexts/AuthContext';

const meta: Meta<typeof Login> = {
  title: 'Pages/Login',
  component: Login,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Login>;

const createMockAuthValue = (
  overrides: Partial<AuthContextType> = {}
): AuthContextType => ({
  user: null,
  token: null,
  permissions: [],
  roles: [],
  isLoading: false,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 500));
    return email === 'demo@finvision.ai' && password === 'Password123';
  },
  logout: async () => undefined,
  register: async () => true,
  refreshToken: async () => true,
  updateUser: () => undefined,
  hasPermission: () => false,
  hasRole: () => false,
  isAdmin: () => false,
  isAnalyst: () => false,
  ...overrides,
});

const withProviders = (
  story: React.ReactNode,
  authOverrides?: Partial<AuthContextType>
) => (
  <AuthContext.Provider value={createMockAuthValue(authOverrides)}>
    <MemoryRouter initialEntries={[{ pathname: '/login' }]}>
      {' '}
      {story}{' '}
    </MemoryRouter>
  </AuthContext.Provider>
);

export const Default: Story = {
  render: () => withProviders(<Login />),
};

export const LoadingState: Story = {
  render: () => withProviders(<Login />, { isLoading: true }),
};

export const ErrorCredentialsHint: Story = {
  render: () =>
    withProviders(<Login />, {
      login: async () => false,
    }),
  parameters: {
    docs: {
      description: {
        story:
          'Use email: demo@finvision.ai, password: Password123 in Default to simulate a successful login.',
      },
    },
  },
};
