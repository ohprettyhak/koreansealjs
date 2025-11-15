import { Geist_Mono, Nanum_Myeongjo } from 'next/font/google';
import localFont from 'next/font/local';

export const Pretendard = localFont({
  src: './PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  preload: true,
  variable: '--font-pretendard',
});

export const GeistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  preload: true,
  variable: '--font-geist-mono',
});
