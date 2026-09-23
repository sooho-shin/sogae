import { NextResponse } from 'next/server';
import { MatchRequest } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

declare global {
  // eslint-disable-next-line no-var
  var __MATCH_REQUESTS_STORE__: MatchRequest[] | undefined;
}

if (!globalThis.__MATCH_REQUESTS_STORE__) {
  globalThis.__MATCH_REQUESTS_STORE__ = [
    // Mock sample match request for immediate preview
    {
      id: 'match-req-demo-1',
      fromAppId: 'app-sample-male',
      fromNickname: 'TTJJ',
      fromGender: 'male',
      toAppId: 'app-sample-female',
      toNickname: '지으니',
      toGender: 'female',
      message: '프로필 가치관과 취미가 저와 너무 잘 맞으시는 것 같아 호감 보냅니다! :)',
      status: 'pending',
      createdAt: '2026.09.23 15:30',
    },
  ];
}

// Helper: sync matches to Supabase metadata if available
async function syncToSupabase(req: MatchRequest) {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    // We update target application's intro metadata or status if applicable
    const { data: targetApp } = await supabase
      .from('applications')
      .select('id, intro')
      .eq('id', req.toAppId)
      .maybeSingle();

    if (targetApp) {
      let meta: any = {};
      try {
        if (targetApp.intro && targetApp.intro.startsWith('{')) {
          meta = JSON.parse(targetApp.intro);
        }
      } catch (e) {
        meta = {};
      }

      meta.matches = meta.matches || [];
      const idx = meta.matches.findIndex((m: any) => m.id === req.id);
      if (idx >= 0) {
        meta.matches[idx] = req;
      } else {
        meta.matches.push(req);
      }

      await supabase
        .from('applications')
        .update({ intro: JSON.stringify(meta) })
        .eq('id', req.toAppId);
    }
  } catch (err) {
    console.error('Error syncing match request to Supabase:', err);
  }
}

// GET: Fetch matches for a specific user, or all matches (for admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    const store = globalThis.__MATCH_REQUESTS_STORE__ || [];

    if (!appId) {
      // Return all requests for Admin
      return NextResponse.json({ success: true, data: store });
    }

    // Requests received by this user
    const received = store.filter((m) => m.toAppId === appId);
    // Requests sent by this user
    const sent = store.filter((m) => m.fromAppId === appId);

    // Any requests that are 'accepted' where this user is either fromAppId or toAppId
    // In accepted matches, both parties can view each other's photo!
    const acceptedMatches = store.filter(
      (m) => m.status === 'accepted' && (m.fromAppId === appId || m.toAppId === appId)
    );

    // List of partner app IDs whose photo is unlocked for this user
    const unlockedPartnerIds = acceptedMatches.map((m) =>
      m.fromAppId === appId ? m.toAppId : m.fromAppId
    );

    return NextResponse.json({
      success: true,
      data: {
        received,
        sent,
        accepted: acceptedMatches,
        unlockedPartnerIds,
      },
    });
  } catch (error) {
    console.error('GET /api/matches exception:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch match requests' }, { status: 500 });
  }
}

// POST: Send a like / match proposal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromAppId, toAppId, fromNickname, toNickname, fromGender, toGender, message } = body;

    if (!fromAppId || !toAppId) {
      return NextResponse.json(
        { success: false, error: '신청자와 수신자 정보가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    if (fromAppId === toAppId) {
      return NextResponse.json(
        { success: false, error: '본인에게는 호감을 보낼 수 없습니다.' },
        { status: 400 }
      );
    }

    const store = globalThis.__MATCH_REQUESTS_STORE__ || [];

    // Check if already requested
    const existing = store.find(
      (m) => m.fromAppId === fromAppId && m.toAppId === toAppId && m.status !== 'rejected'
    );
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: existing.status === 'accepted' ? '이미 상호 수락되어 사진이 공개된 분입니다.' : '이미 호감을 보낸 상대입니다. 상대방의 수락을 기다려주세요.',
        },
        { status: 400 }
      );
    }

    // Check if reverse request exists (Mutual Like!)
    const reverse = store.find(
      (m) => m.fromAppId === toAppId && m.toAppId === fromAppId && m.status === 'pending'
    );

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    if (reverse) {
      // Both users liked each other! Auto-accept!
      reverse.status = 'accepted';
      reverse.unlockedAt = dateStr;
      await syncToSupabase(reverse);

      return NextResponse.json({
        success: true,
        data: reverse,
        isMutualAccept: true,
        message: '🎉 축하합니다! 상대방도 이미 회원님께 호감을 보냈던 상태여서 즉시 상호 수락되었으며, 서로의 사진이 공개되었습니다!',
      });
    }

    // Create new pending request
    const newRequest: MatchRequest = {
      id: `match-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fromAppId,
      fromNickname: fromNickname || '익명회원',
      fromGender,
      toAppId,
      toNickname: toNickname || '상대회원',
      toGender,
      message: message || '회원님의 블라인드 프로필을 보고 호감을 보냈습니다!',
      status: 'pending',
      createdAt: dateStr,
    };

    store.unshift(newRequest);
    globalThis.__MATCH_REQUESTS_STORE__ = store;
    await syncToSupabase(newRequest);

    return NextResponse.json({
      success: true,
      data: newRequest,
      isMutualAccept: false,
      message: '호감이 성공적으로 전송되었습니다! 상대방이 수락하면 서로의 실제 사진이 공개됩니다.',
    });
  } catch (error) {
    console.error('POST /api/matches exception:', error);
    return NextResponse.json({ success: false, error: '호감 전송 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// PATCH: Accept or Reject a match proposal
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { requestId, action } = body;

    if (!requestId || !['accept', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: '올바른 요청 파라미터가 아닙니다.' },
        { status: 400 }
      );
    }

    const store = globalThis.__MATCH_REQUESTS_STORE__ || [];
    const item = store.find((m) => m.id === requestId);

    if (!item) {
      return NextResponse.json(
        { success: false, error: '해당 호감 요청을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    if (action === 'accept') {
      item.status = 'accepted';
      item.unlockedAt = dateStr;
      await syncToSupabase(item);

      return NextResponse.json({
        success: true,
        data: item,
        message: '🎉 호감을 수락하셨습니다! 이제 두 분 모두에게 서로의 실제 사진이 공개되었습니다.',
      });
    } else {
      item.status = 'rejected';
      await syncToSupabase(item);

      return NextResponse.json({
        success: true,
        data: item,
        message: '호감 요청이 거절 처리되었습니다.',
      });
    }
  } catch (error) {
    console.error('PATCH /api/matches exception:', error);
    return NextResponse.json({ success: false, error: '수락 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
