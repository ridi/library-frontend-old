export const toDict = (arr, key, extracter = null) =>
  arr.reduce((previous, current) => {
    if (extracter) {
      previous[current[key]] = extracter(current);
    } else {
      previous[current[key]] = current;
    }
    return previous;
  }, {});

export const toFlatten = (arr, key, skipNull = false) => {
  const splited = key.split('.');
  const _key = splited.shift();

  let data = arr.map(value => value[_key]);
  if (skipNull) {
    data = data.filter(element => !!element);
  }

  if (splited.length === 0) {
    return data;
  }

  return toFlatten(data, splited.join('.'), skipNull);
};

export const makeRange = (start, end) => Array.from({ length: end - start }, (_, k) => k + start);

export const concat = (arr, glue = '_') => arr.join(glue);

export const splitArrayByChunk = (array, chunkSize) =>
  Array(Math.ceil(array.length / chunkSize))
    .fill()
    .map((_, index) => index * chunkSize)
    .map(begin => array.slice(begin, begin + chunkSize));

export const makeUnique = array => [...new Set(array)];
