import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, message: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    // 1. If Supabase is configured, check admin_users table
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, user: { username: data.username, role: data.role } });
      } else {
        return NextResponse.json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
      }
    }

    // 2. Fallback check for offline/local environment (sooho / tjdrbs)
    if (username === 'sooho' && password === 'tjdrbs') {
      return NextResponse.json({ success: true, user: { username: 'sooho', role: 'super_admin' } });
    }

    return NextResponse.json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: '로그인 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
