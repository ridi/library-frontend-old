export const calcOffset = (page, limit) => (page - 1) * limit;
export const calcPage = (totalCount, limit) => Math.ceil(totalCount / limit);
