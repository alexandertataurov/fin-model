/**
 * Utility functions for resolving organism variant objects into CSS-in-JS styles
 */

export interface VariantConfig {
  [key: string]: {
    [subKey: string]: any;
  };
}

/**
 * Resolves a variant configuration object into CSS-in-JS styles
 * @param variants - The variant configuration object
 * @param props - The props object containing variant keys
 * @returns CSS-in-JS style object
 */
export const resolveVariants = (variants: VariantConfig, props: Record<string, any>) => {
  const styles: Record<string, any> = {};
  
  Object.entries(variants).forEach(([category, categoryVariants]) => {
    const propValue = props[category];
    if (propValue && categoryVariants[propValue]) {
      Object.assign(styles, categoryVariants[propValue]);
    }
  });
  
  return styles;
};

/**
 * Creates a variant resolver function for styled-components
 * @param variants - The variant configuration object
 * @returns A function that can be used in styled-components
 */
export const createVariantResolver = (variants: VariantConfig) => {
  return (props: Record<string, any>) => resolveVariants(variants, props);
};
