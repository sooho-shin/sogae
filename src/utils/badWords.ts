// 비속어, 음란성 키워드, 부적절한 단어 필터링 유틸리티

const PROFANITY_LIST = [
  '섹스', '섹스머신', '야동', '조건만남', '조건', '원나잇', '애인대행',
  '자지', '보지', '자위', '성교', '오르가즘', '포르노', '노모',
  '시발', '씨발', '병신', '개새끼', '존나', '좆', '창녀', '걸레',
  '느금', '엠창', '지랄', '싸가지', '호구', '새끼', '꺼져', '닥쳐',
  '일베', '노무현', '여시', '메갈', '한남', '김치녀',
];

/**
 * 텍스트에 금칙어/부적절한 단어가 포함되어 있는지 검사합니다.
 * @returns 발견된 금칙어 (없으면 null)
 */
export function findProfanity(text: string): string | null {
  if (!text || typeof text !== 'string') return null;
  const clean = text.replace(/[\s\-_.,~!@#$%^&*()=+]/g, '').toLowerCase();

  for (const word of PROFANITY_LIST) {
    if (clean.includes(word.toLowerCase())) {
      return word;
    }
  }
  return null;
}

/**
 * 객체 내의 문자열 필드들에 금칙어가 포함되어 있는지 전수 검사합니다.
 * @returns { valid: boolean, field?: string, word?: string }
 */
export function validateProfanityInObject(obj: Record<string, any>): { valid: boolean; fieldName?: string; badWord?: string } {
  const fieldsToCheck: { [key: string]: string } = {
    name: '실명',
    nickname: '닉네임',
    jobRole: '직업/직무',
    companyName: '직장명',
    personality: '성격',
    hobbiesSpecialty: '취미/특기',
    idealType: '이상형',
    selfIntro: '자기소개',
    intro: '소개',
  };

  for (const [key, label] of Object.entries(fieldsToCheck)) {
    const val = obj[key];
    if (typeof val === 'string') {
      const badWord = findProfanity(val);
      if (badWord) {
        return { valid: false, fieldName: label, badWord };
      }
    }
  }

  return { valid: true };
}
