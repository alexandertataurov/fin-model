import 'vitest';

declare module 'vitest' {
  interface Assertion {
    toBeInTheDocument(): unknown;
    toHaveAttribute(attr: string, value?: any): unknown;
    toHaveNoViolations(): unknown;
  }
}

declare module 'expect' {
  interface Matchers<R = void> {
    toBeInTheDocument(): R;
    toHaveAttribute(attr: string, value?: any): R;
    toHaveNoViolations(): R;
  }
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: any): R;
      toHaveNoViolations(): R;
    }
  }
}

export {};
