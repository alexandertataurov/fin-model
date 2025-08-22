import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { separatorVariants } from './Separator.variants';

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {}

export type SeparatorRef = HTMLDivElement;
