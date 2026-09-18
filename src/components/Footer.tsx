import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Mail, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 text-sm border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#623898] to-[#E55B7D] flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">러브매칭</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 font-semibold">
                정식 국내결혼중개업 등록
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              러브매칭(LOVE MATCHING)은 서울·경기 2030 직장인을 위한 신뢰 기반 오프라인 로테이션 소개팅 플랫폼입니다. 
              불확실한 데이팅 앱과 과도한 결혼정보회사의 대안으로 안전하고 자연스러운 1:1 대화의 장을 제공합니다.
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>100% 직장/싱글 신원보증</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>연중무휴 매너 관리팀 운영</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              바로가기
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#program" className="hover:text-white transition-colors">
                  로테이션 소개팅이란?
                </Link>
              </li>
              <li>
                <Link href="/#schedule" className="hover:text-white transition-colors">
                  이번 주 세션 일정 및 장소
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-white transition-colors font-semibold text-purple-400">
                  참가 지원하기 (얼리버드 할인)
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-white transition-colors">
                  실제 매칭 및 성혼 후기
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  자주 묻는 질문 (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              고객센터 & 제휴
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-200 font-semibold block">카카오톡 채널 [러브매칭]</span>
                  <span className="text-neutral-500">평일/주말 10:00 ~ 22:00 실시간 상담</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-neutral-300">contact@lovematching.kr</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span className="text-neutral-400">
                  본사: 서울특별시 서초구 강남대로 (라운지: 강남·홍대·잠실·을지로)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 text-[11px] text-neutral-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p>
              (주)러브매칭네트웍스 | 대표이사: 대표관리자 | 사업자등록번호: 214-88-02491 | 국내결혼중개업 신고번호: 제2022-서울-0012호
            </p>
            <p className="mt-1 text-neutral-400">
              통신판매업신고: 제2022-서울서초-0192호 | 개인정보보호책임자: 러브매칭 운영팀
            </p>
          </div>
          <p>© 2022-2026 LoveMatching. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
