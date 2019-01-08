export const isEmpty = dict => Object.keys(dict).length === 0;

export const getOrDefault = (data, key, def = null) => data[key] || def;
