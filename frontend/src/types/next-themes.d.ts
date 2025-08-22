declare module 'next-themes' {
  import React from 'react';
  export interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  }

  export const ThemeProvider: React.FC<ThemeProviderProps>;
  export const useTheme: () => {
    theme: string;
    setTheme: (theme: string) => void;
  };
}

declare module 'next-themes/dist/types' {
  export * from 'next-themes';
}
