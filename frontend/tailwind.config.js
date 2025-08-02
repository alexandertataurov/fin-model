/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}', 
    './index.html',
    './.storybook/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-blue-600',
    'bg-blue-800',
    'bg-gray-700',
    'bg-gray-500',
    'bg-purple-700',
    'bg-orange-700',
    'bg-yellow-300',
    'bg-green-400',
    'bg-blue-400',
    'text-lg',
    'text-sm',
    'font-semibold',
    'text-white',
    'p-6',
    'text-center',
    {
      pattern: /bg-(blue|gray|purple|orange|yellow|green)-(400|500|600|700|800|300)/,
    },
    {
      pattern: /text-(lg|sm|white)/,
    },
    {
      pattern: /font-(semibold)/,
    },
    {
      pattern: /p-6/,
    },
    {
      pattern: /text-center/,
    },
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
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },
        info: {
          DEFAULT: 'var(--info)',
          foreground: 'var(--info-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        // Extended color palette for charts
        'chart-6': 'var(--chart-6)',
        'chart-7': 'var(--chart-7)',
        'chart-8': 'var(--chart-8)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: '600',
      },
      fontSize: {
        'text-xs': 'var(--text-xs)',
        'text-sm': 'var(--text-sm)',
        'text-base': 'var(--text-base)',
        'text-lg': 'var(--text-lg)',
        'text-xl': 'var(--text-xl)',
        'text-2xl': 'var(--text-2xl)',
        'text-3xl': 'var(--text-3xl)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
