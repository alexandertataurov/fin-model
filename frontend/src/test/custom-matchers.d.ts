import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface JestAssertion {
      toHaveClass: (className: string) => void;
      toHaveTextContent: (text: string | RegExp) => void;
      toBeDisabled: () => void;
      toHaveValue: (value: string | string[] | number) => void;
      toHaveFocus: () => void;
      toBeVisible: () => void;
      toHaveStyle: (css: string | Record<string, any>) => void;
    }
  }
}

declare module 'vitest' {
  interface Assertion {
    toHaveClass: (className: string) => void;
    toHaveTextContent: (text: string | RegExp) => void;
    toBeDisabled: () => void;
    toHaveValue: (value: string | string[] | number) => void;
    toHaveFocus: () => void;
    toBeVisible: () => void;
    toHaveStyle: (css: string | Record<string, any>) => void;
  }
  interface AsymmetricMatchersContaining {
    toHaveClass: (className: string) => void;
    toHaveTextContent: (text: string | RegExp) => void;
    toBeDisabled: () => void;
    toHaveValue: (value: string | string[] | number) => void;
    toHaveFocus: () => void;
    toBeVisible: () => void;
    toHaveStyle: (css: string | Record<string, any>) => void;
  }
}

export {};
