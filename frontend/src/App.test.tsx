import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('FinVision Dashboard')).toBeInTheDocument();
  });

  it('displays welcome message', () => {
    render(<App />);
    expect(screen.getByText('Welcome to FinVision')).toBeInTheDocument();
  });

  it('shows the main description', () => {
    render(<App />);
    expect(
      screen.getByText(/Transform your Excel financial models/)
    ).toBeInTheDocument();
  });
});
