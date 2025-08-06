import React, { createContext, useContext, ReactNode } from 'react';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { DesignSystem, componentStyles } from './utils/designSystem';

interface DesignSystemContextType {
  tokens: ReturnType<typeof useDesignTokens>;
  DesignSystem: typeof DesignSystem;
  componentStyles: typeof componentStyles;
}

const DesignSystemContext = createContext<DesignSystemContextType | null>(null);

interface DesignSystemProviderProps {
  children: ReactNode;
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({ children }) => {
  const tokens = useDesignTokens();

  const value: DesignSystemContextType = {
    tokens,
    DesignSystem,
    componentStyles,
  };

  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
}; 