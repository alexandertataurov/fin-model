declare module 'jest-axe' {
  export function configureAxe(options?: any): any;
  export function axe(container: any, options?: any): Promise<any>;
  export function toHaveNoViolations(): any;
} 