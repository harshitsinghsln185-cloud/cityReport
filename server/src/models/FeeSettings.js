import mongoose from 'mongoose';

const feeSettingsSchema = new mongoose.Schema(
  {
    singleton: {
      type: Boolean,
      default: true,
      unique: true,
      required: true,
    },
    freeKm: {
      type: Number,
      required: true,
      default: 3,
      min: [0, 'Free km cannot be negative'],
      max: [50, 'Free km cannot exceed 50'],
      validate: {
        validator: Number.isInteger,
        message: 'Free km must be an integer',
      },
    },
    perKmRatePaise: {
      type: Number,
      required: true,
      default: 1500, // ₹15.00/km in paise
      min: [0, 'Per km rate cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Per km rate in paise must be a whole integer',
      },
    },
    minFeePaise: {
      type: Number,
      required: true,
      default: 10000, // ₹100.00
      min: [1000, 'Minimum fee must be at least ₹10 (1000 paise)'],
      validate: {
        validator: Number.isInteger,
        message: 'Minimum fee in paise must be an integer',
      },
    },
    maxFeePaise: {
      type: Number,
      required: true,
      default: 500000, // ₹5,000.00
      max: [10000000, 'Maximum fee cannot exceed ₹100,000 (10000000 paise)'],
      validate: {
        validator: Number.isInteger,
        message: 'Maximum fee in paise must be an integer',
      },
    },
    commissionPercent: {
      type: Number,
      required: true,
      default: 10,
      min: [0, 'Commission cannot be negative'],
      max: [50, 'Commission percentage cannot exceed 50%'],
    },
    multipliers: {
      minor: {
        type: Number,
        required: true,
        default: 1.0,
        min: 1.0,
        max: 5.0,
      },
      moderate: {
        type: Number,
        required: true,
        default: 1.3,
        min: 1.0,
        max: 5.0,
      },
      high: {
        type: Number,
        required: true,
        default: 1.6,
        min: 1.0,
        max: 5.0,
      },
      critical: {
        type: Number,
        required: true,
        default: 2.0,
        min: 1.0,
        max: 5.0,
      },
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.singleton;
        delete ret.__v;
        return ret;
      },
    },
  }
);

feeSettingsSchema.pre('validate', function (next) {
  if (this.minFeePaise > this.maxFeePaise) {
    this.invalidate('minFeePaise', 'minFeePaise cannot exceed maxFeePaise');
  }
  next();
});

feeSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne({ singleton: true });
  if (!settings) {
    settings = await this.create({ singleton: true });
  }
  return settings;
};

export const FeeSettings = mongoose.model('FeeSettings', feeSettingsSchema);
export default FeeSettings;
