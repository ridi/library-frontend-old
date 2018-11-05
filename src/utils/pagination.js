import { makeRange } from './array';

export const calcOffset = (page, limit) => (page - 1) * limit;
export const calcPage = (totalCount, limit) => Math.ceil(totalCount / limit);

export const calcPageBlock = (currentPage, pageCount) =>
  Math.ceil(currentPage / pageCount);
export const makePageRange = (currentPage, totalPages, pageCount) => {
  const block = calcPageBlock(currentPage, pageCount);
  const start = (block - 1) * pageCount + 1;
  const end = Math.min(start + pageCount, totalPages + 1);
  return makeRange(start, end);
};
