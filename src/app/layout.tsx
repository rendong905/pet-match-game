import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '萌宠消消乐 | 经典三消游戏',
    template: '%s | 萌宠消消乐',
  },
  description:
    '萌宠消消乐是一款经典的在线三消游戏。包含20个精心设计的关卡，支持特殊道具、死局检测、分数记录等功能。',
  keywords: [
    '萌宠消消乐',
    '三消游戏',
    '消除游戏',
    '在线游戏',
    '休闲游戏',
    '萌宠',
  ],
  authors: [{ name: 'Pet Match Game' }],
  generator: 'Next.js',
  openGraph: {
    title: '萌宠消消乐 | 经典三消游戏',
    description:
      '体验经典的萌宠消消乐游戏，20个关卡等你挑战！',
    siteName: '萌宠消消乐',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
