
const _TTL_MINS = 10;
const _DEFAULT_OFFSET_MINS = 1;

export const makeTTL = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + _TTL_MINS);
  return parseInt(now.getTime() / 1000, 10);
};


export const getCriterion = (offsetMins = _DEFAULT_OFFSET_MINS) => {
  const now = new Date();
  if (!offsetMins) {
    return parseInt(now.getTime() / 1000, 10);
  }

  if (offsetMins > _TTL_MINS) {
    throw Error('offset은 TTL값을 초과할 수 없습니다.');
  }

  now.setMinutes(now.getMinutes() - offsetMins);
  return parseInt(now.getTime() / 1000, 10);
};
