import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Advance', 'Final'],
    },
    customerSnapshot: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, default: '', trim: true },
      address: {
        street: { type: String, default: '', trim: true },
        city: { type: String, default: '', trim: true },
        pincode: { type: String, default: '', trim: true },
      },
    },
    resolverSnapshot: {
      name: { type: String, default: null, trim: true },
      phone: { type: String, default: null, trim: true },
    },
    feeBreakdown: {
      categoryName: { type: String, default: '', trim: true },
      categoryBaseFeePaise: { type: Number, required: true },
      severityMultiplier: { type: Number, required: true },
      assessedSeverity: { type: String, default: 'Medium' },
      distanceKm: { type: Number, required: true },
      freeKm: { type: Number, required: true },
      perKmRatePaise: { type: Number, required: true },
      distanceFeePaise: { type: Number, required: true },
      totalPaise: { type: Number, required: true },
    },
    amountPaidPaise: {
      type: Number,
      required: true,
      min: 0,
    },
    advancePaidPaise: {
      type: Number,
      default: 0,
      min: 0,
    },
    balanceDuePaise: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    pdfSnapshotPath: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({ issue: 1, type: 1 });
invoiceSchema.index({ user: 1, createdAt: -1 });

export const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
