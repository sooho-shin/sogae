'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Menu, X, ShieldCheck, Sparkles, Edit3, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasRegisteredCard, setHasRegisteredCard] = useState(false);
  const { user, isLoggedIn, logout, openLoginModal } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const receipt = localStorage.getItem('sogaeting_receipt');
      const phone = localStorage.getItem('sogaeting_phone');
      if (receipt || phone) {
        setHasRegisteredCard(true);
      }
    }
  }, [user]);

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
                  소개남녀
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-[#623898]">
                  SINCE 2022
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 font-medium hidden sm:inline">
                서울·경기 2030 직장인 1:1 프라이빗 소개팅
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/#program"
              className="text-sm font-semibold text-neutral-700 hover:text-[#623898] transition-colors"
            >
              진행 방식
            </Link>
            <Link
              href="/#profile-showcase"
              className="text-sm font-semibold text-neutral-700 hover:text-[#623898] transition-colors"
            >
              프로필 카드
            </Link>
            <Link
              href="/#regions"
              className="text-sm font-semibold text-neutral-700 hover:text-[#623898] transition-colors"
            >
              매칭 지역
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
              href="/profiles"
              className="text-sm font-bold text-pink-600 hover:text-pink-700 transition-colors flex items-center gap-1 bg-pink-50 hover:bg-pink-100 px-3 py-1 rounded-full border border-pink-200"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>블라인드 프로필</span>
            </Link>
            <Link
              href="/status"
              className="text-sm font-bold text-[#623898] hover:text-[#4F2B7D] transition-colors px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200"
            >
              신청 조회
            </Link>
          </nav>

          {/* Desktop Auth & Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200 text-xs">
                <span className="font-extrabold text-neutral-900">{user.nickname} 님</span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-neutral-400 hover:text-rose-500 font-bold ml-1 p-0.5"
                  title="로그아웃"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full font-black text-xs text-[#191919] bg-[#FEE500] hover:bg-[#FDD835] shadow-xs transition-all active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.827 1.83 5.308 4.608 6.694l-.94 3.486c-.083.308.243.557.514.398l4.135-2.427c.548.093 1.111.149 1.683.149 5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
                </svg>
                <span>카카오 1초 로그인</span>
              </button>
            )}

            <Link
              href="/apply"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] hover:from-[#532E82] hover:to-[#7B40EF] shadow-md shadow-purple-900/15 hover:shadow-lg hover:shadow-purple-900/25 active:scale-98 transition-all"
            >
              {hasRegisteredCard ? (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>내 카드 보기 / 수정</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>1:1 프로필 카드 등록</span>
                </>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {!isLoggedIn ? (
              <button
                type="button"
                onClick={openLoginModal}
                className="px-2.5 py-1 text-xs font-black text-[#191919] bg-[#FEE500] rounded-full shadow-2xs"
              >
                로그인
              </button>
            ) : (
              <span className="text-[11px] font-extrabold text-[#623898] bg-purple-50 px-2 py-0.5 rounded-full">
                {user?.nickname}
              </span>
            )}
            <Link
              href="/apply"
              className="px-3 py-1 text-xs font-bold text-white bg-[#623898] rounded-full shadow-xs"
            >
              {hasRegisteredCard ? '내 카드' : '신청'}
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
            href="/status"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-[#623898] hover:underline"
          >
            🔍 내 신청 내역 및 프로필 카드 조회
          </Link>
          <Link
            href="/profiles"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 fill-pink-500" />
            <span>이성 블라인드 프로필 둘러보기</span>
          </Link>
          <Link
            href="/#program"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-neutral-800 hover:text-[#623898]"
          >
            진행 방식
          </Link>
          <Link
            href="/#profile-showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-neutral-800 hover:text-[#623898]"
          >
            프로필 카드 예시
          </Link>
          <Link
            href="/#regions"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-neutral-800 hover:text-[#623898]"
          >
            매칭 지역
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
              1:1 프로필 카드 등록하기
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
