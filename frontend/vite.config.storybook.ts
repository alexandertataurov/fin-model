import { mergeConfig } from './vite.config.base';
import { resolve } from 'path';

export default mergeConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/design-system': resolve(__dirname, './src/design-system'),
      '@design-system': resolve(__dirname, './src/design-system'),
      '@/components': resolve(__dirname, './src/components'),
      '@components': resolve(__dirname, './src/components'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
  },
  define: {
    'process.env.NODE_ENV': '"development"',
    global: 'globalThis',
  },
});
