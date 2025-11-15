'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export const Slider = ({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) => {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={twMerge(
        'relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-1.5 w-full grow overflow-hidden border border-neutral-300 bg-neutral-100"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-neutral-950"
        />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        className="block size-4 shrink-0 cursor-pointer border border-neutral-950 bg-white shadow-sm transition-[transform,box-shadow] hover:scale-105 focus-visible:scale-110 focus-visible:shadow-md focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  );
};
