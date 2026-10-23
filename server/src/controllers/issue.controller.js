import issueService from '../services/issueService.js';
import feeService from '../services/feeService.js';
import financeService from '../services/financeService.js';
import { createIssueSchema, estimateQuoteSchema } from '../validators/issue.validator.js';

export const create = async (req, res, next) => {
  try {
    const validated = createIssueSchema.parse(req.body);

    const result = await issueService.createIssue({
      reporterId: req.user._id,
      categoryId: validated.category,
      title: validated.title,
      description: validated.description,
      suggestedPriority: validated.suggestedPriority,
      contactNumber: validated.contactNumber,
      coordinates: [validated.lng, validated.lat],
      address: validated.address,
      files: req.files || [],
      source: validated.source,
    });

    res.status(201).json({
      success: true,
      message: 'Civic issue submitted successfully',
      data: {
        issue: result.issue,
        quote: result.quote,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const estimateQuote = async (req, res, next) => {
  try {
    const validated = estimateQuoteSchema.parse(req.body);

    const result = await feeService.calculateQuote({
      categoryId: validated.category,
      coordinates: [validated.lng, validated.lat],
      suggestedPriority: validated.suggestedPriority,
      description: validated.description,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await issueService.getIssueById(req.params.id, req.user);

    res.status(200).json({
      success: true,
      data: {
        issue: result.issue,
        timeline: result.timeline,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const result = await issueService.listCitizenIssues(req.user._id, {
      status: req.query.status,
      page: req.query.page ? parseInt(req.query.page, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit, 10) : 10,
      search: req.query.search,
    });

    res.status(200).json({
      success: true,
      data: result.issues,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const issue = await issueService.cancelIssue(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Issue has been cancelled',
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

export const submitFeedback = async (req, res, next) => {
  try {
    const { rating, comments } = req.body;
    const feedback = await financeService.submitCitizenFeedback({
      issueId: req.params.id,
      userId: req.user._id,
      rating,
      comments,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

export const reopen = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const issue = await financeService.reopenClosedIssue(
      req.params.id,
      req.user._id,
      reason
    );

    res.status(200).json({
      success: true,
      message: 'Issue reopened successfully',
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  estimateQuote,
  getById,
  list,
  cancel,
  submitFeedback,
  reopen,
};
