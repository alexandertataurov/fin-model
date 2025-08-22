import { useTheme as useNextTheme } from 'next-themes';

/**
 * Custom hook to access theme context
 * @returns Theme context with theme and setTheme
 */
export const useTheme = () => {
  return useNextTheme();
};
