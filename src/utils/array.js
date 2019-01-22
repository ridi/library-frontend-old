export const toDict = (arr, key) =>
  arr.reduce((previous, current) => {
    previous[current[key]] = current;
    return previous;
  }, {});

export const toFlatten = (arr, key) => arr.map(value => value[key]);

export const makeRange = (start, end) => Array.from({ length: end - start }, (_, k) => k + start);

export const concat = (arr, glue = '_') => arr.join(glue);

export const splitArrayByChunk = (array, chunkSize) =>
  Array(Math.ceil(array.length / chunkSize))
    .fill()
    .map((_, index) => index * chunkSize)
    .map(begin => array.slice(begin, begin + chunkSize));

export const makeUnique = array => [...new Set(array)];
