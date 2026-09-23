'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProfileCard from '@/components/ProfileCard';
import { AdminApplication } from '@/types/admin';
import { AvailableRegion, MatchRequest } from '@/types';
import {
  Sparkles,
  Heart,
  Lock,
  Unlock,
  Filter,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  UserCheck,
  Eye,
  AlertCircle,
  X,
} from 'lucide-react';

function ProfilesContent() {
  const searchParams = useSearchParams();
  const initialGender = searchParams.get('gender') === 'male' ? 'male' : 'female';
  const initialRegion = (searchParams.get('region') as AvailableRegion) || '전체';

  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [targetGender, setTargetGender] = useState<'female' | 'male'>(initialGender);
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('전체');

  // Modal State for Sending Like
  const [selectedTarget, setSelectedTarget] = useState<AdminApplication | null>(null);
  const [senderIdentifier, setSenderIdentifier] = useState<string>(''); // receiptNumber or phone
  const [senderMessage, setSenderMessage] = useState<string>('');
  const [isSubmittingLike, setIsSubmittingLike] = useState<boolean>(false);
  const [likeResult, setLikeResult] = useState<{ success: boolean; message: string; isMutual?: boolean } | null>(null);

  // Unlocked Partner IDs for the current viewing session (if logged in via receipt)
  const [myAppId, setMyAppId] = useState<string>('');
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  // 1. Fetch all applications
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/applications');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setApplications(json.data);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Check localStorage for saved receiptNumber
    if (typeof window !== 'undefined') {
      const savedReceipt = localStorage.getItem('sogaeting_receipt');
      const savedPhone = localStorage.getItem('sogaeting_phone');
      if (savedReceipt) setSenderIdentifier(savedReceipt);
      else if (savedPhone) setSenderIdentifier(savedPhone);
    }
  }, []);

  // 2. Fetch match status if senderIdentifier is present
  useEffect(() => {
    if (!senderIdentifier.trim() || applications.length === 0) return;

    const myApp = applications.find(
      (a) =>
        a.receiptNumber.trim() === senderIdentifier.trim() ||
        a.phone.replace(/[^0-9]/g, '') === senderIdentifier.replace(/[^0-9]/g, '')
    );

    if (myApp) {
      setMyAppId(myApp.id);
      fetch(`/api/matches?appId=${myApp.id}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data?.unlockedPartnerIds) {
            setUnlockedIds(json.data.unlockedPartnerIds);
          }
        })
        .catch(console.error);
    }
  }, [senderIdentifier, applications]);

  // 3. Filtered applications by gender, region, age
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Must be target gender (default: view opposite gender)
      if (app.gender !== targetGender) return false;

      // Region Filter
      if (selectedRegion !== '전체' && app.region !== selectedRegion) {
        return false;
      }

      // Age Filter
      if (selectedAgeGroup !== '전체') {
        const year = parseInt(app.birthYear || '95', 10);
        if (selectedAgeGroup === '20대 초중반' && (year < 97 || year > 0)) return false;
        if (selectedAgeGroup === '20대 후반' && (year < 93 || year > 96)) return false;
        if (selectedAgeGroup === '30대 초반' && (year < 89 || year > 92)) return false;
        if (selectedAgeGroup === '30대 중후반' && (year < 83 || year > 88)) return false;
      }

      return true;
    });
  }, [applications, targetGender, selectedRegion, selectedAgeGroup]);

  // Handle Send Like Submission
  const handleSendLike = async () => {
    if (!selectedTarget) return;

    if (!senderIdentifier.trim()) {
      alert('회원님의 신청 접수번호(SG-1ON1-...) 또는 휴대폰 번호를 입력해 주세요.');
      return;
    }

    // Find sender application
    const senderApp = applications.find(
      (a) =>
        a.receiptNumber.trim() === senderIdentifier.trim() ||
        a.phone.replace(/[^0-9]/g, '') === senderIdentifier.replace(/[^0-9]/g, '')
    );

    if (!senderApp) {
      alert('입력하신 접수번호 또는 휴대폰 번호로 등록된 지원서를 찾을 수 없습니다. 먼저 1:1 지원서를 작성해 주세요.');
      return;
    }

    if (senderApp.id === selectedTarget.id) {
      alert('본인에게는 호감을 보낼 수 없습니다.');
      return;
    }

    try {
      setIsSubmittingLike(true);
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAppId: senderApp.id,
          fromNickname: senderApp.nickname || senderApp.name,
          fromGender: senderApp.gender,
          toAppId: selectedTarget.id,
          toNickname: selectedTarget.nickname || selectedTarget.name,
          toGender: selectedTarget.gender,
          message: senderMessage.trim() || `${selectedTarget.nickname}님의 블라인드 프로필을 보고 호감을 보냅니다!`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setLikeResult({
          success: true,
          message: json.message,
          isMutual: json.isMutualAccept,
        });
        if (json.isMutualAccept) {
          setUnlockedIds((prev) => [...prev, selectedTarget.id]);
        }
      } else {
        alert(json.error || '호감 전송에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSubmittingLike(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FD] text-neutral-900 flex flex-col font-sans">
      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#2E1065] via-[#4C1D95] to-[#5B21B6] text-white pt-12 pb-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-black text-pink-200">
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span>외모 선입견 없는 2단계 블라인드 소개팅</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-snug">
              가치관과 스펙을 먼저 확인하고,
              <br />
              <span className="bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                둘 다 수락하면 서로의 실제 사진이 공개됩니다!
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-purple-100/90 max-w-2xl mx-auto leading-relaxed">
              사진에 휩쓸리지 않고 키, 체형, 직업, 가치관, 취미, 이상형을 먼저 읽어보세요.
              <br />
              마음에 드는 이성에게 <strong>[호감 보내기]</strong>를 누르고, 상대방도 수락하면 <strong>실제 얼굴 사진</strong>이 짜잔 하고 열립니다!
            </p>

            {/* Step Indicators */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold text-purple-200">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
                <Lock className="w-3.5 h-3.5 text-pink-300" />
                <span>STEP 1. 블라인드 카드 탐색</span>
              </div>
              <span className="text-white/40">➔</span>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
                <Heart className="w-3.5 h-3.5 text-pink-400" />
                <span>STEP 2. 마음에 드는 이성 선택</span>
              </div>
              <span className="text-white/40">➔</span>
              <div className="flex items-center gap-1.5 bg-pink-500/30 px-3 py-1.5 rounded-xl border border-pink-400/40 text-pink-200">
                <Unlock className="w-3.5 h-3.5 text-amber-300" />
                <span>STEP 3. 상호 수락 시 사진 공개!</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Navigation Bar */}
        <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs py-3 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Gender Toggle Tabs */}
            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-2xl w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setTargetGender('female')}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                  targetGender === 'female'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                👩 여성 프로필 보기 (남성용)
              </button>
              <button
                type="button"
                onClick={() => setTargetGender('male')}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                  targetGender === 'male'
                    ? 'bg-gradient-to-r from-[#623898] to-[#8C52FF] text-white shadow-md'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                👨 남성 프로필 보기 (여성용)
              </button>
            </div>

            {/* Region & Age Dropdowns */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
                <Filter className="w-3.5 h-3.5 text-neutral-400" />
                <span>지역:</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-transparent font-black text-purple-900 focus:outline-hidden cursor-pointer"
                >
                  <option value="전체">전체 지역</option>
                  <option value="흑석동">흑석동</option>
                  <option value="서교동">서교동</option>
                  <option value="합정동">합정동</option>
                  <option value="홍대">홍대</option>
                  <option value="신도림">신도림</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
                <span>연령:</span>
                <select
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="bg-transparent font-black text-purple-900 focus:outline-hidden cursor-pointer"
                >
                  <option value="전체">전체 연령</option>
                  <option value="20대 초중반">20대 초중반</option>
                  <option value="20대 후반">20대 후반</option>
                  <option value="30대 초반">30대 초반</option>
                  <option value="30대 중후반">30대 중후반</option>
                </select>
              </div>

              <Link
                href="/status"
                className="inline-flex items-center gap-1 text-xs font-extrabold text-[#623898] hover:underline px-2 shrink-0 ml-auto md:ml-0"
              >
                <span>내 매칭 현황</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Profile Feed Cards Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-neutral-900 flex items-center gap-2">
                <span>
                  {targetGender === 'female' ? '여성' : '남성'} 블라인드 프로필
                </span>
                <span className="text-xs font-extrabold bg-purple-100 text-[#623898] px-2.5 py-0.5 rounded-full">
                  {filteredApps.length}명 대기중
                </span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                마음에 드는 분을 발견하시면 <strong>[호감 보내기]</strong>를 눌러 매칭을 신청해 보세요.
              </p>
            </div>

            <Link
              href="/apply"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] px-4 py-2 rounded-xl shadow-xs hover:opacity-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>내 카드 등록하기</span>
            </Link>
          </div>

          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-neutral-500">
                엄선된 블라인드 프로필 카드를 불러오는 중입니다...
              </p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200/80 p-8 space-y-4 max-w-lg mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-full bg-purple-50 text-[#623898] flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-base text-neutral-900">
                선택하신 조건에 해당하는 회원이 아직 없습니다.
              </h3>
              <p className="text-xs text-neutral-500">
                지역 또는 연령 필터를 [전체]로 변경하시거나, 첫 번째 프로필 카드의 주인공이 되어보세요!
              </p>
              <div className="pt-2">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black text-white bg-[#623898]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>내 1:1 프로필 카드 등록하기</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
              {filteredApps.map((app) => {
                const isUnlocked = unlockedIds.includes(app.id);

                return (
                  <div
                    key={app.id}
                    className="flex flex-col bg-white rounded-3xl p-3 border border-neutral-200/80 shadow-md hover:shadow-xl transition-all duration-300 relative group"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-5 right-5 z-20">
                      {isUnlocked ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md animate-bounce">
                          <Unlock className="w-3 h-3" />
                          <span>사진 공개됨!</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                          <Lock className="w-3 h-3 text-pink-300" />
                          <span>블라인드 카드</span>
                        </span>
                      )}
                    </div>

                    {/* Actual Profile Card */}
                    <div className="w-full">
                      <ProfileCard
                        data={app}
                        showWatermark={false}
                        isPhotoLocked={!isUnlocked}
                      />
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 px-2 pb-1">
                      {isUnlocked ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center space-y-1">
                          <div className="flex items-center justify-center gap-1 text-xs font-black text-emerald-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>상호 수락으로 사진이 공개된 회원입니다!</span>
                          </div>
                          <p className="text-[11px] text-emerald-700">
                            신청 현황 페이지에서 상대방의 카카오톡 ID를 확인하세요.
                          </p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTarget(app);
                            setLikeResult(null);
                          }}
                          className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
                          <span>이분에게 호감 보내기 (사진 공개 신청)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* LIKE / PROPOSAL MODAL */}
      {selectedTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 relative space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedTarget(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {likeResult ? (
              // Result View
              <div className="py-6 text-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                    likeResult.isMutual ? 'bg-pink-100 text-pink-600' : 'bg-purple-100 text-purple-600'
                  }`}
                >
                  {likeResult.isMutual ? (
                    <Sparkles className="w-8 h-8" />
                  ) : (
                    <Send className="w-8 h-8" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-neutral-900">
                    {likeResult.isMutual ? '🎉 양측 상호 수락 완료!' : '호감 전송 완료!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {likeResult.message}
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/status"
                    className="w-full py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] text-center"
                  >
                    내 신청 현황 및 사진 확인하기
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedTarget(null)}
                    className="w-full py-3 rounded-2xl font-bold text-xs text-neutral-600 bg-neutral-100 hover:bg-neutral-200"
                  >
                    다른 프로필 더 둘러보기
                  </button>
                </div>
              </div>
            ) : (
              // Input View
              <>
                <div className="text-center space-y-1 pt-1">
                  <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-6 h-6 fill-pink-500 text-pink-500" />
                  </div>
                  <h3 className="text-lg font-black text-neutral-900">
                    &apos;{selectedTarget.nickname}&apos;님께 호감 보내기
                  </h3>
                  <p className="text-xs text-neutral-500">
                    상대방도 회원님의 블라인드 카드를 보고 수락하면 <strong>두 분의 실제 얼굴 사진이 동시에 공개</strong>됩니다!
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Sender Identifier */}
                  <div>
                    <label className="block text-xs font-black text-neutral-800 mb-1">
                      본인의 접수번호 또는 휴대폰 번호 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="예: SG-1ON1-20260923-XXXX 또는 01012345678"
                      value={senderIdentifier}
                      onChange={(e) => setSenderIdentifier(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm font-bold focus:border-[#623898] focus:outline-hidden"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">
                      * 지원서를 작성하셨을 때 발급받으신 번호입니다.
                    </p>
                  </div>

                  {/* Optional Message */}
                  <div>
                    <label className="block text-xs font-black text-neutral-800 mb-1">
                      상대방에게 전할 한 줄 메시지 (선택)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="예: 프로필의 성격과 취미가 저와 너무 잘 맞으시는 것 같아요!"
                      value={senderMessage}
                      onChange={(e) => setSenderMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#623898] focus:outline-hidden resize-none"
                    />
                  </div>

                  {/* Blind Guarantee Notice */}
                  <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-100 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#623898] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      상대방에게는 회원님의 <strong>블라인드 프로필 카드(사진 비공개)</strong>가 전달되며, 상대방이 수락하기 전까지는 전화번호 및 카카오톡 ID가 일절 노출되지 않습니다.
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTarget(null)}
                    className="flex-1 py-3.5 rounded-xl font-bold text-xs text-neutral-600 bg-neutral-100 hover:bg-neutral-200"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittingLike}
                    onClick={handleSendLike}
                    className="flex-2 py-3.5 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isSubmittingLike ? (
                      <span>전송 중...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>호감 보내기 완료</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9FD]">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      }
    >
      <ProfilesContent />
    </Suspense>
  );
}
