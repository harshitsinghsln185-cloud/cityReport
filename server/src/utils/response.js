export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendPaginated = (res, data = [], meta = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      page: meta.page || 1,
      limit: meta.limit || 10,
      total: meta.total || 0,
      totalPages: meta.totalPages || Math.ceil((meta.total || 0) / (meta.limit || 10)),
    },
  });
};
