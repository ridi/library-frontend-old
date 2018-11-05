export const toDict = (arr, key) =>
  arr.reduce((previous, current) => {
    previous[current[key]] = current;
    return previous;
  }, {});

export const toFlatten = (arr, key) => arr.map(value => value[key]);

export const makeRange = (start, end) =>
  Array.from({ length: end - start }, (_, k) => k + start);
