import '@testing-library/jest-dom/vitest';

// Ensure Jest DOM matchers are available globally for all test files
declare global {
  namespace Vi {
    interface JestAssertion {
      toHaveTextContent: (text: string | RegExp) => void;
      toHaveClass: (...classNames: string[]) => void;
      toBeDisabled: () => void;
      toHaveValue: (value: string | string[] | number) => void;
      toHaveFocus: () => void;
      toBeVisible: () => void;
      toHaveStyle: (css: string | Record<string, any>) => void;
    }
  }

  // Support for legacy Jest matcher types
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent: (text: string | RegExp) => R;
      toHaveClass: (...classNames: string[]) => R;
      toBeDisabled: () => R;
      toHaveValue: (value: string | string[] | number) => R;
      toHaveFocus: () => R;
      toBeVisible: () => R;
      toHaveStyle: (css: string | Record<string, any>) => R;
    }
  }
}
