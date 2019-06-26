export const isNowBetween = (start, end) => {
  const now = new Date();
  // 비교할 때 Date가 타임스탬프로 변함
  return start <= now && now < end;
};
