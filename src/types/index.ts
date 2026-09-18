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
  // Step 1: Session & Region
  sessionId: string;
  region: AvailableRegion | '';
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  ageGroup: string;

  // Step 2: Personal Info & Photo
  name: string;
  gender: 'male' | 'female' | '';
  birthDate: string;
  phone: string;
  location: string; // 거주지
  height: string;
  bodyType: string;
  drinking: string;
  smoking: string;
  profileImage: string | null; // 본인 사진 Data URL

  // Step 3: Career & Lifestyle
  jobCategory: string;
  companyName: string; // 비공개용
  jobRole: string;
  mbti: string;
  interests: string[];
  idealType: string;
  intro: string;

  // Step 4: Verification & Agreement
  verificationType: 'business_card' | 'email' | 'cert';
  verificationFile: string | null;
  agreementSingle: boolean;
  agreementManner: boolean;
  agreementPrivacy: boolean;
}
