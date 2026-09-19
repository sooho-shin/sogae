import { NextResponse } from 'next/server';
import { INITIAL_APPLICATIONS } from '@/data/initialApplications';
import { AdminApplication, ApplicationStatus } from '@/types/admin';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Global in-memory storage fallback
declare global {
  // eslint-disable-next-line no-var
  var __APPLICATIONS_STORE__: AdminApplication[] | undefined;
}

if (!globalThis.__APPLICATIONS_STORE__) {
  globalThis.__APPLICATIONS_STORE__ = [...INITIAL_APPLICATIONS];
}

// Convert DB snake_case row to CamelCase AdminApplication
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

export async function GET() {
  try {
    // 1. If Supabase is configured, fetch from PostgreSQL DB
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .neq('status', '삭제됨')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch applications error:', error);
      } else if (data) {
        return NextResponse.json({ success: true, data: data.map(mapRowToApp) });
      }
    }

    // 2. Fallback to in-memory store
    const list = (globalThis.__APPLICATIONS_STORE__ || []).filter((a) => a.status !== ('삭제됨' as ApplicationStatus));
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('GET /api/applications exception:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newApp: AdminApplication = {
      ...body,
      id: body.id || `app-${Date.now()}`,
      appliedAt: body.appliedAt || new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '.'),
      status: (body.status || '심사대기') as ApplicationStatus,
    };

    // 1. If Supabase is configured, insert into PostgreSQL DB
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('applications')
        .insert({
          receipt_number: newApp.receiptNumber,
          applied_at: newApp.appliedAt,
          status: newApp.status,
          name: newApp.name,
          nickname: newApp.nickname,
          kakao_id: newApp.kakaoId,
          gender: newApp.gender,
          birth_date: newApp.birthDate,
          birth_year: newApp.birthYear,
          phone: newApp.phone,
          location: newApp.location,
          region: newApp.region,
          session_title: newApp.sessionTitle,
          height: newApp.height,
          body_type: newApp.bodyType,
          body_type_feature: newApp.bodyTypeFeature,
          eyelid: newApp.eyelid,
          drinking: newApp.drinking,
          drinking_capacity: newApp.drinkingCapacity,
          smoking: newApp.smoking,
          religion: newApp.religion,
          job_category: newApp.jobCategory,
          company_name: newApp.companyName,
          job_role: newApp.jobRole,
          mbti: newApp.mbti,
          personality: newApp.personality,
          hobbies_specialty: newApp.hobbiesSpecialty,
          interests: newApp.interests,
          ideal_type: newApp.idealType,
          self_intro: newApp.selfIntro,
          intro: newApp.intro,
          profile_image: newApp.profileImage,
          verification_type: newApp.verificationType,
          agreement_single: newApp.agreementSingle,
          agreement_manner: newApp.agreementManner,
          agreement_privacy: newApp.agreementPrivacy,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert application error:', error);
      } else if (data) {
        const savedApp = mapRowToApp(data);
        if (!globalThis.__APPLICATIONS_STORE__) {
          globalThis.__APPLICATIONS_STORE__ = [];
        }
        globalThis.__APPLICATIONS_STORE__.unshift(savedApp);
        return NextResponse.json({ success: true, data: savedApp });
      }
    }

    // 2. Fallback to in-memory store
    if (!globalThis.__APPLICATIONS_STORE__) {
      globalThis.__APPLICATIONS_STORE__ = [...INITIAL_APPLICATIONS];
    }
    globalThis.__APPLICATIONS_STORE__.unshift(newApp);

    return NextResponse.json({ success: true, data: newApp });
  } catch (error) {
    console.error('POST /api/applications exception:', error);
    return NextResponse.json({ success: false, error: 'Failed to create application' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status required' }, { status: 400 });
    }

    // 1. If Supabase is configured, update in PostgreSQL DB
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, data: mapRowToApp(data) });
      }
    }

    // 2. Fallback to in-memory store
    if (!globalThis.__APPLICATIONS_STORE__) {
      globalThis.__APPLICATIONS_STORE__ = [...INITIAL_APPLICATIONS];
    }

    const appIndex = globalThis.__APPLICATIONS_STORE__.findIndex((a) => a.id === id);
    if (appIndex === -1) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    globalThis.__APPLICATIONS_STORE__[appIndex].status = status as ApplicationStatus;

    return NextResponse.json({ success: true, data: globalThis.__APPLICATIONS_STORE__[appIndex] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    // 1. If Supabase is configured, soft-delete in PostgreSQL DB
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('applications')
        .update({ status: '삭제됨' })
        .eq('id', id);

      if (error) {
        console.error('Supabase soft-delete error:', error);
      }
    }

    // 2. Fallback to in-memory store
    if (globalThis.__APPLICATIONS_STORE__) {
      globalThis.__APPLICATIONS_STORE__ = globalThis.__APPLICATIONS_STORE__.filter((a) => a.id !== id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete application' }, { status: 500 });
  }
}
