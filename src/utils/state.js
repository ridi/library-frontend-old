import { getOrDefault } from './dict';
import { concat } from './array';

export const getDataState = (state, keyMaterials, initialDataState) => {
  const key = concat(keyMaterials);
  const dataState = getOrDefault(state.data, key, initialDataState);
  return { key, dataState };
};
