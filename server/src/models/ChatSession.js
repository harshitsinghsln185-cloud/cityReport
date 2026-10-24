import mongoose from 'mongoose';
import { fileSchema } from './schemas/fileSchema.js';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    quickReplies: {
      type: [String],
      default: [],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const draftSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    categoryName: {
      type: String,
      trim: true,
      default: null,
    },
    suggestedPriority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: null,
    },
    address: {
      street: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      pincode: { type: String, trim: true, default: '' },
    },
    contactNumber: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const chatSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    state: {
      type: String,
      required: true,
      enum: ['GREETING', 'COLLECT', 'CONFIRM', 'SUBMITTED', 'HANDOFF'],
      default: 'GREETING',
      index: true,
    },
    draft: {
      type: draftSchema,
      default: () => ({}),
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    imageRefs: {
      type: [fileSchema],
      default: [],
    },
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      default: null,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24-hour expiration
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for active user sessions
chatSessionSchema.index({ user: 1, createdAt: -1 });

export const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
export default ChatSession;
