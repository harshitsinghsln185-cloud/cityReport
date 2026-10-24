import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../controllers/notification.controller.js';

const router = Router();

// Apply auth to all notification routes
router.use(authenticate);

// Unread count
router.get('/unread-count', getUnreadCount);

// Mark all as read
router.patch('/read-all', markAllAsRead);

// List notifications (paginated)
router.get('/', getNotifications);

// Mark single notification as read
router.patch('/:id/read', markAsRead);

export default router;
