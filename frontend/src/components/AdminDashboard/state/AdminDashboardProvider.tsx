import React, { ReactNode } from 'react';
import { useAdminDashboardStore } from './AdminDashboardStore';

interface AdminDashboardProviderProps {
  children: ReactNode;
}

export const AdminDashboardProvider: React.FC<AdminDashboardProviderProps> = ({
  children,
}) => {
  // Initialize the store
  const store = useAdminDashboardStore();

  // The store is already initialized by Zustand, so we just need to render children
  // This provider can be extended with additional context if needed
  return <>{children}</>;
};
