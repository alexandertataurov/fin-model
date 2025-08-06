/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';
import 'jest-axe';

declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T> {
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

export {};
