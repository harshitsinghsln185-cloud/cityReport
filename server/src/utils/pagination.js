export const parsePagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const requestedLimit = parseInt(query.limit, 10) || 10;
  const limit = Math.min(50, Math.max(1, requestedLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
