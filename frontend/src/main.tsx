import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

declare global {
  interface Window {
    auditFilters?: unknown;
  }
}

if (typeof window !== 'undefined' && window.auditFilters === undefined) {
  // Ensure global auditFilters is defined to prevent ReferenceError in admin pages
  window.auditFilters = [];
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
