'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface UsageTabTriggerProps {
  value: string;
  children: ReactNode;
}

export const UsageTabTrigger = ({ value, children }: UsageTabTriggerProps) => {
  const router = useRouter();

  const handleClick = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('usage', value);
    router.replace(`/?${searchParams.toString()}`, { scroll: false });
  };

  return (
    <Tabs.Trigger
      value={value}
      onClick={handleClick}
      className={twMerge(
        'cursor-pointer border border-neutral-300 bg-white px-2 py-1 font-semibold text-neutral-600 text-xs transition-all duration-150',
        'hover:border-neutral-400 hover:bg-neutral-50',
        'data-[state=active]:border-neutral-950 data-[state=active]:bg-neutral-950 data-[state=active]:text-white',
      )}
    >
      {children}
    </Tabs.Trigger>
  );
};
