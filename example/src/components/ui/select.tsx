'use client';

import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export const Select = ({ className, children, ...props }: ComponentProps<'select'>) => {
  return (
    <select
      className={twMerge(
        'border border-neutral-300 bg-white px-2 py-1.5 text-neutral-950 text-sm transition-border-color duration-150',
        'hover:border-neutral-400',
        'focus:border-neutral-950 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
};
