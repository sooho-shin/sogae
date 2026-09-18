'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function FloatingCTA() {
  const pathname = usePathname();

  // If already on the apply page, don't show the floating apply button
  if (pathname === '/apply') return null;

  return (
    <aside aria-label="모바일 참가 신청 플로팅 배너" className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-purple-200 p-3 shadow-2xl safe-bottom">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-extrabold text-[#E12B70] bg-pink-100 px-2 py-0.5 rounded-full w-fit">
            오픈 기념 100% 무료
          </span>
          <span className="text-sm font-extrabold text-neutral-900 mt-0.5">
            1:1 맞춤 프로필 매칭
          </span>
        </div>
        <Link
          href="/apply"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-[#623898] to-[#E12B70] shadow-md shadow-purple-900/20 active:scale-98 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>무료 프로필 카드 등록</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}
