'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Lock,
  User,
  KeyRound,
  LogOut,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  Phone,
  X,
  Heart,
  ChevronDown,
  MessageCircle,
  Copy,
  Send,
  Share2,
} from 'lucide-react';
import { AdminApplication, ApplicationStatus } from '@/types/admin';
import ProfileCard from '@/components/ProfileCard';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Applications Data State
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('전체');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<string>('전체');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('전체');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // Modal State
  const [selectedAppForCard, setSelectedAppForCard] = useState<AdminApplication | null>(null);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<AdminApplication | null>(null);
  const [selectedPhotoForZoom, setSelectedPhotoForZoom] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string>('');

  // Check login on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = sessionStorage.getItem('sogaenamnyeo_admin_auth');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
        fetchApplications();
      }
      setAuthChecking(false);
    }
  }, []);

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setApplications(data.data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (usernameInput === 'sooho' && passwordInput === 'tjdrbs') {
      sessionStorage.setItem('sogaenamnyeo_admin_auth', 'true');
      setIsAuthenticated(true);
      fetchApplications();
    } else {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem('sogaenamnyeo_admin_auth');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Update status handler
  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
        if (selectedAppForCard && selectedAppForCard.id === id) {
          setSelectedAppForCard((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        if (selectedAppForDetail && selectedAppForDetail.id === id) {
          setSelectedAppForDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Copy text helper
  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    }
  };

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Keyword match (name, nickname, kakaoId, phone, receiptNumber, job)
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matches =
          app.name.toLowerCase().includes(kw) ||
          (app.nickname || '').toLowerCase().includes(kw) ||
          (app.kakaoId || '').toLowerCase().includes(kw) ||
          app.phone.includes(kw) ||
          app.receiptNumber.toLowerCase().includes(kw) ||
          (app.jobRole || '').toLowerCase().includes(kw) ||
          (app.companyName || '').toLowerCase().includes(kw);
        if (!matches) return false;
      }

      // Region filter
      if (selectedRegionFilter !== '전체' && app.region !== selectedRegionFilter) {
        return false;
      }

      // Gender filter
      if (selectedGenderFilter !== '전체') {
        const targetGender = selectedGenderFilter === '남성' ? 'male' : 'female';
        if (app.gender !== targetGender) return false;
      }

      // Status filter
      if (selectedStatusFilter !== '전체' && app.status !== selectedStatusFilter) {
        return false;
      }

      return true;
    });
  }, [applications, searchKeyword, selectedRegionFilter, selectedGenderFilter, selectedStatusFilter]);

  // Pagination calculation
  const totalPages = Math.max(Math.ceil(filteredApps.length / pageSize), 1);
  const currentPaginatedApps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApps.slice(start, start + pageSize);
  }, [filteredApps, currentPage, pageSize]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedRegionFilter, selectedGenderFilter, selectedStatusFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === '심사대기').length,
      proposing: applications.filter((a) => a.status === '매칭제안중').length,
      matched: applications.filter((a) => a.status === '상호수락(카톡교환)').length,
    };
  }, [applications]);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white text-sm">
        인증 확인 중...
      </div>
    );
  }

  // ================= 1. LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-[#1C102C] to-neutral-950 flex flex-col justify-center items-center px-4 sm:px-6">
        <div className="max-w-md w-full bg-neutral-900/90 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-purple-950/50">
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#623898] to-[#8C52FF] flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-900/40">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white">소개남녀 관리자 콘솔</h1>
            <p className="text-xs text-neutral-400">
              1:1 소개팅 프로필 카드 발행 및 &lsquo;이분은 어떠신가요?&rsquo; 매칭 관리자 화면입니다.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold text-center">
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-400" />
                관리자 아이디
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="아이디를 입력하세요"
                className="w-full px-4 py-3 bg-neutral-800/80 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                비밀번호
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 bg-neutral-800/80 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] hover:from-[#542B8A] hover:to-[#783BE8] shadow-lg shadow-purple-900/30 active:scale-98 transition-all"
            >
              관리자 로그인
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors underline"
            >
              ← 소개남녀 메인 홈페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. ADMIN DASHBOARD =================
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#623898] to-[#8C52FF] flex items-center justify-center text-white shadow-sm">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="font-black text-lg text-neutral-900">소개남녀</span>
            </Link>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-[#623898] font-black border border-purple-200">
              1:1 매칭 ADMIN
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-neutral-600 hidden sm:inline">
              관리자: <strong className="text-neutral-900 font-extrabold">sooho</strong> 님
            </span>
            <button
              onClick={fetchApplications}
              className="p-2 text-neutral-500 hover:text-[#623898] hover:bg-neutral-100 rounded-lg transition-colors"
              title="데이터 새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-500 mb-1">총 등록 회원</p>
              <h3 className="text-2xl font-black text-neutral-900">{stats.total}명</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#623898] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-600 mb-1">심사 대기</p>
              <h3 className="text-2xl font-black text-amber-600">{stats.pending}명</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-600 mb-1">매칭 제안 진행중</p>
              <h3 className="text-2xl font-black text-indigo-600">{stats.proposing}명</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600 mb-1">상호 수락 (카톡 교환)</p>
              <h3 className="text-2xl font-black text-emerald-600">{stats.matched}쌍</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="닉네임, 이름, 카톡ID, 연락처 검색..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#623898] focus:bg-white transition-colors"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Chips / Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Region Filter */}
              <div className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1.5 rounded-xl border border-neutral-200">
                <MapPin className="w-3.5 h-3.5 text-[#623898]" />
                <span className="font-bold text-neutral-500">지역:</span>
                <select
                  value={selectedRegionFilter}
                  onChange={(e) => setSelectedRegionFilter(e.target.value)}
                  className="bg-transparent font-extrabold text-neutral-800 focus:outline-none cursor-pointer"
                >
                  <option value="전체">전체 지역</option>
                  <option value="흑석동">흑석동</option>
                  <option value="서교동">서교동</option>
                  <option value="합정동">합정동</option>
                  <option value="홍대">홍대</option>
                  <option value="신도림">신도림</option>
                </select>
              </div>

              {/* Gender Filter */}
              <div className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1.5 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-500">성별:</span>
                <select
                  value={selectedGenderFilter}
                  onChange={(e) => setSelectedGenderFilter(e.target.value)}
                  className="bg-transparent font-extrabold text-neutral-800 focus:outline-none cursor-pointer"
                >
                  <option value="전체">전체 성별</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1.5 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-500">상태:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-transparent font-extrabold text-neutral-800 focus:outline-none cursor-pointer"
                >
                  <option value="전체">전체 상태</option>
                  <option value="심사대기">심사대기</option>
                  <option value="프로필승인">프로필승인</option>
                  <option value="매칭제안중">매칭제안중</option>
                  <option value="상호수락(카톡교환)">상호수락(카톡교환)</option>
                  <option value="반려">반려</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table Card */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base text-neutral-900">1:1 소개팅 지원자 명단</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#623898]">
                검색결과: {filteredApps.length}건
              </span>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              페이지 {currentPage} / {totalPages}
            </span>
          </div>

          {currentPaginatedApps.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <User className="w-8 h-8 text-neutral-300 mx-auto" />
              <p className="text-sm font-bold text-neutral-600">조건에 일치하는 지원자가 없습니다.</p>
              <p className="text-xs text-neutral-400">검색어나 필터 설정을 변경해 보세요.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-neutral-50/80 text-neutral-500 text-[11px] font-bold border-b border-neutral-200">
                  <tr>
                    <th className="py-3.5 px-4">사진</th>
                    <th className="py-3.5 px-4">닉네임 / 실명 / 성별</th>
                    <th className="py-3.5 px-4">카카오톡 ID (교환용)</th>
                    <th className="py-3.5 px-4">년생 / 키 / 지역</th>
                    <th className="py-3.5 px-4">직업 / 직장명</th>
                    <th className="py-3.5 px-4">체형 / MBTI / 취미</th>
                    <th className="py-3.5 px-4 text-center">매칭 진행 상태</th>
                    <th className="py-3.5 px-4 text-center">1:1 프로필 카드</th>
                    <th className="py-3.5 px-4 text-center">상세</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {currentPaginatedApps.map((app) => (
                    <tr key={app.id} className="hover:bg-purple-50/30 transition-colors">
                      {/* Photo Thumbnail */}
                      <td className="py-3 px-4">
                        {app.profileImage ? (
                          <img
                            src={app.profileImage}
                            alt={app.name}
                            onClick={() => setSelectedPhotoForZoom(app.profileImage || null)}
                            className="w-11 h-14 rounded-xl object-cover border border-neutral-200 hover:scale-105 hover:ring-2 hover:ring-[#623898] transition-all cursor-pointer shadow-xs"
                            title="클릭하여 원본 사진 확대"
                          />
                        ) : (
                          <div className="w-11 h-14 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">
                            무사진
                          </div>
                        )}
                      </td>

                      {/* Nickname / Real Name / Gender */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-neutral-900">{app.nickname || app.name}</span>
                          <span
                            className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                              app.gender === 'male'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-pink-50 text-pink-700'
                            }`}
                          >
                            {app.gender === 'male' ? '남' : '여'}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-500 block">
                          실명: {app.name} ({app.phone})
                        </span>
                      </td>

                      {/* KakaoTalk ID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 bg-yellow-50/80 px-2.5 py-1 rounded-lg border border-yellow-200 w-fit">
                          <MessageCircle className="w-3.5 h-3.5 text-yellow-600" />
                          <span className="font-black text-neutral-900 text-xs">{app.kakaoId || '미기재'}</span>
                          {app.kakaoId && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(app.kakaoId, `kakao-${app.id}`)}
                              className="text-neutral-400 hover:text-neutral-800 p-0.5"
                              title="카톡 ID 복사"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        {copiedText === `kakao-${app.id}` && (
                          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">복사 완료!</span>
                        )}
                      </td>

                      {/* Birth Year / Height / Location */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-neutral-900 block">
                          {app.birthYear || app.birthDate.slice(2, 4)}년생 ({app.height || '-'}cm)
                        </span>
                        <span className="text-[11px] text-neutral-500 block truncate max-w-[130px]" title={app.location}>
                          📍 {app.location || app.region}
                        </span>
                      </td>

                      {/* Job / Company */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-neutral-900 block">{app.jobRole || app.jobCategory}</span>
                        <span className="text-[11px] text-neutral-500 block truncate max-w-[120px]">
                          {app.companyName || '(비공개)'}
                        </span>
                      </td>

                      {/* Body Feature / MBTI / Hobbies */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {app.mbti || 'MBTI'}
                          </span>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                            {app.bodyTypeFeature || app.bodyType}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-500 block truncate max-w-[130px]">
                          {app.hobbiesSpecialty || app.interests.join(', ')}
                        </span>
                      </td>

                      {/* Status & Quick Change */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-block relative">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                            className={`text-xs font-black px-2.5 py-1 rounded-full cursor-pointer border appearance-none pr-6 focus:outline-none ${
                              app.status === '상호수락(카톡교환)'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : app.status === '매칭제안중'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : app.status === '프로필승인'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : app.status === '심사대기'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            <option value="심사대기">심사대기</option>
                            <option value="프로필승인">프로필승인</option>
                            <option value="매칭제안중">매칭제안중</option>
                            <option value="상호수락(카톡교환)">상호수락(카톡교환)</option>
                            <option value="반려">반려</option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                        </div>
                      </td>

                      {/* Profile Card View Button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedAppForCard(app)}
                          className="px-3 py-1 rounded-lg text-xs font-black text-white bg-gradient-to-r from-[#623898] to-[#E12B70] hover:opacity-90 transition-all shadow-xs"
                        >
                          실물 카드 보기
                        </button>
                      </td>

                      {/* Detail View Button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedAppForDetail(app)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-neutral-500 font-medium">
              총 <strong className="text-neutral-900 font-bold">{filteredApps.length}</strong>명 중{' '}
              {filteredApps.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
              {Math.min(currentPage * pageSize, filteredApps.length)}번째 회원
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="이전 페이지"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all ${
                    currentPage === pageNum
                      ? 'bg-[#623898] text-white shadow-sm'
                      : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="다음 페이지"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ================= 3. PROFILE CARD PREVIEW MODAL ================= */}
      {selectedAppForCard && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedAppForCard(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#352758] to-[#623898] p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-200">1:1 제안용 프로필 카드 실물</span>
                <h3 className="text-lg font-black">
                  {selectedAppForCard.nickname || selectedAppForCard.name}님의 프로필 카드
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppForCard(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: ProfileCard itself */}
            <div className="p-4 sm:p-6 bg-neutral-100 flex justify-center">
              <ProfileCard data={selectedAppForCard} showWatermark={true} />
            </div>

            {/* Modal Footer: Quick Kakao Proposal Copy Action */}
            <div className="p-5 bg-white border-t border-neutral-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-600">
                  교환용 카톡 ID: <strong className="text-neutral-900">{selectedAppForCard.kakaoId}</strong>
                </span>
                <span className="font-bold text-[#623898]">
                  현재 상태: {selectedAppForCard.status}
                </span>
              </div>

              {/* Copy "이분은 어떠신가요?" proposal template */}
              <button
                type="button"
                onClick={() => {
                  const msg = `[소개남녀 1:1 매칭 제안]\n안녕하세요, 소개남녀 매니저입니다! 회원님의 이상형 조건에 어울리는 분의 1:1 프로필 카드를 보내드립니다.\n\n이분은 어떠신가요? :)\n\n프로필 카드를 확인해 보시고, 마음에 드시면 'OK'라고 답장 남겨주세요! 두 분 모두 수락하시면 카카오톡 ID를 교환해 드립니다.`;
                  copyToClipboard(msg, 'proposal-msg');
                  handleStatusChange(selectedAppForCard.id, '매칭제안중');
                }}
                className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-[#623898] to-[#8C52FF] hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>&ldquo;이분은 어떠신가요?&rdquo; 카톡 제안 멘트 복사 &amp; 제안중 전환</span>
              </button>
              {copiedText === 'proposal-msg' && (
                <p className="text-center text-xs text-emerald-600 font-bold animate-fade-in">
                  ✓ 카톡 제안 멘트가 복사되었습니다! 상대방에게 붙여넣기하여 전송하세요.
                </p>
              )}

              {/* Mutual OK Button */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedAppForCard.id, '상호수락(카톡교환)')}
                  className="py-2.5 rounded-xl font-black text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  ✓ 상호 수락 (카톡 교환 완료)
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedAppForCard.id, '반려')}
                  className="py-2.5 rounded-xl font-bold text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  ✕ 매칭 반려 / 보류
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. PHOTO ZOOM MODAL ================= */}
      {selectedPhotoForZoom && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoForZoom(null)}
        >
          <div
            className="relative max-w-lg w-full bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-700 shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhotoForZoom(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhotoForZoom}
              alt="프로필 원본 사진"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* ================= 5. APPLICATION DETAIL MODAL ================= */}
      {selectedAppForDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedAppForDetail(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#623898] to-[#8C52FF] p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-200">지원자 상세 심사 카드</span>
                <h3 className="text-xl font-black">
                  {selectedAppForDetail.nickname} ({selectedAppForDetail.name}, {selectedAppForDetail.gender === 'male' ? '남성' : '여성'})
                </h3>
                <p className="text-xs text-purple-200 mt-0.5">
                  접수번호: {selectedAppForDetail.receiptNumber} | 접수일시: {selectedAppForDetail.appliedAt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppForDetail(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              {/* Photo & Basic Info */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {selectedAppForDetail.profileImage && (
                  <img
                    src={selectedAppForDetail.profileImage}
                    alt={selectedAppForDetail.name}
                    onClick={() => setSelectedPhotoForZoom(selectedAppForDetail.profileImage || null)}
                    className="w-28 h-36 rounded-2xl object-cover border border-purple-200 shadow-md cursor-pointer shrink-0"
                    title="클릭하여 확대"
                  />
                )}
                <div className="flex-1 grid grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
                  <div>
                    <span className="text-neutral-400 text-xs block">카카오톡 ID</span>
                    <strong className="text-neutral-900 font-extrabold text-sm text-[#623898]">
                      {selectedAppForDetail.kakaoId}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-xs block">연락처</span>
                    <strong className="text-neutral-800">{selectedAppForDetail.phone}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-xs block">생년월일</span>
                    <strong className="text-neutral-800">{selectedAppForDetail.birthDate}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-xs block">신장 / 체형</span>
                    <strong className="text-neutral-800">
                      {selectedAppForDetail.height}cm / {selectedAppForDetail.bodyTypeFeature || selectedAppForDetail.bodyType}
                    </strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-400 text-xs block">거주 지역</span>
                    <strong className="text-neutral-800">{selectedAppForDetail.location}</strong>
                  </div>
                </div>
              </div>

              {/* Occupation */}
              <div className="space-y-2">
                <h5 className="font-bold text-neutral-700">직장 및 직무 정보</h5>
                <div className="grid grid-cols-3 gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
                  <div>
                    <span className="text-neutral-400 text-xs block">직군</span>
                    <strong className="text-neutral-800">{selectedAppForDetail.jobCategory}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-xs block">직무</span>
                    <strong className="text-neutral-800">{selectedAppForDetail.jobRole}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-xs block">직장명</span>
                    <strong className="text-neutral-800">{selectedAppForDetail.companyName || '(비공개)'}</strong>
                  </div>
                </div>
              </div>

              {/* Preferences & Ideal Type */}
              <div className="space-y-3">
                <h5 className="font-bold text-neutral-700">취향 및 이상형</h5>
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-neutral-400 text-xs block">MBTI</span>
                      <strong className="text-indigo-700 font-black">{selectedAppForDetail.mbti}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-xs block">쌍커풀</span>
                      <strong className="text-neutral-800 font-bold">{selectedAppForDetail.eyelid || '무쌍'}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-xs block">주량 / 흡연</span>
                      <strong className="text-neutral-800 font-bold">
                        {selectedAppForDetail.drinkingCapacity || selectedAppForDetail.drinking} / {selectedAppForDetail.smoking}
                      </strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-xs block">종교</span>
                      <strong className="text-neutral-800 font-bold">{selectedAppForDetail.religion || '무교'}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-neutral-400 text-xs block mb-1">나의 성격:</span>
                    <p className="p-3 bg-white border border-neutral-200 rounded-xl text-neutral-800 text-xs">
                      {selectedAppForDetail.personality || '성격 정보 없음'}
                    </p>
                  </div>

                  <div>
                    <span className="text-neutral-400 text-xs block mb-1">작성한 이상형:</span>
                    <p className="p-3 bg-white border border-neutral-200 rounded-xl text-neutral-800 text-xs">
                      {selectedAppForDetail.idealType || '작성된 내용이 없습니다.'}
                    </p>
                  </div>

                  <div>
                    <span className="text-neutral-400 text-xs block mb-1">상세 자기소개:</span>
                    <p className="p-3 bg-white border border-neutral-200 rounded-xl text-neutral-800 text-xs">
                      {selectedAppForDetail.selfIntro || selectedAppForDetail.intro || '작성된 내용이 없습니다.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification & Pledges */}
              <div className="space-y-2">
                <h5 className="font-bold text-neutral-700">신원 인증 및 서약 내역</h5>
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">직장 인증 방식</span>
                    <span className="font-bold text-purple-800">
                      {selectedAppForDetail.verificationType === 'business_card' ? '명함 / 사원증 사진' : '회사 이메일 인증'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">법적 미혼(싱글) 보증 서약</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 동의 완료
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">비매너 잠수 금지 서약</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 동의 완료
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
