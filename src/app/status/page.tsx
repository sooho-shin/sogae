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
  Lock,
  Unlock,
  UserCheck,
  Send,
  Eye,
  X,
  Edit3,
} from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import { AdminApplication, ApplicationStatus } from '@/types/admin';
import { MatchRequest } from '@/types';
import { toPng } from 'html-to-image';

function StatusContent() {
  const searchParams = useSearchParams();
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [application, setApplication] = useState<AdminApplication | null>(null);
  const [allApplications, setAllApplications] = useState<AdminApplication[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Sub-tab for Application Details
  const [activeTab, setActiveTab] = useState<'myCard' | 'receivedLikes' | 'sentLikes'>('myCard');

  // Likes & Matching State
  const [receivedLikes, setReceivedLikes] = useState<MatchRequest[]>([]);
  const [sentLikes, setSentLikes] = useState<MatchRequest[]>([]);
  const [unlockedPartnerIds, setUnlockedPartnerIds] = useState<string[]>([]);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);

  // Modal to view unlocked partner's full profile / photo
  const [viewingPartnerApp, setViewingPartnerApp] = useState<AdminApplication | null>(null);

  // Load all applications in background to resolve partner profile details
  useEffect(() => {
    fetch('/api/applications')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setAllApplications(json.data);
        }
      })
      .catch(console.error);
  }, []);

  // Auto-search if query param present
  useEffect(() => {
    const q = searchParams.get('query') || searchParams.get('receiptNumber');
    if (q) {
      setQueryInput(q);
      handleSearch(q);
    }
  }, [searchParams]);

  // Load matches when application is found
  const loadMatches = async (appId: string) => {
    try {
      const res = await fetch(`/api/matches?appId=${appId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setReceivedLikes(json.data.received || []);
        setSentLikes(json.data.sent || []);
        setUnlockedPartnerIds(json.data.unlockedPartnerIds || []);
      }
    } catch (e) {
      console.error('Failed to load matches:', e);
    }
  };

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
        loadMatches(data.data.id);
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

  // Handle Accept or Reject a Like
  const handleLikeAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      setProcessingRequestId(requestId);
      const res = await fetch('/api/matches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        if (application) {
          loadMatches(application.id);
        }
      } else {
        alert(json.error || '처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setProcessingRequestId(null);
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
      const url = `${window.location.origin}/status?query=${encodeURIComponent(
        application?.receiptNumber || queryInput
      )}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getStepIndex = (status?: ApplicationStatus) => {
    switch (status) {
      case '심사대기':
        return 1;
      case '프로필승인':
        return 2;
      case '매칭제안중':
        return 3;
      case '상호수락(카톡교환)':
      case '매칭성공':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStepIndex(application?.status);

  return (
    <div className="min-h-screen bg-[#FAF9FD] text-neutral-900 flex flex-col font-sans">
      <main className="flex-1 pb-24">
        {/* Hero Header */}
        <section className="bg-gradient-to-b from-[#2E1065] via-[#4C1D95] to-[#5B21B6] text-white pt-12 pb-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-pink-200 text-xs font-bold backdrop-blur-md border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>실시간 매칭 현황 & 호감 수락 센터</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              내 1:1 소개팅 & 호감 현황 조회
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/80 max-w-lg mx-auto leading-relaxed">
              신청 시 등록하신 휴대폰 번호 또는 접수번호를 입력하시면
              <br />
              <strong>나에게 온 호감 수락, 잠금 해제된 상대방 사진, 내 프로필 카드</strong>를 확인하실 수 있습니다.
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
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-semibold focus:outline-hidden"
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 z-10 relative space-y-6">
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
            <div className="space-y-6">
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
                      {application.name}님의 1:1 매칭 센터
                    </h2>
                  </div>

                  <Link
                    href={`/profiles?gender=${application.gender === 'male' ? 'female' : 'male'}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-md hover:opacity-95"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>이성 블라인드 프로필 둘러보기</span>
                  </Link>
                </div>

                {/* Progress Step Bar */}
                <div className="grid grid-cols-4 gap-2 sm:gap-4 relative pt-2">
                  {[
                    { step: 1, title: '심사대기', desc: '서류·인증 검토' },
                    { step: 2, title: '프로필승인', desc: '블라인드 카드 활성' },
                    { step: 3, title: '호감·매칭제안', desc: '선택 및 사진공개' },
                    { step: 4, title: '매칭성공', desc: '카톡 ID 교환' },
                  ].map((s) => {
                    const isPassed = currentStep >= s.step;
                    const isCurrent = currentStep === s.step;

                    return (
                      <div key={s.step} className="flex flex-col items-center text-center space-y-2 relative">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm transition-all ${
                            isCurrent
                              ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-lg ring-4 ring-purple-100 scale-105'
                              : isPassed
                              ? 'bg-emerald-500 text-white'
                              : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                          }`}
                        >
                          {isPassed && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : s.step}
                        </div>
                        <div>
                          <p
                            className={`font-black text-xs sm:text-sm ${
                              isCurrent ? 'text-purple-900' : isPassed ? 'text-neutral-800' : 'text-neutral-400'
                            }`}
                          >
                            {s.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-neutral-400 hidden sm:block mt-0.5">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Sub-Tabs */}
                <div className="pt-2 flex items-center gap-2 border-b border-neutral-200/80 pb-2 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('myCard')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                      activeTab === 'myCard'
                        ? 'bg-[#623898] text-white shadow-sm'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    내 1:1 프로필 카드
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('receivedLikes')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                      activeTab === 'receivedLikes'
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>나에게 도착한 호감</span>
                    {receivedLikes.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-white text-pink-600 text-[10px] font-black">
                        {receivedLikes.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('sentLikes')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                      activeTab === 'sentLikes'
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>내가 보낸 호감</span>
                    {sentLikes.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-white text-purple-700 text-[10px] font-black">
                        {sentLikes.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* TAB 1: MY PROFILE CARD */}
                {activeTab === 'myCard' && (
                  <div className="space-y-6 pt-2">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#623898]" />
                        <span className="text-xs sm:text-sm font-bold text-purple-950">
                          이 카드가 블라인드 상태로 이성에게 제안되며, 상호 수락 시 사진이 공개됩니다.
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handleDownloadCard}
                          disabled={isDownloading}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#623898] hover:bg-[#512784] shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>카드 이미지 저장</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-900 bg-white border border-purple-200 hover:bg-purple-50"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{copiedLink ? '복사 완료!' : '조회 링크 복사'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center py-2">
                      <ProfileCard
                        cardId="status-profile-card"
                        data={application}
                        showWatermark={true}
                      />
                    </div>

                    {/* Edit Profile Card Button */}
                    <div className="flex justify-center pt-2">
                      <Link
                        href={`/apply?receiptNumber=${encodeURIComponent(application.receiptNumber)}&mode=edit`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#623898] via-[#7E48BA] to-[#E12B70] hover:opacity-95 shadow-md active:scale-98 transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>내 프로필 카드 정보 수정하기</span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* TAB 2: RECEIVED LIKES */}
                {activeTab === 'receivedLikes' && (
                  <div className="space-y-4 pt-2">
                    <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-100 flex items-start gap-2.5">
                      <Heart className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm text-pink-950 space-y-0.5">
                        <p className="font-black">회원님의 블라인드 프로필을 보고 호감을 보낸 이성 목록입니다.</p>
                        <p className="text-pink-800 text-[11px]">
                          <strong>[수락하기]</strong>를 누르면 <strong>두 분 모두에게 서로의 실제 사진이 즉시 공개</strong>되며, 카카오톡 ID 교환이 확정됩니다!
                        </p>
                      </div>
                    </div>

                    {receivedLikes.length === 0 ? (
                      <div className="py-12 text-center bg-neutral-50 rounded-2xl border border-neutral-200/80 p-6 space-y-2">
                        <p className="text-sm font-bold text-neutral-600">
                          아직 도착한 호감이 없습니다.
                        </p>
                        <p className="text-xs text-neutral-400">
                          먼저 이성들의 블라인드 카드를 둘러보고 호감을 보내보세요!
                        </p>
                        <div className="pt-3">
                          <Link
                            href={`/profiles?gender=${application.gender === 'male' ? 'female' : 'male'}`}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-black text-xs text-white bg-[#623898]"
                          >
                            <Heart className="w-3.5 h-3.5" />
                            <span>이성 블라인드 프로필 둘러보기</span>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {receivedLikes.map((req) => {
                          const partnerApp = allApplications.find((a) => a.id === req.fromAppId);
                          const isAccepted = req.status === 'accepted';
                          const isUnlocked = isAccepted || unlockedPartnerIds.includes(req.fromAppId);

                          return (
                            <div
                              key={req.id}
                              className={`p-5 rounded-2xl border transition-all ${
                                isAccepted
                                  ? 'bg-emerald-50/50 border-emerald-200'
                                  : 'bg-white border-neutral-200 shadow-sm'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-base text-neutral-900">
                                      &apos;{req.fromNickname}&apos;님의 호감 신청
                                    </span>
                                    {isAccepted ? (
                                      <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                        <Unlock className="w-3 h-3" />
                                        <span>사진 공개 완료</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                                        <Lock className="w-3 h-3" />
                                        <span>수락 대기중</span>
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-neutral-500 mt-1">
                                    신청일시: {req.createdAt}
                                  </p>
                                  {req.message && (
                                    <p className="text-xs text-neutral-700 mt-2 bg-neutral-100 p-2.5 rounded-xl border border-neutral-200/60 font-medium">
                                      &ldquo;{req.message}&rdquo;
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {partnerApp && (
                                    <button
                                      type="button"
                                      onClick={() => setViewingPartnerApp(partnerApp)}
                                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center gap-1"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>프로필 카드 보기</span>
                                    </button>
                                  )}

                                  {!isAccepted && req.status === 'pending' && (
                                    <>
                                      <button
                                        type="button"
                                        disabled={processingRequestId === req.id}
                                        onClick={() => handleLikeAction(req.id, 'accept')}
                                        className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-105 shadow-md flex items-center gap-1"
                                      >
                                        <Heart className="w-3.5 h-3.5 fill-white" />
                                        <span>수락 (사진 공개)</span>
                                      </button>
                                      <button
                                        type="button"
                                        disabled={processingRequestId === req.id}
                                        onClick={() => handleLikeAction(req.id, 'reject')}
                                        className="px-3 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-neutral-600"
                                      >
                                        패스
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* If Accepted, show unlocked partner's Kakao ID */}
                              {isAccepted && partnerApp && (
                                <div className="mt-4 pt-3 border-t border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/80 p-3 rounded-xl">
                                  <div className="text-xs">
                                    <span className="font-extrabold text-emerald-900">
                                      🎉 매칭 성사! 상대방 카카오톡 ID:{' '}
                                    </span>
                                    <strong className="text-purple-700 font-black text-sm">
                                      {partnerApp.kakaoId || '확인 중'}
                                    </strong>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setViewingPartnerApp(partnerApp)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700"
                                  >
                                    상대방 실제 사진 보러가기
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: SENT LIKES */}
                {activeTab === 'sentLikes' && (
                  <div className="space-y-4 pt-2">
                    <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 flex items-start gap-2.5">
                      <Send className="w-5 h-5 text-[#623898] shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm text-purple-950 space-y-0.5">
                        <p className="font-black">회원님이 호감을 보낸 이성 목록입니다.</p>
                        <p className="text-purple-800 text-[11px]">
                          상대방이 수락하면 <strong>[사진 공개됨]</strong> 뱃지가 활성화되며, 상대방의 실제 얼굴 사진을 확인하실 수 있습니다.
                        </p>
                      </div>
                    </div>

                    {sentLikes.length === 0 ? (
                      <div className="py-12 text-center bg-neutral-50 rounded-2xl border border-neutral-200/80 p-6 space-y-2">
                        <p className="text-sm font-bold text-neutral-600">
                          아직 보낸 호감이 없습니다.
                        </p>
                        <div className="pt-3">
                          <Link
                            href={`/profiles?gender=${application.gender === 'male' ? 'female' : 'male'}`}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-black text-xs text-white bg-[#623898]"
                          >
                            <Heart className="w-3.5 h-3.5" />
                            <span>이성 블라인드 프로필 둘러보기</span>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {sentLikes.map((req) => {
                          const partnerApp = allApplications.find((a) => a.id === req.toAppId);
                          const isAccepted = req.status === 'accepted';

                          return (
                            <div
                              key={req.id}
                              className="p-4 rounded-2xl border border-neutral-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-neutral-900 text-sm">
                                    &apos;{req.toNickname}&apos;님께 호감 발송
                                  </span>
                                  {isAccepted ? (
                                    <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                      <Unlock className="w-3 h-3" />
                                      <span>수락 완료 (사진 공개됨!)</span>
                                    </span>
                                  ) : req.status === 'rejected' ? (
                                    <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                                      종료됨
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                                      <Clock className="w-3 h-3" />
                                      <span>상대방 확인 중</span>
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-neutral-500 mt-1">발송일시: {req.createdAt}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                {partnerApp && (
                                  <button
                                    type="button"
                                    onClick={() => setViewingPartnerApp(partnerApp)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1 ${
                                      isAccepted
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                    }`}
                                  >
                                    {isAccepted ? <Unlock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    <span>{isAccepted ? '실제 사진 확인하기' : '블라인드 프로필 보기'}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Privacy & Manager Support */}
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
                  상단 검색창에 신청서 작성 시 입력하신 연락처(010-XXXX-XXXX) 또는 신청 완료 화면의 접수번호를 입력하시면 내 프로필 카드와 도착한 호감을 즉시 확인하실 수 있습니다.
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
                  href="/profiles"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
                >
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span>이성 블라인드 프로필 둘러보기</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* PARTNER PROFILE CARD MODAL */}
      {viewingPartnerApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl relative space-y-4 max-h-[95vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setViewingPartnerApp(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Check if photo is unlocked for this partner */}
            {(() => {
              const isUnlocked = unlockedPartnerIds.includes(viewingPartnerApp.id);
              return (
                <div className="space-y-4">
                  <div className="text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                        isUnlocked
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-[#623898]'
                      }`}
                    >
                      {isUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>{isUnlocked ? '상호 수락: 실제 사진 공개됨' : '블라인드 프로필 카드'}</span>
                    </span>
                  </div>

                  <ProfileCard
                    data={viewingPartnerApp}
                    showWatermark={false}
                    isPhotoLocked={!isUnlocked}
                  />

                  {isUnlocked && viewingPartnerApp.kakaoId && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
                      <p className="text-xs font-bold text-emerald-800">
                        상대방 카카오톡 ID로 먼저 반갑게 첫인사를 건네보세요!
                      </p>
                      <p className="text-base font-black text-purple-900">
                        {viewingPartnerApp.kakaoId}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setViewingPartnerApp(null)}
                    className="w-full py-3 rounded-2xl font-black text-xs text-neutral-600 bg-neutral-100 hover:bg-neutral-200"
                  >
                    닫기
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9FD]">
          <div className="animate-spin w-8 h-8 border-4 border-[#623898] border-t-transparent rounded-full" />
        </div>
      }
    >
      <StatusContent />
    </Suspense>
  );
}
