-- ========================================================
-- 소개남녀 (Sogaenamnyeo) 1:1 소개팅 데이터베이스 스키마
-- Supabase 대시보드 -> SQL Editor에 붙여넣고 [Run] 실행
-- ========================================================

-- 1. 지원자 (1:1 프로필 카드) 테이블 생성
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_number TEXT UNIQUE NOT NULL,
  applied_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '심사대기',
  name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  kakao_id TEXT NOT NULL,
  gender TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  birth_year TEXT,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  region TEXT NOT NULL,
  session_title TEXT,
  session_date TEXT,
  session_time TEXT,
  height TEXT,
  body_type TEXT,
  body_type_feature TEXT,
  eyelid TEXT,
  drinking TEXT,
  drinking_capacity TEXT,
  smoking TEXT,
  religion TEXT,
  job_category TEXT,
  company_name TEXT,
  job_role TEXT,
  mbti TEXT,
  personality TEXT,
  hobbies_specialty TEXT,
  interests JSONB DEFAULT '[]'::jsonb,
  ideal_type TEXT,
  self_intro TEXT,
  intro TEXT,
  profile_image TEXT,
  verification_type TEXT DEFAULT 'business_card',
  verification_file TEXT,
  agreement_single BOOLEAN DEFAULT true,
  agreement_manner BOOLEAN DEFAULT true,
  agreement_privacy BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 관리자 계정 테이블 생성
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 초기 관리자 계정 등록 (sooho / tjdrbs)
INSERT INTO public.admin_users (username, password, role)
VALUES ('sooho', 'tjdrbs', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- 3. RLS (Row Level Security) 설정
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 익명 사용자(anon) 및 서비스 역할의 접근 허용 정책
CREATE POLICY "Allow public insert for applications"
ON public.applications FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public read for applications"
ON public.applications FOR SELECT TO public USING (true);

CREATE POLICY "Allow public update for applications"
ON public.applications FOR UPDATE TO public USING (true);

CREATE POLICY "Allow public read for admin_users"
ON public.admin_users FOR SELECT TO public USING (true);

-- 4. 초기 샘플 1:1 소개팅 지원자 2명 삽입
INSERT INTO public.applications (
  receipt_number, applied_at, status, name, nickname, kakao_id, gender,
  birth_date, birth_year, phone, location, region, session_title,
  height, body_type_feature, eyelid, drinking_capacity, smoking, religion,
  job_category, company_name, job_role, mbti, personality, hobbies_specialty,
  ideal_type, self_intro, profile_image
) VALUES (
  'SG-20260918-001', '2026.09.18 16:30', '프로필승인', '김서준', 'TTJJ', 'seojun_92k', 'male',
  '1992.05.14', '92', '010-3491-8821', '서울시 구로구', '흑석동', '흑석동 1:1 맞춤 매칭',
  '170', '탄탄한 체형', '무쌍', '거의 안마심', '비흡연', '무교',
  '공공/행정/병원', '중앙대학교병원', '행정직', 'ESTJ',
  '성실하고 자기관리 철저하며, 감정 기복이 크지 않고 안정적인 편입니다.',
  '헬스, 피아노, 클라이밍',
  '여성스럽고 차분하며 자기관리 잘하고, 대화가 편안하면서 서로 배려할 수 있는 사람',
  '꾸준한 자기관리와 안정적인 직업, 탄탄한 생활 기반이 강점입니다. 책임감 있게 관계를 이어가며, 편안한 대화와 배려, 신뢰를 바탕으로 꽤 오래 만나는 연애를 중요하게 생각합니다.',
  '/images/sample_male.jpg'
), (
  'SG-20260918-002', '2026.09.18 16:15', '매칭제안중', '이지은', '러블리지은', 'jieun_lee97', 'female',
  '1997.08.22', '97', '010-9284-1736', '서울 영등포구 여의도동', '합정동', '합정동 1:1 맞춤 매칭',
  '164', '슬림하고 단아한 체형', '유쌍', '와인 1~2잔', '비흡연', '무교',
  '금융/은행/증권', 'NH투자증권', '증권사 리서치 연구원', 'ENFP',
  '밝고 긍정적인 에너지로 주변을 편안하게 해주는 비타민 같은 성격입니다.',
  '카페 투어, 와인 시음, 전시회 감상',
  '다정하고 자기 일에 열정적인 분, 함께 맛있는 음식과 와인을 곁들여 대화할 수 있는 분',
  '금융권에서 성실히 일하고 있으며 여유로운 주말을 함께 나눌 따뜻한 인연을 찾고 있습니다. 솔직하고 배려 깊은 연애를 지향합니다.',
  '/images/sample_female.jpg'
) ON CONFLICT (receipt_number) DO NOTHING;
