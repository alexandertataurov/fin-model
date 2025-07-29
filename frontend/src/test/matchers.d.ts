import 'vitest';

declare module 'vitest' {
  interface Assertion {
    toBeInTheDocument(): unknown;
    toHaveAttribute(attr: string, value?: unknown): unknown;
    toHaveNoViolations(): unknown;
  }
}

declare module 'expect' {
  interface Matchers<R = void> {
    toBeInTheDocument(): R;
    toHaveAttribute(attr: string, value?: unknown): R;
    toHaveNoViolations(): R;
  }
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: unknown): R;
      toHaveNoViolations(): R;
    }
  }
}

export {};
