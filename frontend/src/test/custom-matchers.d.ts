import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveClass: (...classNames: string[]) => R;
      toHaveTextContent: (text: string | RegExp) => R;
      toBeDisabled: () => R;
      toHaveValue: (value: string | string[] | number) => R;
      toHaveFocus: () => R;
      toBeVisible: () => R;
      toHaveStyle: (css: string | Record<string, any>) => R;
    }
  }
}
