import mongoose from 'mongoose';
import { fileSchema } from './schemas/fileSchema.js';

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function (coords) {
          return (
            Array.isArray(coords) &&
            coords.length === 2 &&
            coords[0] >= -180 &&
            coords[0] <= 180 &&
            coords[1] >= -90 &&
            coords[1] <= 90
          );
        },
        message: 'Invalid GeoJSON coordinates: must be [longitude, latitude]',
      },
    },
  },
  { _id: false }
);

const feeSnapshotSchema = new mongoose.Schema(
  {
    categoryBaseFeePaise: {
      type: Number,
      required: true,
    },
    severityMultiplier: {
      type: Number,
      required: true,
    },
    distanceKm: {
      type: Number,
      required: true,
    },
    freeKm: {
      type: Number,
      required: true,
    },
    perKmRatePaise: {
      type: Number,
      required: true,
    },
    distanceFeePaise: {
      type: Number,
      required: true,
    },
    totalPaise: {
      type: Number,
      required: true,
    },
    advancePaise: {
      type: Number,
      required: true,
    },
    balancePaise: {
      type: Number,
      required: true,
    },
    commissionPercent: {
      type: Number,
      required: true,
      default: 10,
    },
    isManualQuote: {
      type: Boolean,
      required: true,
      default: false,
    },
    manualQuoteSetBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    issueCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    suggestedPriority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    finalPriority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: null,
    },
    location: {
      type: pointSchema,
      required: true,
    },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [fileSchema],
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: [
        'AwaitingAdvance',
        'AwaitingQuote',
        'Submitted',
        'UnderReview',
        'Assigned',
        'Accepted',
        'InProgress',
        'Resolved',
        'BalanceDue',
        'Closed',
        'Rejected',
        'Cancelled',
        'ReassignNeeded',
        'Reopened',
      ],
      default: 'AwaitingAdvance',
    },
    source: {
      type: String,
      required: true,
      enum: ['form', 'chatbot'],
      default: 'form',
    },
    assignedResolver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResolverProfile',
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    resolution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resolution',
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },
    reopenReason: {
      type: String,
      default: null,
      trim: true,
    },
    reopenCount: {
      type: Number,
      default: 0,
    },
    payoutStatus: {
      type: String,
      enum: ['None', 'Pending', 'Paid'],
      default: 'None',
      index: true,
    },
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
      default: null,
    },
    aiAssessment: {
      severity: { type: Number },
      confidence: { type: Number },
      reason: { type: String },
      source: { type: String, enum: ['ai', 'rules'] },
      model: { type: String },
      assessedAt: { type: Date },
    },
    fee: {
      type: feeSnapshotSchema,
      required: true,
    },
    payments: {
      advancePayment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        default: null,
      },
      balancePayment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        default: null,
      },
      advanceInvoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        default: null,
      },
      finalInvoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

issueSchema.index({ reporter: 1, status: 1 });
issueSchema.index({ assignedResolver: 1, status: 1 });
issueSchema.index({ location: '2dsphere' });
issueSchema.index({ status: 1, createdAt: -1 });

export const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
