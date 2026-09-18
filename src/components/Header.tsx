'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Menu, X, ShieldCheck, Sparkles } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#623898] via-[#7E48BA] to-[#E55B7D] flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl md:text-2xl font-black tracking-tight text-neutral-900">
                  러브매칭
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-[#623898]">
                  SINCE 2022
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 font-medium hidden sm:inline">
                서울·경기 2030 오프라인 로테이션 소개팅 1위
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#program"
              className="text-sm font-semibold text-neutral-700 hover:text-[#623898] transition-colors"
            >
              진행 방식
            </Link>
            <Link
              href="/#schedule"
              className="text-sm font-semibold text-neutral-700 hover:text-[#623898] transition-colors"
            >
              세션 일정 & 장소
            </Link>
            <Link
              href="/#trust"
              className="text-sm font-semibold text-neutral-700 hover:text-[#623898] transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4 text-[#623898]" />
              신원 검증
            </Link>
            <Link
              href="/#reviews"
              className="text-sm font-semibold text-neutral-700 hover:text-[#623898] transition-colors"
            >
              생생 후기
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-semibold text-neutral-700 hover:text-[#623898] transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Header Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/apply"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] hover:from-[#532E82] hover:to-[#7B40EF] shadow-md shadow-purple-900/15 hover:shadow-lg hover:shadow-purple-900/25 active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              소개팅 참가 신청
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/apply"
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#623898] rounded-full shadow-xs"
            >
              신청하기
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <Link
            href="/#program"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-neutral-800 hover:text-[#623898]"
          >
            진행 방식
          </Link>
          <Link
            href="/#schedule"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-neutral-800 hover:text-[#623898]"
          >
            세션 일정 & 장소
          </Link>
          <Link
            href="/#trust"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-neutral-800 hover:text-[#623898]"
          >
            신원 검증 시스템
          </Link>
          <Link
            href="/#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-neutral-800 hover:text-[#623898]"
          >
            참가자 생생 후기
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-neutral-800 hover:text-[#623898]"
          >
            자주 묻는 질문 (FAQ)
          </Link>
          <div className="pt-2">
            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              로테이션 소개팅 지원하기
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
