'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface DesignSystemContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

interface DesignSystemProviderProps {
  children: ReactNode;
  theme?: 'light' | 'dark' | 'system';
  setTheme?: (theme: 'light' | 'dark' | 'system') => void;
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({
  children,
  theme = 'system',
  setTheme = () => {},
}) => {
  return (
    <DesignSystemContext.Provider value={{ theme, setTheme }}>
      {children}
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
};
