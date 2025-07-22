import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('FinVision')).toBeInTheDocument();
  });

  it('displays the application subtitle', () => {
    render(<App />);
    expect(screen.getByText('Financial Modeling & Analysis Platform')).toBeInTheDocument();
  });

  it('shows the login form', () => {
    render(<App />);
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
