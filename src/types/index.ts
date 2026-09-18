export type AvailableRegion = '흑석동' | '서교동' | '합정동' | '홍대' | '신도림';

export interface Session {
  id: string;
  region: AvailableRegion;
  title: string; // e.g. "토요일 1차 세션 (20대 중후반)"
  date: string; // e.g. "2026.09.20 (토)"
  time: string; // e.g. "14:30 ~ 17:00"
  ageGroup: string; // e.g. "20대 중후반 (남 27-32 / 여 24-30)"
  maleSlotsLeft: number;
  femaleSlotsLeft: number;
  status: '모집중' | '마감임박' | '마감';
  price: number;
  originalPrice: number;
}

export interface RegionInfo {
  id: string;
  name: AvailableRegion;
  tag: string;
  desc: string;
  badge: string;
}

export interface Review {
  id: string;
  author: string;
  age: string;
  occupation: string;
  sessionInfo: string;
  rating: number;
  title: string;
  content: string;
  matched: boolean;
  date: string;
  badge?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: '참가 자격' | '진행 방식' | '매칭 및 결과' | '환불 및 변경';
}

export interface ApplicationFormData {
  // Step 1: Matching Region & Preference
  sessionId: string;
  region: AvailableRegion | '';
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  ageGroup: string;

  // Step 2: Personal Info & Contact
  name: string;
  nickname: string; // 프로필 카드 닉네임 (예: TTJJ)
  kakaoId: string; // 카카오톡 아이디 (상호 수락 시 교환용)
  gender: 'male' | 'female' | '';
  birthDate: string;
  birthYear: string; // 년생 2자리 (예: 92)
  phone: string;
  location: string; // 거주지 (예: 서울시 구로구)
  height: string; // 키 (예: 170)
  bodyType: string;
  bodyTypeFeature: string; // 본인 체형 특징 (예: 탄탄한 체형, 슬림 등)
  eyelid: '유쌍' | '무쌍' | '속쌍' | ''; // 쌍커풀 유무
  drinking: string;
  drinkingCapacity: string; // 주량 (예: 거의 안마심, 소주 1병 등)
  smoking: string; // 흡연 유무 (예: 비흡연, 흡연)
  religion: string; // 종교 (예: 무교, 기독교, 천주교 등)
  profileImage: string | null; // 본인 실제 얼굴 사진 Data URL

  // Step 3: Career & Personality & Lifestyle
  jobCategory: string;
  companyName: string; // 직장명 (예: 중앙대학교병원)
  jobRole: string; // 직업/직무 (예: 행정직)
  mbti: string; // MBTI (예: ESTJ)
  personality: string; // 나의 성격
  hobbiesSpecialty: string; // 나의 취미/특기 (예: 헬스, 피아노, 클라이밍)
  interests: string[];
  idealType: string; // 이상형 (예: 여성스럽고 차분하며 자기관리 잘하고...)
  selfIntro: string; // 상세 자기소개
  intro: string;

  // Step 4: Verification & Agreement
  verificationType: 'business_card' | 'email' | 'cert';
  verificationFile: string | null;
  agreementSingle: boolean;
  agreementManner: boolean;
  agreementPrivacy: boolean;
}
