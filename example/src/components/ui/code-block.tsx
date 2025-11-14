import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface CodeBlockProps extends ComponentProps<'div'> {
  html: string;
}

export const CodeBlock = ({ html, className, ...props }: CodeBlockProps) => {
  return (
    <div
      className={twMerge('overflow-x-auto font-mono [&_pre]:p-4 [&_pre]:text-[13px]', className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized HTML from `shiki`
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
};
