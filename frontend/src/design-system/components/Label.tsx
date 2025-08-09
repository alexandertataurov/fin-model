'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

<<<<<<< HEAD:frontend/src/design-system/components/Label.tsx
import { cn } from '@/utils/cn';
=======
import { cn } from './utils';
>>>>>>> 1e86ba1 (chore(frontend): update pnpm lock):frontend/src/components/ui/label.tsx

export type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean;
};

function Label({ className, required: _required, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Label };
