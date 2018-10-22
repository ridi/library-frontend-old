
const _TTL_MINS = 10;

export const makeTTL = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + _TTL_MINS);
  return parseInt(now.getTime() / 1000, 10);
};


export const getNow = () => {
  return parseInt(new Date().getTime() / 1000, 10);
};
