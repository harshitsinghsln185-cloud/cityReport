import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    template: {
      type: String,
      default: 'generic',
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Sent', 'Failed'],
      default: 'Pending',
      index: true,
    },
    attempts: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },
    lastError: {
      type: String,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    failedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

emailLogSchema.index({ status: 1, attempts: 1 });
emailLogSchema.index({ createdAt: -1 });

export const EmailLog = mongoose.model('EmailLog', emailLogSchema);
export default EmailLog;
