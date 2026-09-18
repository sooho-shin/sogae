import { Session, Review, FAQItem } from '@/types';

export const SESSIONS_DATA: Session[] = [
  {
    id: 'session-gangnam-1',
    region: '강남/역삼',
    locationName: '역삼 프라이빗 라운지 아트리움',
    locationAddress: '서울 강남구 테헤란로 142 (역삼역 3번 출구 도보 2분)',
    date: '2026.09.20 (토)',
    time: '14:30 ~ 17:00',
    ageGroup: '20대 중후반 (남 27~32세 / 여 24~30세)',
    maleSlotsLeft: 1,
    femaleSlotsLeft: 2,
    status: '마감임박',
    price: 23900,
    originalPrice: 60000,
  },
  {
    id: 'session-gangnam-2',
    region: '강남/역삼',
    locationName: '역삼 프라이빗 라운지 아트리움',
    locationAddress: '서울 강남구 테헤란로 142 (역삼역 3번 출구 도보 2분)',
    date: '2026.09.20 (토)',
    time: '18:00 ~ 20:30',
    ageGroup: '30대 초중반 (남 30~36세 / 여 28~34세)',
    maleSlotsLeft: 0,
    femaleSlotsLeft: 1,
    status: '마감임박',
    price: 23900,
    originalPrice: 60000,
  },
  {
    id: 'session-hongdae-1',
    region: '홍대/합정',
    locationName: '합정 테라스 감성 라운지 루프',
    locationAddress: '서울 마포구 독막로 31 (합정역 6번 출구 도보 3분)',
    date: '2026.09.21 (일)',
    time: '15:00 ~ 17:30',
    ageGroup: '20대 중후반 (남 26~31세 / 여 24~29세)',
    maleSlotsLeft: 3,
    femaleSlotsLeft: 2,
    status: '모집중',
    price: 23900,
    originalPrice: 60000,
  },
  {
    id: 'session-hongdae-2',
    region: '홍대/합정',
    locationName: '합정 테라스 감성 라운지 루프',
    locationAddress: '서울 마포구 독막로 31 (합정역 6번 출구 도보 3분)',
    date: '2026.09.21 (일)',
    time: '18:30 ~ 21:00',
    ageGroup: '30대 초중반 (남 31~37세 / 여 28~35세)',
    maleSlotsLeft: 2,
    femaleSlotsLeft: 0,
    status: '마감임박',
    price: 23900,
    originalPrice: 60000,
  },
  {
    id: 'session-jamsil-1',
    region: '잠실/올림픽공원',
    locationName: '잠실 시그니처 갤러리 카페',
    locationAddress: '서울 송파구 백제고분로 41길 (석촌호수 도보 4분)',
    date: '2026.09.27 (토)',
    time: '15:00 ~ 17:30',
    ageGroup: '30대 초중반 (남 30~36세 / 여 28~34세)',
    maleSlotsLeft: 4,
    femaleSlotsLeft: 3,
    status: '모집중',
    price: 23900,
    originalPrice: 60000,
  },
  {
    id: 'session-euljiro-1',
    region: '을지로',
    locationName: '을지로 헤리티지 와인 라운지',
    locationAddress: '서울 중구 을지로 100 (을지로입구역 1분)',
    date: '2026.09.28 (일)',
    time: '16:00 ~ 18:30',
    ageGroup: '20대 후반~30대 초반 (남 28~35세 / 여 26~33세)',
    maleSlotsLeft: 2,
    femaleSlotsLeft: 2,
    status: '모집중',
    price: 23900,
    originalPrice: 60000,
  },
];

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    author: '김*현 (남, 31세)',
    age: '31세',
    occupation: '대기업 IT 기획자',
    sessionInfo: '강남 역삼 세션 참가',
    rating: 5,
    title: '데이팅 앱에 지쳐있던 저에게 최고의 선택이었습니다',
    content:
      '어플은 프로필 사기도 많고 대화하다가 끊기기 일쑤였는데, 여기서는 실제로 얼굴을 마주보고 눈을 맞추며 대화하니까 호감도가 완전히 달랐어요. 준비해주신 대화카드가 있어서 15분이 순식간에 지나갔고, 2지망으로 적었던 분과 매칭되어 지금 3주째 예쁘게 만나고 있습니다! 감사합니다.',
    matched: true,
    date: '2026.09.12',
    badge: '커플 탄생 💕',
  },
  {
    id: 'rev-2',
    author: '이*서 (여, 28세)',
    age: '28세',
    occupation: '공기업 연구원',
    sessionInfo: '홍대 합정 세션 참가',
    rating: 5,
    title: '혼자 가서 걱정했는데 분위기가 너무 편안했어요',
    content:
      '낯가림이 심해서 혼자 신청하고 전날까지 취소할까 고민했거든요. 근데 라운지 조명도 은은하고 매니저님들이 안내를 차분하게 잘해주셔서 긴장이 싹 풀렸어요. 번호를 그 자리에서 교환하지 않고 비밀 쪽지로 선택하는 방식이라 여성 입장에서 부담이 전혀 없었습니다.',
    matched: true,
    date: '2026.09.08',
    badge: '매칭 성공 🥂',
  },
  {
    id: 'rev-3',
    author: '박*준 (남, 34세)',
    age: '34세',
    occupation: '금융권 재무팀',
    sessionInfo: '잠실 올림픽공원 세션 참가',
    rating: 5,
    title: '결혼정보회사 상담받고 현타왔는데 소개남녀가 정답이었네요',
    content:
      '결정사 가입비 300만원 부르고 등급 매기는 게 너무 거부감 들었거든요. 소개남녀는 2만원대 참가비에 재직증명서랑 싱글 인증 다 확인된 진짜 괜찮은 직장인 분들만 나와서 놀랐습니다. 10명과 진솔하게 이야기 나누며 이상형을 찾을 수 있어서 가성비 최고입니다.',
    matched: true,
    date: '2026.09.03',
    badge: '성혼 예정 💍',
  },
  {
    id: 'rev-4',
    author: '최*영 (여, 30세)',
    age: '30세',
    occupation: '외국계 마케터',
    sessionInfo: '을지로 시그니처 세션 참가',
    rating: 5,
    title: '주변에 소개팅 자리 부탁하기 민망할 때 딱이에요',
    content:
      '주선자 눈치 볼 필요도 없고, 다양한 직종의 열정적인 분들과 교류할 수 있어서 주말이 정말 알찼습니다. 분위기도 고급스럽고 음료도 맛있었어요. 제 친구들에게도 적극 추천 중입니다!',
    matched: false,
    date: '2026.08.30',
  },
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: '참가 자격',
    question: '참가 자격 및 인증 절차는 어떻게 되나요?',
    answer:
      '소개남녀는 2030 싱글 직장인을 대상으로 하며, 참가 신청 시 명함/사원증/건강보험자격득실확인서 등을 통해 직장 인증과 싱글(미혼) 확인을 100% 거칩니다. 신원이 불분명하거나 기혼자의 참가는 법적으로 엄격히 제한됩니다.',
  },
  {
    id: 'faq-2',
    category: '진행 방식',
    question: '혼자 참여해도 어색하지 않을까요?',
    answer:
      '실제 참가자의 95% 이상이 혼자 신청하십니다. 1:1 독립된 테이블로 배치되며, 전문 연애상담사가 개발한 아이스브레이킹 대화 질문 카드가 제공되어 침묵이나 어색함 없이 자연스럽고 즐겁게 대화를 나누실 수 있습니다.',
  },
  {
    id: 'faq-3',
    category: '매칭 및 결과',
    question: '현장에서 연락처를 바로 교환해야 하나요?',
    answer:
      '아닙니다! 소개남녀는 참가자 보호를 위해 현장에서의 직접적인 연락처 교환을 지양합니다. 행사가 끝난 뒤 모바일 안심 쪽지 매칭표를 통해 호감 있는 상대 1~3지망을 비밀리에 제출하며, 서로 호감을 표현한 분들에 한해 익일 오전 매니저가 연락처를 전달해 드립니다.',
  },
  {
    id: 'faq-4',
    category: '진행 방식',
    question: '행사 복장(드레스코드)은 어떻게 입고 가야 하나요?',
    answer:
      '깔끔하고 단정한 깔끔 캐주얼(Smart Casual) 또는 출근 룩을 권장합니다. 남성분은 셔츠/슬랙스/자켓, 여성분은 원피스/블라우스/깔끔한 슬랙스 착용을 추천드리며, 트레이닝복이나 슬리퍼 등은 입장이 제한될 수 있습니다.',
  },
  {
    id: 'faq-5',
    category: '환불 및 변경',
    question: '일정 변경이나 취소/환불 규정은 어떻게 되나요?',
    answer:
      '성비 1:1 매칭의 특성상 세션 시작 4일 전까지는 100% 전액 환불 및 일정 무료 변경이 가능합니다. 3일 전부터는 성비 조정 및 노쇼 방지를 위해 위약금이 발생하오니 신중한 신청 부탁드립니다.',
  },
];

export const TRUST_STATS = [
  { label: '누적 참가자', value: '45,000+', desc: '4년 연속 2030 직장인 선호도 1위' },
  { label: '평균 매칭률', value: '42.8%', desc: '10:10 세션 기준 상호 매칭 결과' },
  { label: '누적 성혼 커플', value: '320쌍+', desc: '소개남녀를 통해 결혼에 골인한 커플' },
  { label: '매주 참가자', value: '400명+', desc: '서울/경기 주말 정기 세션 운영' },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: '프라이빗 라운지 입장',
    desc: '예약된 프라이빗 라운지에 도착하여 웰컴 드링크와 명찰, 대화카드를 수령합니다.',
    badge: '웰컴 드링크 제공',
  },
  {
    step: '02',
    title: '1:1 프라이빗 15분 대화',
    desc: '독립된 좌석에서 준비된 대화 질문카드를 통해 가치관, 취미, 라이프스타일을 나눕니다.',
    badge: '어색함 없는 대화카드',
  },
  {
    step: '03',
    title: '자연스러운 순환 로테이션',
    desc: '남성 참가자가 정해진 순서대로 자리를 이동하며 참가한 모든 이성과 1:1 대화를 마칩니다.',
    badge: '전원 1:1 대화 보장',
  },
  {
    step: '04',
    title: '모바일 비밀 매칭표 작성',
    desc: '현장 거절 부담 ZERO! 행사 종료 후 모바일로 마음이 통한 상대 1~3지망을 비밀 투표합니다.',
    badge: '연락처 공개 부담 없음',
  },
  {
    step: '05',
    title: '익일 매칭 결과 전달 & 애프터',
    desc: '상호 호감이 일치한 커플에게 다음 날 오전 매니저가 개별 연락처와 첫 데이트 팁을 전달합니다.',
    badge: '익일 오전 10시 발표',
  },
];

export const JOB_CATEGORIES = [
  '대기업 / 중견기업',
  '공기업 / 공무원',
  '전문직 (의료·법조·회계·변리 등)',
  'IT / 개발 / 스타트업',
  '금융 / 투자 / 증권',
  '연구원 / 교육 / 교직',
  '외국계 기업',
  '사업가 / 전문 프리랜서',
];

export const INTEREST_TAGS = [
  '🏋️ 헬스/피트니스',
  '🍷 와인/위스키',
  '☕ 카페/베이커리',
  '✈️ 해외여행/국내여행',
  '🍽️ 맛집탐방',
  '🏃 러닝/마라톤',
  '🎨 전시회/미술관',
  '🐶 반려동물',
  '⛳ 골프/테니스',
  '📚 독서/자기계발',
  '⛺ 캠핑/글램핑',
  '🎬 영화/넷플릭스',
  '📈 재테크/투자',
  '🍳 요리/베이킹',
];

export const MBTI_LIST = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
];
