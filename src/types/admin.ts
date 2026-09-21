import { ApplicationFormData } from './index';

export type ApplicationStatus =
  | '심사대기'
  | '프로필승인'
  | '매칭제안중'
  | '상호수락(카톡교환)'
  | '매칭성공'
  | '반려'
  | '보류'
  | '삭제됨';

export interface AdminApplication extends ApplicationFormData {
  id: string; // 고유 ID
  receiptNumber: string; // 접수번호 (LM-...)
  appliedAt: string; // 신청 일시 (YYYY.MM.DD HH:mm)
  status: ApplicationStatus;
}
