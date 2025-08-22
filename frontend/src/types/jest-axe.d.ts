declare module 'jest-axe' {
  export function configureAxe(options?: unknown): unknown;
  export function axe(container: unknown, options?: unknown): Promise<unknown>;
  export function toHaveNoViolations(): unknown;
}
