'use client';

import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary';
};

export const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => {
  return (
    <button
      className={twMerge(
        'cursor-pointer border px-2 py-1.5 font-medium text-sm transition-all duration-150',
        variant === 'primary' &&
          'border-neutral-950 bg-neutral-950 text-white hover:border-neutral-700 hover:bg-neutral-700',
        variant === 'secondary' &&
          'border-neutral-300 bg-white text-neutral-950 hover:border-neutral-400 hover:bg-neutral-100',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
};
