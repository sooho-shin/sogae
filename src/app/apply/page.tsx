'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  AlertCircle,
  Copy,
  MapPin,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import {
  SESSIONS_DATA,
  SETTING_REGIONS,
  JOB_CATEGORIES,
  INTEREST_TAGS,
  MBTI_LIST
} from '@/data/mockData';
import { ApplicationFormData, Session, AvailableRegion } from '@/types';

function ApplyFormContent() {
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Region Filter in Step 1
  const [filterRegion, setFilterRegion] = useState<string>('전체');

  // Form State
  const [formData, setFormData] = useState<ApplicationFormData>({
    sessionId: '',
    region: '',
    sessionTitle: '',
    sessionDate: '',
    sessionTime: '',
    ageGroup: '',
    name: '',
    gender: '',
    birthDate: '',
    phone: '',
    location: '',
    height: '',
    bodyType: '보통',
    drinking: '가끔',
    smoking: '비흡연',
    profileImage: null,
    jobCategory: '',
    companyName: '',
    jobRole: '',
    mbti: '',
    interests: [],
    idealType: '',
    intro: '',
    verificationType: 'business_card',
    verificationFile: null,
    agreementSingle: false,
    agreementManner: false,
    agreementPrivacy: false,
  });

  // Errors State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize selected session & region from URL query
  useEffect(() => {
    const sessionQuery = searchParams.get('sessionId');
    const regionQuery = searchParams.get('region') as AvailableRegion | null;

    if (regionQuery && ['흑석동', '서교동', '합정동', '홍대', '신도림'].includes(regionQuery)) {
      setFilterRegion(regionQuery);
    }

    if (sessionQuery) {
      const found = SESSIONS_DATA.find((s) => s.id === sessionQuery);
      if (found) {
        setFormData((prev) => ({
          ...prev,
          sessionId: found.id,
          region: found.region,
          sessionTitle: found.title,
          sessionDate: found.date,
          sessionTime: found.time,
          ageGroup: found.ageGroup,
        }));
        setFilterRegion(found.region);
      }
    } else if (SESSIONS_DATA.length > 0 && !formData.sessionId) {
      const first = SESSIONS_DATA[0];
      setFormData((prev) => ({
        ...prev,
        sessionId: first.id,
        region: first.region,
        sessionTitle: first.title,
        sessionDate: first.date,
        sessionTime: first.time,
        ageGroup: first.ageGroup,
      }));
    }
  }, [searchParams]);

  // Filtered Sessions for Step 1
  const displayedSessions =
    filterRegion === '전체'
      ? SESSIONS_DATA
      : SESSIONS_DATA.filter((s) => s.region === filterRegion);

  // Session selection handler
  const handleSelectSession = (session: Session) => {
    setFormData((prev) => ({
      ...prev,
      sessionId: session.id,
      region: session.region,
      sessionTitle: session.title,
      sessionDate: session.date,
      sessionTime: session.time,
      ageGroup: session.ageGroup,
    }));
    setErrors((prev) => ({ ...prev, session: '' }));
  };

  // Image Upload Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profileImage: '사진 용량은 10MB 이하만 가능합니다.' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result as string }));
        setErrors((prev) => ({ ...prev, profileImage: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
  };

  // Interest toggle
  const toggleInterest = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(tag);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((t) => t !== tag) };
      } else {
        if (prev.interests.length >= 5) return prev;
        return { ...prev, interests: [...prev.interests, tag] };
      }
    });
  };

  // Phone auto format (010-XXXX-XXXX)
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    let formatted = raw;
    if (raw.length > 3 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  // Validation per step
  const validateStep = (step: number): boolean => {
    const errs: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.sessionId) {
        errs.session = '참가하실 소개팅 세션을 선택해주세요.';
      }
    } else if (step === 2) {
      if (!formData.name.trim()) errs.name = '이름을 입력해주세요.';
      if (!formData.gender) errs.gender = '성별을 선택해주세요.';
      if (!formData.birthDate.trim()) {
        errs.birthDate = '생년월일을 입력해주세요. (예: 1995.04.28)';
      }
      if (!formData.phone.trim() || formData.phone.length < 12) {
        errs.phone = '올바른 휴대폰 번호를 입력해주세요.';
      }
      if (!formData.location.trim()) errs.location = '거주 지역을 입력해주세요.';
      if (!formData.height.trim()) errs.height = '키(cm)를 입력해주세요.';
      if (!formData.profileImage) {
        errs.profileImage = '본인 확인 및 매칭 심사를 위한 사진을 등록해주세요.';
      }
    } else if (step === 3) {
      if (!formData.jobCategory) errs.jobCategory = '직군 분류를 선택해주세요.';
      if (!formData.jobRole.trim()) errs.jobRole = '담당 직무를 입력해주세요.';
      if (!formData.mbti) errs.mbti = 'MBTI를 선택해주세요.';
      if (formData.interests.length === 0) {
        errs.interests = '관심사/취미를 1개 이상 선택해주세요.';
      }
      if (!formData.idealType.trim()) {
        errs.idealType = '선호하는 이상형 스타일을 간단히 적어주세요.';
      }
    } else if (step === 4) {
      if (!formData.agreementSingle) {
        errs.agreementSingle = '미혼(싱글) 확인 서약에 동의해야 합니다.';
      }
      if (!formData.agreementManner) {
        errs.agreementManner = '매너 준수 서약에 동의해야 합니다.';
      }
      if (!formData.agreementPrivacy) {
        errs.agreementPrivacy = '개인정보 수집 및 이용에 동의해야 합니다.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const receipt = `SG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${randomNum}`;
    setReceiptNumber(receipt);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#623898', '#E55B7D', '#FFC837', '#9857D3'],
      });
    } catch {
      // safe fallback
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedSessionObj = SESSIONS_DATA.find((s) => s.id === formData.sessionId);

  const copyReceipt = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(receiptNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-6 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
            <Check className="w-9 h-9 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              참가 신청 접수 완료
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
              소개팅 참가 신청이 완료되었습니다!
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              담당 매니저가 사진 및 서류 확인 후 24시간 이내에 개별 카카오톡으로 안내드립니다.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="bg-neutral-50 rounded-2xl p-5 sm:p-6 text-left border border-neutral-200/80 space-y-3.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="text-neutral-500 font-medium">접수 번호</span>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#623898]">{receiptNumber}</span>
                <button
                  type="button"
                  onClick={copyReceipt}
                  className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                  title="접수번호 복사"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-600 text-right">접수번호가 복사되었습니다!</p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">신청자 성명</span>
              <div className="flex items-center gap-2">
                {formData.profileImage && (
                  <img
                    src={formData.profileImage}
                    alt="프로필"
                    className="w-7 h-7 rounded-full object-cover border border-purple-300"
                  />
                )}
                <span className="font-bold text-neutral-800">
                  {formData.name} ({formData.gender === 'male' ? '남성' : '여성'})
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500 font-medium">연락처</span>
              <span className="font-bold text-neutral-800">{formData.phone}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500 font-medium">선택 지역 및 세션</span>
              <span className="font-bold text-neutral-800 text-right">
                <span className="text-[#623898] font-extrabold">[{formData.region || selectedSessionObj?.region}]</span> {selectedSessionObj?.title}
                <br />
                <span className="text-xs text-neutral-600">
                  {selectedSessionObj?.date} {selectedSessionObj?.time}
                </span>
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500 font-medium">본인 사진 등록</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> 등록 완료 (심사 대기)
              </span>
            </div>

            <div className="flex justify-between pt-3 border-t border-neutral-200">
              <span className="text-neutral-500 font-medium">참가비 (얼리버드가)</span>
              <span className="font-black text-neutral-900 text-base">
                {selectedSessionObj?.price.toLocaleString() || '23,900'}원
              </span>
            </div>
          </div>

          {/* Next Steps Notification */}
          <div className="bg-purple-50 rounded-2xl p-4 sm:p-5 text-left border border-purple-100 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#623898] shrink-0 mt-0.5" />
            <div className="text-xs text-purple-900 space-y-1">
              <p className="font-bold">입금 및 최종 확정 안내</p>
              <p className="text-purple-800/80 leading-relaxed">
                신청서 검토 후 입력하신 휴대폰 번호로 카카오톡 알림톡(입금 계좌 및 {formData.region || '선택 지역'} 프라이빗 모임 상세 위치 안내)이 발송됩니다.
                안내된 시각까지 입금이 완료되면 최종 참가가 확정됩니다.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm text-white bg-[#623898] hover:bg-[#522E80] shadow-md transition-all text-center"
            >
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Top Header */}
      <div className="text-center mb-8 space-y-2">
        <span className="text-xs font-extrabold text-[#623898] uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
          APPLICATION FORM
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
          로테이션 소개팅 참가 신청
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          소중한 인연을 만나실 수 있도록 정성껏 매칭을 준비해 드립니다
        </p>
      </div>

      {/* STEP INDICATOR */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative max-w-lg mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#623898] -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />

          {[
            { num: 1, label: '지역/일정' },
            { num: 2, label: '프로필/사진' },
            { num: 3, label: '직장/취향' },
            { num: 4, label: '인증/서약' },
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                  currentStep >= s.num
                    ? 'bg-[#623898] text-white ring-4 ring-purple-100 shadow-md'
                    : 'bg-white text-neutral-400 border-2 border-neutral-300'
                }`}
              >
                {currentStep > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`text-[11px] font-bold mt-1.5 transition-colors ${
                  currentStep >= s.num ? 'text-[#623898]' : 'text-neutral-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-3xl shadow-xl shadow-neutral-900/5 border border-purple-100 p-6 sm:p-9">
        {/* ================= STEP 1: REGION & SESSION ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-neutral-900 mb-1">
                STEP 1. 희망 지역 및 세션 일정 선택
              </h2>
              <p className="text-xs text-neutral-500">
                현재 소개남녀에서 운영 중인 5개 핵심 지역 중 원하시는 지역을 선택해 주세요.
              </p>
            </div>

            {/* Region Selection Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#623898]" />
                <span>희망 모임 지역 선택 <span className="text-rose-500">*</span></span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {['전체', '흑석동', '서교동', '합정동', '홍대', '신도림'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setFilterRegion(r);
                      if (r !== '전체') {
                        setFormData((prev) => ({ ...prev, region: r as AvailableRegion }));
                      }
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                      filterRegion === r
                        ? 'bg-[#623898] text-white border-[#623898] shadow-sm'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {errors.session && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.session}</span>
              </div>
            )}

            {/* Session List */}
            <div className="space-y-2.5 pt-2">
              <label className="text-xs font-bold text-neutral-700">
                참가 세션 선택 <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3">
                {displayedSessions.map((session) => {
                  const isSelected = formData.sessionId === session.id;
                  return (
                    <div
                      key={session.id}
                      onClick={() => handleSelectSession(session)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#623898] bg-purple-50/50 shadow-md shadow-purple-900/5'
                          : 'border-neutral-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-purple-100 text-[#623898]">
                            📍 {session.region}
                          </span>
                          <span className="text-sm font-extrabold text-neutral-900">
                            {session.title}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              session.status === '마감임박'
                                ? 'bg-rose-100 text-rose-600'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {session.status}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-600 flex flex-wrap items-center gap-3">
                          <span className="font-semibold text-neutral-900 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-purple-600" />
                            {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-purple-600" />
                            {session.time}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-[#623898]">
                          대상: {session.ageGroup}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                        <div className="text-right">
                          <span className="text-[11px] text-neutral-400 line-through mr-1">
                            {session.originalPrice.toLocaleString()}원
                          </span>
                          <span className="text-base font-black text-neutral-900">
                            {session.price.toLocaleString()}원
                          </span>
                        </div>
                        <div className="mt-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                              isSelected
                                ? 'border-[#623898] bg-[#623898] text-white'
                                : 'border-neutral-300'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PERSONAL INFO & PHOTO ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-neutral-900 mb-1">
                STEP 2. 기본 인적사항 & 본인 사진 등록
              </h2>
              <p className="text-xs text-neutral-500">
                원활한 매칭 심사와 100% 신원 보증을 위해 본인 사진과 프로필을 등록해 주세요.
              </p>
            </div>

            {/* PHOTO UPLOAD BOX (USER REQUIREMENT) */}
            <div className="p-5 rounded-2xl bg-purple-50/60 border-2 border-dashed border-purple-200 space-y-3">
              <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#623898]" />
                <span>본인 얼굴 사진 등록 <span className="text-rose-500">* (필수)</span></span>
              </label>

              {formData.profileImage ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#623898] shadow-md group">
                    <img
                      src={formData.profileImage}
                      alt="본인 프로필 사진"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>사진이 정상 등록되었습니다</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 cursor-pointer shadow-xs">
                        사진 변경
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>삭제</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border border-purple-200 rounded-xl bg-white hover:bg-purple-50/40 cursor-pointer transition-all">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-[#623898] flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-neutral-800 mb-1">
                    클릭하여 본인 사진 업로드
                  </span>
                  <span className="text-[11px] text-neutral-500 text-center">
                    얼굴이 정면으로 명확히 나온 최근 일상 사진 (JPG, PNG / 최대 10MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {errors.profileImage && (
                <p className="text-[11px] text-rose-500 font-semibold">{errors.profileImage}</p>
              )}

              <p className="text-[11px] text-neutral-500 leading-tight">
                💡 <strong>사진 안내:</strong> 마스크나 선글라스 미착용, 얼굴이 선명하게 확인되는 일상 사진을 올려주세요.
                해당 사진은 매칭 심사용으로만 안전하게 관리되며 외부 및 타 참가자에게 임의 공개되지 않습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  성명 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#623898] focus:ring-2 focus:ring-purple-100"
                />
                {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  성별 <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                    className={`py-2.5 rounded-xl border font-bold text-sm transition-all ${
                      formData.gender === 'male'
                        ? 'border-[#623898] bg-purple-50 text-[#623898]'
                        : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    남성
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                    className={`py-2.5 rounded-xl border font-bold text-sm transition-all ${
                      formData.gender === 'female'
                        ? 'border-[#623898] bg-purple-50 text-[#623898]'
                        : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    여성
                  </button>
                </div>
                {errors.gender && <p className="text-[11px] text-rose-500">{errors.gender}</p>}
              </div>

              {/* Birth Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  생년월일 8자리 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="예: 1995.04.28"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#623898] focus:ring-2 focus:ring-purple-100"
                />
                {errors.birthDate && (
                  <p className="text-[11px] text-rose-500">{errors.birthDate}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  휴대폰 번호 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#623898] focus:ring-2 focus:ring-purple-100"
                />
                {errors.phone && <p className="text-[11px] text-rose-500">{errors.phone}</p>}
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  거주 지역 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 서울 송파구, 경기 성남시"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#623898] focus:ring-2 focus:ring-purple-100"
                />
                {errors.location && (
                  <p className="text-[11px] text-rose-500">{errors.location}</p>
                )}
              </div>

              {/* Height */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  키 (cm) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="예: 178"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#623898] focus:ring-2 focus:ring-purple-100"
                />
                {errors.height && <p className="text-[11px] text-rose-500">{errors.height}</p>}
              </div>

              {/* Drinking & Smoking */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">음주 여부</label>
                <select
                  value={formData.drinking}
                  onChange={(e) => setFormData({ ...formData, drinking: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#623898]"
                >
                  <option value="비음주">비음주 (전혀 안 마심)</option>
                  <option value="가끔">가끔 (사회적 음주)</option>
                  <option value="즐김">즐김 (주 1~2회)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">흡연 여부</label>
                <select
                  value={formData.smoking}
                  onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#623898]"
                >
                  <option value="비흡연">비흡연</option>
                  <option value="전자담배">전자담배</option>
                  <option value="흡연">연초 흡연</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: CAREER & LIFESTYLE ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-neutral-900 mb-1">
                STEP 3. 직장 및 라이프스타일
              </h2>
              <p className="text-xs text-neutral-500">
                1:1 대화카드에 반영되어 풍부한 대화를 돕는 정보입니다. (직장명은 비공개)
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  직군 분류 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.jobCategory}
                  onChange={(e) => setFormData({ ...formData, jobCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#623898]"
                >
                  <option value="">직군을 선택해주세요</option>
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.jobCategory && (
                  <p className="text-[11px] text-rose-500">{errors.jobCategory}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">
                    직장명 <span className="text-[10px] text-neutral-400 font-normal">(검증용 / 상대방 비공개)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 현대자동차, 카카오, 분당서울대병원"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#623898]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">
                    담당 직무 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: UI/UX 디자이너, 마케팅, 회계, 개발"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#623898]"
                  />
                  {errors.jobRole && (
                    <p className="text-[11px] text-rose-500">{errors.jobRole}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  MBTI <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {MBTI_LIST.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({ ...formData, mbti: m })}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        formData.mbti === m
                          ? 'bg-[#623898] text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                {errors.mbti && <p className="text-[11px] text-rose-500">{errors.mbti}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-700">
                    관심사 및 취미 <span className="text-rose-500">*</span> (최대 5개)
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    {formData.interests.length}/5 선택
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_TAGS.map((tag) => {
                    const isSelected = formData.interests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#623898] text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                {errors.interests && (
                  <p className="text-[11px] text-rose-500">{errors.interests}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  내가 바라는 이상형 스타일 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 대화가 티키타카 잘 통하고 긍정적인 에너지를 가진 분"
                  value={formData.idealType}
                  onChange={(e) => setFormData({ ...formData, idealType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#623898]"
                />
                {errors.idealType && (
                  <p className="text-[11px] text-rose-500">{errors.idealType}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  상대방에게 전하는 한마디 (선택)
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 주말에 맛있는 커피 한잔하며 좋은 인연 만들고 싶습니다 :)"
                  value={formData.intro}
                  onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#623898]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: VERIFICATION & SUBMIT ================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-neutral-900 mb-1">
                STEP 4. 신원 인증 및 서약
              </h2>
              <p className="text-xs text-neutral-500">
                100% 안전한 만남을 위해 서약 및 인증 방식을 확인합니다.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-700">
                재직 인증 방식 선택
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, verificationType: 'business_card' })}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    formData.verificationType === 'business_card'
                      ? 'border-[#623898] bg-purple-50/50'
                      : 'border-neutral-200'
                  }`}
                >
                  <span className="text-xs font-bold text-neutral-900 block mb-1">
                    📷 명함/사원증 사진
                  </span>
                  <span className="text-[11px] text-neutral-500 leading-snug block">
                    카카오톡 알림톡으로 사진 전송 인증
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, verificationType: 'email' })}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    formData.verificationType === 'email'
                      ? 'border-[#623898] bg-purple-50/50'
                      : 'border-neutral-200'
                  }`}
                >
                  <span className="text-xs font-bold text-neutral-900 block mb-1">
                    ✉️ 회사 이메일 인증
                  </span>
                  <span className="text-[11px] text-neutral-500 leading-snug block">
                    회사 웹메일로 발송되는 인증 확인
                  </span>
                </button>
              </div>
            </div>

            {/* Agreements Checklist */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-neutral-700">
                필수 서약 및 약관 동의
              </label>

              <div className="space-y-2.5 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreementSingle}
                    onChange={(e) =>
                      setFormData({ ...formData, agreementSingle: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 rounded text-[#623898] focus:ring-purple-500"
                  />
                  <div className="space-y-0.5">
                    <span className="font-bold text-neutral-900">
                      [필수] 미혼(싱글) 상태 보증 서약
                    </span>
                    <p className="text-neutral-500 text-[11px]">
                      현재 법적/사실혼 상태가 아닌 싱글이며, 기혼자의 참가는 법적 위약금 부과 대상임에 동의합니다.
                    </p>
                  </div>
                </label>
                {errors.agreementSingle && (
                  <p className="text-[11px] text-rose-500 pl-6">{errors.agreementSingle}</p>
                )}

                <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-neutral-200/60">
                  <input
                    type="checkbox"
                    checked={formData.agreementManner}
                    onChange={(e) =>
                      setFormData({ ...formData, agreementManner: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 rounded text-[#623898] focus:ring-purple-500"
                  />
                  <div className="space-y-0.5">
                    <span className="font-bold text-neutral-900">
                      [필수] 매너 준수 및 노쇼(No-Show) 방지 서약
                    </span>
                    <p className="text-neutral-500 text-[11px]">
                      성비 1:1 세션 특성상 당일 무단 불참 시 다른 참가자에게 피해를 주지 않으며, 불쾌감을 주는 행위 금지에 동의합니다.
                    </p>
                  </div>
                </label>
                {errors.agreementManner && (
                  <p className="text-[11px] text-rose-500 pl-6">{errors.agreementManner}</p>
                )}

                <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-neutral-200/60">
                  <input
                    type="checkbox"
                    checked={formData.agreementPrivacy}
                    onChange={(e) =>
                      setFormData({ ...formData, agreementPrivacy: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 rounded text-[#623898] focus:ring-purple-500"
                  />
                  <div className="space-y-0.5">
                    <span className="font-bold text-neutral-900">
                      [필수] 개인정보 수집 및 매칭 안내 알림톡 수신 동의
                    </span>
                    <p className="text-neutral-500 text-[11px]">
                      소개팅 참가 안내 및 상호 매칭 결과 안내를 위한 개인정보 처리에 동의합니다.
                    </p>
                  </div>
                </label>
                {errors.agreementPrivacy && (
                  <p className="text-[11px] text-rose-500 pl-6">{errors.agreementPrivacy}</p>
                )}
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-900 font-bold block">
                  최종 참가비 (얼리버드 20% 할인)
                </span>
                <span className="text-[11px] text-purple-700">
                  프리미엄 웰컴 드링크 + 1:1 대화카드 일체 포함
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 line-through mr-1">60,000원</span>
                <span className="text-xl font-black text-[#623898]">23,900원</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= NAVIGATION BUTTONS ================= */}
        <div className="pt-8 border-t border-neutral-100 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>이전 단계</span>
            </button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              취소 후 메인으로
            </Link>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs sm:text-sm font-extrabold text-white bg-[#623898] hover:bg-[#522E80] shadow-md shadow-purple-900/20 active:scale-95 transition-all"
            >
              <span>다음 단계</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#623898] via-[#7E48BA] to-[#E55B7D] hover:opacity-95 shadow-lg shadow-purple-900/30 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>참가 신청서 최종 제출하기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-24 md:pb-16">
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto py-20 text-center text-neutral-500">
            신청서를 불러오는 중입니다...
          </div>
        }
      >
        <ApplyFormContent />
      </Suspense>
    </div>
  );
}
