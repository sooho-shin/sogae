export interface Session {
  id: string;
  title: string; // e.g. "토요일 오후 세션", "일요일 저녁 세션"
  date: string; // e.g. "2026.09.20 (토)"
  time: string; // e.g. "14:30 ~ 17:00"
  ageGroup: string; // e.g. "20대 중후반 (남 27-32 / 여 24-30)"
  maleSlotsLeft: number;
  femaleSlotsLeft: number;
  status: '모집중' | '마감임박' | '마감';
  price: number;
  originalPrice: number;
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
  // Step 1: Session (일정 및 연령대)
  sessionId: string;
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  ageGroup: string;

  // Step 2: Personal Info
  name: string;
  gender: 'male' | 'female' | '';
  birthDate: string;
  phone: string;
  location: string;
  height: string;
  bodyType: string;
  drinking: string;
  smoking: string;

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
