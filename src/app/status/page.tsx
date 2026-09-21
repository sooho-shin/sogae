'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Heart,
  ArrowRight,
  Download,
  Share2,
  AlertCircle,
  MessageCircle,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import { AdminApplication, ApplicationStatus } from '@/types/admin';
import { toPng } from 'html-to-image';

function StatusContent() {
  const searchParams = useSearchParams();
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [application, setApplication] = useState<AdminApplication | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-search if query param present
  useEffect(() => {
    const q = searchParams.get('query') || searchParams.get('receiptNumber');
    if (q) {
      setQueryInput(q);
      handleSearch(q);
    }
  }, [searchParams]);

  const handleSearch = async (targetQuery?: string) => {
    const q = (targetQuery || queryInput).trim();
    if (!q) {
      setErrorMsg('전화번호(010-XXXX-XXXX) 또는 접수번호(SG-...)를 입력해 주세요.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/applications/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setApplication(data.data);
      } else {
        setApplication(null);
        setErrorMsg(data.error || '일치하는 신청 내역을 찾을 수 없습니다.');
      }
    } catch (err: any) {
      setApplication(null);
      setErrorMsg(err?.message || '조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCard = async () => {
    const node = document.getElementById('status-profile-card');
    if (!node) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(node, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `${application?.name || '소개남녀'}_1대1_프로필카드.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download card image error:', err);
      alert('이미지 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/status?query=${encodeURIComponent(application?.receiptNumber || queryInput)}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Step Status Mapping
  const getStepIndex = (status?: ApplicationStatus) => {
    switch (status) {
      case '심사대기':
        return 1;
      case '프로필승인':
        return 2;
      case '매칭제안중':
        return 3;
      case '매칭성공':
        return 4;
      case '보류':
      default:
        return 1;
    }
  };

  const currentStep = getStepIndex(application?.status);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-neutral-900 pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-purple-900 via-[#331B54] to-[#1E0F33] text-white pt-12 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold backdrop-blur-md border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>실시간 신청 현황 & 프로필 카드 뷰어</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            내 1:1 소개팅 신청 내역 조회
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/80 max-w-lg mx-auto">
            신청 시 등록하신 휴대폰 번호 또는 접수번호를 입력하시면
            <br />
            현재 매칭 진행 상황과 발행된 내 프로필 카드를 확인하실 수 있습니다.
          </p>

          {/* Search Input Box */}
          <div className="pt-4 max-w-xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-xl flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-purple-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="휴대폰 번호 (010-XXXX-XXXX) 또는 접수번호"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-amber-300 via-rose-200 to-pink-300 text-neutral-900 hover:brightness-105 active:scale-98 transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-md"
              >
                {loading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full" />
                ) : (
                  <>
                    <span>내역 조회</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 z-10 relative space-y-8">
        {/* Error Notice */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl flex items-start gap-3 shadow-md">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="font-extrabold text-rose-900">{errorMsg}</p>
              <p className="text-rose-700">
                신청 내역이 없거나 번호가 일치하지 않으신가요? 아직 지원 전이시라면 새로 프로필 카드를 등록해 보세요.
              </p>
              <div className="pt-2">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-1 text-xs font-black text-rose-800 underline underline-offset-4 hover:text-rose-950"
                >
                  1:1 프로필 카드 무료 등록하러 가기 &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Search Result Display */}
        {application && (
          <div className="space-y-8">
            {/* Status Step Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl shadow-purple-950/5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#623898]">
                      접수번호: {application.receiptNumber}
                    </span>
                    <span className="text-xs text-neutral-400">
                      신청일시: {application.appliedAt}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mt-1">
                    {application.name}님의 1:1 매칭 진행 현황
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      application.status === '매칭성공'
                        ? 'bg-emerald-100 text-emerald-800'
                        : application.status === '매칭제안중'
                        ? 'bg-indigo-100 text-indigo-800'
                        : application.status === '프로필승인'
                        ? 'bg-purple-100 text-[#623898]'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    현재 단계: {application.status}
                  </span>
                </div>
              </div>

              {/* Progress Step Bar */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 relative pt-2">
                {[
                  { step: 1, title: '심사대기', desc: '서류·사진 검토' },
                  { step: 2, title: '프로필승인', desc: '카드 발행 완료' },
                  { step: 3, title: '매칭제안중', desc: '이성에게 제안' },
                  { step: 4, title: '매칭성공', desc: '카톡 ID 교환' },
                ].map((s) => {
                  const isPassed = currentStep >= s.step;
                  const isCurrent = currentStep === s.step;
                  return (
                    <div
                      key={s.step}
                      className={`text-center p-3 rounded-2xl transition-all border ${
                        isCurrent
                          ? 'bg-purple-50 border-[#623898] shadow-sm'
                          : isPassed
                          ? 'bg-neutral-50 border-neutral-200'
                          : 'bg-neutral-50/50 border-neutral-100 opacity-50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-black mb-1.5 ${
                          isCurrent
                            ? 'bg-[#623898] text-white ring-4 ring-purple-100'
                            : isPassed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-neutral-200 text-neutral-500'
                        }`}
                      >
                        {isPassed && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                      </div>
                      <span className="block font-black text-xs sm:text-sm text-neutral-900">
                        {s.title}
                      </span>
                      <span className="block text-[10px] text-neutral-500 mt-0.5">
                        {s.desc}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Step Context Description Alert */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100/80 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {application.status === '심사대기' && (
                  <p>
                    📌 <strong>담당 매니저가 본인 사진과 재직 서류를 꼼꼼히 확인하고 있습니다.</strong>
                    <br />
                    검토 완료 후 24시간 이내에 1:1 프로필 카드가 정식 발행되며, 이상형 조건에 맞는 이성에게 첫 제안이 시작됩니다.
                  </p>
                )}
                {application.status === '프로필승인' && (
                  <p>
                    ✨ <strong>신원 및 서류 검증이 완료되어 1:1 프로필 카드가 발행되었습니다!</strong>
                    <br />
                    희망하신 활동 지역({application.region})과 이상형 조건을 바탕으로 담당 매니저가 어울리는 이성을 선별하고 있습니다.
                  </p>
                )}
                {application.status === '매칭제안중' && (
                  <p>
                    💌 <strong>회원님의 프로필 카드가 조건에 맞는 이성분께 전달되어 매칭 의사를 여쭤보고 있습니다!</strong>
                    <br />
                    상대방이 수락(OK)하시면 매니저가 회원님께도 카드를 전달해 드리며, 양측 모두 동의 시 즉시 카카오톡 ID를 교환해 드립니다.
                  </p>
                )}
                {application.status === '매칭성공' && (
                  <p className="text-emerald-900 font-medium">
                    🎉 <strong>축하드립니다! 양측 모두 호감을 표현하여 1:1 매칭이 성사되었습니다!</strong>
                    <br />
                    담당 매니저가 신청 시 등록하신 카카오톡({application.kakaoId || '등록된 ID'})으로 상대방의 카톡 ID와 첫인사 가이드를 안내해 드렸습니다.
                  </p>
                )}
              </div>
            </div>

            {/* Profile Card Preview & Tools */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl shadow-purple-950/5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-neutral-900">
                    발행된 1:1 프로필 카드 실물
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    이성에게 제안될 때 사용되는 정식 프로필 카드입니다.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownloadCard}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-50 text-[#623898] hover:bg-purple-100 font-extrabold text-xs transition-colors active:scale-98"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloading ? '저장 중...' : '카드 이미지 저장 (PNG)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-extrabold text-xs transition-colors active:scale-98"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copiedLink ? '링크 복사 완료!' : '조회 링크 복사'}</span>
                  </button>
                </div>
              </div>

              {/* The Profile Card Itself */}
              <div className="flex justify-center py-4">
                <ProfileCard
                  cardId="status-profile-card"
                  data={application}
                  showWatermark={true}
                />
              </div>

              {/* Support & Manager Help */}
              <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>개인정보(전화번호, 본명)는 상대방에게 직접 노출되지 않으며 카톡 ID만 상호 교환됩니다.</span>
                </div>
                <Link
                  href="mailto:contact@sogaeting.kr"
                  className="font-bold text-[#623898] hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>매니저 1:1 상담 문의</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Empty State / Before Search Guidance */}
        {!application && !errorMsg && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-purple-100 shadow-xl shadow-purple-950/5 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-[#623898] flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-black text-neutral-900">
                신청하신 휴대폰 번호로 조회해 보세요
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                상단 검색창에 신청서 작성 시 입력하신 연락처(010-XXXX-XXXX) 또는 신청 완료 화면의 접수번호를 입력하시면 내 프로필 카드와 매칭 상황을 즉시 확인하실 수 있습니다.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/apply"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-black text-xs sm:text-sm text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] hover:from-[#512784] hover:to-[#7637E4] shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>새로운 1:1 프로필 카드 등록하기</span>
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <span>홈으로 돌아가기</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
          <div className="animate-spin w-8 h-8 border-4 border-[#623898] border-t-transparent rounded-full" />
        </div>
      }
    >
      <StatusContent />
    </Suspense>
  );
}
