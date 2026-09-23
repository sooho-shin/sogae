import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import { AuthProvider } from '@/lib/authContext';
import KakaoLoginModal from '@/components/KakaoLoginModal';

export const metadata: Metadata = {
  title: '소개남녀 | 2030 직장인 1:1 프라이빗 프로필 매칭 소개팅',
  description:
    '어플의 피로감과 결정사의 부담을 없앤 2030 직장인 1:1 프라이빗 프로필 매칭 소개남녀. 감각적인 프로필 카드로 먼저 확인하고 상호 수락 시에만 카카오톡 ID를 교환합니다.',
  keywords: [
    '소개남녀',
    '1대1소개팅',
    '직장인소개팅',
    '프로필카드소개팅',
    '서울소개팅',
    '2030소개팅',
  ],
  openGraph: {
    title: '소개남녀 | 2030 직장인 1:1 프라이빗 프로필 매칭',
    description: '매니저가 엄선한 1:1 프로필 카드로 먼저 확인하고 둘 다 OK하면 카톡 교환! 2030 직장인 매칭 소개남녀.',
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
      <head>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased selection:bg-purple-200 selection:text-purple-900 bg-[#FAFAFC]">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCTA />
          <KakaoLoginModal />
        </AuthProvider>
      </body>
    </html>
  );
}
