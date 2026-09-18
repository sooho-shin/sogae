import { NextResponse } from 'next/server';
import { INITIAL_APPLICATIONS } from '@/data/initialApplications';
import { AdminApplication, ApplicationStatus } from '@/types/admin';

// Global in-memory storage to survive across requests
declare global {
  // eslint-disable-next-line no-var
  var __APPLICATIONS_STORE__: AdminApplication[] | undefined;
}

if (!globalThis.__APPLICATIONS_STORE__) {
  globalThis.__APPLICATIONS_STORE__ = [...INITIAL_APPLICATIONS];
}

export async function GET() {
  try {
    const list = globalThis.__APPLICATIONS_STORE__ || [];
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newApp: AdminApplication = {
      ...body,
      id: `app-${Date.now()}`,
      appliedAt: body.appliedAt || new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '.'),
      status: '심사대기' as ApplicationStatus,
    };

    if (!globalThis.__APPLICATIONS_STORE__) {
      globalThis.__APPLICATIONS_STORE__ = [...INITIAL_APPLICATIONS];
    }

    // Prepend to top
    globalThis.__APPLICATIONS_STORE__.unshift(newApp);

    return NextResponse.json({ success: true, data: newApp });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create application' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status required' }, { status: 400 });
    }

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
