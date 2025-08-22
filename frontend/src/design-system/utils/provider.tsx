import React, { createContext, useContext, ReactNode } from 'react';

interface DesignSystemContextValue {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  density: 'compact' | 'comfortable' | 'spacious';
  setDensity: (density: 'compact' | 'comfortable' | 'spacious') => void;
  radius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  setRadius: (radius: 'none' | 'sm' | 'md' | 'lg' | 'xl') => void;
}

const DesignSystemContext = createContext<DesignSystemContextValue | undefined>(
  undefined
);

interface DesignSystemProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  defaultDensity?: 'compact' | 'comfortable' | 'spacious';
  defaultRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function DesignSystemProvider({
  children,
  defaultTheme = 'system',
  defaultDensity = 'comfortable',
  defaultRadius = 'md',
}: DesignSystemProviderProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>(
    defaultTheme
  );
  const [density, setDensity] = React.useState<
    'compact' | 'comfortable' | 'spacious'
  >(defaultDensity);
  const [radius, setRadius] = React.useState<
    'none' | 'sm' | 'md' | 'lg' | 'xl'
  >(defaultRadius);

  const value: DesignSystemContextValue = {
    theme,
    setTheme,
    density,
    setDensity,
    radius,
    setRadius,
  };

  return (
    <DesignSystemContext.Provider value={value}>
      <div
        className={`design-system-root density-${density} radius-${radius}`}
        data-density={density}
        data-radius={radius}
        data-theme={theme}
      >
        {children}
      </div>
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystem() {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error(
      'useDesignSystem must be used within a DesignSystemProvider'
    );
  }
  return context;
}
