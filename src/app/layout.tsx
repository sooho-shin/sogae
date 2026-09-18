import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';

export const metadata: Metadata = {
  title: '소개남녀 | 서울·경기 2030 직장인 로테이션 소개팅 1위',
  description:
    '좋은 사람은 직접 마주했을 때 더 선명하게 보입니다. 어플의 불안함과 결정사의 부담을 없앤 가장 현실적인 1:1 오프라인 로테이션 소개팅 플랫폼 소개남녀. 100% 직장·미혼 신원 보증.',
  keywords: [
    '소개남녀',
    '로테이션소개팅',
    '직장인소개팅',
    '서울소개팅',
    '강남소개팅',
    '홍대소개팅',
    '오프라인소개팅',
    '미팅',
    '2030소개팅',
  ],
  openGraph: {
    title: '소개남녀 | 서울·경기 2030 직장인 로테이션 소개팅 1위',
    description: '좋은 사람은 직접 마주했을 때 더 선명하게 보입니다. 45,000명이 선택한 안전한 로테이션 소개팅 소개남녀.',
    url: 'https://www.sogaenamnyeo.kr',
    siteName: '소개남녀',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col font-sans antialiased selection:bg-purple-200 selection:text-purple-900 bg-[#FAFAFC]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  );
}
