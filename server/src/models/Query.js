import mongoose from 'mongoose';

const querySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Replied'],
      default: 'Pending',
      index: true,
    },
    reply: {
      type: String,
      trim: true,
      default: null,
      maxlength: 3000,
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    repliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for status filtering and chronology
querySchema.index({ status: 1, createdAt: -1 });

export const Query = mongoose.model('Query', querySchema);
export default Query;
