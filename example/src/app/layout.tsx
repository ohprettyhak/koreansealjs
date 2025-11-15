import './global.css';
import './_fonts/fonts.css';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { GeistMono, Pretendard } from './_fonts';

export const metadata: Metadata = {
  title: '@koreansealjs',
  description: '한국 도장을 Node.js와 브라우저 환경에서 생성할 수 있는 라이브러리입니다.',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <body
        className={twMerge(
          'mx-auto max-w-4xl p-4 pt-20 md:p-8 md:pt-24',
          Pretendard.variable,
          GeistMono.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
