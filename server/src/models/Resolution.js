import mongoose from 'mongoose';
import { fileSchema } from './schemas/fileSchema.js';

const reworkHistorySchema = new mongoose.Schema(
  {
    requestedAt: { type: Date, default: Date.now },
    reason: { type: String, required: true, trim: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resubmittedAt: { type: Date },
  },
  { _id: false }
);

const resolutionSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
      unique: true,
      index: true,
    },
    resolver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResolverProfile',
      required: true,
      index: true,
    },
    beforeImages: {
      type: [fileSchema],
      default: [],
      validate: {
        validator: function (val) {
          return !val || val.length <= 4;
        },
        message: 'A maximum of 4 before-repair images can be attached.',
      },
    },
    afterImages: {
      type: [fileSchema],
      required: true,
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length >= 1 && val.length <= 4;
        },
        message: 'Must provide between 1 and 4 after-repair photos.',
      },
    },
    remarks: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, 'Completion remarks must be at least 10 characters long'],
      maxlength: [2000, 'Completion remarks cannot exceed 2000 characters'],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reworkHistory: {
      type: [reworkHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Resolution = mongoose.model('Resolution', resolutionSchema);
export default Resolution;
