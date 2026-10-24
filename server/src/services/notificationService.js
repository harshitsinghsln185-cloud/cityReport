import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import emailQueue from './emailQueue.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

export const notify = async ({
  recipientId,
  title,
  message,
  type = 'SYSTEM',
  link = null,
  emailOptions = null,
}) => {
  if (!recipientId) {
    throw new AppError('recipientId is required for notifications', 400);
  }
  if (!title || !message) {
    throw new AppError('title and message are required for notifications', 400);
  }

  // 1. Create In-App Notification
  const notification = await Notification.create({
    recipient: recipientId,
    title,
    message,
    type,
    link,
    isRead: false,
  });

  // 2. Dispatch Async Email if requested
  if (emailOptions) {
    try {
      let recipientEmail = emailOptions.to;
      if (!recipientEmail) {
        const user = await User.findById(recipientId).select('email');
        if (user && user.email) {
          recipientEmail = user.email;
        }
      }

      if (recipientEmail) {
        await emailQueue.enqueueEmail({
          to: recipientEmail,
          template: emailOptions.template || 'generic',
          subject: emailOptions.subject || title,
          html: emailOptions.html || `<p>${message}</p>`,
          attachments: emailOptions.attachments || [],
          metadata: {
            notificationId: notification._id,
            type,
            link,
            ...(emailOptions.metadata || {}),
          },
        });
      }
    } catch (err) {
      // Email failure or enqueue error must NEVER block in-app notification creation
      logger.error(`[NotificationService] Email enqueue failed for recipient ${recipientId}: ${err.message}`);
    }
  }

  return notification;
};

export const getUserNotifications = async (
  userId,
  { page = 1, limit = 20, isRead, type } = {}
) => {
  const query = { recipient: userId };

  if (isRead !== undefined && isRead !== null && isRead !== '') {
    query.isRead = isRead === true || isRead === 'true';
  }

  if (type) {
    query.type = type;
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (p - 1) * l;

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .lean(),
    Notification.countDocuments(query),
  ]);

  return {
    notifications,
    meta: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l) || 1,
    },
  };
};

export const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw new AppError('Notification not found or access denied', 404);
  }

  notification.isRead = true;
  await notification.save();

  return notification;
};

export const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true } }
  );

  return {
    success: true,
    modifiedCount: result.modifiedCount,
  };
};

export default {
  notify,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
