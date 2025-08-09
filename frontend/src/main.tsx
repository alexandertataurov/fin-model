import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Ensure React is available globally
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

console.info('=== MAIN.TSX STARTING ===');

const rootElement = document.getElementById('root');
console.debug('Root element found:', !!rootElement);
if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  const root = ReactDOM.createRoot(rootElement);
  const queryClient = new QueryClient();

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
} catch (error) {
  const msg = error instanceof Error ? error.message : String(error);
  const fallback = ReactDOM.createRoot(rootElement);
  fallback.render(
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Error Loading Application</h1>
      <p>There was an error loading the application. Please check the console for details.</p>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>{msg}</pre>
    </div>
  );
}
