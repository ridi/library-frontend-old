import { OrderBy } from 'constants/orderOptions';

export const getOrderParams = (orderBy, orderDirection) => {
  if (orderBy === OrderBy.EXPIRED_BOOKS_ONLY) {
    return {
      expiredBooksOnly: true,
    };
  }
  return {
    orderType: orderBy,
    orderBy: orderDirection,
  };
};
