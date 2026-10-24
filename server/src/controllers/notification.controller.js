import notificationService from '../services/notificationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit, isRead, type } = req.query;
  const result = await notificationService.getUserNotifications(req.user._id, {
    page,
    limit,
    isRead,
    type,
  });

  return sendPaginated(res, result.notifications, result.meta, 200);
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user._id);
  return sendSuccess(res, { unreadCount: count });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);
  return sendSuccess(res, notification, 200);
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);
  return sendSuccess(res, result, 200);
});

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
