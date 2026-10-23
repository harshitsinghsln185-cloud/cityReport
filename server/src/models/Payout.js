import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema(
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
    grossAmountPaise: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'grossAmountPaise must be an integer',
      },
    },
    commissionPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    commissionPaise: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'commissionPaise must be an integer',
      },
    },
    netAmountPaise: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'netAmountPaise must be an integer',
      },
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
      index: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

payoutSchema.index({ resolver: 1, status: 1 });
payoutSchema.index({ createdAt: -1 });

export const Payout = mongoose.model('Payout', payoutSchema);
export default Payout;
