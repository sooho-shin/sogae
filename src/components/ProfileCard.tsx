'use client';

import React from 'react';
import { ApplicationFormData } from '@/types';
import { Sparkles, Heart } from 'lucide-react';

interface ProfileCardProps {
  data: Partial<ApplicationFormData>;
  showWatermark?: boolean;
}

export default function ProfileCard({ data, showWatermark = true }: ProfileCardProps) {
  const isMale = data.gender === 'male';
  const genderTitle = isMale ? '소개팅 남자 프로필' : '소개팅 여자 프로필';
  const themeBg = isMale ? 'bg-[#F0EDF7]' : 'bg-[#FDF0F4]';
  const headerColor = isMale ? 'text-[#352758]' : 'text-[#5E1A36]';
  const labelColor = isMale ? 'text-[#D92C6B]' : 'text-[#E12B70]';
  const borderTone = isMale ? 'border-purple-200' : 'border-pink-200';

  // Format birth year (e.g. "1992.05.14" -> "92")
  const birthYear = data.birthYear || (data.birthDate ? data.birthDate.slice(2, 4) : '95');

  // Format occupation (combine company & role if both present)
  const jobDisplay = [data.companyName, data.jobRole || data.jobCategory].filter(Boolean).join(' ') || '직장인';

  return (
    <div className={`w-full max-w-md mx-auto ${themeBg} p-3 sm:p-5 rounded-3xl border ${borderTone} shadow-xl relative select-none font-sans`}>
      {/* Inner White Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-neutral-100 flex flex-col space-y-4">
        {/* Header with rays icon */}
        <div className="text-center relative pt-1 pb-2">
          {/* Decorative Ray Lines */}
          <div className="inline-block relative">
            <div className="absolute -top-3.5 right-6 flex items-center gap-1 opacity-70">
              <span className="w-0.5 h-2 bg-purple-400 rotate-[-25deg] rounded-full" />
              <span className="w-0.5 h-2.5 bg-purple-500 rounded-full" />
              <span className="w-0.5 h-2 bg-purple-400 rotate-[25deg] rounded-full" />
            </div>
            <h2 className={`text-2xl sm:text-[26px] font-black tracking-tight ${headerColor}`}>
              소개남녀 1:1 <span className="underline decoration-pink-300 decoration-wavy underline-offset-4">{genderTitle}</span>
            </h2>
          </div>
        </div>

        {/* Top Section: Photo (Left) + Quick Specs Grid (Right) */}
        <div className="grid grid-cols-12 gap-3 sm:gap-4 items-stretch">
          {/* Left Photo */}
          <div className="col-span-5 relative rounded-xl overflow-hidden border-2 border-purple-100 bg-neutral-100 aspect-[3/4] shadow-xs">
            {data.profileImage ? (
              <img
                src={data.profileImage}
                alt="프로필 사진"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-neutral-400">
                <Heart className="w-8 h-8 text-neutral-300 mb-1" />
                <span className="text-[11px] font-bold">얼굴 사진</span>
              </div>
            )}
            {showWatermark && (
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/40 backdrop-blur-xs rounded text-[9px] font-bold text-white tracking-tighter">
                소개남녀 검증
              </div>
            )}
          </div>

          {/* Right Specs Table */}
          <div className="col-span-7 border-2 border-[#DCE4F7] rounded-xl overflow-hidden bg-[#F5F8FE]/60 flex flex-col justify-between divide-y divide-[#DCE4F7]">
            <div className="grid grid-cols-12 flex-1 items-center px-3 py-1.5">
              <span className="col-span-4 text-xs sm:text-sm font-black text-[#2D3960]">년생</span>
              <span className="col-span-8 text-sm sm:text-base font-black text-neutral-900 text-center">{birthYear}년생</span>
            </div>
            <div className="grid grid-cols-12 flex-1 items-center px-3 py-1.5">
              <span className="col-span-4 text-xs sm:text-sm font-black text-[#2D3960]">지역</span>
              <span className="col-span-8 text-xs sm:text-sm font-black text-neutral-900 text-center leading-tight">
                {data.location || data.region || '서울'}
              </span>
            </div>
            <div className="grid grid-cols-12 flex-1 items-center px-3 py-1.5">
              <span className="col-span-4 text-xs sm:text-sm font-black text-[#2D3960]">직업</span>
              <span className="col-span-8 text-[11px] sm:text-xs font-black text-neutral-900 text-center leading-tight">
                {jobDisplay}
              </span>
            </div>
            <div className="grid grid-cols-12 flex-1 items-center px-3 py-1.5">
              <span className="col-span-4 text-xs sm:text-sm font-black text-[#2D3960]">키</span>
              <span className="col-span-8 text-sm sm:text-base font-black text-neutral-900 text-center">
                {data.height ? data.height.replace('cm', '') : '175'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Detailed Two-Column Grid */}
        <div className="border-t-2 border-[#E7ECF7] pt-3 divide-y divide-[#EDF1F9] text-xs sm:text-[13px] space-y-2">
          {/* Row 1: Nickname & MBTI */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className={`w-20 font-black ${labelColor} shrink-0`}>닉네임</span>
              <span className="font-extrabold text-neutral-900 truncate">{data.nickname || data.name || '소개남'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-20 font-black ${labelColor} shrink-0`}>MBTI</span>
              <span className="font-extrabold text-neutral-900">{data.mbti || 'ESTJ'}</span>
            </div>
          </div>

          {/* Row 2: Personality & Body Type */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="flex items-start gap-2">
              <span className={`w-20 font-black ${labelColor} shrink-0 pt-0.5`}>나의 성격</span>
              <span className="font-bold text-neutral-800 text-[11px] sm:text-xs leading-snug">
                {data.personality || '성실하고 차분하며 감정 기복 없이 안정적인 편입니다.'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className={`w-20 font-black ${labelColor} shrink-0 pt-0.5`}>본인 체형 특징</span>
              <span className="font-bold text-neutral-800 text-[11px] sm:text-xs leading-snug">
                {data.bodyTypeFeature || data.bodyType || '탄탄한 체형'}
              </span>
            </div>
          </div>

          {/* Row 3: Hobbies & Eyelid */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="flex items-start gap-2">
              <span className={`w-20 font-black ${labelColor} shrink-0 pt-0.5`}>나의 취미/특기</span>
              <span className="font-bold text-neutral-800 text-[11px] sm:text-xs leading-snug">
                {data.hobbiesSpecialty || (data.interests && data.interests.join(', ')) || '헬스, 카페 투어, 러닝'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-20 font-black ${labelColor} shrink-0`}>쌍커풀 유무</span>
              <span className="font-bold text-neutral-800">{data.eyelid || '무쌍'}</span>
            </div>
          </div>

          {/* Row 4: Smoking & Drinking */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="flex items-center gap-2">
              <span className={`w-20 font-black ${labelColor} shrink-0`}>흡연 유무</span>
              <span className="font-bold text-neutral-800">{data.smoking || '비흡연'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-20 font-black ${labelColor} shrink-0`}>주량</span>
              <span className="font-bold text-neutral-800">{data.drinkingCapacity || data.drinking || '거의 안마심'}</span>
            </div>
          </div>

          {/* Row 5: Religion & Ideal Type */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="flex items-center gap-2">
              <span className={`w-20 font-black ${labelColor} shrink-0`}>종교</span>
              <span className="font-bold text-neutral-800">{data.religion || '무교'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className={`w-20 font-black ${labelColor} shrink-0 pt-0.5`}>이상형</span>
              <span className="font-bold text-neutral-800 text-[11px] sm:text-xs leading-snug">
                {data.idealType || '대화가 편안하고 서로 배려할 수 있는 분'}
              </span>
            </div>
          </div>

          {/* Row 6: Self Intro (Full width) */}
          <div className="pt-2">
            <div className="flex items-start gap-2">
              <span className={`w-20 font-black ${labelColor} shrink-0 pt-0.5`}>자기소개</span>
              <p className="font-bold text-neutral-900 text-xs sm:text-[12.5px] leading-relaxed flex-1 bg-neutral-50/60 p-2.5 rounded-xl border border-neutral-200/60">
                {data.selfIntro || data.intro || '꾸준한 자기관리와 안정적인 직업, 탄탄한 생활 기반이 강점입니다. 편안한 대화와 신뢰를 바탕으로 진지한 만남을 희망합니다.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="pt-2 text-center text-[10px] text-neutral-400 border-t border-neutral-100 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D92C6B]" />
          <span>본 프로필 카드는 100% 신원 및 직장 서류 검증을 마친 정식 회원입니다.</span>
        </div>
      </div>
    </div>
  );
}
