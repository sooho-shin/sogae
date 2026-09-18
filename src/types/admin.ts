import { ApplicationFormData } from './index';

export type ApplicationStatus = '심사대기' | '승인완료' | '반려';

export interface AdminApplication extends ApplicationFormData {
  id: string; // 고유 ID
  receiptNumber: string; // 접수번호 (LM-...)
  appliedAt: string; // 신청 일시 (YYYY.MM.DD HH:mm)
  status: ApplicationStatus;
}
