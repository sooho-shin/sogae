import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AdminApplication } from '@/types/admin';
import { INITIAL_APPLICATIONS } from '@/data/initialApplications';

declare global {
  // eslint-disable-next-line no-var
  var __APPLICATIONS_STORE__: AdminApplication[] | undefined;
}

function mapRowToApp(row: any): AdminApplication {
  return {
    id: row.id,
    receiptNumber: row.receipt_number,
    appliedAt: row.applied_at,
    status: row.status,
    sessionId: row.session_id || 'session-default',
    sessionTitle: row.session_title || '1:1 맞춤 매칭',
    sessionDate: row.session_date || '상시 조율',
    sessionTime: row.session_time || '',
    ageGroup: row.age_group || '',
    region: row.region || '흑석동',
    name: row.name,
    nickname: row.nickname || row.name,
    kakaoId: row.kakao_id || '',
    gender: row.gender,
    birthDate: row.birth_date,
    birthYear: row.birth_year || (row.birth_date ? row.birth_date.slice(2, 4) : ''),
    phone: row.phone,
    location: row.location,
    height: row.height,
    bodyType: row.body_type || '보통',
    bodyTypeFeature: row.body_type_feature || '탄탄한 체형',
    eyelid: row.eyelid || '무쌍',
    drinking: row.drinking || '거의 안마심',
    drinkingCapacity: row.drinking_capacity || '거의 안마심',
    smoking: row.smoking || '비흡연',
    religion: row.religion || '무교',
    profileImage: row.profile_image,
    jobCategory: row.job_category,
    companyName: row.company_name,
    jobRole: row.job_role,
    mbti: row.mbti,
    personality: row.personality || '',
    hobbiesSpecialty: row.hobbies_specialty || '',
    interests: Array.isArray(row.interests) ? row.interests : [],
    idealType: row.ideal_type || '',
    selfIntro: row.self_intro || '',
    intro: row.intro || '',
    verificationType: row.verification_type || 'business_card',
    verificationFile: row.verification_file,
    agreementSingle: row.agreement_single ?? true,
    agreementManner: row.agreement_manner ?? true,
    agreementPrivacy: row.agreement_privacy ?? true,
  };
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ success: false, error: '전화번호 또는 접수번호를 입력해 주세요.' }, { status: 400 });
    }

    const cleanQuery = query.trim();
    const numericQuery = cleanQuery.replace(/[^0-9]/g, '');

    // 1. Supabase Check
    if (isSupabaseConfigured() && supabase) {
      // Check receipt_number
      let { data, error } = await supabase
        .from('applications')
        .select('*')
        .neq('status', '삭제됨')
        .ilike('receipt_number', cleanQuery)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!data || data.length === 0) {
        // Check phone exact or sanitized
        const phoneFormatted = numericQuery.length === 11
          ? `${numericQuery.slice(0, 3)}-${numericQuery.slice(3, 7)}-${numericQuery.slice(7)}`
          : cleanQuery;

        const phoneRes = await supabase
          .from('applications')
          .select('*')
          .neq('status', '삭제됨')
          .or(`phone.eq.${cleanQuery},phone.eq.${phoneFormatted}`)
          .order('created_at', { ascending: false })
          .limit(1);

        data = phoneRes.data;
        error = phoneRes.error;
      }

      if (data && data.length > 0) {
        return NextResponse.json({ success: true, data: mapRowToApp(data[0]) });
      }
    }

    // 2. In-Memory Store Check
    const list = globalThis.__APPLICATIONS_STORE__ || [...INITIAL_APPLICATIONS];
    const match = list.find((app) => {
      if (app.status === '삭제됨') return false;
      if (app.receiptNumber.toLowerCase() === cleanQuery.toLowerCase()) return true;
      const appNumericPhone = app.phone.replace(/[^0-9]/g, '');
      if (numericQuery.length >= 8 && appNumericPhone === numericQuery) return true;
      if (app.phone === cleanQuery) return true;
      return false;
    });

    if (match) {
      return NextResponse.json({ success: true, data: match });
    }

    return NextResponse.json(
      { success: false, error: '입력하신 정보와 일치하는 신청 내역을 찾을 수 없습니다. 접수번호나 전화번호를 다시 확인해 주세요.' },
      { status: 404 }
    );
  } catch (error) {
    console.error('POST /api/applications/status exception:', error);
    return NextResponse.json({ success: false, error: '신청 내역 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
