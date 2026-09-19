'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  MessageCircle,
  FileText,
  UserCheck,
  Send,
  Lock,
} from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import {
  REVIEWS_DATA,
  FAQ_DATA,
  TRUST_STATS,
  SETTING_REGIONS,
  SAMPLE_MALE_CARD,
  SAMPLE_FEMALE_CARD,
} from '@/data/mockData';

export default function HomePage() {
  const [activeCardGender, setActiveCardGender] = useState<'male' | 'female'>('male');
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Sample male and female profile card data
  const maleSample = SAMPLE_MALE_CARD;
  const femaleSample = SAMPLE_FEMALE_CARD;

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
              <span>100% 신원 검증 · 1:1 프라이빗 프로필 매칭</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.2] md:leading-[1.18] text-white">
              프로필 카드로 먼저 확인하고,{' '}
              <br />
              <span className="bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                둘 다 OK하면 카톡 교환!
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-purple-100/85 font-normal leading-relaxed max-w-2xl mx-auto">
              어색한 단체 모임이나 어플의 끝없는 연락 피로감은 그만!
              <br className="hidden sm:inline" />
              매니저가 엄선한 <strong>1:1 프로필 카드</strong>를 제안받고, 양측 모두 수락했을 때만 카카오톡 아이디를 전달받아 설레는 1:1 만남을 시작하세요.
            </p>

            {/* CTA Group */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/apply"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-black text-base sm:text-lg text-neutral-900 bg-gradient-to-r from-amber-300 via-rose-200 to-pink-300 hover:from-amber-200 hover:to-pink-200 shadow-xl shadow-purple-950/40 hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                <Sparkles className="w-5 h-5 text-purple-900" />
                <span>1:1 프로필 카드 등록하고 신청하기</span>
                <ArrowRight className="w-5 h-5 text-purple-900" />
              </Link>
              <Link
                href="#profile-showcase"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-sm sm:text-base text-white/90 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md transition-all"
              >
                프로필 카드 실물 미리보기
              </Link>
            </div>

            {/* Value Props Pills */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-purple-200/90">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% 얼굴 사진 & 직장 서류 검증</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>쌍방 수락 시에만 카카오톡 ID 교환</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>거절해도 부담 없는 비공개 매칭 매니저 케어</span>
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
              <span className="text-xs sm:text-sm font-bold text-neutral-800 block">
                {stat.label}
              </span>
              <span className="text-[11px] text-neutral-600 block">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. NEW: 1:1 PROFILE CARD SHOWCASE */}
      <section id="profile-showcase" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold text-[#623898] uppercase tracking-wider bg-purple-100 px-3.5 py-1 rounded-full">
            REAL PROFILE CARD SHOWCASE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900">
            이렇게 완성된 프로필 카드로
            <br />
            1:1 매칭 의사를 먼저 여쭤봅니다
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base">
            얼굴 사진부터 나이, 직업, 키, 성격, 체형, 주량, 이상형까지!
            <br className="hidden sm:inline" />
            매니저가 정성껏 제작한 카드를 보고 <strong>&ldquo;이분은 어떠신가요?&rdquo;</strong> 제안드렸을 때, 마음에 드시면 <strong>OK</strong>만 해주세요.
          </p>
        </div>

        {/* Gender Toggle Tabs */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => setActiveCardGender('male')}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all ${
              activeCardGender === 'male'
                ? 'bg-[#352758] text-white shadow-lg shadow-purple-950/20 scale-105'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            🙋‍♂️ 남자 프로필 카드 예시 보기
          </button>
          <button
            type="button"
            onClick={() => setActiveCardGender('female')}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all ${
              activeCardGender === 'female'
                ? 'bg-[#E12B70] text-white shadow-lg shadow-pink-900/20 scale-105'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            🙋‍♀️ 여자 프로필 카드 예시 보기
          </button>
        </div>

        {/* Card & Explanatory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left / Center: The Profile Card Itself */}
          <div className="lg:col-span-6 flex justify-center">
            <ProfileCard
              data={activeCardGender === 'male' ? maleSample : femaleSample}
              showWatermark={true}
            />
          </div>

          {/* Right: How It Matches Explanation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-md space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#E12B70] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  소개남녀만의 1:1 안심 매칭 룰
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
                  내가 승낙하기 전까지,
                  <br />
                  내 카카오톡 아이디는 절대 공개되지 않습니다
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#623898] flex items-center justify-center shrink-0 font-black">
                    1
                  </div>
                  <div>
                    <h4 className="font-extrabold text-neutral-900">투명하고 검증된 프로필 카드</h4>
                    <p className="text-neutral-600 text-xs mt-0.5">
                      서류가 100% 검증된 회원만 정식 카드로 제작되며, 과장이나 보정 사기 없는 실물 정보를 확인합니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                  <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#E12B70] flex items-center justify-center shrink-0 font-black">
                    2
                  </div>
                  <div>
                    <h4 className="font-extrabold text-neutral-900">매니저의 정중한 1:1 카톡 제안</h4>
                    <p className="text-neutral-600 text-xs mt-0.5">
                      매니저가 회원님께 프로필 카드를 보내며 <strong>&ldquo;이분은 어떠신가요?&rdquo;</strong> 하고 의사를 여쭤봅니다. 마음에 들지 않으면 언제든 편하게 패스하셔도 괜찮습니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-black">
                    3
                  </div>
                  <div>
                    <h4 className="font-extrabold text-neutral-900">양측 모두 OK 시 카카오톡 ID 교환!</h4>
                    <p className="text-neutral-600 text-xs mt-0.5">
                      상대방도 회원님의 프로필 카드를 보고 수락(OK)했을 때에만 매니저가 서로의 카톡 ID를 전달하여 1:1 대화를 연결해 드립니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/apply"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] hover:from-[#512784] hover:to-[#7637E4] shadow-lg shadow-purple-900/20 transition-all active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>나만의 1:1 소개팅 프로필 카드 만들기</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 4-STEP MATCHING PROCESS */}
      <section id="program" className="py-16 md:py-24 bg-white border-y border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold text-[#623898] uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
              MATCHING PROCESS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900">
              소개남녀 1:1 소개팅은 이렇게 진행됩니다
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base">
              신청부터 프로필 카드 발행, 1:1 제안, 카톡 ID 교환까지 매니저가 100% 밀착 케어합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 hover:border-purple-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#623898] flex items-center justify-center font-black text-lg mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-purple-600 mb-1 block">STEP 1</span>
                <h3 className="text-base font-extrabold text-neutral-900 mb-2">프로필 신청서 작성</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  본인 얼굴 사진, 직장 및 직무, 키, 성격, 체형, 주량, 이상형, 카카오톡 ID를 꼼꼼하게 입력합니다.
                </p>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 hover:border-purple-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#E12B70] flex items-center justify-center font-black text-lg mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-pink-600 mb-1 block">STEP 2</span>
                <h3 className="text-base font-extrabold text-neutral-900 mb-2">1:1 프로필 카드 제작</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  담당 매니저가 신원 및 직장 서류를 검증한 후, 이성에게 전달할 맞춤형 &lsquo;소개남녀 프로필 카드&rsquo;를 발행합니다.
                </p>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 hover:border-purple-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg mb-4">
                  <Send className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-indigo-600 mb-1 block">STEP 3</span>
                <h3 className="text-base font-extrabold text-neutral-900 mb-2">이성에게 1:1 매칭 제안</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  매니저가 회원님의 이상형 조건에 부합하는 이성에게 프로필 카드를 보내며 &ldquo;이분은 어떠신가요?&rdquo; 매칭 의사를 여쭤봅니다.
                </p>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 border-2 border-emerald-400 bg-emerald-50/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-emerald-700 mb-1 block">STEP 4</span>
                <h3 className="text-base font-extrabold text-neutral-900 mb-2">양측 OK 시 카톡 교환!</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  두 분 모두 호감을 보이며 수락(OK)하면 서로의 카카오톡 ID를 교환해 드려 프라이빗한 1:1 만남이 성사됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 5 CORE REGIONS SHOWCASE */}
      <section id="regions" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold text-[#623898] uppercase tracking-wider bg-purple-100 px-3.5 py-1 rounded-full">
            5 CORE REGIONS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900">
            소개남녀 5대 거점 지역 매칭
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base">
            서울 주요 핫플레이스(흑석·서교·합정·홍대·신도림)를 중심으로 내 생활 반경에 맞는 이성을 연결해 드립니다
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SETTING_REGIONS.map((region) => (
            <div
              key={region.id}
              className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition-all flex flex-col justify-between group"
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

              <div className="pt-4 mt-4 border-t border-neutral-100">
                <Link
                  href={`/apply?region=${encodeURIComponent(region.name)}`}
                  className="w-full inline-flex items-center justify-center gap-1 py-2 text-xs font-bold text-[#623898] bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                >
                  <span>{region.name} 1:1 매칭 신청</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TRUST & VERIFICATION GUARANTEE */}
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
                재직증명서, 사원증, 명함 또는 회사 이메일을 통해 재직 사실을 확인하며 본인 얼굴 사진이 등록된 분만 정식 프로필 카드를 발행합니다.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. 싱글(미혼) 법적 보증 서약</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                기혼자나 교제 중인 분의 참가를 원천 배제하기 위해 법적 싱글 서약서를 징구하며 위반 시 강력한 민·형사상 책임을 묻습니다.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. 비매너 원스트라이크 아웃</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                상호 수락 후 연락 두절(잠수), 무례한 언행, 허위 정보 기재 적발 시 영구 제명 처리하여 안전하고 존중받는 만남 문화를 지킵니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. REVIEWS */}
      <section id="reviews" className="py-16 md:py-24 bg-white border-b border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold text-[#623898] uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
              REVIEWS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900">
              1:1 매칭으로 시작된 설레는 인연들
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base">
              프로필 카드를 보고 서로 OK하여 카톡을 주고받은 실제 회원님들의 생생한 후기
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS_DATA.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-purple-100 text-[#623898]">
                      {review.badge || '커플 탄생 💕'}
                    </span>
                    <div className="flex text-amber-400">
                      {'★'.repeat(review.rating)}
                    </div>
                  </div>
                  <h3 className="font-extrabold text-neutral-900 text-sm">
                    {review.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {review.content}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-bold text-neutral-800">{review.author}</span>
                  <span>{review.occupation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section id="faq" className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold text-[#623898] uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900">
            자주 묻는 질문
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base">
            1:1 프로필 카드 매칭에 대해 궁금하신 점을 확인하세요
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-neutral-900">
                    Q. {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#623898] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. BOTTOM CTA */}
      <section className="py-16 bg-gradient-to-r from-[#623898] via-[#7B40EF] to-[#E23B75] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black">
            지금, 나만의 1:1 소개팅 프로필 카드를 등록하세요
          </h2>
          <p className="text-xs sm:text-base text-purple-100 max-w-xl mx-auto">
            매니저가 엄선한 이성에게 프로필 카드를 제안해 드립니다.
            서로 OK했을 때만 카카오톡 ID를 교환하므로 부담 없이 신청할 수 있습니다.
          </p>
          <div className="pt-2">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-base text-neutral-900 bg-white hover:bg-neutral-100 shadow-xl shadow-purple-950/30 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-[#623898]" />
              <span>무료 프로필 카드 등록하기</span>
              <ArrowRight className="w-5 h-5 text-[#623898]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
