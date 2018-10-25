const _camelToSnake = name =>
  name
    .replace(/(?:^)([A-Z])/g, (x, y) => `_${y.toLowerCase()}`)
    .replace(/^_/, '');

export const snakelize = dict =>
  Object.keys(dict).reduce((previous, key) => {
    previous[_camelToSnake(key)] = dict[key];
    return previous;
  }, {});
