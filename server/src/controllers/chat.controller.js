import chatbotService from '../services/chatbotService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';

/**
 * Initializes a new chat session.
 */
export const createSession = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const session = await chatbotService.createSession(userId);
  return sendSuccess(res, session, 'Chat session initialized', 201);
});

/**
 * Retrieves the current state and message history of a chat session.
 */
export const getSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const session = await chatbotService.getSession(id);
  return sendSuccess(res, session, 'Chat session retrieved', 200);
});

/**
 * Sends a message in the chat session, advancing the state machine.
 */
export const postMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw new AppError('Message is required and cannot be empty', 400);
  }

  const result = await chatbotService.handleUserMessage(id, message);
  return sendSuccess(res, result, 'Message processed', 200);
});

/**
 * Uploads and attaches a photo to the chat session draft.
 */
export const attachImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.file) {
    throw new AppError('Please provide an image file under key "image"', 400);
  }

  const session = await chatbotService.attachChatImage(id, req.file);
  return sendSuccess(res, session, 'Image attached to session successfully', 200);
});

/**
 * Finalizes and submits the draft issue on behalf of the citizen.
 * Strictly requires authentication.
 */
export const submitDraft = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.user || !req.user._id) {
    throw new AppError('Authentication required. Please sign in to submit your civic report.', 401);
  }

  const result = await chatbotService.submitDraftIssue(id, req.user);
  return sendSuccess(res, result, 'Civic issue successfully submitted via AI Assistant', 201);
});

export default {
  createSession,
  getSession,
  postMessage,
  attachImage,
  submitDraft,
};
