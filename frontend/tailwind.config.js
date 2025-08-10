/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  // Include Storybook files so classes used only in stories/preview are generated
  content: [
    './src/**/*.{ts,tsx,js,jsx,mdx}',
    './index.html',
    './.storybook/**/*.{ts,tsx,js,jsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: '#e2e8f0',
        input: '#ffffff',
        ring: '#3b82f6',
        background: '#ffffff',
        foreground: '#0f172a',
        // Shadcn-style semantic color pairs used across components
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        accent: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
        success: {
          DEFAULT: '#16a34a',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#ffffff',
        },
        info: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
        surface: '#ffffff',
        'on-surface': '#0f172a',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.125rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
