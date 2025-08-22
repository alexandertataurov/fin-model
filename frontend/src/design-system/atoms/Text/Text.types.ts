import * as React from 'react';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
  variant?:
    | 'body'
    | 'caption'
    | 'overline'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'headline'
    | 'subheadline'
    | 'title'
    | 'subtitle'
    | 'elegant'
    | 'code';
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl'
    | '9xl';
  weight?:
    | 'thin'
    | 'extralight'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold'
    | 'black';
  color?:
    | 'default'
    | 'muted'
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'info';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  fontFamily?: 'sans' | 'serif' | 'display' | 'mono' | 'elegant' | 'modern';
  lineHeight?:
    | 'none'
    | 'tight'
    | 'snug'
    | 'normal'
    | 'relaxed'
    | 'loose'
    | 'extra-loose';
  letterSpacing?:
    | 'tighter'
    | 'tight'
    | 'normal'
    | 'wide'
    | 'wider'
    | 'widest'
    | 'extra-wide';
  children?: React.ReactNode;
}

export type TextRef = React.ForwardedRef<HTMLParagraphElement>;
