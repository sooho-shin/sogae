'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Check,
  AlertCircle,
  Copy,
  MapPin,
  Camera,
  Upload,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  MessageCircle,
  Heart,
  User,
  Search,
  Edit3,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  SETTING_REGIONS,
  JOB_CATEGORIES,
  MBTI_LIST,
} from '@/data/mockData';
import { ApplicationFormData, AvailableRegion } from '@/types';
import { AdminApplication } from '@/types/admin';
import ProfileCard from '@/components/ProfileCard';
import { findProfanity } from '@/utils/badWords';
import { useAuth } from '@/lib/authContext';

function ApplyFormContent() {
  const searchParams = useSearchParams();
  const { user, isLoggedIn, openLoginModal } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<ApplicationFormData>({
    sessionId: 'session-1on1-default',
    region: '흑석동',
    sessionTitle: '소개남녀 1:1 프라이빗 매칭',
    sessionDate: '상시 조율',
    sessionTime: '주말/평일 맞춤',
    ageGroup: '2030 직장인',
    name: '',
    nickname: '',
    kakaoId: '',
    kakaoUserId: '',
    gender: 'male',
    birthDate: '',
    birthYear: '',
    phone: '',
    location: '',
    height: '175',
    bodyType: '보통',
    bodyTypeFeature: '탄탄한 체형',
    eyelid: '무쌍',
    drinking: '거의 안마심',
    drinkingCapacity: '거의 안마심',
    smoking: '비흡연',
    religion: '무교',
    profileImage: null,
    jobCategory: '대기업/중견기업',
    companyName: '',
    jobRole: '',
    mbti: 'ESTJ',
    personality: '',
    hobbiesSpecialty: '',
    interests: [],
    idealType: '',
    selfIntro: '',
    intro: '',
    verificationType: 'business_card',
    verificationFile: null,
    agreementSingle: false,
    agreementManner: false,
    agreementPrivacy: false,
  });

  // Errors State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Existing Card & Edit Mode State
  const [existingApplication, setExistingApplication] = useState<AdminApplication | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [checkingExisting, setCheckingExisting] = useState<boolean>(true);

  // Helper to fill form data from an existing application
  const fillFormDataFromApp = (app: AdminApplication) => {
    setFormData({
      sessionId: app.sessionId || 'session-1on1-default',
      region: app.region || '흑석동',
      sessionTitle: app.sessionTitle || `${app.region} 1:1 맞춤 매칭`,
      sessionDate: app.sessionDate || '상시 조율',
      sessionTime: app.sessionTime || '주말/평일 맞춤',
      ageGroup: app.ageGroup || '2030 직장인',
      name: app.name || '',
      nickname: app.nickname || app.name || '',
      kakaoId: app.kakaoId || '',
      kakaoUserId: app.kakaoUserId || user?.id || '',
      gender: app.gender || 'male',
      birthDate: app.birthDate || '',
      birthYear: app.birthYear || '',
      phone: app.phone || '',
      location: app.location || '',
      height: app.height || '175',
      bodyType: app.bodyType || '보통',
      bodyTypeFeature: app.bodyTypeFeature || '탄탄한 체형',
      eyelid: app.eyelid || '무쌍',
      drinking: app.drinking || '거의 안마심',
      drinkingCapacity: app.drinkingCapacity || '거의 안마심',
      smoking: app.smoking || '비흡연',
      religion: app.religion || '무교',
      profileImage: app.profileImage || null,
      jobCategory: app.jobCategory || '대기업/중견기업',
      companyName: app.companyName || '',
      jobRole: app.jobRole || '',
      mbti: app.mbti || 'ESTJ',
      personality: app.personality || '',
      hobbiesSpecialty: app.hobbiesSpecialty || '',
      interests: Array.isArray(app.interests) ? app.interests : [],
      idealType: app.idealType || '',
      selfIntro: app.selfIntro || '',
      intro: app.intro || '',
      verificationType: app.verificationType || 'business_card',
      verificationFile: app.verificationFile || null,
      agreementSingle: true,
      agreementManner: true,
      agreementPrivacy: true,
    });
  };

  // Sync Kakao user to formData
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        nickname: prev.nickname || user.nickname || '',
        kakaoUserId: user.id,
      }));
    }
  }, [user]);

  // Check if user already registered a card
  useEffect(() => {
    async function checkExistingCard() {
      if (typeof window === 'undefined') return;

      const receipt = searchParams.get('receiptNumber') || localStorage.getItem('sogaeting_receipt');
      const phone = localStorage.getItem('sogaeting_phone');
      const kakaoId = user?.id;
      const query = receipt || phone || kakaoId;
      const mode = searchParams.get('mode');

      if (query) {
        try {
          const res = await fetch('/api/applications/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
          });
          const json = await res.json();
          if (json.success && json.data) {
            setExistingApplication(json.data);
            if (mode === 'edit') {
              fillFormDataFromApp(json.data);
              setIsEditMode(true);
            }
          }
        } catch (e) {
          console.error('Failed to check existing card:', e);
        }
      }
      setCheckingExisting(false);
    }

    checkExistingCard();
  }, [searchParams, user]);

  // Initialize selected region from URL query
  useEffect(() => {
    const regionQuery = searchParams.get('region') as AvailableRegion | null;
    if (regionQuery && ['흑석동', '서교동', '합정동', '홍대', '신도림'].includes(regionQuery)) {
      setFormData((prev) => ({
        ...prev,
        region: regionQuery,
        sessionTitle: `${regionQuery} 1:1 맞춤 매칭`,
      }));
    }
  }, [searchParams]);

  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  // HTML5 Canvas 기반 고효율 이미지 리사이징 & 압축 (EXIF 회전 보정 및 100~150KB 최적화)
  const compressImage = async (file: File, maxWidth = 800, quality = 0.82): Promise<string> => {
    // 1. 최신 브라우저: createImageBitmap with imageOrientation 'from-image' (EXIF 자동 정방향 보정)
    if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
      try {
        const bitmap = await (createImageBitmap as any)(file, { imageOrientation: 'from-image' });
        const canvas = document.createElement('canvas');
        let { width, height } = bitmap;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(bitmap, 0, 0, width, height);
          return canvas.toDataURL('image/jpeg', quality);
        }
      } catch (e) {
        console.warn('createImageBitmap fallback to FileReader:', e);
      }
    }

    // 2. Fallback: FileReader + Image
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Image Upload Handler
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profileImage: '사진 용량은 25MB 이하만 가능합니다.' }));
        return;
      }
      setIsCompressing(true);
      try {
        const compressedBase64 = await compressImage(file, 800, 0.82);
        setFormData((prev) => ({ ...prev, profileImage: compressedBase64 }));
        setErrors((prev) => ({ ...prev, profileImage: '' }));
      } catch (err) {
        console.error('Image compression error:', err);
        setErrors((prev) => ({ ...prev, profileImage: '사진 압축 처리 중 오류가 발생했습니다.' }));
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
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

  // Birthdate input & auto birthYear (e.g. 1995.04.28 -> birthYear: "95")
  const handleBirthDateChange = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    let formatted = raw;
    if (raw.length > 4 && raw.length <= 6) {
      formatted = `${raw.slice(0, 4)}.${raw.slice(4)}`;
    } else if (raw.length > 6) {
      formatted = `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}`;
    }
    const year2 = raw.length >= 4 ? raw.slice(2, 4) : '';
    setFormData((prev) => ({
      ...prev,
      birthDate: formatted,
      birthYear: year2 || prev.birthYear,
    }));
  };

  // Validation per step
  const validateStep = (step: number): boolean => {
    const errs: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.region) {
        errs.region = '희망하시는 매칭 활동 지역을 선택해 주세요.';
      }
    } else if (step === 2) {
      if (!formData.name.trim()) errs.name = '실명을 입력해주세요. (신원 확인용)';
      if (!formData.nickname.trim()) errs.nickname = '프로필 카드에 노출될 닉네임을 입력해주세요.';
      if (!formData.kakaoId.trim()) errs.kakaoId = '상호 수락 시 교환할 카카오톡 ID를 반드시 입력해주세요.';
      if (!formData.gender) errs.gender = '성별을 선택해주세요.';
      if (!formData.birthDate.trim()) {
        errs.birthDate = '생년월일을 입력해주세요. (예: 1995.04.28)';
      }
      if (!formData.phone.trim() || formData.phone.length < 12) {
        errs.phone = '올바른 휴대폰 번호를 입력해주세요.';
      }
      if (!formData.location.trim()) errs.location = '거주 지역을 입력해주세요. (예: 서울시 구로구)';
      if (!formData.height.trim()) errs.height = '키를 입력해주세요. (예: 175)';
      if (!formData.profileImage) {
        errs.profileImage = '1:1 프로필 카드 제작을 위해 본인 얼굴 사진을 반드시 등록해 주세요.';
      }

      // 비속어/음란어 검사 (STEP 2)
      const badName = findProfanity(formData.name);
      if (badName) errs.name = `부적절한 단어('${badName}')가 포함되어 있습니다.`;
      const badNick = findProfanity(formData.nickname);
      if (badNick) errs.nickname = `부적절한 단어('${badNick}')가 포함되어 있습니다.`;
    } else if (step === 3) {
      if (!formData.jobRole.trim()) errs.jobRole = '직업 또는 직무를 입력해주세요. (예: 행정직, 백엔드 개발자)';
      if (!formData.personality.trim()) errs.personality = '프로필 카드에 들어갈 나의 성격을 한 줄 이상 적어주세요.';
      if (!formData.hobbiesSpecialty.trim()) errs.hobbiesSpecialty = '취미 및 특기를 입력해주세요. (예: 헬스, 피아노, 클라이밍)';
      if (!formData.idealType.trim()) errs.idealType = '희망하시는 이상형을 상세히 적어주세요.';
      if (!formData.selfIntro.trim()) errs.selfIntro = '상대방에게 전달될 자기소개를 정성껏 작성해주세요.';

      // 비속어/음란어 검사 (STEP 3)
      const badJob = findProfanity(formData.jobRole) || findProfanity(formData.companyName);
      if (badJob) errs.jobRole = `직업 정보에 부적절한 단어('${badJob}')가 포함되어 있습니다.`;
      const badPers = findProfanity(formData.personality);
      if (badPers) errs.personality = `성격 소개에 부적절한 단어('${badPers}')가 포함되어 있습니다.`;
      const badHobby = findProfanity(formData.hobbiesSpecialty);
      if (badHobby) errs.hobbiesSpecialty = `취미/특기에 부적절한 단어('${badHobby}')가 포함되어 있습니다.`;
      const badIdeal = findProfanity(formData.idealType);
      if (badIdeal) errs.idealType = `이상형 조건에 부적절한 단어('${badIdeal}')가 포함되어 있습니다.`;
      const badIntro = findProfanity(formData.selfIntro);
      if (badIntro) errs.selfIntro = `자기소개에 부적절한 단어('${badIntro}')가 포함되어 있습니다.`;
    } else if (step === 4) {
      if (!formData.agreementSingle) {
        errs.agreementSingle = '싱글(미혼) 서약에 동의하셔야 신청이 가능합니다.';
      }
      if (!formData.agreementManner) {
        errs.agreementManner = '매너 준수 및 잠수 금지 서약에 동의해 주세요.';
      }
      if (!formData.agreementPrivacy) {
        errs.agreementPrivacy = '개인정보 처리방침에 동의해 주세요.';
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

  // Submit Handler (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');

    // If Edit Mode: update existing application via PUT
    if (isEditMode && existingApplication) {
      try {
        const res = await fetch('/api/applications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            id: existingApplication.id,
            receiptNumber: existingApplication.receiptNumber,
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || '프로필 카드 수정에 실패했습니다.');
        }

        setExistingApplication(json.data);
        setIsEditMode(false);
        setIsSubmitted(false);
        alert('🎉 1:1 프로필 카드가 성공적으로 수정되었습니다!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err: any) {
        console.error('Failed to update application:', err);
        const msg = err?.message || '프로필 카드 수정 중 오류가 발생했습니다.';
        setSubmitError(msg);
        alert(msg);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // New Application Creation via POST
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const receipt = `SG-1ON1-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${randomNum}`;

    try {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          receiptNumber: receipt,
          appliedAt: formattedDate,
          sessionTitle: `${formData.region} 1:1 맞춤 매칭`,
          status: '심사대기',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || '지원서 등록에 실패했습니다.');
      }

      setReceiptNumber(receipt);
      setIsSubmitted(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sogaeting_receipt', receipt);
        localStorage.setItem('sogaeting_phone', formData.phone);
      }
      if (json.data) {
        setExistingApplication(json.data);
      }

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#623898', '#E12B70', '#FFC837', '#8C52FF'],
        });
      } catch {
        // safe fallback
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Failed to submit application to API:', err);
      const msg = err?.message || '지원서 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      setSubmitError(msg);
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReceipt = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(receiptNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ================= SUCCESS SCREEN (PRODUCES REAL PROFILE CARD) =================
  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-8">
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-6 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
            <Check className="w-9 h-9 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              1:1 프로필 카드 등록 완료
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
              {formData.nickname || formData.name}님의 1:1 프로필 카드가 생성되었습니다!
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
              매니저가 서류 검토 후, 회원님의 이상형 조건에 맞는 이성에게 아래 카드를 전달하며 <strong>&ldquo;이분은 어떠신가요?&rdquo;</strong> 하고 매칭 의사를 확인합니다.
              <br />
              <strong>상대방과 회원님 모두 OK(수락)</strong>하시면 등록하신 카카오톡 ID로 연결해 드립니다.
            </p>
          </div>

          {/* Receipt Info Bar */}
          <div className="bg-neutral-50 rounded-2xl p-4 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-3 border border-neutral-200">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-bold">접수번호:</span>
              <strong className="text-[#623898] font-black">{receiptNumber}</strong>
              <button
                type="button"
                onClick={copyReceipt}
                className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                title="접수번호 복사"
              >
                <Copy className="w-4 h-4" />
              </button>
              {copied && <span className="text-xs text-emerald-600 font-bold">복사됨!</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-bold">교환용 카카오톡 ID:</span>
              <strong className="text-neutral-900 font-black">{formData.kakaoId}</strong>
            </div>
          </div>
        </div>

        {/* Live Generated Profile Card Preview */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-[#623898] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>상대방에게 전달될 실제 1:1 프로필 카드 실물</span>
          </div>

          <ProfileCard data={formData} showWatermark={true} />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href={`/status?receiptNumber=${encodeURIComponent(receiptNumber)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-black text-sm text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] hover:from-[#512784] hover:to-[#7637E4] transition-all shadow-md active:scale-98"
          >
            <Search className="w-4 h-4" />
            <span>내 신청 현황 & 카드 확인하기</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-full font-bold text-sm text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-all"
          >
            소개남녀 메인으로 이동
          </Link>
        </div>
      </div>
    );
  }

  // ================= 0. CHECKING EXISTING LOADER =================
  if (checkingExisting) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-neutral-500">프로필 카드 등록 상태를 확인하는 중입니다...</p>
      </div>
    );
  }

  // ================= 1. ALREADY REGISTERED CARD VIEW SCREEN =================
  if (existingApplication && !isEditMode) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 space-y-6">
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-6 sm:p-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-black text-[#623898]">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>이미 등록된 회원님의 1:1 프로필 카드가 있습니다</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
              {existingApplication.name}님의 기본 프로필 카드
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
              현재 이 카드 정보로 1:1 블라인드 매칭이 진행되고 있습니다. 정보 변경이 필요하시면 언제든 수정하실 수 있습니다.
            </p>
          </div>

          {/* Current Profile Card Preview */}
          <div className="py-2 flex justify-center">
            <ProfileCard data={existingApplication} showWatermark={true} />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                fillFormDataFromApp(existingApplication);
                setIsEditMode(true);
                setCurrentStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] hover:from-[#522884] hover:to-[#7637E4] shadow-md transition-all active:scale-98"
            >
              <Edit3 className="w-4 h-4" />
              <span>내 프로필 카드 정보 수정하기</span>
            </button>

            <Link
              href="/status"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>내 매칭 & 호감 현황 보기</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => {
                setExistingApplication(null);
                setIsEditMode(false);
                setCurrentStep(1);
              }}
              className="text-xs font-bold text-neutral-400 hover:text-neutral-600 underline"
            >
              다른 사람으로 새로 등록하시겠습니까?
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= APPLICATION FORM WIZARD (NEW OR EDIT) =================
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
      {/* KAKAO AUTH STATUS BANNER */}
      {isLoggedIn && user ? (
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs sm:text-sm shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-neutral-700">
              카카오 계정 <strong className="text-neutral-900">{user.nickname}</strong>님으로 로그인되어 카드에 자동 연동됩니다.
            </span>
          </div>
          <span className="text-amber-800 text-xs font-black bg-amber-100/90 px-2.5 py-1 rounded-full shrink-0">
            1초 연동 완료
          </span>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-2xl bg-[#FEE500]/15 border border-[#FEE500]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm shadow-2xs">
          <div className="flex items-center gap-2.5 text-neutral-800">
            <div className="w-7 h-7 rounded-full bg-[#FEE500] flex items-center justify-center text-[#3C1E1E] shrink-0 font-black text-xs shadow-2xs">
              💬
            </div>
            <div>
              <p className="font-bold text-neutral-900">카카오 1초 간편 로그인 후 등록해 보세요!</p>
              <p className="text-xs text-neutral-600">로그인하시면 접수번호를 따로 외우지 않아도 내 카드와 호감을 1초 만에 확인/수정할 수 있습니다.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={openLoginModal}
            className="w-full sm:w-auto shrink-0 px-4 py-2 rounded-xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#3C1E1E] font-black text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>카카오 1초 로그인</span>
          </button>
        </div>
      )}

      {/* EDIT MODE BANNER */}
      {isEditMode && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>내 프로필 카드 수정 모드</strong>입니다. (접수번호: {existingApplication?.receiptNumber})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsEditMode(false)}
            className="text-xs font-black px-3.5 py-1.5 bg-white border border-amber-300 rounded-xl hover:bg-amber-100 text-amber-900 shadow-2xs"
          >
            수정 취소하고 카드 보기
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="text-center mb-8 space-y-2">
        <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-100 text-[#623898]">
          {isEditMode ? 'EDIT PROFILE CARD' : '1:1 PRIVATE MATCHING'}
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900">
          {isEditMode ? '1:1 프로필 카드 정보 수정' : '소개남녀 1:1 소개팅 프로필 카드 등록'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600">
          {isEditMode
            ? '수정하신 정보는 검증 후 즉시 상대방에게 전달될 프로필 카드에 업데이트됩니다.'
            : '프로필 카드를 정성껏 제작하여 이상형에게 제안해 드립니다. 둘 다 OK할 때만 카톡 ID를 교환합니다.'}
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
            { num: 1, label: '매칭 지역' },
            { num: 2, label: '사진/기본/카톡' },
            { num: 3, label: '스펙/성격/이상형' },
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

      {/* FORM CONTAINER */}
      <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-6 sm:p-9">
        {/* ================= STEP 1: REGION ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-neutral-900 mb-1">
                STEP 1. 희망 매칭 활동 지역 선택
              </h2>
              <p className="text-xs text-neutral-500">
                1:1 소개팅을 희망하시는 주요 활동/약속 지역을 선택해 주세요.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SETTING_REGIONS.map((r) => {
                  const isSelected = formData.region === r.name;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setFormData((prev) => ({ ...prev, region: r.name }))}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#623898] bg-purple-50/60 shadow-md'
                          : 'border-neutral-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-neutral-900">{r.name}</span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-[#623898]">
                            {r.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#623898] font-bold">{r.tag}</p>
                        <p className="text-xs text-neutral-500">{r.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {errors.region && (
                <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.region}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ================= STEP 2: PERSONAL & PHOTO & KAKAO ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-neutral-900 mb-1">
                STEP 2. 프로필 카드 기본 정보 & 본인 얼굴 사진 등록
              </h2>
              <p className="text-xs text-neutral-500">
                실물 프로필 카드에 들어갈 사진과 인적사항, 양측 수락 시 교환할 카카오톡 ID를 기재합니다.
              </p>
            </div>

            {/* Profile Photo Upload */}
            <div className="space-y-2 p-5 bg-purple-50/40 rounded-2xl border border-purple-200/80">
              <label className="text-xs font-black text-neutral-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#E12B70]" />
                  <span>본인 얼굴 사진 등록 <span className="text-rose-500">* (필수)</span></span>
                </span>
                <span className="text-[11px] font-normal text-neutral-500">
                  마스크/선글라스 미착용 정면 사진 권장
                </span>
              </label>

              {isCompressing ? (
                <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-purple-50/50 text-center">
                  <div className="w-8 h-8 border-3 border-[#623898] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold text-[#623898]">사진 고효율 최적화 및 압축 중...</span>
                </div>
              ) : formData.profileImage ? (
                <div className="flex items-center gap-4 pt-2">
                  <div className="relative w-28 h-36 rounded-xl overflow-hidden border-2 border-[#623898] shadow-md shrink-0">
                    <img
                      src={formData.profileImage}
                      alt="본인 등록 사진"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                      title="사진 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <p className="font-extrabold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4" /> 얼굴 사진이 최적화되어 등록되었습니다.
                    </p>
                    <p className="text-neutral-500 text-[11px]">
                      이 사진이 1:1 프로필 카드 좌측 상단에 선명하게 반영됩니다.
                    </p>
                    <label className="inline-block px-3 py-1.5 bg-white border border-neutral-300 rounded-lg font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer text-xs">
                      다른 사진으로 변경
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-purple-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/80 transition-all bg-white/50 text-center">
                  <Upload className="w-8 h-8 text-[#623898]" />
                  <div>
                    <span className="text-xs font-black text-[#623898] underline">
                      여기를 클릭하여 본인 사진 업로드
                    </span>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      JPG, PNG, HEIC 등 사진 지원 (자동 최적화)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {errors.profileImage && (
                <p className="text-xs text-rose-500 font-bold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.profileImage}
                </p>
              )}
            </div>

            {/* Kakao ID & Real Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-yellow-500" />
                  <span>카카오톡 ID <span className="text-rose-500">* (상호 수락 시 교환용)</span></span>
                </label>
                <input
                  type="text"
                  value={formData.kakaoId}
                  onChange={(e) => setFormData({ ...formData, kakaoId: e.target.value.trim() })}
                  placeholder="카카오톡 아이디 입력"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-900 focus:outline-none focus:border-[#623898]"
                />
                {errors.kakaoId && <p className="text-[11px] text-rose-500 font-bold">{errors.kakaoId}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  프로필 카드 닉네임 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value.trim() })}
                  placeholder="카드에 표시될 닉네임 (예: TTJJ, 지은)"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-900 focus:outline-none focus:border-[#623898]"
                />
                {errors.nickname && <p className="text-[11px] text-rose-500 font-bold">{errors.nickname}</p>}
              </div>
            </div>

            {/* Real Name & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  신청자 실명 <span className="text-rose-500">* (매니저 확인용, 비공개)</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="홍길동"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#623898]"
                />
                {errors.name && <p className="text-[11px] text-rose-500 font-bold">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  성별 <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      formData.gender === 'male'
                        ? 'bg-[#352758] text-white border-[#352758]'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    남성 (남자 프로필)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      formData.gender === 'female'
                        ? 'bg-[#E12B70] text-white border-[#E12B70]'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    여성 (여자 프로필)
                  </button>
                </div>
              </div>
            </div>

            {/* Birth Date & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  생년월일 8자리 <span className="text-rose-500">* (카드에는 년생만 노출)</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.birthDate}
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                  placeholder="예: 1992.05.14"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#623898]"
                />
                {errors.birthDate && <p className="text-[11px] text-rose-500 font-bold">{errors.birthDate}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  휴대폰 번호 <span className="text-rose-500">* (매니저 연락용)</span>
                </label>
                <input
                  type="tel"
                  maxLength={13}
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#623898]"
                />
                {errors.phone && <p className="text-[11px] text-rose-500 font-bold">{errors.phone}</p>}
              </div>
            </div>

            {/* Location & Height & Body & Eyelid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  거주지 <span className="text-rose-500">* (예: 서울시 구로구)</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="예: 서울시 구로구"
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#623898]"
                />
                {errors.location && <p className="text-[11px] text-rose-500 font-bold">{errors.location}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  키 (cm) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="170"
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#623898]"
                />
                {errors.height && <p className="text-[11px] text-rose-500 font-bold">{errors.height}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">쌍커풀 유무</label>
                <select
                  value={formData.eyelid}
                  onChange={(e) => setFormData({ ...formData, eyelid: e.target.value as any })}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-800 focus:outline-none focus:border-[#623898]"
                >
                  <option value="무쌍">무쌍</option>
                  <option value="속쌍">속쌍</option>
                  <option value="유쌍">유쌍</option>
                </select>
              </div>
            </div>

            {/* Body Type Feature */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">본인 체형 특징</label>
              <div className="grid grid-cols-4 gap-2">
                {['탄탄한 체형', '슬림탄탄', '슬림', '보통'].map((bt) => (
                  <button
                    key={bt}
                    type="button"
                    onClick={() => setFormData({ ...formData, bodyTypeFeature: bt })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.bodyTypeFeature === bt
                        ? 'bg-[#623898] text-white border-[#623898]'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: CAREER, LIFESTYLE & IDEAL ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-neutral-900 mb-1">
                STEP 3. 직업, 성격, 라이프스타일 & 이상형
              </h2>
              <p className="text-xs text-neutral-500">
                상대방이 가장 눈여겨보는 스펙과 취향 정보입니다. 성실하게 작성할수록 매칭 성사율이 높아집니다.
              </p>
            </div>

            {/* Job Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  직장명 <span className="text-neutral-400 font-normal">(예: 중앙대학교병원, 카카오 등)</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="회사명/기관명"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#623898]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  직업 / 직무 <span className="text-rose-500">* (카드에 노출)</span>
                </label>
                <input
                  type="text"
                  value={formData.jobRole}
                  onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                  placeholder="예: 행정직, 백엔드 개발자, 연구원"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#623898]"
                />
                {errors.jobRole && <p className="text-[11px] text-rose-500 font-bold">{errors.jobRole}</p>}
              </div>
            </div>

            {/* MBTI & Religion & Drink & Smoke */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">MBTI</label>
                <select
                  value={formData.mbti}
                  onChange={(e) => setFormData({ ...formData, mbti: e.target.value })}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-800 focus:outline-none focus:border-[#623898]"
                >
                  {MBTI_LIST.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">종교</label>
                <select
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-800 focus:outline-none focus:border-[#623898]"
                >
                  <option value="무교">무교</option>
                  <option value="기독교">기독교</option>
                  <option value="천주교">천주교</option>
                  <option value="불교">불교</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">주량</label>
                <select
                  value={formData.drinkingCapacity}
                  onChange={(e) => setFormData({ ...formData, drinkingCapacity: e.target.value })}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-800 focus:outline-none focus:border-[#623898]"
                >
                  <option value="거의 안마심">거의 안마심</option>
                  <option value="전혀 안마심">전혀 안마심</option>
                  <option value="맥주 1~2잔">맥주 1~2잔</option>
                  <option value="소주 반병">소주 반병</option>
                  <option value="소주 1병">소주 1병</option>
                  <option value="소주 1병 이상">소주 1병 이상</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">흡연 유무</label>
                <select
                  value={formData.smoking}
                  onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-800 focus:outline-none focus:border-[#623898]"
                >
                  <option value="비흡연">비흡연</option>
                  <option value="전자담배">전자담배</option>
                  <option value="연초 흡연">연초 흡연</option>
                </select>
              </div>
            </div>

            {/* Personality */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">
                나의 성격 <span className="text-rose-500">* (카드 노출)</span>
              </label>
              <input
                type="text"
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                placeholder="예: 성실하고 자기관리 철저하며, 감정 기복이 크지 않고 안정적인 편입니다."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#623898]"
              />
              {errors.personality && <p className="text-[11px] text-rose-500 font-bold">{errors.personality}</p>}
            </div>

            {/* Hobbies / Specialty */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">
                나의 취미 / 특기 <span className="text-rose-500">* (카드 노출)</span>
              </label>
              <input
                type="text"
                value={formData.hobbiesSpecialty}
                onChange={(e) => setFormData({ ...formData, hobbiesSpecialty: e.target.value })}
                placeholder="예: 헬스, 피아노, 클라이밍, 카페 투어"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#623898]"
              />
              {errors.hobbiesSpecialty && <p className="text-[11px] text-rose-500 font-bold">{errors.hobbiesSpecialty}</p>}
            </div>

            {/* Ideal Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">
                이상형 <span className="text-rose-500">* (카드 노출)</span>
              </label>
              <textarea
                rows={2}
                value={formData.idealType}
                onChange={(e) => setFormData({ ...formData, idealType: e.target.value })}
                placeholder="예: 여성스럽고 차분하며 자기관리 잘하고, 대화가 편안하면서 서로 배려할 수 있는 사람"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#623898]"
              />
              {errors.idealType && <p className="text-[11px] text-rose-500 font-bold">{errors.idealType}</p>}
            </div>

            {/* Self Intro */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">
                자기소개 <span className="text-rose-500">* (카드 최하단 노출)</span>
              </label>
              <textarea
                rows={3}
                value={formData.selfIntro}
                onChange={(e) => setFormData({ ...formData, selfIntro: e.target.value })}
                placeholder="예: 꾸준한 자기관리와 안정적인 직업, 탄탄한 생활 기반이 강점입니다. 책임감 있게 관계를 이어가며, 편안한 대화와 배려, 신뢰를 바탕으로 꽤 오래 만나는 연애를 중요하게 생각합니다."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#623898]"
              />
              {errors.selfIntro && <p className="text-[11px] text-rose-500 font-bold">{errors.selfIntro}</p>}
            </div>
          </div>
        )}

        {/* ================= STEP 4: VERIFICATION & AGREEMENT ================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-neutral-900 mb-1">
                STEP 4. 신원 인증 및 1:1 매칭 서약
              </h2>
              <p className="text-xs text-neutral-500">
                안전하고 신뢰할 수 있는 매칭을 위해 서약에 동의해 주세요.
              </p>
            </div>

            {/* Verification Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700">재직 인증 방식 선택</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, verificationType: 'business_card' })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.verificationType === 'business_card'
                      ? 'border-[#623898] bg-purple-50/50'
                      : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  <span className="font-extrabold text-xs block text-neutral-900">명함 / 사원증 인증</span>
                  <span className="text-[11px] text-neutral-500">서류 심사 후 자동 파기</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, verificationType: 'email' })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.verificationType === 'email'
                      ? 'border-[#623898] bg-purple-50/50'
                      : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  <span className="font-extrabold text-xs block text-neutral-900">회사 이메일 인증</span>
                  <span className="text-[11px] text-neutral-500">회사 계정 메일 인증</span>
                </button>
              </div>
            </div>

            {/* Pledge Agreements */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-neutral-700">필수 서약 및 동의</label>

              <label className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 cursor-pointer hover:bg-neutral-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.agreementSingle}
                  onChange={(e) => setFormData({ ...formData, agreementSingle: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-[#623898] rounded focus:ring-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-neutral-900">
                    [필수] 싱글(미혼) 서약 동의
                  </span>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    현재 법적 미혼 상태이며 사실혼 및 교제 중인 상대가 없음을 확인하고 서약합니다.
                  </p>
                </div>
              </label>
              {errors.agreementSingle && <p className="text-[11px] text-rose-500 font-bold">{errors.agreementSingle}</p>}

              <label className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 cursor-pointer hover:bg-neutral-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.agreementManner}
                  onChange={(e) => setFormData({ ...formData, agreementManner: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-[#623898] rounded focus:ring-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-neutral-900">
                    [필수] 1:1 매칭 매너 준수 및 잠수 금지 서약
                  </span>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    상호 수락 후 정당한 사유 없는 연락 두절(잠수)이나 비매너 행위 시 영구 제명 조치에 동의합니다.
                  </p>
                </div>
              </label>
              {errors.agreementManner && <p className="text-[11px] text-rose-500 font-bold">{errors.agreementManner}</p>}

              <label className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 cursor-pointer hover:bg-neutral-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.agreementPrivacy}
                  onChange={(e) => setFormData({ ...formData, agreementPrivacy: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-[#623898] rounded focus:ring-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-neutral-900">
                    [필수] 개인정보 수집 및 1:1 매칭 상대방 제공 동의
                  </span>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    양측 모두 수락(OK) 시에 한하여 상대방에게 카카오톡 ID가 전달됨에 동의합니다.
                  </p>
                </div>
              </label>
              {errors.agreementPrivacy && <p className="text-[11px] text-rose-500 font-bold">{errors.agreementPrivacy}</p>}
            </div>
          </div>
        )}

        {/* CONTROLS (PREV / NEXT / SUBMIT) */}
        <div className="pt-6 mt-6 border-t border-neutral-200 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>이전 단계</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] hover:opacity-95 shadow-md shadow-purple-900/15 active:scale-95 transition-all"
            >
              <span>다음 단계</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isCompressing}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#E12B70] to-[#8C52FF] hover:opacity-95 shadow-lg shadow-pink-900/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isEditMode ? '프로필 카드 수정 저장 중...' : '1:1 프로필 카드 등록 중...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isEditMode ? '1:1 프로필 카드 수정 완료하기' : '1:1 프로필 카드 최종 등록하기'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm font-bold text-neutral-500">
          신청서를 불러오는 중입니다...
        </div>
      }
    >
      <ApplyFormContent />
    </Suspense>
  );
}
