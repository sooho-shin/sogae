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
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-[#623898] bg-purple-100 px-1.5 py-0.5 rounded">
              선착순 20% 할인
            </span>
            <span className="text-[11px] font-semibold text-neutral-500 line-through">
              60,000원
            </span>
          </div>
          <span className="text-base font-extrabold text-neutral-900">
            23,900원 <span className="text-xs font-normal text-neutral-500">/ 1인</span>
          </span>
        </div>
        <Link
          href="/apply"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] shadow-md shadow-purple-900/20 active:scale-98 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>이번 주 소개팅 참가하기</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}
