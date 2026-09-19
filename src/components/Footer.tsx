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
              <span className="text-xl font-black text-white tracking-tight">소개남녀</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              소개남녀는 2030 직장인을 위한 1:1 프라이빗 프로필 매칭 소개팅 서비스입니다. 
              부담스러운 어플과 결정사 대신 검증된 프로필 카드로 서로 호감을 확인한 후 안심하고 카카오톡으로 연결됩니다.
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>100% 직장·프로필 서류 검증</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>매너 관리팀 1:1 케어</span>
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
                  1:1 매칭 진행 방식
                </Link>
              </li>
              <li>
                <Link href="/#regions" className="hover:text-white transition-colors">
                  5대 매칭 거점 지역
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-white transition-colors font-semibold text-purple-400">
                  1:1 프로필 카드 무료 등록
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-white transition-colors">
                  실제 매칭 커플 후기
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
                  <span className="text-neutral-200 font-semibold block">카카오톡 채널 [소개남녀]</span>
                  <span className="text-neutral-500">평일/주말 10:00 ~ 22:00 실시간 상담</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-neutral-300">contact@sogaeting.kr</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span className="text-neutral-400">
                  운영 거점: 서울특별시 주요 5대 지역 (흑석·서교·합정·홍대·신도림)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 text-[11px] text-neutral-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p>
              소개남녀 | 2030 싱글 직장인 1:1 프라이빗 프로필 매칭
            </p>
            <p className="mt-1 text-neutral-500">
              문의: contact@sogaeting.kr | 카카오톡 채널: 소개남녀 | 개인정보보호책임자: 소개남녀 운영팀
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p>© 소개남녀 (Sogaenamnyeo). All rights reserved.</p>
            <span className="text-neutral-700">|</span>
            <Link href="/admin" className="text-neutral-500 hover:text-neutral-300 transition-colors">
              관리자 모드
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
