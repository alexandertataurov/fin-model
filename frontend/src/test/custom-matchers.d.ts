import '@testing-library/jest-dom/vitest';

// Ensure Jest DOM matchers are available globally for all test files
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toHaveTextContent: (text: string | RegExp) => void;
    }
  }
}
