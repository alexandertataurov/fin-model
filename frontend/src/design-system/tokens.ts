import tokensJson from './tokens.json';

export const tokens = tokensJson as const;


export const cssVariables = {
  light: {},
  dark: {},
} as const;

export const getToken = (path: string) => {
  return path.split('.').reduce((obj: any, key: string) => obj?.[key], tokens);
};

export const getCSSVariable = (name: string) => {
  return `var(${name})`;
};

export default tokens;

