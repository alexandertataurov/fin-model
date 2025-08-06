/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';
import 'jest-axe';

declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T> {}
  }
}

export {};
