import { Query } from '../models/Query.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Submits a public citizen contact inquiry.
 */
export const submitQuery = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const query = await Query.create({
    name,
    email,
    subject,
    message,
    status: 'Pending',
  });

  return sendSuccess(
    res,
    {
      queryId: query._id,
      status: query.status,
      createdAt: query.createdAt,
    },
    'Query received. We will reply via email within 24 to 48 hours.',
    201
  );
});

export default {
  submitQuery,
};
