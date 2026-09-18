'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Star,
  ChevronDown,
  ChevronUp,
  Award,
  Lock,
  Coffee,
  MapPin,
  Flame
} from 'lucide-react';
import {
  SESSIONS_DATA,
  REVIEWS_DATA,
  FAQ_DATA,
  TRUST_STATS,
  HOW_IT_WORKS_STEPS,
  SETTING_REGIONS
} from '@/data/mockData';

export default function HomePage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Filter sessions based on selected region
  const filteredSessions =
    selectedRegion === '전체'
      ? SESSIONS_DATA
      : SESSIONS_DATA.filter((s) => s.region === selectedRegion);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-neutral-900 pb-20 md:pb-0">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-purple-900 via-[#331B54] to-[#1E0F33] text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-pink-500/20 to-indigo-500/20 blur-3xl pointer-events-none -z-0" />
        <div className="absolute -bottom-10 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-purple-200 text-xs sm:text-sm font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span>SINCE 2022 · 대한민국 1위 로테이션 소개팅</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.2] md:leading-[1.18] text-white">
              좋은 사람은,{' '}
              <span className="bg-gradient-to-r from-pink-300 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                직접 마주했을 때
              </span>
              <br />더 선명하게 보입니다
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-purple-100/80 font-normal leading-relaxed max-w-2xl mx-auto">
              데이팅 앱의 불안함은 지우고, 결혼정보회사의 무거운 부담은 덜어냈습니다.
              <br className="hidden sm:inline" />
              신원 보증된 2030 직장인과 나누는 가장 현실적이고 안전한 1:1 대화.
            </p>

            {/* CTA Group */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/apply"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-black text-base sm:text-lg text-neutral-900 bg-gradient-to-r from-amber-300 via-rose-200 to-pink-300 hover:from-amber-200 hover:to-pink-200 shadow-xl shadow-purple-950/40 hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                <Sparkles className="w-5 h-5 text-purple-900" />
                <span>이번 주 참가 신청하기</span>
                <ArrowRight className="w-5 h-5 text-purple-900" />
              </Link>
              <Link
                href="#regions"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-sm sm:text-base text-white/90 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md transition-all"
              >
                진행 지역 둘러보기
              </Link>
            </div>

            {/* Value Props Pills */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-purple-200/90">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% 직장·미혼 신원 인증</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>프리미엄 웰컴 드링크 포함</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>현장 연락처 비공개 안심 쪽지</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STATS BAR */}
      <section className="relative -mt-8 z-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-neutral-900/5 border border-purple-100 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          {TRUST_STATS.map((stat, i) => (
            <div
              key={i}
              className={`text-center space-y-1 ${i > 1 ? 'pt-4 md:pt-0' : ''}`}
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#623898] to-[#9857D3] bg-clip-text text-transparent block">
                {stat.value}
              </span>
              <p className="text-xs sm:text-sm font-bold text-neutral-800">
                {stat.label}
              </p>
              <p className="text-[11px] text-neutral-600 hidden sm:block">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ACTIVE REGIONS SHOWCASE (흑석동, 서교동, 합정동, 홍대, 신도림) */}
      <section id="regions" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#623898] uppercase tracking-wider bg-purple-100 px-3.5 py-1 rounded-full">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>HOT PLACES IN SEOUL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900">
            소개남녀 진행 지역 안내
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base">
            분위기와 접근성이 뛰어난 서울 핵심 5개 핫플레이스에서 정기 세션이 진행됩니다
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SETTING_REGIONS.map((region) => (
            <div
              key={region.id}
              onClick={() => {
                setSelectedRegion(region.name);
                const scheduleSection = document.getElementById('schedule');
                if (scheduleSection) {
                  scheduleSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#623898] border border-purple-200">
                    {region.badge}
                  </span>
                  <MapPin className="w-4 h-4 text-purple-400 group-hover:text-[#623898] transition-colors" />
                </div>
                <h3 className="text-xl font-black text-neutral-900 group-hover:text-[#623898] transition-colors">
                  {region.name}
                </h3>
                <p className="text-xs font-bold text-[#623898]">
                  {region.tag}
                </p>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {region.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#623898]">
                <span>일정 보기</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMPARISON SECTION: WHY SOGAENAMNYEO? */}
      <section className="py-16 md:py-24 bg-white border-y border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
            <span className="text-xs font-extrabold text-[#623898] uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
              WHY SOGAENAMNYEO
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900">
              소개팅 앱과 결정사 사이,
              <br />
              가장 상식적이고 확실한 만남
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base">
              온라인의 불확실함과 고액 결정사의 부담을 모두 지운 오프라인 만남의 새로운 기준
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Option 1: Dating Apps */}
            <div className="bg-neutral-50/70 rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-500 flex items-center justify-center font-bold mb-4">
                  📱
                </div>
                <h3 className="text-lg font-bold text-neutral-700 mb-2">데이팅 어플</h3>
                <p className="text-xs text-neutral-600 mb-6">가볍게 시작하지만 끝없는 피로감</p>
                <ul className="space-y-3 text-xs sm:text-sm text-neutral-600">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>사진 보정/신원 불확실로 인한 실망</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>대화 중 잦은 잠수와 가벼운 만남 목적</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>직접 만나기까지 낭비되는 수많은 시간</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-200 text-xs text-neutral-600">
                만남 성사율 낮음 / 신원 검증 불투명
              </div>
            </div>

            {/* Option 2: Sogaenamnyeo (Hero Card) */}
            <div className="relative bg-gradient-to-b from-purple-50 via-white to-purple-50/50 rounded-2xl p-6 sm:p-8 border-2 border-[#623898] shadow-xl shadow-purple-900/10 flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#623898] text-white text-xs font-black shadow-md">
                BEST · 소개남녀 로테이션
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#623898] to-[#8C52FF] text-white flex items-center justify-center font-bold mb-4 shadow-md shadow-purple-500/30">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <h3 className="text-xl font-extrabold text-neutral-900 mb-2">
                  소개남녀 로테이션 소개팅
                </h3>
                <p className="text-xs text-[#623898] font-semibold mb-6">
                  검증된 직장인과 프라이빗 1:1 대화
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-neutral-800 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#623898] shrink-0 mt-0.5" />
                    <span>100% 직장·재직·싱글 서류 검증 통과자만 참가</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#623898] shrink-0 mt-0.5" />
                    <span>단 2시간 만에 10명의 이성과 1:1 심층 대화</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#623898] shrink-0 mt-0.5" />
                    <span>합리적인 참가비 (23,900원 얼리버드)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#623898] shrink-0 mt-0.5" />
                    <span>현장 거절 부담 제로! 모바일 비밀 매칭</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-purple-200/80">
                <Link
                  href="/apply"
                  className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#623898] hover:bg-[#522E80] flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/20 transition-all"
                >
                  <span>지금 참가 신청하기</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Option 3: Marriage Agencies */}
            <div className="bg-neutral-50/70 rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-500 flex items-center justify-center font-bold mb-4">
                  💼
                </div>
                <h3 className="text-lg font-bold text-neutral-700 mb-2">결혼정보회사</h3>
                <p className="text-xs text-neutral-600 mb-6">과도한 가입비와 등급주의</p>
                <ul className="space-y-3 text-xs sm:text-sm text-neutral-600">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>수백만 원에 달하는 과도한 가입 비용</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>스펙과 재산 중심의 무거운 등급 매김</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>계약 횟수 소진에 따른 추가 결제 유도</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-200 text-xs text-neutral-600">
                비용 부담 매우 높음 / 인위적인 조건 매칭
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS: 5-STEP PROCESS */}
      <section id="program" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-[#623898] uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
            PROCESS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900">
            로테이션 소개팅은 이렇게 진행됩니다
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base">
            처음 오셔도 어색하지 않도록 세심하게 설계된 5단계 안심 프로세스
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6 relative">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white hover:bg-purple-50/50 rounded-2xl p-5 border border-neutral-200/80 hover:border-purple-300 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-purple-300 group-hover:text-[#623898] transition-colors">
                    {step.step}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-[#623898]">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Special Feature Highlight */}
        <div className="mt-12 bg-gradient-to-r from-purple-900 via-[#44226C] to-indigo-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-pink-300">
              <Coffee className="w-3.5 h-3.5" />
              <span>소개남녀만의 차별화된 시스템</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-extrabold">
              침묵 걱정 NO! 1:1 대화카드 & 비밀 쪽지 매칭
            </h4>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl">
              전문 연애 컨설턴트가 구성한 자연스러운 질문 카드(가치관, 라이프스타일, 연애관)로 어색함 없이 대화가 이어집니다.
              행사 종료 후에는 모바일로 비밀스럽게 호감을 전달합니다.
            </p>
          </div>
          <Link
            href="/apply"
            className="shrink-0 px-6 py-3 rounded-full font-bold text-sm text-neutral-900 bg-white hover:bg-neutral-100 shadow-md transition-all active:scale-95"
          >
            참가 신청하기
          </Link>
        </div>
      </section>

      {/* 6. REGION SCHEDULE WITH REGION FILTER */}
      <section id="schedule" className="py-16 md:py-24 bg-white border-y border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-extrabold text-[#623898] uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
              REGION SCHEDULE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900">
              소개남녀 지역 일정
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base">
              흑석동 · 서교동 · 합정동 · 홍대 · 신도림 등 원하는 지역의 일정을 확인하고 신청해 주세요
              <br className="hidden sm:inline" />
              <span className="text-xs text-neutral-500 font-medium">
                (상세 모임 장소는 참가 확정자 대상 개별 비밀 안내됩니다)
              </span>
            </p>
          </div>

          {/* Region Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {['전체', '흑석동', '서교동', '합정동', '홍대', '신도림'].map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  selectedRegion === region
                    ? 'bg-[#623898] text-white shadow-md shadow-purple-900/20'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {region === '전체' ? '전체 지역' : `${region} 일정`}
              </button>
            ))}
          </div>

          {/* Active Region Quick Banner */}
          {selectedRegion !== '전체' && (
            <div className="max-w-2xl mx-auto mb-8 bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#623898] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-neutral-900">
                      {selectedRegion} 지역 일정
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-200 text-[#623898]">
                      {SETTING_REGIONS.find((r) => r.name === selectedRegion)?.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {SETTING_REGIONS.find((r) => r.name === selectedRegion)?.desc}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRegion('전체')}
                className="text-xs text-neutral-500 hover:text-neutral-800 underline shrink-0 font-medium"
              >
                전체보기
              </button>
            </div>
          )}

          {/* Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-neutral-50 rounded-2xl border border-purple-100 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black px-2.5 py-1 rounded-md bg-purple-100 text-[#623898]">
                      📍 {session.region} 일정
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        session.status === '마감임박'
                          ? 'bg-rose-100 text-rose-600 animate-pulse'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      ● {session.status}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-neutral-900 group-hover:text-[#623898] transition-colors mb-3">
                    {session.title}
                  </h3>

                  <div className="space-y-2.5 text-xs sm:text-sm text-neutral-600 mb-6 bg-white p-4 rounded-xl border border-neutral-200/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="font-bold text-neutral-900">{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="text-[#623898] font-bold">대상: {session.ageGroup}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                    <div className="bg-purple-50 border border-purple-100 py-2 rounded-lg">
                      <span className="text-[11px] text-neutral-500 block">남성 잔여</span>
                      <span className="text-xs font-black text-purple-800">
                        {session.maleSlotsLeft === 0 ? (
                          <span className="text-rose-500">마감</span>
                        ) : (
                          `${session.maleSlotsLeft}자리 남음`
                        )}
                      </span>
                    </div>
                    <div className="bg-pink-50 border border-pink-100 py-2 rounded-lg">
                      <span className="text-[11px] text-neutral-500 block">여성 잔여</span>
                      <span className="text-xs font-black text-pink-800">
                        {session.femaleSlotsLeft === 0 ? (
                          <span className="text-rose-500">마감</span>
                        ) : (
                          `${session.femaleSlotsLeft}자리 남음`
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-400 line-through mr-1.5">
                      {session.originalPrice.toLocaleString()}원
                    </span>
                    <span className="text-lg font-black text-neutral-900">
                      {session.price.toLocaleString()}원
                    </span>
                  </div>
                  <Link
                    href={`/apply?sessionId=${session.id}&region=${encodeURIComponent(session.region)}`}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] hover:opacity-95 shadow-sm active:scale-95 transition-all"
                  >
                    일정 신청하기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TRUST & VERIFICATION GUARANTEE */}
      <section id="trust" className="py-16 md:py-24 bg-gradient-to-b from-neutral-900 to-purple-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold text-pink-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              SAFETY & TRUST
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              믿을 수 있는 3단계 신원 검증 시스템
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base">
              신원이 불분명하거나 매너가 불량한 참가자는 철저히 사전 차단합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. 본인 사진 & 직장 100% 검증</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                실물 본인 사진 검수와 명함, 사원증, 건강보험자격득실확인서 중 하나를 필수로 거칩니다.
                무직이나 신원 미상의 참가는 엄격히 제한됩니다.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. 싱글(미혼) 법적 보증</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                정식 국내결혼중개업 인허가 및 보증보험 가입 업체로서, 기혼자 참가는 법적으로 엄격히 금지되며 위반 시 강력한 민·형사상 책임을 묻습니다.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. 매너 평가 & 원스트라이크 아웃</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                행사 후 참가자 상호 매너 피드백을 수집하며, 비매너 언행이나 과도한 신체접촉, 불쾌감을 주는 참가자는 영구 영구제명 처리됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. REAL REVIEWS SECTION */}
      <section id="reviews" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-[#623898] uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
            REAL REVIEWS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900">
            실제 참가자들의 생생한 후기
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base">
            누적 참가자 45,000명, 320쌍 이상의 성혼을 탄생시킨 소개남녀의 진짜 이야기
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  {rev.badge && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
                      {rev.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-neutral-900 mb-2">
                  &ldquo;{rev.title}&rdquo;
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  {rev.content}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-800">{rev.author}</span>
                  <span>·</span>
                  <span>{rev.occupation}</span>
                </div>
                <span>{rev.sessionInfo}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-16 md:py-24 bg-white border-t border-neutral-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold text-[#623898] uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900">
              자주 묻는 질문
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base">
              참가 전 궁금하신 점들을 정리해 두었습니다
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq) => (
              <div
                key={faq.id}
                className="border border-neutral-200 rounded-2xl overflow-hidden transition-all bg-neutral-50/50"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-bold text-sm sm:text-base text-neutral-900 hover:text-[#623898] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-[#623898]">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  {openFaqId === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-purple-600 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-600 shrink-0 ml-2" />
                  )}
                </button>
                {openFaqId === faq.id && (
                  <div className="px-5 pb-6 pt-1 sm:px-6 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-200/60 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-[#623898] via-[#7E48BA] to-[#9955F3] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md mx-auto flex items-center justify-center text-white shadow-md">
            <Heart className="w-7 h-7 fill-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            이번 주말, 당신의 인생을 바꿀
            <br />
            특별한 인연을 만나보세요
          </h2>
          <p className="text-purple-100 text-sm sm:text-base max-w-xl mx-auto">
            흑석동, 서교동, 합정동, 홍대, 신도림에서 매주 주말 정기 세션이 열립니다.
            <br />
            선착순 조기 마감될 수 있으니 서둘러 신청하세요.
          </p>
          <div className="pt-2">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-black text-base sm:text-lg text-neutral-900 bg-white hover:bg-neutral-100 shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-5 h-5 text-purple-900" />
              <span>지금 20% 할인받고 참가하기</span>
              <ArrowRight className="w-5 h-5 text-purple-900" />
            </Link>
          </div>
          <p className="text-xs text-purple-200/80 pt-2">
            정가 60,000원 → 선착순 얼리버드가 23,900원 (웰컴 드링크 포함)
          </p>
        </div>
      </section>
    </div>
  );
}
