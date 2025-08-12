export const tokenVal = (t: any): string => {
  if (t == null) return '';
  const v = typeof t === 'object' && 'value' in t ? (t as any).value : t;
  if (Array.isArray(v)) return v.join(', ');
  return String(v);
};

